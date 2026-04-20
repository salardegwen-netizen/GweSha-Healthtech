# API Request/Response Examples

## Authentication

### Login Request
```
POST /api/auth/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "password123"
}
```

### Login Response (200)
```json
{
    "success": true,
    "data": {
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "role": "patient"
        },
        "token": "1|abcdefghijklmnopqrstuvwxyz..."
    },
    "message": "Login successful"
}
```

### Register Request
```
POST /api/auth/register
Content-Type: application/json

{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "role": "patient"
}
```

### Get Current User
```
GET /api/auth/me
Authorization: Bearer 1|abcdefghijklmnopqrstuvwxyz...
```

### Get Current User Response (200)
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "patient"
    },
    "message": "User retrieved successfully"
}
```

## Patients

### Get All Patients
```
GET /api/patients
Authorization: Bearer {token}
```

### Get All Patients Response (200)
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@example.com",
            "phone": "555-1234",
            "last_visit": "2026-03-15",
            "next_appointment": "2026-04-20",
            "balance": 150.00,
            "status": "active"
        }
    ],
    "message": "Patients retrieved successfully"
}
```

### Create Patient
```
POST /api/patients
Authorization: Bearer {token}
Content-Type: application/json

{
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane@example.com",
    "phone": "555-5678",
    "balance": 0
}
```

### Create Patient Response (201)
```json
{
    "success": true,
    "data": {
        "id": 2,
        "first_name": "Jane",
        "last_name": "Smith",
        "email": "jane@example.com",
        "phone": "555-5678",
        "balance": "0.00",
        "status": "active",
        "created_at": "2026-04-17T03:30:00.000000Z",
        "updated_at": "2026-04-17T03:30:00.000000Z"
    },
    "message": "Patient created successfully"
}
```

### Get Patient with Relationships
```
GET /api/patients/1
Authorization: Bearer {token}
```

### Get Patient Response (200)
```json
{
    "success": true,
    "data": {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "phone": "555-1234",
        "last_visit": "2026-03-15",
        "next_appointment": "2026-04-20",
        "balance": "150.00",
        "status": "active",
        "created_at": "2026-03-01T00:00:00.000000Z",
        "updated_at": "2026-04-15T10:30:00.000000Z",
        "appointments": [
            {
                "id": 1,
                "patient_id": 1,
                "doctor_id": 1,
                "date_time": "2026-04-20T10:00:00",
                "procedure": "General Checkup",
                "length": 30,
                "status": "scheduled"
            }
        ],
        "invoices": [...],
        "health_records": [...],
        "vitals": [...],
        "schedule_blocks": [...]
    },
    "message": "Patient retrieved successfully"
}
```

## Appointments

### Create Appointment
```
POST /api/appointments
Authorization: Bearer {token}
Content-Type: application/json

{
    "patient_id": 1,
    "doctor_id": 1,
    "date_time": "2026-04-25 14:30:00",
    "procedure": "Annual Checkup",
    "length": 45,
    "status": "scheduled"
}
```

### Create Appointment Response (201)
```json
{
    "success": true,
    "data": {
        "id": 2,
        "patient_id": 1,
        "doctor_id": 1,
        "date_time": "2026-04-25 14:30:00",
        "procedure": "Annual Checkup",
        "length": 45,
        "status": "scheduled",
        "created_at": "2026-04-17T03:35:00.000000Z",
        "updated_at": "2026-04-17T03:35:00.000000Z",
        "patient": {
            "id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@example.com",
            "phone": "555-1234"
        },
        "doctor": {
            "id": 1,
            "name": "Dr. Smith",
            "email": "doctor@example.com",
            "role": "doctor",
            "title": "MD"
        }
    },
    "message": "Appointment created successfully"
}
```

## Vitals

### Record Vitals
```
POST /api/vitals
Authorization: Bearer {token}
Content-Type: application/json

{
    "patient_id": 1,
    "heart_rate": 72,
    "sleep_hours": 7.5,
    "blood_pressure_systolic": 120,
    "blood_pressure_diastolic": 80,
    "temperature": 37.2
}
```

### Record Vitals Response (201)
```json
{
    "success": true,
    "data": {
        "id": 5,
        "patient_id": 1,
        "heart_rate": 72,
        "sleep_hours": "7.5",
        "blood_pressure_systolic": 120,
        "blood_pressure_diastolic": 80,
        "temperature": "37.2",
        "created_at": "2026-04-17T03:40:00.000000Z",
        "updated_at": "2026-04-17T03:40:00.000000Z",
        "patient": {
            "id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@example.com"
        }
    },
    "message": "Vitals recorded successfully"
}
```

### Get Current Vitals
```
GET /api/vitals/current
Authorization: Bearer {token}
```

### Get Vitals History
```
GET /api/vitals/history/1
Authorization: Bearer {token}
```

## Billing

### Process Payment
```
POST /api/payments
Authorization: Bearer {token}
Content-Type: application/json

{
    "invoice_id": 1,
    "amount": 100.00,
    "payment_method": "card"
}
```

### Process Payment Response (200)
```json
{
    "success": true,
    "data": {
        "invoice": {
            "id": 1,
            "patient_id": 1,
            "amount": "100.00",
            "date": "2026-04-15",
            "status": "paid",
            "description": "Office visit",
            "created_at": "2026-04-15T00:00:00.000000Z",
            "updated_at": "2026-04-17T03:45:00.000000Z"
        },
        "payment_amount": 100.00,
        "payment_method": "card",
        "timestamp": "2026-04-17T03:45:00.000000Z"
    },
    "message": "Payment recorded successfully"
}
```

### Get Billing Dashboard Metrics
```
GET /api/billing/dashboard-metrics
Authorization: Bearer {token}
```

### Billing Metrics Response (200)
```json
{
    "success": true,
    "data": {
        "todaysRevenue": 500.00,
        "pendingInvoices": 3,
        "outstandingBalance": 450.00,
        "recentTransactions": [
            {
                "id": 1,
                "patient_id": 1,
                "amount": "100.00",
                "status": "paid",
                "date": "2026-04-17",
                "updated_at": "2026-04-17T03:45:00.000000Z",
                "patient": {
                    "id": 1,
                    "first_name": "John",
                    "last_name": "Doe"
                }
            }
        ]
    },
    "message": "Billing metrics retrieved successfully"
}
```

## Error Responses

### Validation Error (400)
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "email": [
            "The email field must be a valid email.",
            "The email has already been taken."
        ],
        "phone": [
            "The phone field is required."
        ]
    }
}
```

### Not Found (404)
```json
{
    "success": false,
    "message": "Patient not found"
}
```

### Unauthorized (401)
```json
{
    "success": false,
    "message": "Unauthenticated"
}
```

### Server Error (500)
```json
{
    "success": false,
    "message": "Failed to create patient",
    "errors": [
        "Exception message here"
    ]
}
```

## Staff

### Create Staff Member
```
POST /api/staff
Authorization: Bearer {token}
Content-Type: application/json

{
    "name": "Dr. Emily Johnson",
    "email": "emily@hospital.com",
    "phone": "555-9999",
    "role": "doctor",
    "department": "Cardiology",
    "title": "Cardiologist",
    "status": "active"
}
```

### Update Staff Status
```
PUT /api/staff/1/status
Authorization: Bearer {token}
Content-Type: application/json

{
    "status": "on_leave"
}
```

## Schedule

### Create Schedule Block
```
POST /api/schedule
Authorization: Bearer {token}
Content-Type: application/json

{
    "time": "09:00:00",
    "day": "Monday",
    "patient_id": 1,
    "doctor_id": 1,
    "procedure": "Consultation",
    "length": 30,
    "status": "scheduled"
}
```

## Specialists

### Get All Specialists
```
GET /api/specialists
Authorization: Bearer {token}
```

### Specialists Response (200)
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Dr. Smith",
            "email": "doctor@example.com",
            "phone": "555-1234",
            "title": "MD",
            "department": "General Practice",
            "status": "active",
            "created_at": "2026-03-01T00:00:00.000000Z"
        }
    ],
    "message": "Specialists retrieved successfully"
}
```
