<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Settings extends Model
{
    protected $fillable = [
        'clinic_name',
        'clinic_email',
        'clinic_phone',
        'clinic_address',
        'registration_number',
        'tax_id',
        'billing_cycle',
        'payment_method',
        'currency',
        'email_alerts',
        'sms_alerts',
        'appointment_reminders',
        'billing_alerts',
        'system_updates',
        'two_factor',
        'session_timeout',
        'require_password_reset',
    ];

    protected $casts = [
        'email_alerts' => 'boolean',
        'sms_alerts' => 'boolean',
        'appointment_reminders' => 'boolean',
        'billing_alerts' => 'boolean',
        'system_updates' => 'boolean',
        'two_factor' => 'boolean',
        'require_password_reset' => 'boolean',
        'session_timeout' => 'integer',
    ];
}

