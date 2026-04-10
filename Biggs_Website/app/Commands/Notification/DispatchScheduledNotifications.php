<?php

namespace App\Commands\Notification;

use App\Libraries\Notification\NotificationService;
use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;

class DispatchScheduledNotifications extends BaseCommand
{
    protected $group = 'Notifications';
    protected $name = 'notifications:dispatch-scheduled';
    protected $description = 'Dispatch due scheduled notifications to queue jobs.';

    public function run(array $params)
    {
        $limit = (int) ($params[0] ?? 200);
        $service = new NotificationService();
        $result = $service->dispatchScheduled($limit);

        CLI::write('Scheduled found: ' . $result['scheduled_count'], 'yellow');
        CLI::write('Dispatched: ' . $result['dispatched_count'], 'green');
        CLI::write('Jobs queued: ' . $result['queued_jobs'], 'green');
    }
}
