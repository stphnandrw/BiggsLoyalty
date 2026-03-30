<?php

namespace App\Controllers;

class UserController extends BaseController
{
    public function index(): string
    {
        return view('welcome_message');
    }

    public function getUsers()
    {
        $users = $this->userModel->findAll();

        return $this->response->setJSON($users);
    }

    public function getUserByTagUID(){
        $data = $this->request->getJSON();

        $tagUid = $data->tag_uid;

        if ($tagUid) {
            $user = $this->userModel->where('tag_uid', $tagUid)->first();
        } else {
            return $this->response->setStatusCode(400)->setJSON(['message' => 'Tag UID is required']);
        }

        if ($user) {
            return $this->response->setJSON([
                'status' => true,
                'message' => 'User found',
                'phone_number' => $user['phone_number'] ?? null,
            ]);
        } else {
            return $this->response->setStatusCode(404)->setJSON(['message' => 'User not found']);
        }

    }

    public function getUserByTagUidAndPhone()
    {
        $data = $this->request->getJSON();

        $tagUid = $data->tag_uid;
        $phoneNumber = $data->phone_number;

        if ($tagUid && $phoneNumber) {
            $user = $this->userModel
                ->where('tag_uid', $tagUid)
                ->where('phone_number', $phoneNumber)
                ->first();
        } else {
            return $this->response->setStatusCode(400)->setJSON(['message' => 'Tag UID and phone number are required']);
        }

        if ($user) {
            return $this->response->setJSON($user);
        } else {
            return $this->response->setStatusCode(404)->setJSON(['message' => 'User not found']);
        }
    }

    public function getUserByPhoneNumber()
    {
        $data = $this->request->getJSON();

        $phone_number = $data->phone_number;

        $user = $this->userModel->where('phone_number', $phone_number)->first();

        if ($user) {
            return $this->response->setJSON($user);
        } else {
            return $this->response->setStatusCode(404)->setJSON(['message' => 'User not found']);
        }
    }

    public function checkPhoneIfExist()
    {
        $data = $this->request->getJSON();

        $phone_number = $data->phone_number ?? null;
        
        if (empty($phone_number)) {
            return $this->response
                ->setStatusCode(400)
                ->setJSON([
                    'exists' => false,
                    'message' => 'Phone number is required'
                ]);
        }
        if (!empty($phone_number)) {
            $user = $this->userModel->where('phone_number', $phone_number)->first();
        }

        $latestUserToken = null;

        if (!$user) {
            return $this->response->setJSON([
                'exists' => false
            ]);
        }

        $latestUserToken = $this->userTokensModel
            ->where('tag_uid', $user['tag_uid'])
            ->orderBy('token_id', 'DESC')
            ->first();

        // validation for users with incomplete data (e.g. only email or phone number)
        if ($user['name'] === null || $user['birthday'] === null) {
            return $this->response->setJSON([
                'exists' => true,
                'tag_uid' => $user['tag_uid'] ?? null,
                'is_incomplete' => true,
                'expo_push_token' => $latestUserToken['expo_push_token'] ?? null,
            ]);
        }

        return $this->response->setJSON([
            'exists' => true,
            'tag_uid' => $user['tag_uid'] ?? null,
            'name' => $user['name'] ?? null,
            'email' => $user['email'] ?? null,
            'phone_number' => $user['phone_number'] ?? null,
            'birthday' => $user['birthday'] ?? null,
            'expo_push_token' => $latestUserToken['expo_push_token'] ?? null,
            'events_flag' => (int)($user['events_flag'] ?? null),
            'franchising_flag' => (int)($user['franchising_flag'] ?? null),
        ]);
    }

    public function createUser()
    {
        $data = $this->request->getJSON();

        if (!$data) {
            return $this->response->setStatusCode(400)->setJSON(['message' => 'Invalid JSON']);
        }

        $insertData = (array) $data;
        $expoPushToken = $insertData['expo_push_token'] ?? null;
        unset($insertData['expo_push_token']);

        $userId = $this->userModel->insert($insertData);

        if ($userId) {
            if (!empty($expoPushToken)) {
                $existingToken = $this->userTokensModel
                    ->where('user_id', $userId)
                    ->where('expo_push_token', $expoPushToken)
                    ->first();

                if (!$existingToken) {
                    $this->userTokensModel->insert([
                        'user_id' => $userId,
                        'expo_push_token' => $expoPushToken,
                    ]);
                }
            }

            return $this->response->setStatusCode(201)->setJSON(['message' => 'User created', 'user_id' => $userId]);
        } else {
            return $this->response->setStatusCode(500)->setJSON(['message' => 'Failed to create user']);
        }
    }

    public function updateUser()
    {
        $data = $this->request->getJSON();

        log_message('debug', 'Received data for update: ' . json_encode($data));

        $tag_uid = $data->tag_uid ?? null;

        if (!$tag_uid) {
            return $this->response->setStatusCode(400)->setJSON(['message' => 'Tag UID is required']);
        }

        $expoPushToken = $data->expo_push_token;

        $updateData = (array) $data;

        unset($updateData['expo_push_token']);
        unset($updateData['tag_uid']);

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
            }
        }

        $user = $this->userModel->find($tag_uid);
        if (!$user) {
            return $this->response->setStatusCode(404)->setJSON(['message' => 'User not found']);
        }

        // Token-only updates are valid. Skip users-table update when no user fields remain.
        if (empty($updateData)) {
            $updatedUser = $this->userModel->find($tag_uid);
            return $this->response->setJSON(['message' => 'User token updated', 'user' => $updatedUser]);
        }

        if ($this->userModel->update($tag_uid, $updateData)) {
            $updatedUser = $this->userModel->find($tag_uid);
            return $this->response->setJSON(['message' => 'User updated', 'user' => $updatedUser]);
        } else {
            return $this->response->setStatusCode(500)->setJSON(['message' => 'Failed to update user']);
        }
    }
}
