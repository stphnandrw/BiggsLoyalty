<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->get('testing/nfc-simulator', 'Home::nfcSimulator');
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


$routes->group('claimed-vouchers', function ($routes) {
    $routes->post('claim', 'FavoriteController::claimVoucher');
    $routes->post('redeem', 'FavoriteController::redeemVoucher');
    $routes->post('vouchers', 'FavoriteController::getAllClaimedVouchersByTagUid');
});

$routes->group('vouchers', function ($routes) {
    $routes->get('/', 'VoucherController::getAllVouchers');
    $routes->post('exclude-claimed', 'VoucherController::getVouchersExcludingClaimed');
});

$routes->group('menu', function ($routes) {
    $routes->get('/', 'MenuController::getAllMenus');
    $routes->get('categories', 'MenuController::getMenuCategories');
});

$routes->group('booking', function ($routes) {
    $routes->post('branch-packages', 'BookingController::getBranchPackages');
    $routes->post('slots', 'BookingController::getAvailableSlots');
    $routes->post('create', 'BookingController::createBooking');
    $routes->post('my-bookings', 'BookingController::getMyBookings');
    $routes->post('count', 'BookingController::getBookingCountByTagUid');
    $routes->post('cancel', 'BookingController::cancelBooking');
});