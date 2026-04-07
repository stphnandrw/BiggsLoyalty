<?php

namespace App\Models;

use CodeIgniter\Model;

class PackageModel extends Model
{
    protected $table      = 'packages';
    protected $primaryKey = 'package_id';

    protected $returnType     = 'array';

    protected $allowedFields = [
        'package_name',
        'details',
        'price',
    ];

    public function tableExists($tableName)
    {
        return $this->db->tableExists($tableName);
    }

    public function getAllPackages()
    {
        return $this->orderBy('package_id', 'ASC')->findAll();
    }
}
