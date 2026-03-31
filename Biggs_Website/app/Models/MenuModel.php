<?php

namespace App\Models;

use CodeIgniter\Model;

class MenuModel extends Model
{
    protected $table      = 'menu';
    protected $primaryKey = 'm_id';

    protected $returnType     = 'array';

    protected $allowedFields = [
        'm_code',
        'm_title',
        'm_desc',
        'm_price',
        'm_creator',
        'date_create',
        'filename',
        'position',
        'type',
    ];

    public function getMenuItemsByType($type)
    {
        return $this->where('type', $type)->findAll();
    }

    public function getMenuItemById($id)
    {
        return $this->where('m_id', $id)->first();
    }

    public function getAllMenuItems()
    {
        return $this->findAll();
    }

    public function getMenuCodeById($m_id)
    {
        $menuItem = $this->where('m_id', $m_id)->first();
        return $menuItem ? $menuItem['m_code'] : null;
    }

    public function getMenuCategories()
    {
        return $this->distinct()->select('position')->findAll();
    }
}
