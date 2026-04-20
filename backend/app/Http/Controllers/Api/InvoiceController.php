<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    /**
     * Get all invoices
     */
    public function index()
    {
        try {
            $invoices = Invoice::with([
                'patient:id,first_name,last_name,email',
            ])->select([
                'id',
                'patient_id',
                'amount',
                'date',
                'status',
                'description',
                'created_at',
            ])->get();

            return response()->json([
                'success' => true,
                'data' => $invoices,
                'message' => 'Invoices retrieved successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve invoices',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Get a specific invoice
     */
    public function show($id)
    {
        try {
            $invoice = Invoice::with([
                'patient:id,first_name,last_name,email,phone,balance',
            ])->find($id);

            if (!$invoice) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invoice not found',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $invoice,
                'message' => 'Invoice retrieved successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve invoice',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Create a new invoice
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'patient_id' => 'required|exists:patients,id',
                'amount' => 'required|numeric|min:0.01',
                'status' => 'sometimes|string|in:pending,due,paid,partial',
                'description' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 400);
            }

            $invoice = Invoice::create([
                'patient_id' => $request->patient_id,
                'amount' => $request->amount,
                'date' => now()->toDateString(),
                'status' => $request->status ?? 'pending',
                'description' => $request->description,
            ]);

            // Update patient balance
            $patient = Patient::find($request->patient_id);
            if ($patient) {
                $patient->balance = ($patient->balance ?? 0) + $request->amount;
                $patient->save();
            }

            $invoice = $invoice->load('patient:id,first_name,last_name,email');

            return response()->json([
                'success' => true,
                'data' => $invoice,
                'message' => 'Invoice created successfully',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create invoice',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Record a payment
     */
    public function payment(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'invoice_id' => 'required|exists:invoices,id',
                'amount' => 'required|numeric|min:0.01',
                'payment_method' => 'required|string|in:cash,card,bank_transfer,check',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 400);
            }

            $invoice = Invoice::find($request->invoice_id);

            if (!$invoice) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invoice not found',
                ], 404);
            }

            if ($invoice->status === 'paid') {
                return response()->json([
                    'success' => false,
                    'message' => 'Invoice is already paid',
                ], 400);
            }

            $remainingAmount = $invoice->amount;

            if ($request->amount >= $remainingAmount) {
                $invoice->status = 'paid';
            } else {
                $invoice->status = 'partial';
            }

            $invoice->save();

            // Update patient balance
            $patient = Patient::find($invoice->patient_id);
            if ($patient) {
                $patient->balance -= $request->amount;
                $patient->save();
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'invoice' => $invoice,
                    'payment_amount' => $request->amount,
                    'payment_method' => $request->payment_method,
                    'timestamp' => now(),
                ],
                'message' => 'Payment recorded successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to record payment',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }

    /**
     * Get billing dashboard metrics
     */
    public function dashboardMetrics()
    {
        try {
            $today = now()->toDateString();

            // Today's revenue
            $todaysRevenue = Invoice::where('status', 'paid')
                ->whereDate('date', $today)
                ->sum('amount');

            // Pending invoices
            $pendingInvoices = Invoice::whereIn('status', ['pending', 'partial'])
                ->count();

            // Outstanding balance
            $outstandingBalance = Invoice::whereIn('status', ['pending', 'partial'])
                ->sum('amount');

            // Recent transactions (last 10)
            $recentTransactions = Invoice::with([
                'patient:id,first_name,last_name',
            ])->orderBy('updated_at', 'desc')
                ->limit(10)
                ->select([
                    'id',
                    'patient_id',
                    'amount',
                    'status',
                    'date',
                    'updated_at',
                ])
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'todaysRevenue' => round($todaysRevenue, 2),
                    'pendingInvoices' => $pendingInvoices,
                    'outstandingBalance' => round($outstandingBalance, 2),
                    'recentTransactions' => $recentTransactions,
                ],
                'message' => 'Billing metrics retrieved successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve billing metrics',
                'errors' => [$e->getMessage()],
            ], 500);
        }
    }
}
