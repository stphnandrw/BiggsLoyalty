<?php

namespace App\Models;

use CodeIgniter\Model;

class NotificationModel extends Model
{
    protected $table = 'notifications';
    protected $primaryKey = 'notification_id';
    protected $returnType = 'array';
    protected $allowedFields = [
        'title',
        'body',
        'type',
        'target_type',
        'data_payload',
        'status',
        'scheduled_at',
        'sent_at',
        'created_by_employee_id',
        'created_at',
        'updated_at',
    ];

    public function insertNotification(array $notificationData, array $recipientUserIds): int
    {
        return (int)$this->insert($notificationData);
    }

    public function getDueScheduled(int $limit = 100): array
    {
        return $this->where('status', 'scheduled')
            ->where('scheduled_at <=', date('Y-m-d H:i:s'))
            ->orderBy('scheduled_at', 'ASC')
            ->limit($limit)
            ->findAll();
    }

    public function getAllWithDeliveryCounts(): array
    {
        return $this->select('notifications.*, COUNT(notification_recipients.notification_recipient_id) AS recipient_count')
            ->join('notification_recipients', 'notification_recipients.notification_id = notifications.notification_id', 'left')
            ->groupBy('notifications.notification_id')
            ->orderBy('notifications.created_at', 'DESC')
            ->findAll();
    }

    public function getByIdWithDeliveryCounts(int $notificationId): ?array
    {
        $row = $this->select('notifications.*, COUNT(notification_recipients.notification_recipient_id) AS recipient_count')
            ->join('notification_recipients', 'notification_recipients.notification_id = notifications.notification_id', 'left')
            ->where('notifications.notification_id', $notificationId)
            ->groupBy('notifications.notification_id')
            ->first();

        return $row ?: null;
    }
}
