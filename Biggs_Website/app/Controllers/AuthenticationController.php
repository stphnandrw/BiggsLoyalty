<?php

namespace App\Controllers;

class AuthenticationController extends BaseController
{
    private function renderPage(string $pageView, array $data = []): string
    {
        $sharedData = array_merge([
            'footerText' => 'Biggs Loyalty. All rights reserved.',
            'brandName' => $this->brandName,
            'productName' => $this->productName,
            'shortName' => $this->shortName,
        ], $data);

        return view('Templates/Header', $sharedData)
            . view('Templates/Navbar', $sharedData)
            . view($pageView, $sharedData)
            . view('Templates/Footer', $sharedData);
    }

    public function index(): string
    {
        return view('Pages/Authentication/Login');
    }

    public function signup(): string
    {
        return view('Pages/Authentication/SignUp');
    }

    private function resolveRedirectPath(?string $employeeType = null): string
    {
        $type = strtolower(trim((string) $employeeType));

        if (in_array($type, ['admin', 'manager'], true)) {
            return base_url('notifications');
        }

        return base_url('bookings');
    }

    private function redirectWithValidationErrors(string $path, array $errors)
    {
        return redirect()->to(base_url($path))
            ->withInput()
            ->with('validation_errors', $errors);
    }

    public function login()
    {
        $data = $this->request->getPost([
            'username',
            'password',
        ]);

        if (!$this->validateData($data, [
            'username' => 'required|min_length[3]|max_length[50]',
            'password' => 'required|min_length[8]|max_length[72]',
        ])) {
            return $this->redirectWithValidationErrors('/', $this->validator->getErrors());
        }

        $post = $this->validator->getValidated();
        $username = $post['username'];
        $password = $post['password'];

        $employee = $this->employeeModel->findByUsername($username);

        if (!$employee) {
            return $this->redirectWithValidationErrors('/', [
                'username' => 'Username not found.',
            ]);
        }

        if (!$this->employeeModel->verifyPassword($password, $employee['password'])) {
            return $this->redirectWithValidationErrors('/', [
                'password' => 'Incorrect password.',
            ]);
        }

        if ((int) ($employee['is_active'] ?? 0) !== 1) {
            return $this->redirectWithValidationErrors('/', [
                'username' => 'This employee account is inactive.',
            ]);
        }

        // Set session data
        $this->session->set([
            'employee_id' => $employee['employee_id'],
            'username' => $employee['username'],
            'employee_type' => $employee['employee_type'],
            'assigned_at' => $employee['assigned_at'] ?? null,
            'is_logged_in' => true,
        ]);

        return redirect()->to($this->resolveRedirectPath($employee['employee_type'] ?? null))
            ->with('success', 'Login successful.');
    }

    public function register()
    {
        $data = $this->request->getPost([
            'username',
            'password',
            'confirm_password',
            'employee_type',
            'assigned_at',
            'terms',
        ]);

        if (!$this->validateData($data, [
            'username' => 'required|min_length[3]|max_length[50]',
            'password' => 'required|min_length[8]|max_length[72]',
            'confirm_password' => 'required|matches[password]',
            'employee_type' => 'required|max_length[50]',
            'assigned_at' => 'permit_empty|is_natural_no_zero',
            'terms' => 'required',
        ])) {
            return $this->redirectWithValidationErrors('/signup', $this->validator->getErrors());
        }

        $post = $this->validator->getValidated();
        $username = trim((string) $post['username']);
        $password = (string) $post['password'];
        $employeeType = trim((string) $post['employee_type']);
        $assignedAtRaw = $post['assigned_at'] ?? '';
        $assignedAt = $assignedAtRaw === '' ? null : (int) $assignedAtRaw;

        if ($this->employeeModel->where('username', $username)->first()) {
            return $this->redirectWithValidationErrors('/signup', [
                'username' => 'Username already exists.',
            ]);
        }

        $hashedPassword = $this->employeeModel->hashPassword($password);

        $created = $this->employeeModel->insert([
            'username' => $username,
            'password' => $hashedPassword,
            'employee_type' => $employeeType,
            'assigned_at' => $assignedAt,
            'is_active' => 1,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ]);

        if (!$created) {
            return $this->redirectWithValidationErrors('/signup', [
                'general' => 'Registration failed. Please try again.',
            ]);
        }

        return redirect()->to(base_url('/'))
            ->with('success', 'Registration successful. Please sign in.');
    }

    public function logout()
    {
        $this->session->destroy();
        return redirect()->to(base_url('/'));
    }
}
