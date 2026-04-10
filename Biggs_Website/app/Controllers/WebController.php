<?php

namespace App\Controllers;

class WebController extends BaseController
{
    public function manager(): string
    {
        return view('Notification/manager');
    }
}
