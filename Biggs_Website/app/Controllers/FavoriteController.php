<?php

namespace App\Controllers;

class FavoriteController extends BaseController
{
    public function getAllFavoriteMenuByTagUid()
    {
        $data = $this->request->getJSON();
        $tagUid = $data->tag_uid;

        $favorite_menus = $this->favoriteModel->getFavoriteMenusByTagUid($tagUid);

        return $this->response->setJSON($favorite_menus);
    }

        public function getAllFavoritePromosByTagUid()
        {
        $data = $this->request->getJSON();

        $tagUid = $data->tag_uid;

        $favorite_promos = $this->favoriteModel->getFavoritePromosByTagUid($tagUid);

        return $this->response->setJSON($favorite_promos);
        }

        public function getLikedPromosByTagUid()
        {
        $data = $this->request->getJSON();

        $tagUid = $data->tag_uid;

        $liked_promos = $this->favoriteModel->getFavoritePromosByTagUid($tagUid);

        return $this->response->setJSON($liked_promos);
        }

    public function addPromoToFavorite()
{
    $data    = $this->request->getJSON();
    $tagUid  = $data->tag_uid  ?? null;
    $promoId = $data->promo_id ?? null;

    if (!$tagUid || !$promoId) {
        return $this->response
            ->setStatusCode(400)
            ->setJSON(['message' => 'Missing tag_uid or promo_id']);
    }

    $result = $this->favoriteModel->addFavorite($tagUid, $promoId);

    if ($result) {
        return $this->response->setJSON(['message' => 'Promo added to favorites successfully']);
    }

    return $this->response
        ->setStatusCode(500)
        ->setJSON(['message' => 'Failed to add promo to favorites']);
}

public function removePromoFromFavorite()
{
    $data    = $this->request->getJSON();
    $tagUid  = $data->tag_uid  ?? null;
    $promoId = $data->promo_id ?? null;

    if (!$tagUid || !$promoId) {
        return $this->response
            ->setStatusCode(400)
            ->setJSON(['message' => 'Missing tag_uid or promo_id']);
    }

    $result = $this->favoriteModel->removeFavorite($tagUid, $promoId);

    if ($result) {
        return $this->response->setJSON(['message' => 'Promo removed from favorites successfully']);
    }

    return $this->response
        ->setStatusCode(500)
        ->setJSON(['message' => 'Failed to remove promo from favorites']);
}
}
