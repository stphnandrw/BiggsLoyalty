<?php

namespace App\Controllers;

class UserController extends BaseController
{
    public function getUsers()
    {
        log_message('debug', 'Fetching all users');

        $users = $this->userModel->findAll();

        log_message('debug', 'Users fetched count: ' . count($users));

        return $this->response->setJSON($users);
    }

    public function getUserByTagUID()
    {
        $data = $this->request->getJSON();
        log_message('debug', 'getUserByTagUID payload: ' . json_encode($data));

        $tagUid = $data->tag_uid ?? null;

        if (!$tagUid) {
            log_message('error', 'Tag UID is missing');
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'message' => 'Tag UID is required'
            ]);
        }

        $user = $this->userModel->where('tag_uid', $tagUid)->first();
        log_message('debug', 'User query result: ' . json_encode($user));

        if ($user) {
            return $this->response->setJSON([
                'status' => 'success',
                'message' => 'User found',
                'data' => [
                    'status' => true,
                    'phone_number' => $user['phone_number'] ?? null,
                ],
            ]);
        }

        log_message('error', 'User not found: ' . $tagUid);
        return $this->response->setStatusCode(404)->setJSON([
            'status' => 'error',
            'message' => 'User not found'
        ]);
    }

    public function getUserByTagUidAndPhone()
    {
        $data = $this->request->getJSON();
        log_message('debug', 'Payload: ' . json_encode($data));

        $tagUid = $data->tag_uid ?? null;
        $phoneNumber = $data->phone_number ?? null;

        if (!$tagUid || !$phoneNumber) {
            log_message('error', 'Missing tag_uid or phone_number');
            return $this->response->setStatusCode(400)->setJSON(['message' => 'Tag UID and phone number are required']);
        }

        $user = $this->userModel
            ->where('tag_uid', $tagUid)
            ->where('phone_number', $phoneNumber)
            ->first();

        log_message('debug', 'User found: ' . json_encode($user));

        if (!$user) {
            log_message('error', 'User not found');
            return $this->response->setStatusCode(404)->setJSON(['message' => 'User not found']);
        }

        $loyaltyPoints = $this->btcLoyaltyModel->getLoyaltyPoints($tagUid);
        log_message('debug', 'Loyalty points: ' . json_encode($loyaltyPoints));

        return $this->response->setJSON(array_merge($user, [
            'loyalty_points' => $loyaltyPoints
        ]));
    }

    public function getUserByPhoneNumber()
    {
        $data = $this->request->getJSON();
        log_message('debug', 'Payload: ' . json_encode($data));

        $phone_number = $data->phone_number ?? null;

        if (!$phone_number) {
            log_message('error', 'Phone number missing');
            return $this->response->setStatusCode(400)->setJSON(['message' => 'Phone number is required']);
        }

        $user = $this->userModel->where('phone_number', $phone_number)->first();
        log_message('debug', 'User result: ' . json_encode($user));

        if ($user) {
            return $this->response->setJSON($user);
        }

        log_message('error', 'User not found for phone: ' . $phone_number);
        return $this->response->setStatusCode(404)->setJSON(['message' => 'User not found']);
    }

    public function checkPhoneIfExist()
    {
        $data = $this->request->getJSON();
        log_message('debug', 'Payload: ' . json_encode($data));

        $phone_number = $data->phone_number ?? null;

        if (!$phone_number) {
            log_message('error', 'Phone number is required');
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'message' => 'Phone number is required',
                'data' => [
                    'exists' => false,
                ],
            ]);
        }

        $user = $this->userModel->where('phone_number', $phone_number)->first();
        log_message('debug', 'User lookup: ' . json_encode($user));

        if (!$user) {
            return $this->response->setJSON([
                'status' => 'success',
                'message' => 'User lookup complete',
                'data' => [
                    'exists' => false,
                ],
            ]);
        }

        $latestUserToken = $this->userTokensModel
            ->where('tag_uid', $user['tag_uid'])
            ->orderBy('token_id', 'DESC')
            ->first();

        log_message('debug', 'Latest token: ' . json_encode($latestUserToken));

        if ($user['name'] === null || $user['birthday'] === null) {
            log_message('debug', 'Incomplete user: ' . $user['tag_uid']);

            return $this->response->setJSON([
                'status' => 'success',
                'message' => 'User found',
                'data' => [
                    'exists' => true,
                    'tag_uid' => $user['tag_uid'],
                    'is_incomplete' => true,
                    'expo_push_token' => $latestUserToken['expo_push_token'] ?? null,
                ],
            ]);
        }

        log_message('debug', 'User complete: ' . $user['tag_uid']);

        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'User found',
            'data' => [
                'exists' => true,
                'tag_uid' => $user['tag_uid'],
                'name' => $user['name'],
                'email' => $user['email'],
                'phone_number' => $user['phone_number'],
                'birthday' => $user['birthday'],
                'expo_push_token' => $latestUserToken['expo_push_token'] ?? null,
                'events_flag' => (int)($user['events_flag'] ?? 0),
                'franchising_flag' => (int)($user['franchising_flag'] ?? 0),
            ],
        ]);
    }

    public function getLoyaltyPoints()
    {
        $data = $this->request->getJSON();
        log_message('debug', 'Payload: ' . json_encode($data));

        $tagUid = $data->tag_uid ?? null;

        if (!$tagUid) {
            log_message('error', 'Tag UID missing');
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'message' => 'Tag UID is required',
            ]);
        }

        $loyaltyPoints = $this->btcLoyaltyModel->getLoyaltyPoints($tagUid);
        log_message('debug', 'Loyalty result: ' . json_encode($loyaltyPoints));

        if ($loyaltyPoints) {
            return $this->response->setJSON([
                'status' => 'success',
                'message' => 'Loyalty points fetched successfully',
                'data' => $loyaltyPoints,
            ]);
        }

        log_message('error', 'Loyalty not found');
        return $this->response->setStatusCode(404)->setJSON([
            'status' => 'error',
            'message' => 'Loyalty points not found',
        ]);
    }

    public function addFavoriteMenu()
    {
        $data = $this->request->getJSON();
        log_message('debug', 'Payload: ' . json_encode($data));

        $tagUid = $data->tag_uid ?? null;
        $m_id = $data->m_id ?? null;

        if (!$tagUid || !$m_id) {
            log_message('error', 'Missing tag_uid or m_id');
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'message' => 'Tag UID and Menu ID are required'
            ]);
        }

        if (!$this->userModel->find($tagUid)) {
            log_message('error', 'User not found: ' . $tagUid);
            return $this->response->setStatusCode(404)->setJSON([
                'status' => 'error',
                'message' => 'User not found'
            ]);
        }

        if (!$this->menuModel->find($m_id)) {
            log_message('error', 'Menu not found: ' . $m_id);
            return $this->response->setStatusCode(404)->setJSON([
                'status' => 'error',
                'message' => 'Menu item not found'
            ]);
        }

        $menu_code = $this->menuModel->getMenuCodeById($m_id);

        if ($this->userModel->addFavoriteMenuByTagUid($tagUid, $menu_code)) {
            log_message('debug', 'Menu added to favorites');
            return $this->response->setJSON([
                'status' => 'success',
                'message' => 'Menu added to favorites',
                'data' => []
            ]);
        }

        log_message('error', 'Failed to add favorite menu');
        return $this->response->setStatusCode(500)->setJSON([
            'status' => 'error',
            'message' => 'Failed to add menu'
        ]);
    }

    public function addFavoriteLocation()
    {
        $data = $this->request->getJSON();
        log_message('debug', 'Payload: ' . json_encode($data));

        $tagUid = $data->tag_uid ?? null;
        $branch_id = $data->branch_id ?? null;

        if (!$tagUid || !$branch_id) {
            log_message('error', 'Missing tag_uid or branch_id');
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'message' => 'Tag UID and Branch ID are required'
            ]);
        }

        if (!$this->userModel->find($tagUid)) {
            log_message('error', 'User not found: ' . $tagUid);
            return $this->response->setStatusCode(404)->setJSON([
                'status' => 'error',
                'message' => 'User not found'
            ]);
        }

        if (!$this->branchModel->find($branch_id)) {
            log_message('error', 'Branch not found: ' . $branch_id);
            return $this->response->setStatusCode(404)->setJSON([
                'status' => 'error',
                'message' => 'Branch not found'
            ]);
        }

        $branch_code = $this->branchModel->getBranchCodeById($branch_id);

        if ($this->userModel->addFavoriteLocationByTagUid($tagUid, $branch_code)) {
            log_message('debug', 'Branch added to favorites');
            return $this->response->setJSON([
                'status' => 'success',
                'message' => 'Branch added to favorites',
                'data' => []
            ]);
        }

        log_message('error', 'Failed to add favorite branch');
        return $this->response->setStatusCode(500)->setJSON([
            'status' => 'error',
            'message' => 'Failed to add branch'
        ]);
    }

    public function getFavoriteBranchByCode()
    {
        $data = $this->request->getJSON();
        $branch_code = $data->branch_code ?? null;

        log_message('debug', 'Payload of getFavoriteBranchByCode: ' . json_encode($data));

        if (!$branch_code || !is_string($branch_code)) {
            log_message('error', 'Missing branch_code');
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'message' => 'Branch code is required and must be a string'
            ]);
        }

        $branch = $this->branchModel->getBranchByCode($branch_code);

        if (!$branch) {
            log_message('error', 'Branch not found: ' . $branch_code);
            return $this->response->setStatusCode(404)->setJSON([
                'status' => 'error',
                'message' => 'Branch not found'
            ]);
        }

        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'Favorite branch fetched successfully',
            'data' => $branch,
        ]);
    }

    public function getFavoriteLocationByTagUid()
    {
        $data = $this->request->getJSON();
        $tag_uid = $data->tag_uid ?? null;

        if (!$tag_uid) {
            log_message('error', 'Missing tag_uid');
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'message' => 'Tag UID is required'
            ]);
        }

        $favoriteLocation = $this->userModel->getFavoriteLocationByTagUid($tag_uid);

        if (!$favoriteLocation) {
            log_message('error', 'Favorite location not found for tag_uid: ' . $tag_uid);
            return $this->response->setStatusCode(404)->setJSON([
                'status' => 'error',
                'message' => 'Favorite location not found'
            ]);
        }

        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'Favorite location fetched successfully',
            'data' => $favoriteLocation,
        ]);
    }

    public function getFavoriteMenuByCode()
    {
        $data = $this->request->getJSON();
        $menu_code = $data->menu_code ?? null;

        log_message('debug', 'Payload of getFavoriteMenuByCode: ' . json_encode($data));

        if (!$menu_code || !is_string($menu_code)) {
            log_message('error', 'Missing menu_code');
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'message' => 'Menu code is required and must be a string'
            ]);
        }

        $menu = $this->menuModel->getMenuByCode($menu_code);

        if (!$menu) {
            log_message('error', 'Menu not found: ' . $menu_code);
            return $this->response->setStatusCode(404)->setJSON([
                'status' => 'error',
                'message' => 'Menu not found'
            ]);
        }

        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'Favorite menu fetched successfully',
            'data' => $menu,
        ]);
    }

    public function getFavoriteMenuByTagUid()
    {
        $data = $this->request->getJSON();
        $tag_uid = $data->tag_uid ?? null;

        if (!$tag_uid) {
            log_message('error', 'Missing tag_uid');
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'message' => 'Tag UID is required'
            ]);
        }

        $favoriteMenu = $this->userModel->getFavoriteMenuByTagUid($tag_uid);

        if (!$favoriteMenu) {
            log_message('error', 'Favorite menu not found for tag_uid: ' . $tag_uid);
            return $this->response->setStatusCode(404)->setJSON([
                'status' => 'error',
                'message' => 'Favorite menu not found'
            ]);
        }

        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'Favorite menu code fetched successfully',
            'data' => $favoriteMenu,
        ]);
    }

    public function updateUser()
    {
        $data = $this->request->getJSON();
        log_message('debug', 'Update payload: ' . json_encode($data));

        $tag_uid = $data->tag_uid ?? null;

        if (!$tag_uid) {
            log_message('error', 'Tag UID missing');
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'message' => 'Tag UID is required'
            ]);
        }

        $expoPushToken = $data->expo_push_token ?? null;

        $updateData = (array) $data;
        unset($updateData['expo_push_token'], $updateData['tag_uid']);

        if ($expoPushToken) {
            $existingToken = $this->userTokensModel
                ->where('tag_uid', $tag_uid)
                ->where('expo_push_token', $expoPushToken)
                ->first();

            if (!$existingToken) {
                $this->userTokensModel->insert([
                    'tag_uid' => $tag_uid,
                    'expo_push_token' => $expoPushToken,
                ]);
                log_message('debug', 'New expo token saved');
            }
        }

        $user = $this->userModel->find($tag_uid);

        if (!$user) {
            log_message('error', 'User not found: ' . $tag_uid);
            return $this->response->setStatusCode(404)->setJSON([
                'status' => 'error',
                'message' => 'User not found'
            ]);
        }

        if (empty($updateData)) {
            log_message('debug', 'Only token updated');
            return $this->response->setJSON([
                'status' => 'success',
                'message' => 'User token updated',
                'data' => [],
            ]);
        }

        if ($this->userModel->update($tag_uid, $updateData)) {
            log_message('debug', 'User updated successfully');
            return $this->response->setJSON([
                'status' => 'success',
                'message' => 'User updated',
                'data' => [],
            ]);
        }

        log_message('error', 'Failed to update user');
        return $this->response->setStatusCode(500)->setJSON([
            'status' => 'error',
            'message' => 'Failed to update user'
        ]);
    }

    public function getNotificationRecipientsByTagUid()
    {
        $data = $this->request->getJSON();
        log_message('debug', 'Payload: ' . json_encode($data));

        $tagUid = $data->tag_uid ?? null;

        if (!$tagUid) {
            log_message('error', 'Tag UID missing');
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'message' => 'Tag UID is required',
            ]);
        }

        $rows = $this->notificationRecipientModel->getUserNotifications($tagUid);
        $unreadCount = $this->notificationRecipientModel->countUnreadByTagUid($tagUid);

        $notifications = array_map(static function (array $row): array {
            return [
                'notification_id' => (int) ($row['notification_id'] ?? 0),
                'notification_recipient_id' => (int) ($row['notification_recipient_id'] ?? 0),
                'title' => $row['title'] ?? null,
                'body' => $row['body'] ?? null,
                'type' => $row['type'] ?? 'general',
                'is_read' => (bool) ($row['is_read'] ?? false),
                'read_at' => $row['read_at'] ?? null,
                'delivery_status' => $row['delivery_status'] ?? 'sent',
                'data_payload' => !empty($row['data_payload']) ? json_decode($row['data_payload'], true) : null,
                'created_at' => $row['created_at'] ?? null,
            ];
        }, $rows);

        $payload = [
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
            'meta' => [
                'limit' => count($notifications),
                'offset' => 0,
                'count' => count($notifications),
            ],
        ];

        log_message('debug', 'Notifications payload for tag_uid ' . $tagUid . ': ' . json_encode($payload));

        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'Notifications fetched successfully',
            'data' => $payload,
        ]);
    }

    public function markNotificationAsRead()
    {
        $data = $this->request->getJSON();
        log_message('debug', 'Mark as read payload: ' . json_encode($data));

        $tagUid = $data->tag_uid ?? null;
        $notificationIds = $data->notification_ids ?? null;

        if (!$tagUid || !is_array($notificationIds)) {
            log_message('error', 'Missing tag_uid or notification_ids');
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'message' => 'Tag UID and notification IDs are required',
            ]);
        }

        $updatedCount = $this->notificationRecipientModel->markAsRead($tagUid, $notificationIds);

        log_message('debug', 'Marked as read count: ' . $updatedCount);

        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'Notifications marked as read',
            'data' => [
                'updated_count' => $updatedCount,
                'unread_count' => $this->notificationRecipientModel->countUnreadByTagUid($tagUid),
            ],
        ]);
    }

    public function markAllNotificationsAsRead()
    {
        $data = $this->request->getJSON();
        log_message('debug', 'Mark all as read payload: ' . json_encode($data));

        $tagUid = $data->tag_uid ?? null;

        if (!$tagUid) {
            log_message('error', 'Tag UID missing');
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'message' => 'Tag UID is required',
            ]);
        }

        $recipientRows = $this->notificationRecipientModel->getRecipientIdsByTagUid($tagUid);
        $notificationIds = array_map(static fn(array $row): int => (int) ($row['notification_id'] ?? 0), $recipientRows);

        if (empty($notificationIds)) {
            log_message('debug', 'No notifications to mark as read for tag_uid: ' . $tagUid);
            return $this->response->setJSON([
                'status' => 'success',
                'message' => 'No notifications to mark as read',
                'data' => [
                    'updated_count' => 0,
                    'unread_count' => 0,
                ],
            ]);
        }

        $updatedCount = $this->notificationRecipientModel->markAsRead($tagUid, $notificationIds);

        log_message('debug', 'Marked all as read count: ' . $updatedCount);

        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'All notifications marked as read',
            'data' => [
                'updated_count' => $updatedCount,
                'unread_count' => $this->notificationRecipientModel->countUnreadByTagUid($tagUid),
            ],
        ]);
    }
}