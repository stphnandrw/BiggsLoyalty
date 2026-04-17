<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

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
    protected $claimedVoucherModel;

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


        $this->userModel = service('userModel');
        $this->userTokensModel = service('userTokensModel');
        $this->voucherModel = service('voucherModel');
        $this->favoriteModel = service('favoriteModel');
        $this->otpModel = service('otpModel');
        $this->btcLoyaltyModel = service('btcLoyaltyModel');
        $this->menuModel = service('menuModel');
        $this->branchModel = service('branchModel');
        $this->bookingModel = service('bookingModel');
        $this->bookingSlotModel = service('bookingSlotModel');
        $this->packageModel = service('packageModel');
        $this->notificationRecipientModel = service('notificationRecipientModel');
        $this->claimedVoucherModel = service('claimedVoucherModel');



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
