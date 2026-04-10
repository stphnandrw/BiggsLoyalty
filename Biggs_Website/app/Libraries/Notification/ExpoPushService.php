<?php

namespace App\Libraries\Notification;

class ExpoPushService
{
    public function sendToTokens(array $tokens, array $payload): array
    {
        $tokens = array_values(array_filter(array_unique($tokens)));

        if (empty($tokens)) {
            return [
                'success' => 0,
                'failed' => 0,
                'errors' => ['No Expo tokens found'],
            ];
        }

        $messages = [];
        foreach ($tokens as $token) {
            $messages[] = [
                'to' => $token,
                'sound' => 'default',
                'title' => $payload['title'] ?? 'Notification',
                'body' => $payload['body'] ?? '',
                'data' => $payload['data'] ?? [],
            ];
        }

        try {
            $client = service('curlrequest');
            $response = $client->post('https://exp.host/--/api/v2/push/send', [
                'headers' => [
                    'Accept' => 'application/json',
                    'Accept-Encoding' => 'gzip, deflate',
                    'Content-Type' => 'application/json',
                ],
                'body' => json_encode($messages),
            ]);

            $decoded = json_decode((string) $response->getBody(), true);
            $resultData = $decoded['data'] ?? [];

            $success = 0;
            $failed = 0;
            $errors = [];

            foreach ($resultData as $item) {
                if (($item['status'] ?? '') === 'ok') {
                    $success++;
                } else {
                    $failed++;
                    $errors[] = $item['message'] ?? 'Unknown Expo push error';
                }
            }

            return [
                'success' => $success,
                'failed' => $failed,
                'errors' => $errors,
            ];
        } catch (\Throwable $exception) {
            return [
                'success' => 0,
                'failed' => count($tokens),
                'errors' => [$exception->getMessage()],
            ];
        }
    }
}
