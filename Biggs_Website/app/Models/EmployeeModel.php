<?php

namespace App\Models;

use CodeIgniter\Model;

class EmployeeModel extends Model
{
    protected $table = 'employees';
    protected $primaryKey = 'employee_id';
    protected $returnType = 'array';
    protected $allowedFields = [
        'username',
        'password',
        'employee_type',
        'assigned_at',
        'is_active',
        'created_at',
        'updated_at',
    ];

    public function hashPassword($password)
    {
        return password_hash($password, PASSWORD_BCRYPT);
    }

    public function verifyPassword($password, $hash)
    {
        return password_verify($password, $hash);
    }

    public function findByUsername(string $username): ?array
    {
        $employee = $this->select('employees.*, biggs_branches.*')
            ->join('biggs_branches', 'biggs_branches.id = employees.assigned_at', 'left')
            ->where('username', $username)
            ->first();
        return $employee ?: null;
    }

    public function findActiveByApiKey(string $apiKey): ?array
    {
        $employee = $this->where('api_key', $apiKey)
            ->where('is_active', 1)
            ->first();

        return $employee ?: null;
    }

    public function findDefaultActive(?string $username = null): ?array
    {
        $builder = $this->where('is_active', 1);

        if ($username !== null && $username !== '') {
            $builder->where('username', $username);
        }

        $employee = $builder->orderBy('employee_id', 'ASC')->first();

        return $employee ?: null;
    }
}
