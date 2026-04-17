<?php

namespace Config;

use App\Models\BookingModel;
use App\Models\BookingSlotModel;
use App\Models\BtcLoyaltyModel;
use App\Models\BranchModel;
use App\Models\ClaimedVoucherModel;
use App\Models\FavoriteModel;
use App\Models\MenuModel;
use App\Models\NotificationModel;
use App\Models\NotificationQueueModel;
use App\Models\NotificationRecipientModel;
use App\Models\OtpModel;
use App\Models\PackageModel;
use App\Models\UserModel;
use App\Models\UserTokensModel;
use App\Models\VoucherModel;
use App\Services\ExpoPushService;
use App\Services\NotificationService;
use CodeIgniter\Config\BaseService;

/**
 * Services Configuration file.
 *
 * Services are simply other classes/libraries that the system uses
 * to do its job. This is used by CodeIgniter to allow the core of the
 * framework to be swapped out easily without affecting the usage within
 * the rest of your application.
 *
 * This file holds any application-specific services, or service overrides
 * that you might need. An example has been included with the general
 * method format you should use for your service methods. For more examples,
 * see the core Services file at system/Config/Services.php.
 */
class Services extends BaseService
{
    public static function notificationService($getShared = true): NotificationService
    {
        if ($getShared) {
            return static::getSharedInstance('notificationService');
        }

        return new NotificationService(
            service('notificationModel'),
            service('notificationRecipientModel'),
            service('notificationQueueModel'),
            service('userModel'),
            service('userTokensModel'),
            service('expoPushService'),
            db_connect()
        );
    }

    public static function expoPushService($getShared = true): ExpoPushService
    {
        if ($getShared) {
            return static::getSharedInstance('expoPushService');
        }

        return new ExpoPushService(service('curlrequest'));
    }

    public static function userModel($getShared = true): UserModel
    {
        if ($getShared) {
            return static::getSharedInstance('userModel');
        }

        return new UserModel();
    }

    public static function userTokensModel($getShared = true): UserTokensModel
    {
        if ($getShared) {
            return static::getSharedInstance('userTokensModel');
        }

        return new UserTokensModel();
    }

    public static function voucherModel($getShared = true): VoucherModel
    {
        if ($getShared) {
            return static::getSharedInstance('voucherModel');
        }

        return new VoucherModel();
    }

    public static function favoriteModel($getShared = true): FavoriteModel
    {
        if ($getShared) {
            return static::getSharedInstance('favoriteModel');
        }

        return new FavoriteModel();
    }

    public static function otpModel($getShared = true): OtpModel
    {
        if ($getShared) {
            return static::getSharedInstance('otpModel');
        }

        return new OtpModel();
    }

    public static function btcLoyaltyModel($getShared = true): BtcLoyaltyModel
    {
        if ($getShared) {
            return static::getSharedInstance('btcLoyaltyModel');
        }

        return new BtcLoyaltyModel();
    }

    public static function menuModel($getShared = true): MenuModel
    {
        if ($getShared) {
            return static::getSharedInstance('menuModel');
        }

        return new MenuModel();
    }

    public static function branchModel($getShared = true): BranchModel
    {
        if ($getShared) {
            return static::getSharedInstance('branchModel');
        }

        return new BranchModel();
    }

    public static function bookingModel($getShared = true): BookingModel
    {
        if ($getShared) {
            return static::getSharedInstance('bookingModel');
        }

        return new BookingModel();
    }

    public static function bookingSlotModel($getShared = true): BookingSlotModel
    {
        if ($getShared) {
            return static::getSharedInstance('bookingSlotModel');
        }

        return new BookingSlotModel();
    }

    public static function packageModel($getShared = true): PackageModel
    {
        if ($getShared) {
            return static::getSharedInstance('packageModel');
        }

        return new PackageModel();
    }

    public static function notificationModel($getShared = true): NotificationModel
    {
        if ($getShared) {
            return static::getSharedInstance('notificationModel');
        }

        return new NotificationModel();
    }

    public static function notificationRecipientModel($getShared = true): NotificationRecipientModel
    {
        if ($getShared) {
            return static::getSharedInstance('notificationRecipientModel');
        }

        return new NotificationRecipientModel();
    }

    public static function notificationQueueModel($getShared = true): NotificationQueueModel
    {
        if ($getShared) {
            return static::getSharedInstance('notificationQueueModel');
        }

        return new NotificationQueueModel();
    }

    public static function claimedVoucherModel($getShared = true): ClaimedVoucherModel
    {
        if ($getShared) {
            return static::getSharedInstance('claimedVoucherModel');
        }

        return new ClaimedVoucherModel();
    }
}
