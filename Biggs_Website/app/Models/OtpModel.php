<?php

namespace App\Models;

use CodeIgniter\Model;

class OtpModel extends Model
{
    protected $table      = 'otp';
    protected $primaryKey = 'otp_id';

    protected $returnType     = 'array';

    protected $allowedFields = [
        'tag_uid',
        'phone_number',
        'otp_code',
        'expires_at',
        'is_verified',
    ];
}
