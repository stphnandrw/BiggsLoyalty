<?php

namespace App\Controllers;

class WebController extends BaseController
{
    private function renderPage(string|array $pageViews, array $data = []): string
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

        $pageContent = '';
        if (is_array($pageViews)) {
            foreach ($pageViews as $view) {
                $pageContent .= view($view, $sharedData);
            }
        } else {
            $pageContent = view($pageViews, $sharedData);
        }

        return view('Templates/Header', $sharedData)
            . view('Templates/Navbar', $sharedData)
            . $pageContent
            . view('Templates/Footer', $sharedData);
    }

    public function manager(): string
    {
        $this->checkSession();

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
        $this->checkSession();
        
        // Detect view mode from query parameter or default to table
        $viewMode = $this->request->getGet('view') ?? 'table';
        $pageView = ($viewMode === 'calendar') ? 'Pages/BookingsCalendar' : 'Pages/ManageBookings';
        
        return $this->renderPage($pageView, [
            'title' => 'Bookings | Biggs Website',
            'activeNav' => 'views',
        ]);
    }

    public function packages(): string
    {
        $this->checkSession();
        
        return $this->renderPage('Pages/ManagePackages', [
            'title' => 'Packages | Biggs Website',
            'activeNav' => 'views',
        ]);
    }
}
