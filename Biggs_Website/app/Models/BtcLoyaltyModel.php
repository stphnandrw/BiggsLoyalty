<?php

namespace App\Models;

use CodeIgniter\Model;

class BtcLoyaltyModel extends Model
{
    protected $table      = 'btc_loyalty';
    protected $primaryKey = 'loyalty_id';

    protected $returnType     = 'array';

    protected $allowedFields = [
        'tag_uid',
        'phone_number',
        'activated_flag',
        'register_flag',
        'points',
        'visits',
        'tag_timestamp',
        'server_timestamp',
    ];

    public function getLoyaltyPoints($tag_uid)
    {
        return $this->select('points')->where('tag_uid', $tag_uid)->first();
    }

    public function deductPoints($tag_uid, $pointsToDeduct){

        $pointsToDeduct = (int) $pointsToDeduct;

        if ($pointsToDeduct <= 0) {
            return false;
        }

        return $this->where('tag_uid', $tag_uid)
            ->where('points >=', $pointsToDeduct)
            ->set('points', 'points - ' . $pointsToDeduct, false)
            ->update();
    }
    
}