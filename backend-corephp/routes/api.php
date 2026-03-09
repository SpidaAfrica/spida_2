<?php

$authController = new AuthController();
$requestController = new RequestController();
$tractorController = new TractorController();
$dashboardController = new DashboardController();
$paymentController = new PaymentController();
$healthController = new HealthController();
$verificationController = new VerificationController();
$passwordController = new PasswordController();
$walletController = new WalletController();
$webhookController = new WebhookController();
$notificationController = new NotificationController();
$adminController = new AdminController();
$matchingController = new MatchingController();

$router->add('GET', '/health', fn(Request $r) => $healthController->index($r));

$router->add('POST', '/auth/register', fn(Request $r) => $authController->register($r));
$router->add('POST', '/auth/login', fn(Request $r) => $authController->login($r));
$router->add('GET', '/auth/me', fn(Request $r) => $authController->me($r), [fn(Request $r) => AuthMiddleware::handle($r)]);
$router->add('POST', '/auth/verify-email/send', fn(Request $r) => $verificationController->send($r), [fn(Request $r) => AuthMiddleware::handle($r)]);
$router->add('POST', '/auth/verify-email/confirm', fn(Request $r) => $verificationController->verify($r));
$router->add('POST', '/auth/password/forgot', fn(Request $r) => $passwordController->forgot($r));
$router->add('POST', '/auth/password/reset', fn(Request $r) => $passwordController->reset($r));

$router->add('POST', '/requests', fn(Request $r) => $requestController->create($r), [fn(Request $r) => AuthMiddleware::handle($r), AuthMiddleware::role(['FARMER'])]);
$router->add('GET', '/requests/{id}/tracking', fn(Request $r) => $requestController->tracking($r), [fn(Request $r) => AuthMiddleware::handle($r)]);
$router->add('POST', '/requests/{id}/search', fn(Request $r) => $matchingController->search($r), [fn(Request $r) => AuthMiddleware::handle($r)]);

$router->add('POST', '/tractors', fn(Request $r) => $tractorController->create($r), [fn(Request $r) => AuthMiddleware::handle($r), AuthMiddleware::role(['TRACTOR_OWNER', 'ADMIN'])]);
$router->add('GET', '/tractors/me', fn(Request $r) => $tractorController->myTractors($r), [fn(Request $r) => AuthMiddleware::handle($r)]);

$router->add('GET', '/dashboard/owner/summary', fn(Request $r) => $dashboardController->ownerSummary($r), [fn(Request $r) => AuthMiddleware::handle($r)]);

$router->add('POST', '/payments/estimate', fn(Request $r) => $paymentController->estimate($r), [fn(Request $r) => AuthMiddleware::handle($r)]);
$router->add('POST', '/payments/intent', fn(Request $r) => $paymentController->createIntent($r), [fn(Request $r) => AuthMiddleware::handle($r)]);
$router->add('POST', '/webhooks/payments', fn(Request $r) => $webhookController->payment($r));

$router->add('GET', '/wallet/me', fn(Request $r) => $walletController->me($r), [fn(Request $r) => AuthMiddleware::handle($r)]);
$router->add('GET', '/notifications/me', fn(Request $r) => $notificationController->myNotifications($r), [fn(Request $r) => AuthMiddleware::handle($r)]);

$router->add('GET', '/admin/users', fn(Request $r) => $adminController->users($r), [fn(Request $r) => AuthMiddleware::handle($r), AuthMiddleware::role(['ADMIN'])]);
