<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$email = 'patient@gwesha.com';
$password = 'password';

echo "Attempting login for $email...\n";

if (Auth::attempt(['email' => $email, 'password' => $password])) {
    echo "Login SUCCESS!\n";
    $user = Auth::user();
    echo "User ID: " . $user->id . "\n";
    $token = $user->createToken('test_token')->plainTextToken;
    echo "Token created: " . $token . "\n";
} else {
    echo "Login FAILED!\n";
    $user = User::where('email', $email)->first();
    if ($user) {
        echo "User found in DB, but password mismatch.\n";
    } else {
        echo "User NOT found in DB.\n";
    }
}
