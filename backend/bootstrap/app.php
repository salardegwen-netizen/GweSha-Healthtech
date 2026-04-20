<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Middleware configuration - keep minimal
        // Custom Authenticate middleware handles API auth redirects
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Handle all exceptions with JSON for API requests
        $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e) {
            if (request()->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated. Please login first.',
                    'errors' => []
                ], 401);
            }
        });

        $exceptions->render(function (Throwable $e) {
            if (request()->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage() ?: 'An error occurred',
                    'errors' => config('app.debug') ? [
                        'file' => $e->getFile(),
                        'line' => $e->getLine(),
                    ] : []
                ], match (true) {
                    $e instanceof \Symfony\Component\HttpKernel\Exception\NotFoundHttpException => 404,
                    $e instanceof \Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException => 401,
                    $e instanceof \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException => 403,
                    $e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException => 404,
                    $e instanceof \Illuminate\Validation\ValidationException => 422,
                    default => 500
                });
            }
        });
    })->create();
