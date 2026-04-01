<?php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table      = 'btc_profile';
    protected $primaryKey = 'tag_uid';

    protected $returnType     = 'array';

    protected $allowedFields = [
        'tag_uid',
        'phone_number',
        'email',
        'name',
        'birthday',
        'password',
        'fave_location',
        'fave_item',
        'events_flag',
        'franchising_flag',
    ];

    public function addFavoriteMenuByTagUid($tag_uid, $m_code)
    {
        return $this->update($tag_uid, ['fave_item' => $m_code]);
    }

    public function addFavoriteLocationByTagUid($tag_uid, $branch_code)
    {
        return $this->update($tag_uid, ['fave_location' => $branch_code]);
    }

    public function getFavoriteLocationByTagUid($tag_uid)
    {
        return $this->select('fave_location')->where('tag_uid', $tag_uid)->first();
    }

    public function getFavoriteMenuByTagUid($tag_uid)
    {
        return $this->select('fave_item')->where('tag_uid', $tag_uid)->first();
    }
}
