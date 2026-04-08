<?php

namespace App\Models;

use CodeIgniter\Model;

class FavoriteModel extends Model
{
    protected $table      = 'claimed_vouchers';
    protected $primaryKey = 'claimed_voucher_id';

    protected $returnType     = 'array';

    protected $allowedFields = [
        'tag_uid',
        'voucher_id',
        'claimed_at',
    ];

    public function getClaimedVouchersByTagUid($tagUid)
    {
        return $this->select('v.voucher_id, v.voucher_name, v.description, v.required_points, v.image_url, v.start_date, v.end_date, v.created_at, claimed_vouchers.claimed_voucher_id, claimed_vouchers.tag_uid, claimed_vouchers.claimed_at')
            ->join('vouchers v', 'v.voucher_id = claimed_vouchers.voucher_id')
            ->where('claimed_vouchers.tag_uid', $tagUid)
            ->findAll();
    }

    public function claimVoucher($tagUid, $voucherId)
    {
        // Prevent duplicate claims to keep claimed_count accurate.
        $exists = $this->where('tag_uid', $tagUid)
            ->where('voucher_id', $voucherId)
            ->first();

        if ($exists) {
            return true;
        }

        $this->db->transStart();

        $inserted = $this->insert([
            'tag_uid' => $tagUid,
            'voucher_id' => $voucherId,
            'claimed_at' => null,
        ]);

        if (!$inserted) {
            $this->db->transRollback();
            return false;
        }

        $this->db->table('vouchers')
            ->set('claimed_count', 'claimed_count + 1', false)
            ->where('voucher_id', $voucherId)
            ->update();

        $this->db->transComplete();
        return $this->db->transStatus();
    }

    public function redeemVoucher($tagUid, $claimedVoucherId)
    {
        return $this->where('tag_uid', $tagUid)
            ->where('claimed_voucher_id', $claimedVoucherId)
            ->set('claimed_at', date('Y-m-d H:i:s'))
            ->update();
    }

    public function getClaimedVoucherForRedeem($claimedVoucherId)
    {
        return $this->select('claimed_vouchers.claimed_voucher_id, claimed_vouchers.tag_uid, claimed_vouchers.claimed_at, v.required_points, v.voucher_name')
            ->join('vouchers v', 'v.voucher_id = claimed_vouchers.voucher_id')
            ->where('claimed_vouchers.claimed_voucher_id', $claimedVoucherId)
            ->first();
    }

    public function markVoucherRedeemed($claimedVoucherId)
    {
        return $this->where('claimed_voucher_id', $claimedVoucherId)
            ->set('claimed_at', date('Y-m-d H:i:s'))
            ->update();
    }
}
