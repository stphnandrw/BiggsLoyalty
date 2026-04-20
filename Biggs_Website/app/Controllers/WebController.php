<?php

namespace App\Controllers;

class WebController extends BaseController
{
    private function renderPage(string $pageView, array $data = []): string
    {
        $sharedData = array_merge([
            'footerText' => 'Biggs Loyalty. All rights reserved.',
            'name' => $this->session->get('username'),
            'employee_type' => $this->session->get('employee_type'),
            'assigned_at'=> $this->session->get('assigned_at'),
            'brandName' => $this->brandName,
            'productName' => $this->productName,
            'shortName' => $this->shortName,
        ], $data);

        return view('Templates/Header', $sharedData)
            . view('Templates/Navbar', $sharedData)
            . view($pageView, $sharedData)
            . view('Templates/Footer', $sharedData);
    }

    public function manager(): string
    {
        return $this->renderPage('Notification/manager', [
            'title' => 'Notification Manager | Biggs Website',
            'activeNav' => 'notification_manager',
        ]);
    }

    public function nfcSimulator(): string
    {
        return $this->renderPage('Testing/nfc_simulator', [
            'title' => 'NFC Simulator | Biggs Website',
            'activeNav' => 'nfc_simulator',
        ]);
    }

    public function home(): string
    {
        return $this->renderPage('Pages/Home', [
            'title' => 'Home | Biggs Website',
            'activeNav' => 'home',
        ]);
    }

    public function about(): string
    {
        return $this->renderPage('Pages/About', [
            'title' => 'About | Biggs Website',
            'activeNav' => 'about',
        ]);
    }

    public function dashboard(): string
    {
        return $this->renderPage('Pages/Dashboard', [
            'title' => 'Dashboard | Biggs Website',
            'activeNav' => 'dashboard',
        ]);
    }

    public function bookings(): string
    {
        return $this->renderPage('Pages/ManageBookings', [
            'title' => 'Bookings | Biggs Website',
            'activeNav' => 'views',
        ]);
    }
}
