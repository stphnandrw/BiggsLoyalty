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
}
