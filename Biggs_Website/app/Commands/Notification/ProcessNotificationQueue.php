<?php

namespace App\Commands\Notification;

use App\Libraries\Notification\NotificationService;
use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;

class ProcessNotificationQueue extends BaseCommand
{
    protected $group = 'Notifications';
    protected $name = 'notifications:process-queue';
    protected $description = 'Process queued notification jobs and send Expo pushes.';

    public function run(array $params)
    {
        $limit = (int) ($params[0] ?? 100);
        $service = new NotificationService();
        $result = $service->processQueue($limit);

        CLI::write('Processed: ' . $result['processed_count'], 'yellow');
        CLI::write('Sent: ' . $result['sent_count'], 'green');
        CLI::write('Failed: ' . $result['failed_count'], 'red');
    }
}
