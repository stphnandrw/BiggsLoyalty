<?php

namespace App\Models;

use CodeIgniter\Model;

class VoucherModel extends Model
{
    protected $table      = 'vouchers';
    protected $primaryKey = 'voucher_id';

    protected $returnType     = 'array';

    protected $allowedFields = [
        'voucher_name',
        'description',
        'required_points',
        'start_date',
        'end_date',
        'image_url',
        'created_at',
    ];

    public function getVouchersExcludingClaimed($tagUid)
    {
        return $this->db->table('vouchers v')
            ->select('v.*')
            ->join(
                'claimed_vouchers c',
                'c.voucher_id = v.voucher_id AND c.tag_uid = ' . $this->db->escape($tagUid),
                'left'
            )
            ->where('c.claimed_voucher_id IS NULL')
            ->get()
            ->getResult();
    }
}
