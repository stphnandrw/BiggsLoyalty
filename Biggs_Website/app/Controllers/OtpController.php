<?php

namespace App\Controllers;

class OtpController extends BaseController
{
    public function generateOTP()
    {
        $data = $this->request->getJSON();

        if (!$data) {
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'message' => 'Invalid JSON'
            ]);
        }

        $tagUid = $data->tag_uid ?? null;
        $phonenumber = $data->phone_number;
        $force = $data->force ?? false; // 👈 new flag

        if (!$phonenumber) {
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'message' => 'Phone number is required'
            ]);
        }

        $existingOtp = $this->checkNumberForOtp($phonenumber);

        // Block only if NOT forcing
        if ($existingOtp && !$force) {
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'message' => 'An OTP has already been sent. Please wait up to 5 minutes or request a new one.'
            ]);
        }

        // Optional: invalidate old OTP if forcing
        if ($existingOtp && $force) {
            $this->otpModel->update($existingOtp['otp_id'], [
                'expires_at' => date('Y-m-d H:i:s') // expire immediately
            ]);
        }

        $otp = rand(100000, 999999);
        $hashedOtp = password_hash($otp, PASSWORD_DEFAULT);

        $addOtp = $this->otpModel->insert([
            'tag_uid' => $tagUid,
            'phone_number' => $phonenumber,
            'otp_code' => $hashedOtp,
            'expires_at' => date('Y-m-d H:i:s', strtotime('+5 minutes')),
            'is_verified' => false,
        ]);

        if (!$addOtp) {
            return $this->response->setStatusCode(500)->setJSON([
                'status' => 'error',
                'message' => 'Failed to generate OTP'
            ]);
        }

        return $this->response->setJSON([
            'status' => 'success',
            'message' => $force ? 'OTP regenerated' : 'OTP generated',
            'data' => []
        ]);
    }

    public function verifyOTP()
    {
        $data = $this->request->getJSON();

        if (!$data) {
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'message' => 'Invalid JSON'
            ]);
        }

        $phonenumber = $data->phone_number;
        $otp = $data->otp_code;

        if (!$phonenumber || !$otp) {
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'message' => 'Phone number and OTP are required'
            ]);
        }

        $latestOtp = $this->checkNumberForOtp($phonenumber);

        if (!$latestOtp) {
            return $this->response->setStatusCode(404)->setJSON([
                'status' => 'error',
                'message' => 'OTP not found'
            ]);
        }

        $time = date('Y-m-d H:i:s');

        if (strtotime($latestOtp['expires_at']) < strtotime($time)) {
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'message' => 'OTP has expired',
                'data' => [
                    'current_time' => $time,
                    'expires_at' => $latestOtp['expires_at'],
                ],
            ]);
        }

        if (password_verify($otp, $latestOtp['otp_code'])) {
            $this->otpModel->update($latestOtp['otp_id'], ['is_verified' => true]);
            return $this->response->setJSON([
                'status' => 'success',
                'message' => 'OTP verified successfully',
                'data' => [
                    'time_check' => $time,
                ],
            ]);
        } else {
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'message' => 'Invalid OTP'
            ]);
        }
    }

    private function checkNumberForOtp($phone_number)
    {
        $latestOtp = $this->otpModel
            ->where('phone_number', $phone_number)
            ->where('is_verified', false)
            ->orderBy('otp_id', 'DESC')
            ->first();

        if (!$latestOtp) {
            return null; // No OTP found for this phone number
        }

        $time = date('Y-m-d H:i:s');

        if (strtotime($latestOtp['expires_at']) < strtotime($time)) {
            return null; // OTP has expired
        }

        return $latestOtp; // Return the latest valid OTP for this phone number
    }
}
