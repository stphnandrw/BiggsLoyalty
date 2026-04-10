# Notification Commands

## Why these command files were added

These command classes were created because your requirement explicitly asked for cronjob-ready background processing for notifications:

- Scheduled notifications
- Queue processing

In CodeIgniter 4, background jobs for cron are typically implemented as Spark commands. That is why these were added:

- app/Commands/DispatchScheduledNotifications.php
- app/Commands/ProcessNotificationQueue.php

## What each command does

### notifications:dispatch-scheduled

File: app/Commands/DispatchScheduledNotifications.php

Purpose:
- Finds notifications whose scheduled_at is due
- Converts them into queue jobs
- Marks them as queued for processing

Use:

php spark notifications:dispatch-scheduled
php spark notifications:dispatch-scheduled 500

### notifications:process-queue

File: app/Commands/ProcessNotificationQueue.php

Purpose:
- Pulls queue jobs in batches
- Sends Expo push notifications
- Updates delivery status and retry metadata

Use:

php spark notifications:process-queue
php spark notifications:process-queue 200

## Cron examples

Run every minute for scheduled dispatch:

* * * * * cd /path/to/Biggs_Website && php spark notifications:dispatch-scheduled >> writable/logs/cron-dispatch.log 2>&1

Run every minute for queue processing:

* * * * * cd /path/to/Biggs_Website && php spark notifications:process-queue >> writable/logs/cron-process.log 2>&1

## Related implementation files

- app/Libraries/NotificationService.php
- app/Libraries/ExpoPushService.php
- app/Models/NotificationQueueModel.php
- app/Models/NotificationRecipientModel.php
- app/Models/NotificationModel.php
- app/Models/EmployeeModel.php

## Employee auth note

- Manual send endpoint expects `employee_api_key`.
- Backward compatibility is kept for `admin_api_key` while clients are migrating.

## Official documentation

- CodeIgniter 4 CLI (Spark Commands): https://codeigniter4.github.io/userguide/cli/cli_commands.html
- CodeIgniter 4 Creating Spark Commands: https://codeigniter4.github.io/userguide/cli/cli_commands.html#creating-spark-commands
- CodeIgniter 4 Running via Cron Jobs: https://codeigniter4.github.io/userguide/cli/cli_commands.html#running-via-cron-jobs
