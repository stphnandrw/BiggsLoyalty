<?php

namespace App\Services;

use App\Models\NotificationModel;
use App\Models\NotificationQueueModel;
use App\Models\NotificationRecipientModel;
use App\Models\UserModel;
use App\Models\UserTokensModel;
use CodeIgniter\Database\BaseConnection;

class NotificationService
{
    protected NotificationModel $notificationModel;
    protected NotificationRecipientModel $recipientModel;
    protected NotificationQueueModel $queueModel;
    protected UserModel $userModel;
    protected UserTokensModel $userTokensModel;
    protected ExpoPushService $expoPushService;
    protected BaseConnection $db;

    public function __construct(
        NotificationModel $notificationModel,
        NotificationRecipientModel $recipientModel,
        NotificationQueueModel $queueModel,
        UserModel $userModel,
        UserTokensModel $userTokensModel,
        ExpoPushService $expoPushService,
        BaseConnection $db
    ) {
        $this->notificationModel = $notificationModel;
        $this->recipientModel = $recipientModel;
        $this->queueModel = $queueModel;
        $this->userModel = $userModel;
        $this->userTokensModel = $userTokensModel;
        $this->expoPushService = $expoPushService;
        $this->db = $db;
    }

    public function createNotification(array $input): array
    {
        $now = date('Y-m-d H:i:s');

        $this->notificationModel->insert([
            'title' => $input['title'],
            'body' => $input['body'],
            'type' => $input['type'] ?? 'general',
            'target_type' => $input['target_type'] ?? 'selected',
            'data_payload' => !empty($input['data_payload']) ? json_encode($input['data_payload']) : null,
            'status' => 'draft',
            'scheduled_at' => $input['scheduled_at'] ?? null,
            'created_by_employee_id' => $input['created_by_employee_id'] ?? null,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $notificationId = (int) $this->notificationModel->getInsertID();

        return $this->getAdminNotification($notificationId);
    }

    public function listAdminNotifications(): array
    {
        $rows = $this->notificationModel->getAllWithDeliveryCounts();

        return array_map(function (array $row): array {
            return $this->normalizeNotificationRow($row);
        }, $rows);
    }

    public function getAdminNotification(int $notificationId): array
    {
        $notification = $this->notificationModel->getByIdWithDeliveryCounts($notificationId);

        if (!$notification) {
            throw new \RuntimeException('Notification not found');
        }

        $stats = $this->recipientModel->getDeliveryStats($notificationId);

        $normalized = $this->normalizeNotificationRow($notification);
        $normalized['delivery_stats'] = $stats;

        return $normalized;
    }

    public function updateNotification(int $notificationId, array $input): array
    {
        $notification = $this->notificationModel->find($notificationId);
        if (!$notification) {
            throw new \RuntimeException('Notification not found');
        }

        if ($this->recipientModel->hasRecipients($notificationId)) {
            throw new \RuntimeException('Cannot update notification after send has started');
        }

        $updateData = [
            'updated_at' => date('Y-m-d H:i:s'),
        ];

        foreach (['title', 'body', 'type', 'target_type', 'scheduled_at'] as $field) {
            if (array_key_exists($field, $input)) {
                $updateData[$field] = $input[$field];
            }
        }

        if (array_key_exists('data_payload', $input)) {
            $updateData['data_payload'] = !empty($input['data_payload']) ? json_encode($input['data_payload']) : null;
        }

        $this->notificationModel->update($notificationId, $updateData);

        return $this->getAdminNotification($notificationId);
    }

    public function deleteNotification(int $notificationId): void
    {
        $notification = $this->notificationModel->find($notificationId);
        if (!$notification) {
            throw new \RuntimeException('Notification not found');
        }

        if ($this->recipientModel->hasRecipients($notificationId)) {
            throw new \RuntimeException('Cannot delete notification after send has started');
        }

        $this->notificationModel->delete($notificationId);
    }

    public function sendExistingNotification(int $notificationId, string $targetType, array $targetUsers = []): array
    {
        $notification = $this->notificationModel->find($notificationId);
        if (!$notification) {
            
            throw new \RuntimeException('Notification not found');
        }

        if ($this->recipientModel->hasRecipients($notificationId)) {
            
            throw new \RuntimeException('Notification has already been sent to recipients');
        }

        $users = $this->resolveTargetUsers($targetType, $targetUsers);
        if (empty($users)) {
            
            throw new \RuntimeException('No target users found for this notification');
        }

        $scheduledAt = $notification['scheduled_at'] ?? null;
        $isScheduled = $scheduledAt && strtotime((string) $scheduledAt) > time();
        $status = $isScheduled ? 'scheduled' : 'queued';

        $this->db->transStart();

        $now = date('Y-m-d H:i:s');

        $recipientRows = [];
        foreach ($users as $tagUid) {
            $recipientRows[] = [
                'notification_id' => $notificationId,
                'tag_uid' => $tagUid,
                'is_read' => 0,
                'delivery_status' => 'pending',
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        if (!empty($recipientRows)) {
            log_message('info', 'Inserting {count} recipients for notification_id {nid}', [
                'count' => count($recipientRows),
                'nid' => $notificationId,
            ]);
            $this->recipientModel->insertBatch($recipientRows);
        }

        $queuedJobs = 0;
        if (!$isScheduled) {
            $recipientIds = $this->recipientModel->getRecipientIdsByNotificationId($notificationId);
            $queuedJobs = $this->queueModel->enqueueRecipientIds($recipientIds);
        }

        $this->notificationModel->update($notificationId, [
            'status' => $status,
            'target_type' => $targetType,
            'updated_at' => $now,
        ]);

        $this->db->transComplete();

        if (!$this->db->transStatus()) {
            throw new \RuntimeException('Failed to send notification');
        }

        return [
            'notification_id' => $notificationId,
            'status' => $status,
            'recipient_count' => count($users),
            'queued_jobs' => $queuedJobs,
        ];
    }

    public function createAndSend(array $input): array
    {
        $created = $this->createNotification($input);

        return $this->sendExistingNotification(
            (int) $created['notification_id'],
            $input['target_type'] ?? 'selected',
            is_array($input['target_users'] ?? null) ? $input['target_users'] : []
        );
    }

    public function getUserNotifications(string $tagUid): array
    {
        $rows = $this->recipientModel->getUserNotifications($tagUid);
        $unreadCount = $this->recipientModel->countUnreadByTagUid($tagUid);

        $notifications = array_map(static function (array $row): array {
            return [
                'notification_id' => (int) $row['notification_id'],
                'notification_recipient_id' => (int) $row['notification_recipient_id'],
                'title' => $row['title'],
                'body' => $row['body'],
                'type' => $row['type'],
                'is_read' => (bool) $row['is_read'],
                'read_at' => $row['read_at'],
                'delivery_status' => $row['delivery_status'],
                'data_payload' => $row['data_payload'] ? json_decode($row['data_payload'], true) : null,
                'created_at' => $row['created_at'],
            ];
        }, $rows);

        return [
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
        ];
    }

    public function markAsRead(string $tagUid, array $notificationIds): array
    {
        $sanitizedIds = array_values(array_unique(array_filter(array_map('intval', $notificationIds))));
        $updatedCount = $this->recipientModel->markAsRead($tagUid, $sanitizedIds);

        return [
            'updated_count' => $updatedCount,
            'unread_count' => $this->recipientModel->countUnreadByTagUid($tagUid),
        ];
    }

    public function dispatchScheduled(int $limit = 200): array
    {
        $scheduled = $this->notificationModel->getDueScheduled($limit);
        $dispatched = 0;
        $jobsQueued = 0;

        foreach ($scheduled as $notification) {
            $recipientIds = $this->recipientModel->getRecipientIdsByNotificationId((int) $notification['notification_id']);
            $jobsQueued += $this->queueModel->enqueueRecipientIds($recipientIds);

            $this->notificationModel->update((int) $notification['notification_id'], [
                'status' => 'queued',
                'updated_at' => date('Y-m-d H:i:s'),
            ]);

            $dispatched++;
        }

        return [
            'scheduled_count' => count($scheduled),
            'dispatched_count' => $dispatched,
            'queued_jobs' => $jobsQueued,
        ];
    }

    public function processQueue(int $limit = 100): array
    {
        $jobs = $this->queueModel->getProcessableBatch($limit);

        $processed = 0;
        $sent = 0;
        $failed = 0;

        foreach ($jobs as $job) {
            $queueId = (int) $job['notification_queue_id'];
            $recipientId = (int) $job['notification_recipient_id'];
            $notificationId = (int) $job['notification_id'];
            $attempts = (int) $job['attempts'];
            $maxAttempts = (int) $job['max_attempts'];

            $this->queueModel->update($queueId, [
                'status' => 'processing',
                'updated_at' => date('Y-m-d H:i:s'),
            ]);

            $tokenRows = $this->userTokensModel->where('tag_uid', $job['tag_uid'])->findAll();
            $tokens = array_map(static fn(array $row): string => $row['expo_push_token'], $tokenRows);

            $payloadData = $job['data_payload'] ? json_decode($job['data_payload'], true) : [];
            $pushResult = $this->expoPushService->sendToTokens($tokens, [
                'title' => $job['title'],
                'body' => $job['body'],
                'data' => array_merge($payloadData ?? [], [
                    'notification_id' => $notificationId,
                ]),
            ]);

            $processed++;

            if (($pushResult['success'] ?? 0) > 0) {
                $this->queueModel->update($queueId, [
                    'status' => 'sent',
                    'processed_at' => date('Y-m-d H:i:s'),
                    'last_error' => null,
                    'updated_at' => date('Y-m-d H:i:s'),
                ]);
                $this->recipientModel->update($recipientId, [
                    'delivery_status' => 'sent',
                    'delivery_error' => null,
                    'updated_at' => date('Y-m-d H:i:s'),
                ]);
                $sent++;
            } else {
                $nextAttempts = $attempts + 1;
                $reachedMax = $nextAttempts >= $maxAttempts;
                $errorMessage = implode('; ', $pushResult['errors'] ?? ['Push failed']);

                $this->queueModel->update($queueId, [
                    'status' => 'failed',
                    'attempts' => $nextAttempts,
                    'next_attempt_at' => $reachedMax ? null : date('Y-m-d H:i:s', time() + 120),
                    'last_error' => $errorMessage,
                    'updated_at' => date('Y-m-d H:i:s'),
                ]);

                if ($reachedMax) {
                    $this->recipientModel->update($recipientId, [
                        'delivery_status' => 'failed',
                        'delivery_error' => $errorMessage,
                        'updated_at' => date('Y-m-d H:i:s'),
                    ]);
                }

                log_message('error', 'Notification queue failed for queue_id {qid}: {err}', [
                    'qid' => $queueId,
                    'err' => $errorMessage,
                ]);

                $failed++;
            }

            $this->syncNotificationStatus($notificationId);
        }

        return [
            'processed_count' => $processed,
            'sent_count' => $sent,
            'failed_count' => $failed,
        ];
    }

    protected function resolveTargetUsers(string $targetType, array $selectedUsers): array
    {
        if ($targetType === 'broadcast') {
            $rows = $this->userModel->select('tag_uid')->findAll();
            return array_values(array_filter(array_map(static fn(array $row): string => (string) $row['tag_uid'], $rows)));
        }

        return array_values(array_unique(array_filter(array_map('strval', $selectedUsers))));
    }

    protected function syncNotificationStatus(int $notificationId): void
    {
        $stats = $this->recipientModel->getDeliveryStats($notificationId);

        if (($stats['all'] ?? 0) === 0) {
            return;
        }

        if (($stats['sent'] ?? 0) === ($stats['all'] ?? 0)) {
            $this->notificationModel->update($notificationId, [
                'status' => 'sent',
                'sent_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ]);
            return;
        }

        if (($stats['failed'] ?? 0) > 0) {
            $status = (($stats['sent'] ?? 0) > 0) ? 'partial' : 'failed';
            $this->notificationModel->update($notificationId, [
                'status' => $status,
                'updated_at' => date('Y-m-d H:i:s'),
            ]);
        }
    }

    protected function normalizeNotificationRow(array $row): array
    {
        return [
            'notification_id' => (int) $row['notification_id'],
            'title' => (string) $row['title'],
            'body' => (string) $row['body'],
            'type' => (string) ($row['type'] ?? 'general'),
            'target_type' => (string) ($row['target_type'] ?? 'selected'),
            'data_payload' => !empty($row['data_payload']) ? json_decode((string) $row['data_payload'], true) : null,
            'status' => (string) ($row['status'] ?? 'draft'),
            'scheduled_at' => $row['scheduled_at'] ?? null,
            'sent_at' => $row['sent_at'] ?? null,
            'created_by_employee_id' => isset($row['created_by_employee_id']) ? (int) $row['created_by_employee_id'] : null,
            'created_at' => $row['created_at'] ?? null,
            'updated_at' => $row['updated_at'] ?? null,
            'recipient_count' => isset($row['recipient_count']) ? (int) $row['recipient_count'] : 0,
        ];
    }
}