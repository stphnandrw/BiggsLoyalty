<?php

namespace App\Controllers;

use App\Services\NotificationService;
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
    protected NotificationService $notificationService;
    protected $claimedVoucherModel;
    protected $employeeModel;
    protected $brandName;
    protected $productName;
    protected $shortName;


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
        $this->notificationService = service('notificationService');
        $this->claimedVoucherModel = service('claimedVoucherModel');
        $this->employeeModel = service('employeeModel');

        // Use descriptive keys that explain the context of the name
        $this->brandName     = 'Biggs Inc.';     
        $this->productName   = 'Biggs Loyalty';  
        $this->shortName     = 'Biggs';          

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

    
    protected function checkSession(): void
    {
        if (!$this->session->get('is_logged_in')) {
            $this->response->redirect('/')->send(
                'message', 'Please log in to access this page.'
            );
            exit();
        }
    }

    protected function createGenericNotification(
        string $title,
        string $body,
        array $targetUsers = [],
        string $targetType = 'selected',
        array $dataPayload = [],
        string $type = 'general',
        ?string $scheduledAt = null,
        ?int $createdByEmployeeId = 1
    ): array {
        $targetType = trim($targetType);
        if (!in_array($targetType, ['broadcast', 'selected'], true)) {
            throw new \InvalidArgumentException('targetType must be broadcast or selected');
        }

        if ($targetType === 'selected' && empty($targetUsers)) {
            throw new \InvalidArgumentException('targetUsers is required for selected targetType');
        }

        return $this->notificationService->createAndSend([
            'title' => trim($title),
            'body' => trim($body),
            'type' => trim($type) !== '' ? trim($type) : 'general',
            'target_type' => $targetType,
            'target_users' => $targetUsers,
            'data_payload' => $dataPayload,
            'scheduled_at' => $scheduledAt,
            'created_by_employee_id' => $createdByEmployeeId,
        ]);
    }
}
