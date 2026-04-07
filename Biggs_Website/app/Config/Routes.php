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

    // Loyalty points
    $routes->post('loyalty-points', 'UserController::getLoyaltyPoints');
    
    // Add Favorite routes
    $routes->post('addFavoriteMenu', 'UserController::addFavoriteMenu');
    $routes->post('addFavoriteLocation', 'UserController::addFavoriteLocation');
    $routes->post('getFavoriteBranchByCode', 'UserController::getFavoriteBranchByCode');
    $routes->post('getFavoriteLocationByTagUid', 'UserController::getFavoriteLocationByTagUid');
    $routes->post('getFavoriteMenuByCode', 'UserController::getFavoriteMenuByCode');
    $routes->post('getFavoriteMenuByTagUid', 'UserController::getFavoriteMenuByTagUid');
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

$routes->group('menu', function ($routes) {
    $routes->get('/', 'MenuController::getAllMenus');
    $routes->get('categories', 'MenuController::getMenuCategories');
});

$routes->group('booking', function ($routes) {
    $routes->post('packages', 'BookingController::getBranchPackages');
    $routes->post('slots', 'BookingController::getAvailableSlots');
    $routes->post('create', 'BookingController::createBooking');
    $routes->post('my-bookings', 'BookingController::getMyBookings');
});