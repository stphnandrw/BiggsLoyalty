<?php

namespace App\Controllers;

class PromoController extends BaseController
{
    public function getAllPromos()
    {
        $promos = $this->promoModel->findAll();

        return $this->response->setJSON($promos);
    }

    public function getPromosExcludingFavorites()
    {
        $data = $this->request->getJSON();

        $tagUid = $data->tag_uid;

        $promos = $this->promoModel->getPromosExcludingFavorites($tagUid);

        return $this->response->setJSON($promos);
    }
}
