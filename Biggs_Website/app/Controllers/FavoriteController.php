<?php

namespace App\Controllers;

class FavoriteController extends BaseController
{
    public function getAllClaimedVouchersByTagUid()
    {
        $data = $this->request->getJSON();

        $tagUid = $data->tag_uid;

        $claimedVouchers = $this->favoriteModel->getClaimedVouchersByTagUid($tagUid);

        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'Claimed vouchers fetched successfully',
            'data' => $claimedVouchers,
        ]);
    }

    public function claimVoucher()
    {
        $data = $this->request->getJSON();
        $tagUid = $data->tag_uid ?? null;
        $voucherId = $data->voucher_id ?? null;

        if (!$tagUid || !$voucherId) {
            return $this->response
                ->setStatusCode(400)
                ->setJSON([
                    'status' => 'error',
                    'message' => 'Missing tag_uid or voucher_id',
                ]);
        }

        $result = $this->favoriteModel->claimVoucher($tagUid, $voucherId);

        if ($result) {
            return $this->response->setJSON([
                'status' => 'success',
                'message' => 'Voucher claimed successfully',
                'data' => [],
            ]);
        }

        return $this->response
            ->setStatusCode(500)
            ->setJSON([
                'status' => 'error',
                'message' => 'Failed to claim voucher',
            ]);
    }

    public function redeemVoucher()
    {
        $data = $this->request->getJSON();
        $tagUid = $data->tag_uid ?? null;
        $claimedVoucherId = $data->claimed_voucher_id ?? null;

        if (!$tagUid || !$claimedVoucherId) {
            return $this->response
                ->setStatusCode(400)
                ->setJSON([
                    'status' => 'error',
                    'message' => 'Missing tag_uid or claimed_voucher_id',
                ]);
        }

        $claimedVoucher = $this->favoriteModel->getClaimedVoucherForRedeem($claimedVoucherId);

        if (!$claimedVoucher) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON([
                    'status' => 'error',
                    'message' => 'Claimed voucher not found',
                ]);
        }

        if (($claimedVoucher['tag_uid'] ?? null) !== $tagUid) {
            return $this->response
                ->setStatusCode(403)
                ->setJSON([
                    'status' => 'error',
                    'message' => 'Tag UID does not match claimed voucher owner',
                ]);
        }

        if (!empty($claimedVoucher['claimed_at'])) {
            return $this->response
                ->setStatusCode(409)
                ->setJSON([
                    'status' => 'error',
                    'message' => 'Voucher already redeemed',
                ]);
        }

        $requiredPoints = (int) ($claimedVoucher['required_points'] ?? 0);
        $loyalty = $this->btcLoyaltyModel->where('tag_uid', $tagUid)->first();

        if (!$loyalty) {
            return $this->response
                ->setStatusCode(404)
                ->setJSON([
                    'status' => 'error',
                    'message' => 'Loyalty account not found',
                ]);
        }

        $currentPoints = (int) ($loyalty['points'] ?? 0);

        if ($currentPoints < $requiredPoints) {
            return $this->response
                ->setStatusCode(400)
                ->setJSON([
                    'status' => 'error',
                    'message' => 'Not enough points to redeem this voucher',
                    'data' => [
                        'required_points' => $requiredPoints,
                        'current_points' => $currentPoints,
                    ],
                ]);
        }

        $db = \Config\Database::connect();
        $db->transStart();

        $db->table('btc_loyalty')
            ->where('tag_uid', $tagUid)
            ->where('points >=', $requiredPoints)
            ->set('points', 'points - ' . $requiredPoints, false)
            ->update();

        if ($db->affectedRows() < 1) {
            $db->transRollback();
            return $this->response
                ->setStatusCode(400)
                ->setJSON([
                    'status' => 'error',
                    'message' => 'Not enough points to redeem this voucher',
                ]);
        }

        $result = $this->favoriteModel->markVoucherRedeemed($claimedVoucherId);

        if (!$result) {
            $db->transRollback();
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'status' => 'error',
                    'message' => 'Failed to redeem voucher',
                ]);
        }

        $db->transComplete();

        if (!$db->transStatus()) {
            return $this->response
                ->setStatusCode(500)
                ->setJSON([
                    'status' => 'error',
                    'message' => 'Failed to redeem voucher',
                ]);
        }

        $updatedLoyalty = $this->btcLoyaltyModel->getLoyaltyPoints($tagUid);
        $remainingPoints = (int) ($updatedLoyalty['points'] ?? 0);

        if ($result) {
            return $this->response->setJSON([
                'status' => 'success',
                'message' => 'Voucher redeemed successfully',
                'data' => [
                    'required_points' => $requiredPoints,
                    'remaining_points' => $remainingPoints,
                ],
            ]);
        }

        return $this->response
            ->setStatusCode(500)
            ->setJSON([
                'status' => 'error',
                'message' => 'Failed to redeem voucher',
            ]);
    }
}
