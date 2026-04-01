<?php

namespace App\Models;

use CodeIgniter\Model;

class BranchModel extends Model
{
    protected $table      = 'biggs_branches';
    protected $primaryKey = 'id';

    protected $returnType     = 'array';

    protected $allowedFields = [
        'title',
        'code',
        'description',
        'images',
        'created_at',
        'updated_at',
        'contact',
        'latitude',
        'longitude',
        'has_venue_hall'
    ];

    public function getAllBranches()
    {
        return $this->findAll();
    }

    public function getBranchCodeById($id)
    {
        $branch = $this->where('id', $id)->first();
        return $branch ? $branch['code'] : null;
    }

    public function getBranchByCode($code)
    {
        return $this->where('code', $code)->first();
    }
}
