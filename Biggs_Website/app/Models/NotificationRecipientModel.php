<?php

namespace App\Models;

use CodeIgniter\Model;

class NotificationRecipientModel extends Model
{
    protected $table = 'notification_recipients';
    protected $primaryKey = 'notification_recipient_id';
    protected $returnType = 'array';
    protected $allowedFields = [
        'notification_id',
        'tag_uid',
        'is_read',
        'read_at',
        'delivery_status',
        'delivery_error',
        'created_at',
        'updated_at',
    ];

    public function getUserNotifications(string $tagUid): array
    {
        return $this->select('notification_recipients.notification_recipient_id, notification_recipients.notification_id, notification_recipients.is_read, notification_recipients.read_at, notification_recipients.delivery_status, notifications.title, notifications.body, notifications.type, notifications.data_payload, notifications.created_at')
            ->join('notifications', 'notifications.notification_id = notification_recipients.notification_id', 'inner')
            ->where('notification_recipients.tag_uid', $tagUid)
            ->orderBy('notifications.created_at', 'DESC')
            ->findAll();
    }

    public function countUnreadByTagUid(string $tagUid): int
    {
        return $this->where('tag_uid', $tagUid)
            ->where('is_read', 0)
            ->countAllResults();
    }

    public function markAsRead(string $tagUid, array $notificationIds): int
    {
        if (empty($notificationIds)) {
            return 0;
        }

        $builder = $this->builder();
        $builder->where('tag_uid', $tagUid)
            ->where('is_read', 0)
            ->whereIn('notification_id', $notificationIds)
            ->set('is_read', 1)
            ->set('read_at', date('Y-m-d H:i:s'))
            ->set('updated_at', date('Y-m-d H:i:s'))
            ->update();

        return $this->db->affectedRows();
    }

    public function hasRecipients(int $notificationId): bool
    {
        return $this->where('notification_id', $notificationId)->countAllResults() > 0;
    }

    public function getRecipientIdsByNotificationId(int $notificationId): array
    {
        $rows = $this->select('notification_recipient_id')
            ->where('notification_id', $notificationId)
            ->findAll();

        return array_map(static fn(array $row): int => (int) $row['notification_recipient_id'], $rows);
    }

    public function getDeliveryStats(int $notificationId): array
    {
        $all = $this->where('notification_id', $notificationId)->countAllResults();
        $sent = $this->where('notification_id', $notificationId)->where('delivery_status', 'sent')->countAllResults();
        $failed = $this->where('notification_id', $notificationId)->where('delivery_status', 'failed')->countAllResults();

        return [
            'all' => $all,
            'sent' => $sent,
            'failed' => $failed,
            'pending' => max(0, $all - ($sent + $failed)),
        ];
    }

    public function getRecipientIdsByTagUid($tagUid){
            $rows = $this->where('tag_uid', $tagUid)
                ->findAll();
    
            return $rows;
    }
}
