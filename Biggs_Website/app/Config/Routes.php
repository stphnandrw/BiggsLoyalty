<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'AuthenticationController::index');
$routes->get('/signup', 'AuthenticationController::signup');
$routes->post('/login', 'AuthenticationController::login');
$routes->post('/logout', 'AuthenticationController::logout');
$routes->post('/register', 'AuthenticationController::register');
$routes->get('bookings', 'WebController::bookings');
$routes->get('notifications', 'WebController::manager');
$routes->get('nfc', 'WebController::nfcSimulator');

$routes->group('user', function ($routes) {
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

    // Notification routes
    $routes->post('getNotificationRecipientsByTagUid', 'UserController::getNotificationRecipientsByTagUid');
    $routes->post('markNotificationAsRead', 'UserController::markNotificationAsRead');
    $routes->post('markAllNotificationsAsRead', 'UserController::markAllNotificationsAsRead');

    // Voucher routes
    $routes->post('getAvailableVouchers', 'VoucherController::getVouchersExcludingClaimed');
    $routes->post('getClaimedVouchers', 'VoucherController::getClaimedVouchersByTagUId');
    $routes->post('getRedeemedVouchers', 'VoucherController::getRedeemedVouchers');

    $routes->post('claimVoucher', 'VoucherController::claimVoucher'); // Create a row on claimed_vouchers with active status
    $routes->post('startRedeemVoucher', 'VoucherController::startRedeemVoucher'); // Set claimed voucher status to pending, indicating the user has started the redemption process
    $routes->post("checkOnProcessVoucher", "VoucherController::checkOnProcessVoucher"); // Check if there's a pending redemption voucher for the user (to handle cases where the user might have closed the app before finalizing redemption)
    $routes->post('endRedeemVoucher', 'VoucherController::endRedeemVoucher'); // Finalize voucher redemption by checking points and updating status to redeemed if successful

    $routes->post('cancelVoucherRedemption', 'VoucherController::cancelVoucherRedemption'); // Cancel a pending voucher redemption

    $routes->post('checkSelectedVoucher', 'VoucherController::checkSelectedVoucher'); // Check if the selected voucher is still on pending redemption (to prevent claiming multiple vouchers at the same time)
});

$routes->group('menu', function ($routes) {
    $routes->get('/', 'MenuController::getAllMenus');
    $routes->get('categories', 'MenuController::getMenuCategories');
});

$routes->group('branches', function ($routes) {
    $routes->get('/', 'BookingController::getBranches');
    $routes->get('(:num)', 'BranchController::getBranchById/$1');
    $routes->post('bookings', 'BookingController::getAllBookingByBranch'); // For branch manager to view all bookings of their branch
    $routes->post('booking', 'BookingController::getBookingById'); // For branch manager to view their bookings of a specific branch
    $routes->post('approve-booking', 'BookingController::approveBooking'); // For branch manager to approve a booking
    $routes->post('reject-booking', 'BookingController::rejectBooking'); // For branch manager to reject a booking
    $routes->post('cancel-booking', 'BookingController::cancelBooking'); // For branch manager to cancel a booking
    $routes->post('reschedule-booking', 'BookingController::rescheduleBooking'); // For branch manager to reschedule a booking
});

$routes->group('booking', function ($routes) {
    $routes->post('branch-packages', 'BookingController::getBranchPackages');
    $routes->post('slots', 'BookingController::getAvailableSlots');
    $routes->post('create', 'BookingController::createBooking');
    $routes->post('my-bookings', 'BookingController::getMyBookings');
    $routes->post('count', 'BookingController::getBookingCountByTagUid');
    $routes->post('cancel', 'BookingController::cancelBooking');
});

$routes->group('notifications', function ($routes) {
    $routes->post('list', 'UserController::getNotificationRecipientsByTagUid');
    $routes->patch('mark-read', 'UserController::markNotificationAsRead');
    $routes->post('mark-read', 'UserController::markNotificationAsRead');
    $routes->post('mark-all-read', 'UserController::markAllNotificationsAsRead');
});

$routes->group('admin/notifications', function ($routes) {
    $routes->get('/', 'AdminController::index');
    $routes->get('(:num)', 'AdminController::show/$1');
    $routes->post('/', 'AdminController::create');
    $routes->patch('(:num)', 'AdminController::update/$1');
    $routes->post('(:num)/update', 'AdminController::update/$1');
    $routes->delete('(:num)', 'AdminController::delete/$1');
    $routes->post('(:num)/send', 'AdminController::send/$1');
    $routes->post('send', 'AdminController::send');
});
