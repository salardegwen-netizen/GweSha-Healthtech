<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['appointment', 'patient', 'billing', 'system'])->default('system');
            $table->string('title');
            $table->text('message');
            $table->boolean('read')->default(false);
            $table->string('icon')->default('notifications');
            $table->string('color')->default('bg-gray-50 text-gray-700');
            $table->timestamps();
            $table->index('user_id');
            $table->index('read');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
