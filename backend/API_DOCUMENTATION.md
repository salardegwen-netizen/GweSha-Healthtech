# Sanctuary Health Laravel API - Complete Implementation

## Summary
A complete production-ready Laravel API has been created for the Sanctuary Health application with comprehensive error handling, validation, and proper HTTP status codes.

## Created Files

### 1. API Routes (`routes/api.php`)
- Public authentication endpoints (login, register)
- Protected endpoints using Sanctum middleware
- RESTful routing for all resources
- Proper route grouping and organization

### 2. API Controllers (9 Total)

#### AuthController.php
- `POST /auth/login` - User login with credentials
- `POST /auth/register` - User registration with validation
- `POST /auth/logout` - Revoke current access token
- `GET /auth/me` - Get authenticated user details

**Features:**
- Password hashing using Laravel's Hash
- Token generation with Sanctum
- Comprehensive input validation
- Error responses with validation errors

#### PatientController.php
- `GET /patients` - List all patients with key fields
- `POST /patients` - Create new patient
- `GET /patients/{id}` - Get patient with relationships
- `PUT /patients/{id}` - Update patient details
- `DELETE /patients/{id}` - Delete patient

**Features:**
- Returns: id, first_name, last_name, email, phone, last_visit, next_appointment, balance, status
- Accepts: first_name, last_name, email (unique), phone, balance
- Eager loads: appointments, invoices, healthRecords, vitals, scheduleBlocks
- Email uniqueness validation per patient

#### AppointmentController.php
- `GET /appointments` - List all appointments with relationships
- `POST /appointments` - Create new appointment
- `GET /appointments/{id}` - Get appointment details
- `PUT /appointments/{id}` - Update appointment
- `DELETE /appointments/{id}` - Cancel appointment

**Features:**
- Includes patient and doctor relationships
- Date/time validation (must be after current time)
- Validates patient and doctor exist
- Minimum appointment length validation (15 minutes)

#### InvoiceController.php
- `GET /invoices` - List all invoices
- `GET /invoices/{id}` - Get invoice details
- `POST /payments` - Record payment
- `GET /billing/dashboard-metrics` - Get billing metrics

**Features:**
- Payment method validation (cash, card, bank_transfer, check)
- Automatic invoice status updates (pending, partial, paid)
- Updates patient balance on payment
- Dashboard metrics: todaysRevenue, pendingInvoices, outstandingBalance, recentTransactions
- Eager loads patient information

#### StaffController.php
- `GET /staff` - List all staff members
- `POST /staff` - Create staff member
- `GET /staff/{id}` - Get staff details with relationships
- `PUT /staff/{id}` - Update staff information
- `PUT /staff/{id}/status` - Update only status field
- `DELETE /staff/{id}` - Delete staff member

**Features:**
- Role validation: doctor, nurse, receptionist, admin
- Status options: active, inactive, on_leave
- Includes appointments and schedule blocks relationships
- Email uniqueness validation

#### HealthRecordController.php
- `GET /health-records` - List all health records
- `POST /health-records` - Create new health record
- `GET /health-records/{id}` - Get health record details
- `PUT /health-records/{id}` - Update health record
- `DELETE /health-records/{id}` - Delete health record

**Features:**
- Required fields: patient_id, title, type, date
- Optional description field
- Includes patient information
- Date validation

#### VitalsController.php
- `GET /vitals` - List all vitals records
- `POST /vitals` - Record new vitals
- `GET /vitals/current` - Get most recent vitals for authenticated patient
- `GET /vitals/history/{patientId}` - Get vitals history for patient

**Features:**
- Validates vital sign ranges:
  - Heart rate: 30-200 bpm
  - Sleep hours: 0-24 hours
  - Blood pressure systolic: 60-200 mmHg
  - Blood pressure diastolic: 30-130 mmHg
  - Temperature: 35-42°C
- Current endpoint requires authentication
- History endpoint returns records in reverse chronological order

#### ScheduleController.php
- `GET /schedule` - List all schedule blocks
- `POST /schedule` - Create schedule block
- `GET /schedule/blocks/{id}` - Get schedule block
- `PUT /schedule/blocks/{id}` - Update schedule block
- `DELETE /schedule/blocks/{id}` - Delete schedule block

**Features:**
- Day validation: Monday through Sunday
- Time format validation: H:i:s
- Includes patient and doctor details
- Minimum appointment length: 15 minutes

#### SpecialistController.php
- `GET /specialists` - List all doctors/specialists

**Features:**
- Filters staff by role = 'doctor'
- Returns specialist name, email, phone, title, department, status

## Response Format

### Success Response
```json
{
    "success": true,
    "data": { ... },
    "message": "Success message"
}
```
- HTTP Status: 200 (GET/PUT/POST with existing data), 201 (POST new resource)

### Error Response
```json
{
    "success": false,
    "message": "Error message",
    "errors": [ ... ]
}
```
- HTTP Status: 400 (validation), 401 (unauthorized), 404 (not found), 500 (server error)

## Key Features

1. **Comprehensive Error Handling**
   - Try-catch blocks in all methods
   - Validation error responses
   - Resource not found handling
   - Server error handling with exception messages

2. **Input Validation**
   - Email uniqueness where required
   - Date/time validation
   - Numeric range validation
   - Enum validation for status fields
   - Required field validation

3. **Relationship Management**
   - Eager loading with `with()` for N+1 prevention
   - Selective column selection for optimization
   - Related entity filtering (e.g., doctors by role)

4. **Authentication & Authorization**
   - Public login/register endpoints
   - Protected endpoints with Sanctum middleware
   - Current user access in controllers
   - Token-based authentication

5. **HTTP Status Codes**
   - 200: Successful GET/PUT
   - 201: Successful resource creation (POST)
   - 400: Validation errors
   - 401: Authentication required
   - 404: Resource not found
   - 500: Server errors

## File Locations

```
backend/
├── routes/
│   └── api.php (Updated)
└── app/Http/Controllers/Api/
    ├── AuthController.php
    ├── PatientController.php
    ├── AppointmentController.php
    ├── InvoiceController.php
    ├── StaffController.php
    ├── HealthRecordController.php
    ├── VitalsController.php
    ├── ScheduleController.php
    └── SpecialistController.php
```

## Usage Examples

### Authentication
```
POST /api/auth/login
{
    "email": "user@example.com",
    "password": "password123"
}

POST /api/auth/register
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "role": "patient"
}
```

### Patient Management
```
GET /api/patients
GET /api/patients/1
POST /api/patients
{
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "jane@example.com",
    "phone": "555-1234",
    "balance": 100.00
}
```

### Billing
```
GET /api/billing/dashboard-metrics
POST /api/payments
{
    "invoice_id": 1,
    "amount": 50.00,
    "payment_method": "card"
}
```

### Schedule Management
```
GET /api/schedule
POST /api/schedule
{
    "time": "14:30:00",
    "day": "Monday",
    "patient_id": 1,
    "doctor_id": 1,
    "procedure": "Checkup",
    "length": 30,
    "status": "scheduled"
}
```

## Production Readiness

- All endpoints include comprehensive error handling
- Input validation prevents invalid data entry
- Eager loading prevents N+1 query problems
- Proper HTTP status codes for API consumers
- Structured JSON responses for easy frontend integration
- User authentication with Sanctum tokens
- Database relationship management
- Exception handling with meaningful error messages
