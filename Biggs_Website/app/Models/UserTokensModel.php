<?php

namespace App\Models;

use CodeIgniter\Model;

class UserTokensModel extends Model
{
    protected $table      = 'user_tokens';
    protected $primaryKey = 'token_id';

    protected $returnType     = 'array';

    protected $allowedFields = [
        'tag_uid',
        'expo_push_token',
    ];
}
