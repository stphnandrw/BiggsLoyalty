<?php

namespace App\Controllers;

class MenuController extends BaseController
{
    public function index(): string
    {
        return view('welcome_message');
    }

    public function getAllMenus()
    {
        $menus = $this->menuModel->getAllMenuItems();
        return $this->response->setJSON([
            'status' => 'success',
            'data' => $menus
        ]);
    }

    public function getMenuCategories()
    {
        $categories = $this->menuModel->getMenuCategories();
        return $this->response->setJSON($categories);
    }
}
