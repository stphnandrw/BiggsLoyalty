<?php

namespace App\Controllers;

class BookingController extends BaseController
{
	private function getDefaultPackages(): array
	{
		return [
			[
				'id' => 1,
				'name' => 'Basic Package (Snack/Seminar)',
				'price_per_head' => 350,
				'min_pax' => 20,
				'max_pax' => 30,
				'inclusions' => [
					'3-hour hall use',
					'Sound system',
					'Plated snack',
					'Bottomless Iced Tea',
				],
				'best_for' => 'Small Meetings or Workshops',
			],
			[
				'id' => 2,
				'name' => 'Classic Buffet',
				'price_per_head' => 550,
				'min_pax' => 30,
				'max_pax' => 50,
				'inclusions' => [
					'4-hour hall use',
					'Standard Buffet',
					'Basic Venue Decor',
					'Projector Use',
				],
				'best_for' => 'Birthdays and Family Reunions',
			],
			[
				'id' => 3,
				'name' => 'Grand Celebration',
				'price_per_head' => 750,
				'min_pax' => 50,
				'max_pax' => 100,
				'inclusions' => [
					'5-hour hall use',
					'Premium Buffet',
					'Special Setup',
					'Dedicated Coordinator',
				],
				'best_for' => 'Corporate Events, Weddings, and Debuts',
			],
		];
	}

	private function parseInclusions($raw): array
	{
		if (is_array($raw)) {
			return $raw;
		}

		if (!is_string($raw) || $raw === '') {
			return [];
		}

		$decoded = json_decode($raw, true);
		if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
			return $decoded;
		}

		return array_values(array_filter(array_map('trim', explode('|', $raw))));
	}

	public function getBranchPackages()
	{
		$data = $this->request->getJSON();
		$branchId = (int) ($data->branch_id ?? 0);

		if ($branchId <= 0) {
			return $this->response->setStatusCode(400)->setJSON(['message' => 'branch_id is required']);
		}

		if (!$this->branchModel->find($branchId)) {
			return $this->response->setStatusCode(404)->setJSON(['message' => 'Branch not found']);
		}

		if (!$this->packageModel->tableExists('packages')) {
			return $this->response->setJSON([
				'status' => 'success',
				'data' => $this->getDefaultPackages(),
			]);
		}

		$packages = $this->packageModel->getAllPackages();

		$normalized = array_map(function ($package) {
			$rawDetails = (string) ($package['details'] ?? '');
			$detailsLines = array_values(array_filter(array_map('trim', preg_split('/\r\n|\r|\n/', $rawDetails) ?: [])));
			$inclusions = $detailsLines;
			if (empty($inclusions) && $rawDetails !== '') {
				$inclusions = [$rawDetails];
			}

			return [
				'id' => (int) ($package['package_id'] ?? 0),
				'name' => $package['package_name'] ?? '',
				'price_per_head' => (float) ($package['price'] ?? 0),
				'min_pax' => 1,
				'max_pax' => 9999,
				'inclusions' => $inclusions,
				'best_for' => '',
			];
		}, $packages);

		return $this->response->setJSON([
			'status' => 'success',
			'data' => $normalized,
		]);
	}

	public function getAvailableSlots()
	{
		$data = $this->request->getJSON();

		$branchId = (int) ($data->branch_id ?? 0);
		$slotDate = $data->slot_date ?? null;

		if ($branchId <= 0 || !$slotDate) {
			return $this->response->setStatusCode(400)->setJSON([
				'message' => 'branch_id and slot_date are required',
			]);
		}

		if (!$this->branchModel->find($branchId)) {
			return $this->response->setStatusCode(404)->setJSON(['message' => 'Branch not found']);
		}

		$slots = $this->bookingSlotModel->getAvailableSlots($branchId, $slotDate);

		return $this->response->setJSON([
			'status' => 'success',
			'data' => $slots,
		]);
	}

	public function createBooking()
	{
		$data = $this->request->getJSON();

		$tagUid = trim((string) ($data->tag_uid ?? ''));
		$branchId = (int) ($data->branch_id ?? 0);
		$slotId = (int) ($data->slot_id ?? 0);
		$packageId = (int) ($data->package_id ?? 0);
		$userName = trim((string) ($data->user_name ?? ''));
		$userEmail = trim((string) ($data->user_email ?? ''));
		$userPhone = trim((string) ($data->user_phone ?? ''));
		$note = trim((string) ($data->note ?? ''));
		$promoId = $data->promo_id ?? null;
		$partySize = (int) ($data->party_size ?? 0);

		if ($tagUid === '' || $branchId <= 0 || $slotId <= 0 || $partySize <= 0) {
			return $this->response->setStatusCode(400)->setJSON([
				'message' => 'tag_uid, branch_id, slot_id, and party_size are required',
			]);
		}

		if (!$this->branchModel->find($branchId)) {
			return $this->response->setStatusCode(404)->setJSON(['message' => 'Branch not found']);
		}

		$slot = $this->bookingSlotModel->getSlotWithAvailability($slotId);
		if (!$slot) {
			return $this->response->setStatusCode(404)->setJSON(['message' => 'Slot not found']);
		}

		if ((int) $slot['branch_id'] !== $branchId) {
			return $this->response->setStatusCode(400)->setJSON([
				'message' => 'Selected slot does not belong to the selected branch',
			]);
		}

		if ((int) ($slot['is_active'] ?? 0) !== 1) {
			return $this->response->setStatusCode(400)->setJSON(['message' => 'Selected slot is inactive']);
		}

		if ($partySize > (int) ($slot['available_seats'] ?? 0)) {
			return $this->response->setStatusCode(400)->setJSON([
				'message' => 'Selected slot has insufficient available seats',
			]);
		}

		$payload = [
			'tag_uid' => $tagUid,
			'slot_id' => $slotId,
			'branch_id' => $branchId,
			'package_id' => $packageId > 0 ? $packageId : null,
			'user_name' => $userName,
			'user_email' => $userEmail,
			'user_phone' => $userPhone,
			'party_size' => $partySize,
			'note' => $note,
			'promo_id' => $promoId,
			'status' => 'pending',
			'slot_date' => $slot['slot_date'] ?? null,
			'time_start' => $slot['time_start'] ?? null,
			'time_end' => $slot['time_end'] ?? null,
		];

		$bookingId = $this->bookingModel->createBooking($payload);
		if (!$bookingId) {
			return $this->response->setStatusCode(500)->setJSON(['message' => 'Failed to create booking']);
		}

		return $this->response->setJSON([
			'status' => 'success',
			'message' => 'Booking created successfully',
			'booking_id' => $bookingId,
		]);
	}

	public function getMyBookings()
	{
		$data = $this->request->getJSON();
		$tagUid = trim((string) ($data->tag_uid ?? ''));

		if ($tagUid === '') {
			return $this->response->setStatusCode(400)->setJSON(['message' => 'tag_uid is required']);
		}

		$bookings = $this->bookingModel->getBookingsByTagUid($tagUid);

		return $this->response->setJSON([
			'status' => 'success',
			'data' => $bookings,
		]);
	}
}
