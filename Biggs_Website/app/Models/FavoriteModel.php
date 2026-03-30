<?php

namespace App\Models;

use CodeIgniter\Model;

class FavoriteModel extends Model
{
    protected $table      = 'favorites';
    protected $primaryKey = 'favorite_id';

    protected $returnType     = 'array';

    protected $allowedFields = [
        'tag_uid',
        'promo_id',
        'menu_id',
        'date_redeemed',
    ];

    public function getFavoritePromosByTagUid($tagUid)
    {
        return $this->select('p.promo_id, p.promo_name, p.description, p.required_points, p.image_url, p.start_date, p.end_date, p.created_at, favorites.favorite_id, favorites.tag_uid, favorites.date_redeemed')
            ->join('promos p', 'p.promo_id = favorites.promo_id')
            ->where('favorites.tag_uid', $tagUid)
            ->findAll();
    }

    public function getFavoriteMenusByTagUid($tagUid)
    {
        return $this->select('m.*, favorites.favorite_id, favorites.tag_uid, favorites.menu_id, favorites.date_redeemed')
            ->join('menus m', 'm.menu_id = favorites.menu_id')
            ->where('favorites.tag_uid', $tagUid)
            ->findAll();
    }

    public function addFavorite($tagUid, $promoId)
{
    // Prevent duplicate favorites
    $exists = $this->where('tag_uid', $tagUid)
                   ->where('promo_id', $promoId)
                   ->first();

    if ($exists) {
        return true; // Already favorited, treat as success
    }

    $data = [
        'tag_uid'  => $tagUid,
        'promo_id' => $promoId,
    ];

    return $this->insert($data);
}

    public function removeFavorite($tagUid, $promoId)
    {
        return $this->where('tag_uid', $tagUid)->where('promo_id', $promoId)->delete();
    }
}
