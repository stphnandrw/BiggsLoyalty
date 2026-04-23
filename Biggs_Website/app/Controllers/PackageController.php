<?php

namespace App\Controllers;

class PackageController extends BaseController
{
	public function getAllPackages()
	{
		$packages = $this->packageModel->getAllPackages();

		return $this->response->setJSON([
			'status' => 'success',
			'message' => 'All packages fetched successfully',
			'data' => $packages,
		]);
	}

	public function getPackagesByBranchId()
	{
		$data = $this->request->getJSON();

		$branchId = (int) ($data->branch_id ?? 0);

		if ($branchId <= 0) {
			return $this->response->setStatusCode(400)->setJSON([
				'status' => 'error',
				'message' => 'Invalid branch_id',
			]);
		}

		if (!$this->branchModel->find($branchId)) {
			return $this->response->setStatusCode(404)->setJSON([
				'status' => 'error',
				'message' => 'Branch not found',
			]);
		}

		$packages = $this->packageModel->getPackagesByBranchId($branchId);

		return $this->response->setJSON([
			'status' => 'success',
			'message' => 'Branch packages fetched successfully',
			'data' => $packages,
		]);
	}

	public function getPackageById()
	{
		$data = $this->request->getJSON();

		$packageId = (int) ($data->package_id ?? 0);

		if ($packageId <= 0) {
			return $this->response->setStatusCode(400)->setJSON([
				'status' => 'error',
				'message' => 'package_id is required',
			]);
		}

		$package = $this->packageModel->getPackageById($packageId);

		if (!$package) {
			return $this->response->setStatusCode(404)->setJSON([
				'status' => 'error',
				'message' => 'Package not found',
			]);
		}

		return $this->response->setJSON([
			'status' => 'success',
			'message' => 'Package details fetched successfully',
			'data' => $package,
		]);
	}

	public function createPackage()
	{
		$data = $this->request->getJSON();

		$branchId = (int) ($data->branch_id ?? 0);
		$packageName = trim((string) ($data->package_name ?? ''));
		$details = trim((string) ($data->details ?? ''));
		$paxSize = (int) ($data->pax_size ?? 0);
		$price = (double) ($data->price ?? 0);

		log_message('debug', 'Creating package with data: ' . json_encode($data));

		if ($branchId <= 0 || $packageName === '' || $paxSize <= 0 || $price <= 0) {
			return $this->response->setStatusCode(400)->setJSON([
				'status' => 'error',
				'message' => 'branch_id, package_name, pax_size, and price are required',
			]);
		}

		if (!$this->branchModel->find($branchId)) {
			return $this->response->setStatusCode(404)->setJSON([
				'status' => 'error',
				'message' => 'Branch not found',
			]);
		}

		$payload = [
			'branch_id' => $branchId,
			'package_name' => $packageName,
			'details' => $details,
			'pax_size' => $paxSize,
			'price' => $price,
		];

		log_message('debug', 'Inserting package with payload: ' . json_encode($payload));

		$packageId = $this->packageModel->insert($payload);

		if (!$packageId) {
			return $this->response->setStatusCode(500)->setJSON([
				'status' => 'error',
				'message' => 'Failed to create package',
			]);
		}

		log_message('debug', 'Package created with ID: ' . $packageId);

		return $this->response->setJSON([
			'status' => 'success',
			'message' => 'Package created successfully',
			'data' => [
				'package_id' => $packageId,
			],
		]);
	}

	public function updatePackage()
	{
		$data = $this->request->getJSON();

		$packageId = (int) ($data->package_id ?? 0);
		$packageName = trim((string) ($data->package_name ?? ''));
		$details = trim((string) ($data->details ?? ''));
		$paxSize = (int) ($data->pax_size ?? 0);
		$price = (float) ($data->price ?? 0);

		if ($packageId <= 0) {
			return $this->response->setStatusCode(400)->setJSON([
				'status' => 'error',
				'message' => 'package_id is required',
			]);
		}

		$package = $this->packageModel->getPackageById($packageId);
		if (!$package) {
			return $this->response->setStatusCode(404)->setJSON([
				'status' => 'error',
				'message' => 'Package not found',
			]);
		}

		$payload = [];
		if ($packageName !== '') {
			$payload['package_name'] = $packageName;
		}
		if ($details !== '') {
			$payload['details'] = $details;
		}
		if ($paxSize > 0) {
			$payload['pax_size'] = $paxSize;
		}
		if ($price > 0) {
			$payload['price'] = $price;
		}

		if (empty($payload)) {
			return $this->response->setStatusCode(400)->setJSON([
				'status' => 'error',
				'message' => 'No fields to update',
			]);
		}

		$updated = $this->packageModel->update($packageId, $payload);

		if (!$updated) {
			return $this->response->setStatusCode(500)->setJSON([
				'status' => 'error',
				'message' => 'Failed to update package',
			]);
		}

		return $this->response->setJSON([
			'status' => 'success',
			'message' => 'Package updated successfully',
		]);
	}

	public function deletePackage()
	{
		$data = $this->request->getJSON();

		$packageId = (int) ($data->package_id ?? 0);

		if ($packageId <= 0) {
			return $this->response->setStatusCode(400)->setJSON([
				'status' => 'error',
				'message' => 'package_id is required',
			]);
		}

		$package = $this->packageModel->getPackageById($packageId);
		if (!$package) {
			return $this->response->setStatusCode(404)->setJSON([
				'status' => 'error',
				'message' => 'Package not found',
			]);
		}

		$deleted = $this->packageModel->delete($packageId);

		if (!$deleted) {
			return $this->response->setStatusCode(500)->setJSON([
				'status' => 'error',
				'message' => 'Failed to delete package',
			]);
		}

		return $this->response->setJSON([
			'status' => 'success',
			'message' => 'Package deleted successfully',
		]);
	}
}

