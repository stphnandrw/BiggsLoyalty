<?php

namespace App\Controllers;

class VoucherController extends BaseController
{
    public function getAllVouchers()
    {
        $vouchers = $this->voucherModel->findAll();

        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'Vouchers fetched successfully',
            'data' => $vouchers,
        ]);
    }

    public function getClaimedVouchersByTagUId()
    {
        $data = $this->request->getJSON();

        $tagUid = $data->tag_uid ?? null;

        if (!$tagUid) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'Tag UID is required',
            ])->setStatusCode(400);
        }

        $vouchers = $this->voucherModel->getClaimedVouchersByTagUId($tagUid);

        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'Claimed vouchers fetched successfully',
            'data' => $vouchers,
        ]);
    }

    public function getVouchersExcludingClaimed()
    {
        $data = $this->request->getJSON();

        $tagUid = $data->tag_uid ?? null;

        if (!$tagUid) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'Tag UID is required',
            ])->setStatusCode(400);
        }

        $vouchers = $this->voucherModel->getVouchersExcludingClaimed($tagUid);

        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'Available vouchers fetched successfully',
            'data' => $vouchers,
        ]);
    }

    public function getRedeemedVouchers()
    {
        $data = $this->request->getJSON();

        $tagUid = $data->tag_uid ?? null;

        if (!$tagUid) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'Tag UID is required',
            ])->setStatusCode(400);
        }

        $vouchers = $this->voucherModel->getRedeemedVouchersByTagUId($tagUid);

        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'Redeemed vouchers fetched successfully',
            'data' => $vouchers,
        ]);
    }

    public function claimVoucher()
    {
        $data = $this->request->getJSON();

        $tagUid = $data->tag_uid ?? null;
        $voucherId = $data->voucher_id ?? null;

        if (!$tagUid || !$voucherId) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'Tag UID and Voucher ID are required',
            ])->setStatusCode(400);
        }

        $claimedVoucherId = $this->claimedVoucherModel->claimVoucher($tagUid, $voucherId);

        if (!$claimedVoucherId) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'Failed to claim voucher. It may have already been claimed.',
            ])->setStatusCode(400);
        }

        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'Voucher claimed successfully',
            'data' => ['claimed_voucher_id' => $claimedVoucherId],
        ]);
    }

    public function startRedeemVoucher()
    {
        $data = $this->request->getJSON();

        $tagUid = $data->tag_uid ?? null;
        $claimedVoucherId = $data->claimed_voucher_id ?? null;

        if (!$tagUid || !$claimedVoucherId) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'Tag UID and Claimed Voucher ID are required',
            ])->setStatusCode(400);
        }

        $success = $this->claimedVoucherModel->setVoucherAsPending($claimedVoucherId);

        if (!$success) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'Failed to redeem voucher. It may have already been redeemed.',
            ])->setStatusCode(400);
        }

        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'Merchant notified for voucher redemption. Please wait for confirmation.',
        ]);
    }

    
    public function checkOnProcessVoucher()
    {
        $data = $this->request->getJSON();

        $tagUid = $data->tag_uid ?? null;

        if (!$tagUid) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'Tag UID is required',
            ])->setStatusCode(400);
        }

        $voucher = $this->claimedVoucherModel->getOnProcessVoucherByTagUId($tagUid);

        if (!$voucher) {
            return $this->response->setJSON([
                'status' => 'success',
                'message' => 'No voucher currently being processed',
                'data' => null,
            ]);
        }

        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'Voucher currently being processed fetched successfully',
            'data' => $voucher,
        ]);
    }

    public function endRedeemVoucher()
    {
        $data = $this->request->getJSON();

        $tagUid = $data->tag_uid ?? null;
        $claimedVoucherId = $data->claimed_voucher_id ?? null;

        if (!$claimedVoucherId || !$tagUid) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'Claimed Voucher ID and Tag UID are required',
            ])->setStatusCode(400);
        }

        $userPoints = $this->btcLoyaltyModel->getLoyaltyPoints($tagUid);
        $currentPoints = (int) ($userPoints['points'] ?? 0);

        $checkPoints = $this->claimedVoucherModel->checkPoints($claimedVoucherId, $currentPoints);

        if(!$checkPoints) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'Insufficient loyalty points to redeem this voucher',
            ])->setStatusCode(400);
        }

        $deductPoints = $this->btcLoyaltyModel->deductPoints($tagUid, $checkPoints);

        if(!$deductPoints) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'Failed to deduct loyalty points. Please try again.',
            ])->setStatusCode(500);
        }

        $success = $this->claimedVoucherModel->redeemVoucher($claimedVoucherId);

        if (!$success) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'Failed to redeem voucher. It may have already been redeemed.',
            ])->setStatusCode(400);
        }
        
        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'Voucher redeemed successfully',
        ]);
    }

    public function cancelVoucherRedemption()
    {
        $data = $this->request->getJSON();

        $tagUid = $data->tag_uid ?? null;
        $claimedVoucherId = $data->claimed_voucher_id ?? null;

        if (!$claimedVoucherId || !$tagUid) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'Claimed Voucher ID and Tag UID are required',
            ])->setStatusCode(400);
        }

        $success = $this->claimedVoucherModel->cancelRedemption($claimedVoucherId);

        if (!$success) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'Failed to cancel voucher redemption. Please try again.',
            ])->setStatusCode(500);
        }
        
        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'Voucher redemption cancelled successfully',
        ]);
    }

    public function checkSelectedVoucher()
    {
        $data = $this->request->getJSON();

        $tagUid = $data->tag_uid ?? null;
        $claimedVoucherId = $data->claimed_voucher_id ?? null;

        if (!$claimedVoucherId || !$tagUid) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'Claimed Voucher ID and Tag UID are required',
            ])->setStatusCode(400);
        }

        $voucher = $this->claimedVoucherModel->checkSelectedVoucher($claimedVoucherId);

        if (!$voucher) {
            return $this->response->setJSON([
                'status' => 'error',
                'message' => 'Voucher not found',
            ])->setStatusCode(404);
        }

        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'Voucher status fetched successfully',
            'data' => $voucher,
        ]);
    }
}
