<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;


use App\Models\UserModel;
use App\Models\UserTokensModel;
use App\Models\VoucherModel;
use App\Models\FavoriteModel;
use App\Models\OtpModel;
use App\Models\BtcLoyaltyModel;
use App\Models\MenuModel;
use App\Models\BranchModel;
use App\Models\BookingModel;
use App\Models\BookingSlotModel;
use App\Models\PackageModel;
use App\Models\NotificationRecipientModel;

/**
 * BaseController provides a convenient place for loading components
 * and performing functions that are needed by all your controllers.
 *
 * Extend this class in any new controllers:
 * ```
 *     class Home extends BaseController
 * ```
 *
 * For security, be sure to declare any new methods as protected or private.
 */
abstract class BaseController extends Controller
{
    /**
     * Be sure to declare properties for any property fetch you initialized.
     * The creation of dynamic property is deprecated in PHP 8.2.
     */

    protected $session;
    protected $userModel;
    protected $userTokensModel;
    protected $voucherModel;
    protected $favoriteModel;
    protected $otpModel;
    protected $btcLoyaltyModel;
    protected $menuModel;
    protected $branchModel;
    protected $bookingModel;
    protected $bookingSlotModel;
    protected $packageModel;
    protected $notificationRecipientModel;

    /**
     * @return void
     */
    public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger)
    {
        // Load here all helpers you want to be available in your controllers that extend BaseController.
        // Caution: Do not put the this below the parent::initController() call below.
        // $this->helpers = ['form', 'url'];

        // Caution: Do not edit this line.
        parent::initController($request, $response, $logger);


        $this->userModel = new UserModel();
        $this->userTokensModel = new UserTokensModel();
        $this->voucherModel = new VoucherModel();
        $this->favoriteModel = new FavoriteModel();
        $this->otpModel = new OtpModel();
        $this->btcLoyaltyModel = new BtcLoyaltyModel();
        $this->menuModel = new MenuModel();
        $this->branchModel = new BranchModel();
        $this->bookingModel = new BookingModel();
        $this->bookingSlotModel = new BookingSlotModel();
        $this->packageModel = new PackageModel();
        $this->notificationRecipientModel = new NotificationRecipientModel();



        $this->session = service('session');
        
        // Preload any models, libraries, etc, here.
    }

    protected function getWebSessionValue(string $key)
    {
        if (!$this->isWebSessionRequest()) {
            return null;
        }

        return $this->session->get($key);
    }

    protected function setWebSessionValue(string $key, $value): void
    {
        if (!$this->isWebSessionRequest()) {
            return;
        }

        $this->session->set($key, $value);
    }

    protected function removeWebSessionValue(string $key): void
    {
        if (!$this->isWebSessionRequest()) {
            return;
        }

        $this->session->remove($key);
    }

    private function isWebSessionRequest(): bool
    {
        return !$this->request->isCLI();
    }
}

