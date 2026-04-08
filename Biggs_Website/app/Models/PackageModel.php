<?php

namespace App\Models;

use CodeIgniter\Model;

class PackageModel extends Model
{
    protected $table      = 'packages';
    protected $primaryKey = 'package_id';

    protected $returnType     = 'array';

    protected $allowedFields = [
        'branch_id',
        'package_name',
        'details',
        'pax_size',
        'price',
    ];

    public function getAllPackages()
    {
        return $this->orderBy('package_id', 'ASC')->findAll();
    }

    public function getPackageById($id)
    {
        return $this->where('package_id', $id)->first();
    }

    public function getPackagesByBranchId($branchId)
    {
        return $this->where('branch_id', $branchId)->orderBy('package_id', 'ASC')->findAll();
    }
}
