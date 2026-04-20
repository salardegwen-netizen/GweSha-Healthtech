# API Endpoints Quick Reference

## Authentication (Public - No Auth Required)
```
POST   /api/auth/login                 - Login with email/password
POST   /api/auth/register              - Register new user
```

## Authentication (Protected - Sanctum Required)
```
POST   /api/auth/logout                - Logout current user
GET    /api/auth/me                    - Get current user info
```

## Patients (Protected)
```
GET    /api/patients                   - List all patients
POST   /api/patients                   - Create new patient
GET    /api/patients/{id}              - Get patient details
PUT    /api/patients/{id}              - Update patient
DELETE /api/patients/{id}              - Delete patient
```

## Appointments (Protected)
```
GET    /api/appointments               - List all appointments
POST   /api/appointments               - Create new appointment
GET    /api/appointments/{id}          - Get appointment details
PUT    /api/appointments/{id}          - Update appointment
DELETE /api/appointments/{id}          - Delete appointment
```

## Invoices & Billing (Protected)
```
GET    /api/invoices                   - List all invoices
GET    /api/invoices/{id}              - Get invoice details
POST   /api/payments                   - Record payment
GET    /api/billing/dashboard-metrics  - Get billing dashboard metrics
```

## Staff (Protected)
```
GET    /api/staff                      - List all staff members
POST   /api/staff                      - Create new staff member
GET    /api/staff/{id}                 - Get staff details
PUT    /api/staff/{id}                 - Update staff member
DELETE /api/staff/{id}                 - Delete staff member
PUT    /api/staff/{id}/status          - Update staff status only
```

## Health Records (Protected)
```
GET    /api/health-records             - List all health records
POST   /api/health-records             - Create new health record
GET    /api/health-records/{id}        - Get health record
PUT    /api/health-records/{id}        - Update health record
DELETE /api/health-records/{id}        - Delete health record
```

## Vitals (Protected)
```
GET    /api/vitals                     - List all vitals
POST   /api/vitals                     - Record new vitals
GET    /api/vitals/current             - Get current user's latest vitals
GET    /api/vitals/history/{patientId} - Get vitals history for patient
```

## Schedule (Protected)
```
GET    /api/schedule                   - List all schedule blocks
POST   /api/schedule                   - Create schedule block
GET    /api/schedule/blocks/{id}       - Get schedule block
PUT    /api/schedule/blocks/{id}       - Update schedule block
DELETE /api/schedule/blocks/{id}       - Delete schedule block
```

## Specialists (Protected)
```
GET    /api/specialists                - List all specialists (doctors)
```

## Authentication Header
All protected endpoints require:
```
Authorization: Bearer {token}
```

## Error Codes
- 200: OK (successful GET/PUT)
- 201: Created (successful POST)
- 400: Bad Request (validation errors)
- 401: Unauthorized (missing or invalid token)
- 404: Not Found (resource doesn't exist)
- 500: Server Error (unexpected exception)
