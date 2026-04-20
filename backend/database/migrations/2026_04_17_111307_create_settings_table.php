<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            // Clinic Profile
            $table->string('clinic_name')->default('Sanctuary Health');
            $table->string('clinic_email');
            $table->string('clinic_phone');
            $table->text('clinic_address');
            $table->string('registration_number')->nullable();
            // Billing Configuration
            $table->string('tax_id')->nullable();
            $table->enum('billing_cycle', ['Monthly', 'Quarterly', 'Annually'])->default('Monthly');
            $table->enum('payment_method', ['ACH Bank Transfer', 'Credit Card', 'Wire Transfer', 'Insurance Direct'])->default('ACH Bank Transfer');
            $table->string('currency')->default('USD');
            // Notifications
            $table->boolean('email_alerts')->default(true);
            $table->boolean('sms_alerts')->default(false);
            $table->boolean('appointment_reminders')->default(true);
            $table->boolean('billing_alerts')->default(true);
            $table->boolean('system_updates')->default(false);
            // Security
            $table->boolean('two_factor')->default(true);
            $table->integer('session_timeout')->default(30);
            $table->boolean('require_password_reset')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
