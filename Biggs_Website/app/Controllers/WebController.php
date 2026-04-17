<?php

namespace App\Controllers;

class WebController extends BaseController
{
    public function manager(): string
    {
        return view('Notification/manager');
    }

    public function nfcSimulator(): string
    {
        return view('Testing/nfc_simulator');
    }
}
