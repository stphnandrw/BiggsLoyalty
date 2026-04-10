<?php

namespace App\Models;

use CodeIgniter\Model;

class NotificationQueueModel extends Model
{
    protected $table = 'notification_queue';
    protected $primaryKey = 'notification_queue_id';
    protected $returnType = 'array';
    protected $allowedFields = [
        'notification_recipient_id',
        'status',
        'attempts',
        'max_attempts',
        'next_attempt_at',
        'last_error',
        'processed_at',
        'created_at',
        'updated_at',
    ];

    public function enqueueRecipientIds(array $recipientIds): int
    {
        if (empty($recipientIds)) {
            return 0;
        }

        $now = date('Y-m-d H:i:s');
        $rows = [];

        foreach ($recipientIds as $recipientId) {
            $rows[] = [
                'notification_recipient_id' => $recipientId,
                'status' => 'pending',
                'attempts' => 0,
                'max_attempts' => 3,
                'next_attempt_at' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        $this->insertBatch($rows);

        return count($rows);
    }

    public function getProcessableBatch(int $limit = 100): array
    {
        return $this->select('notification_queue.notification_queue_id, notification_queue.notification_recipient_id, notification_queue.attempts, notification_queue.max_attempts, notification_recipients.tag_uid, notification_recipients.notification_id, notifications.title, notifications.body, notifications.type, notifications.data_payload')
            ->join('notification_recipients', 'notification_recipients.notification_recipient_id = notification_queue.notification_recipient_id', 'inner')
            ->join('notifications', 'notifications.notification_id = notification_recipients.notification_id', 'inner')
            ->groupStart()
                ->where('notification_queue.status', 'pending')
                ->orGroupStart()
                    ->where('notification_queue.status', 'failed')
                    ->where('notification_queue.next_attempt_at <=', date('Y-m-d H:i:s'))
                ->groupEnd()
            ->groupEnd()
            ->where('notification_queue.attempts < notification_queue.max_attempts', null, false)
            ->orderBy('notification_queue.notification_queue_id', 'ASC')
            ->limit($limit)
            ->findAll();
    }
}
