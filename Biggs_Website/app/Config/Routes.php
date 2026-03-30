<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->group('user', function ($routes) {
    $routes->get('getUsers', 'UserController::getUsers');
    $routes->get('getUser', 'UserController::getUserByIdAndNumber');
    $routes->post('check', 'UserController::checkPhoneIfExist');
    $routes->post('checkTagUID', 'UserController::getUserByTagUID');
    $routes->post('create', 'UserController::createUser');
    $routes->post('update', 'UserController::updateUser');

    // OTP routes
    $routes->post('generate-otp', 'OtpController::generateOTP');
    $routes->post('verify-otp', 'OtpController::verifyOTP');
});


$routes->group('favorites', function ($routes) {
    $routes->post('remove', 'FavoriteController::removePromoFromFavorite');
    $routes->post('add', 'FavoriteController::addPromoToFavorite');
    $routes->post('menus', 'FavoriteController::getAllFavoriteMenuByUser');
    $routes->post('promos', 'FavoriteController::getAllFavoritePromosByTagUid');
});

$routes->group('promos', function ($routes) {
    $routes->get('/', 'PromoController::getAllPromos');
    $routes->post('exclude-favorites', 'PromoController::getPromosExcludingFavorites');
});