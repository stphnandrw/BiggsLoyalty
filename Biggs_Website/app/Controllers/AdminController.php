<?php

namespace App\Controllers;

use App\Services\NotificationService;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

class AdminController extends BaseController
{
    private const STATIC_CREATOR_ID = 1;

    protected NotificationService $notificationService;

    public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger)
    {
        parent::initController($request, $response, $logger);
        $this->notificationService = service('notificationService');
    }

    public function index()
    {
        $result = $this->notificationService->listAdminNotifications();

        return $this->response->setJSON([
            'status' => 'success',
            'data' => $result,
        ]);
    }

    public function show($notificationId)
    {
        try {
            $result = $this->notificationService->getAdminNotification((int) $notificationId);

            return $this->response->setJSON([
                'status' => 'success',
                'data' => $result,
            ]);
        } catch (\RuntimeException $exception) {
            return $this->response->setStatusCode(404)->setJSON([
                'message' => $exception->getMessage(),
            ]);
        }
    }

    public function create()
    {
        $data = $this->request->getJSON(true) ?? [];
        $validationError = $this->validateBasePayload($data, false);
        if ($validationError) {
            return $this->response->setStatusCode(400)->setJSON([
                'message' => $validationError,
            ]);
        }

        $payload = [
            'title' => trim((string) $data['title']),
            'body' => trim((string) $data['body']),
            'type' => trim((string) ($data['type'] ?? 'general')),
            'target_type' => (string) ($data['target_type'] ?? 'selected'),
            'data_payload' => is_array($data['data_payload'] ?? null) ? $data['data_payload'] : [],
            'scheduled_at' => $data['scheduled_at'] ?? null,
            'created_by_employee_id' => self::STATIC_CREATOR_ID,
        ];

        $result = $this->notificationService->createNotification($payload);

        return $this->response->setStatusCode(201)->setJSON([
            'status' => 'success',
            'message' => 'Notification created',
            'data' => $result,
        ]);
    }

    public function update($notificationId)
    {
        $data = $this->request->getJSON(true) ?? [];

        try {
            $result = $this->notificationService->updateNotification((int) $notificationId, $data);

            return $this->response->setJSON([
                'status' => 'success',
                'message' => 'Notification updated',
                'data' => $result,
            ]);
        } catch (\RuntimeException $exception) {
            return $this->response->setStatusCode(409)->setJSON([
                'message' => $exception->getMessage(),
            ]);
        }
    }

    public function delete($notificationId)
    {
        try {
            $this->notificationService->deleteNotification((int) $notificationId);

            return $this->response->setJSON([
                'status' => 'success',
                'message' => 'Notification deleted',
            ]);
        } catch (\RuntimeException $exception) {
            return $this->response->setStatusCode(409)->setJSON([
                'message' => $exception->getMessage(),
            ]);
        }
    }

    public function send($notificationId = null)
    {
        $data = $this->request->getJSON(true) ?? [];
        $targetType = (string) ($data['target_type'] ?? 'selected');
        $targetUsers = is_array($data['target_users'] ?? null) ? $data['target_users'] : [];

        if (!in_array($targetType, ['broadcast', 'selected'], true)) {
            return $this->response->setStatusCode(400)->setJSON([
                'message' => 'target_type must be broadcast or selected',
            ]);
        }

        if ($targetType === 'selected' && empty($targetUsers)) {
            return $this->response->setStatusCode(400)->setJSON([
                'message' => 'target_users is required for selected target_type',
            ]);
        }

        try {
            if ($notificationId !== null) {
                $result = $this->notificationService->sendExistingNotification((int) $notificationId, $targetType, $targetUsers);
            } else {
                $validationError = $this->validateBasePayload($data, true);
                if ($validationError) {
                    return $this->response->setStatusCode(400)->setJSON([
                        'message' => $validationError,
                    ]);
                }

                $result = $this->notificationService->createAndSend([
                    'title' => trim((string) $data['title']),
                    'body' => trim((string) $data['body']),
                    'type' => trim((string) ($data['type'] ?? 'general')),
                    'target_type' => $targetType,
                    'target_users' => $targetUsers,
                    'data_payload' => is_array($data['data_payload'] ?? null) ? $data['data_payload'] : [],
                    'scheduled_at' => $data['scheduled_at'] ?? null,
                    'created_by_employee_id' => self::STATIC_CREATOR_ID,
                ]);
            }

            return $this->response->setStatusCode(201)->setJSON([
                'status' => 'success',
                'message' => 'Notification accepted',
                'data' => $result,
            ]);
        } catch (\RuntimeException $exception) {
            return $this->response->setStatusCode(409)->setJSON([
                'message' => $exception->getMessage(),
            ]);
        }
    }

    protected function validateBasePayload(array $data, bool $forSend): ?string
    {
        $title = trim((string) ($data['title'] ?? ''));
        $body = trim((string) ($data['body'] ?? ''));

        if ($title === '' || $body === '') {
            return 'title and body are required';
        }

        if (strlen($title) > 255) {
            return 'title must not exceed 255 characters';
        }

        if ($forSend) {
            $targetType = (string) ($data['target_type'] ?? 'selected');
            $targetUsers = is_array($data['target_users'] ?? null) ? $data['target_users'] : [];

            if (!in_array($targetType, ['broadcast', 'selected'], true)) {
                return 'target_type must be broadcast or selected';
            }

            if ($targetType === 'selected' && empty($targetUsers)) {
                return 'target_users is required for selected target_type';
            }
        }

        return null;
    }
}
