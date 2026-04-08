<?php

namespace App\Controllers;

class BookingController extends BaseController
{
	public function getBranchPackages()
	{
		$data = $this->request->getJSON();
		
		$branchId = $data->branch_id;
		
		if (!$branchId) {
			return $this->response->setStatusCode(400)->setJSON(['message' => 'Invalid branch_id']);
		}

		if (!$this->branchModel->find($branchId)) {
			return $this->response->setStatusCode(404)->setJSON(['message' => 'Branch not found']);
		}
		
		$packages = $this->packageModel->getPackagesByBranchId($branchId);

		return $this->response->setJSON([
			'status' => 'success',
			'data' => $packages,
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
		$slotId = (int) ($data->slot_id ?? 0);
		$packageId = (int) ($data->package_id ?? 0);
		$note = trim((string) ($data->note ?? ''));

		if ($tagUid === '' || $slotId <= 0 || $packageId <= 0) {
			return $this->response->setStatusCode(400)->setJSON([
				'message' => 'tag_uid, slot_id, and package_id are required',
			]);
		}

		$slot = $this->bookingSlotModel->getSlotWithAvailability($slotId);
		if (!$slot) {
			return $this->response->setStatusCode(404)->setJSON(['message' => 'Slot not found']);
		}

		$package = $this->packageModel->getPackageById($packageId);
		if (!$package) {
			return $this->response->setStatusCode(404)->setJSON(['message' => 'Package not found']);
		}

		if ((int) ($package['branch_id'] ?? 0) !== (int) ($slot['branch_id'] ?? 0)) {
			return $this->response->setStatusCode(400)->setJSON([
				'message' => 'Selected package does not belong to the selected slot branch',
			]);
		}

		if ((int) ($slot['is_available'] ?? 0) !== 1) {
			return $this->response->setStatusCode(400)->setJSON(['message' => 'Selected slot is not available']);
		}

		$checkDuplicate = $this->bookingModel->checkBookingExists($tagUid, $slotId);

		if ($checkDuplicate) {
			return $this->response->setStatusCode(409)->setJSON(['message' => 'You have already booked this slot']);
		}

		$payload = [
			'tag_uid' => $tagUid,
			'slot_id' => $slotId,
			'package_id' => $packageId,
			'note' => $note,
			'status' => 'pending',
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

	public function getBookingCountByTagUid()
	{
		$data = $this->request->getJSON();
		$tagUid = trim((string) ($data->tag_uid ?? ''));

		if ($tagUid === '') {
			return $this->response->setStatusCode(400)->setJSON(['message' => 'tag_uid is required']);
		}

		$count = $this->bookingModel->countBookingsByTagUid($tagUid);

		return $this->response->setJSON([
			'status' => 'success',
			'data' => [
				'booking_count' => $count,
			],
		]);
	}

	public function cancelBooking()
	{
		$data = $this->request->getJSON();
		$bookingId = (int) ($data->booking_id ?? 0);
		$tagUid = trim((string) ($data->tag_uid ?? ''));

		if ($bookingId <= 0 || $tagUid === '') {
			return $this->response->setStatusCode(400)->setJSON(['message' => 'booking_id and tag_uid are required']);
		}

		$booking = $this->bookingModel->find($bookingId);
		if (!$booking) {
			return $this->response->setStatusCode(404)->setJSON(['message' => 'Booking not found']);
		}

		if ($booking['tag_uid'] !== $tagUid) {
			return $this->response->setStatusCode(403)->setJSON(['message' => 'You are not authorized to cancel this booking']);
		}

		if ((int) ($booking['status'] ?? 0) === 2) {
			return $this->response->setStatusCode(400)->setJSON(['message' => 'Booking is already cancelled']);
		}

		$cancelled = $this->bookingModel->update($bookingId, ['status' => 'cancelled']);

		if (!$cancelled) {
			return $this->response->setStatusCode(500)->setJSON(['message' => 'Failed to cancel booking']);
		}

		return $this->response->setJSON([
			'status' => 'success',
			'message' => 'Booking cancelled successfully',
		]);
	}
}
