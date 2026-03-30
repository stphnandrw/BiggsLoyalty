<?php

namespace App\Models;

use CodeIgniter\Model;

class PromoModel extends Model
{
    protected $table      = 'promos';
    protected $primaryKey = 'promo_id';

    protected $returnType     = 'array';

    protected $allowedFields = [
        'promo_name',
        'description',
        'required_points',
        'start_date',
        'end_date',
        'image_url',
        'created_at',
    ];

    public function getPromosExcludingFavorites($tagUid)
    {
        return $this->db->table('promos p')
            ->select('p.*')
            ->join(
                'favorites f',
                'f.promo_id = p.promo_id AND f.tag_uid = ' . $this->db->escape($tagUid),
                'left'
            )
            ->where('f.favorite_id IS NULL')
            ->get()
            ->getResult();
    }
}
