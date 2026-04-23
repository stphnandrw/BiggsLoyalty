<?php

namespace App\Models;

use CodeIgniter\Model;

class ClaimedVoucherModel extends Model
{
    protected $table      = 'claimed_vouchers';
    protected $primaryKey = 'claimed_voucher_id';

    protected $returnType     = 'array';

    protected $allowedFields = [
        'tag_uid',
        'voucher_id',
        'status',
        'redeemed_at',
    ];

    public function claimVoucher($tagUid, $voucherId)
    {
        $data = [
            'tag_uid' => $tagUid,
            'voucher_id' => $voucherId,
            'redeemed_at' => null,
        ];

        return $this->insert($data);
    }

    public function redeemVoucher($claimedVoucherId)
    {
        $data = [
            'status' => 'redeemed',
            'redeemed_at' => date('Y-m-d H:i:s'),
        ];

        return $this->update($claimedVoucherId, $data);
    }

    public function setVoucherAsPending($claimedVoucherId)
    {
        $data = [
            'status' => 'pending',
        ];

        return $this->update($claimedVoucherId, $data);
    }

    public function getOnProcessVoucherByTagUId($tagUid)
    {
        return $this->where('tag_uid', $tagUid)
                    ->where('status', 'pending')
                    ->first();
    }

    public function checkPoints($claimedVoucherId, $userPoints)
    {
        $voucherPoints = $this->getVoucherPoints($claimedVoucherId);

        return $userPoints >= $voucherPoints ? $voucherPoints : false;
    }

    private function getVoucherPoints($claimedVoucherId)
    {   
        $voucher = $this->select('vouchers.required_points')
                        ->join('vouchers', 'claimed_vouchers.voucher_id = vouchers.voucher_id')
                        ->where('claimed_voucher_id', $claimedVoucherId)
                        ->first();

        return $voucher ? $voucher['required_points'] : 0;
    }

    public function cancelRedemption($claimedVoucherId)
    {
        $data = [
            'status' => 'active',
        ];

        return $this->update($claimedVoucherId, $data);
    }

    public function checkSelectedVoucher($claimedVoucherId)
    {
        return $this->where('claimed_voucher_id', $claimedVoucherId)
                    ->first();
    }
}
