<?php

namespace App\Controllers;

class BookingController extends BaseController
{
	public function getBranches()
	{
		$branches = $this->branchModel->findAll();

		return $this->response->setJSON([
			'status' => 'success',
			'message' => 'Branches fetched successfully',
			'data' => $branches,
		]);
	}
	public function getBranchPackages()
	{
		$data = $this->request->getJSON();

		$branchId = $data->branch_id;

		if (!$branchId) {
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

	public function getAvailableSlots()
	{
		$data = $this->request->getJSON();

		$branchId = (int) ($data->branch_id ?? 0);
		$slotDate = $data->slot_date ?? null;

		if ($branchId <= 0 || !$slotDate) {
			return $this->response->setStatusCode(400)->setJSON([
				'status' => 'error',
				'message' => 'branch_id and slot_date are required',
			]);
		}

		if (!$this->branchModel->find($branchId)) {
			return $this->response->setStatusCode(404)->setJSON([
				'status' => 'error',
				'message' => 'Branch not found',
			]);
		}

		$slots = $this->bookingSlotModel->getAvailableSlots($branchId, $slotDate);

		return $this->response->setJSON([
			'status' => 'success',
			'message' => 'Available slots fetched successfully',
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
				'status' => 'error',
				'message' => 'tag_uid, slot_id, and package_id are required',
			]);
		}

		$slot = $this->bookingSlotModel->getSlotWithAvailability($slotId);
		if (!$slot) {
			return $this->response->setStatusCode(404)->setJSON([
				'status' => 'error',
				'message' => 'Slot not found',
			]);
		}

		$package = $this->packageModel->getPackageById($packageId);
		if (!$package) {
			return $this->response->setStatusCode(404)->setJSON([
				'status' => 'error',
				'message' => 'Package not found',
			]);
		}

		if ((int) ($package['branch_id'] ?? 0) !== (int) ($slot['branch_id'] ?? 0)) {
			return $this->response->setStatusCode(400)->setJSON([
				'status' => 'error',
				'message' => 'Selected package does not belong to the selected slot branch',
			]);
		}

		if ((int) ($slot['is_available'] ?? 0) !== 1) {
			return $this->response->setStatusCode(400)->setJSON([
				'status' => 'error',
				'message' => 'Selected slot is not available',
			]);
		}

		$checkDuplicate = $this->bookingModel->checkBookingExists($tagUid, $slotId);

		if ($checkDuplicate) {
			return $this->response->setStatusCode(409)->setJSON([
				'status' => 'error',
				'message' => 'You have already booked this slot',
			]);
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
			return $this->response->setStatusCode(500)->setJSON([
				'status' => 'error',
				'message' => 'Failed to create booking',
			]);
		}

		return $this->response->setJSON([
			'status' => 'success',
			'message' => 'Booking created successfully',
			'data' => [
				'booking_id' => $bookingId,
			],
		]);
	}

	public function getMyBookings()
	{
		$data = $this->request->getJSON();
		$tagUid = trim((string) ($data->tag_uid ?? ''));

		if ($tagUid === '') {
			return $this->response->setStatusCode(400)->setJSON([
				'status' => 'error',
				'message' => 'tag_uid is required',
			]);
		}

		$bookings = $this->bookingModel->getBookingsByTagUid($tagUid);

		return $this->response->setJSON([
			'status' => 'success',
			'message' => 'Bookings fetched successfully',
			'data' => $bookings,
		]);
	}

	public function getBookingCountByTagUid()
	{
		$data = $this->request->getJSON();
		$tagUid = trim((string) ($data->tag_uid ?? ''));

		if ($tagUid === '') {
			return $this->response->setStatusCode(400)->setJSON([
				'status' => 'error',
				'message' => 'tag_uid is required',
			]);
		}

		$count = $this->bookingModel->countBookingsByTagUid($tagUid);

		return $this->response->setJSON([
			'status' => 'success',
			'message' => 'Booking count fetched successfully',
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
			return $this->response->setStatusCode(400)->setJSON([
				'status' => 'error',
				'message' => 'booking_id and tag_uid are required',
			]);
		}

		$booking = $this->bookingModel->find($bookingId);
		if (!$booking) {
			return $this->response->setStatusCode(404)->setJSON([
				'status' => 'error',
				'message' => 'Booking not found',
			]);
		}

		if ($booking['tag_uid'] !== $tagUid) {
			return $this->response->setStatusCode(403)->setJSON([
				'status' => 'error',
				'message' => 'You are not authorized to cancel this booking',
			]);
		}

		if ((int) ($booking['status'] ?? 0) === 2) {
			return $this->response->setStatusCode(400)->setJSON([
				'status' => 'error',
				'message' => 'Booking is already cancelled',
			]);
		}

		$cancelled = $this->bookingModel->update($bookingId, ['status' => 'cancelled']);

		if (!$cancelled) {
			return $this->response->setStatusCode(500)->setJSON([
				'status' => 'error',
				'message' => 'Failed to cancel booking',
			]);
		}

		$this->createGenericNotification(
			'Booking Cancelled',
			'Your booking has been cancelled. We hope to see you again soon!',
			[$booking['tag_uid']],
			'selected',
			['booking_id' => $bookingId],
			'booking_update'
		);

		return $this->response->setJSON([
			'status' => 'success',
			'message' => 'Booking cancelled successfully',
		]);
	}

	public function getAllBookingByBranch()
	{
		$data = $this->request->getJSON();
		$branchId = (int) ($data->branch_id ?? 0);

		if ($branchId <= 0) {
			return $this->response->setStatusCode(400)->setJSON([
				'status' => 'error',
				'message' => 'branch_id is required',
			]);
		}

		if (!$this->branchModel->find($branchId)) {
			return $this->response->setStatusCode(404)->setJSON([
				'status' => 'error',
				'message' => 'Branch not found',
			]);
		}

		$bookings = $this->bookingModel->getBookingsByBranchId($branchId);

		return $this->response->setJSON([
			'status' => 'success',
			'message' => 'Bookings fetched successfully',
			'data' => $bookings,
		]);
	}

	public function getBookingById()
	{
		$data = $this->request->getJSON();
		$bookingId = (int) ($data->booking_id ?? 0);

		if ($bookingId <= 0) {
			return $this->response->setStatusCode(400)->setJSON([
				'status' => 'error',
				'message' => 'booking_id is required',
			]);
		}

		$booking = $this->bookingModel->getBookingDetailsById($bookingId);

		if (!$booking) {
			return $this->response->setStatusCode(404)->setJSON([
				'status' => 'error',
				'message' => 'Booking not found',
			]);
		}

		return $this->response->setJSON([
			'status' => 'success',
			'message' => 'Booking details fetched successfully',
			'data' => $booking,
		]);
	}

	public function getUserDetailsByTagUid()
	{
		$data = $this->request->getJSON();

		$isVerified = $data->is_verified ?? false;
		$tagUid = trim((string) ($data->tag_uid ?? ''));

		if (!$isVerified) {
			return $this->response->setStatusCode(403)->setJSON([
				'status' => 'error',
				'message' => 'User verification failed. Access denied.',
			]);
		}

		if ($tagUid === '') {
			return $this->response->setStatusCode(400)->setJSON([
				'status' => 'error',
				'message' => 'tag_uid is required',
			]);
		}

		$user = $this->userModel->getUserByTagUid($tagUid);

		if (!$user) {
			return $this->response->setStatusCode(404)->setJSON([
				'status' => 'error',
				'message' => 'User not found',
			]);
		}

		return $this->response->setJSON([
			'status' => 'success',
			'message' => 'User details fetched successfully',
			'data' => $user,
		]);
	}

	public function approveBooking()
	{
		$data = $this->request->getJSON();
		$bookingId = (int) ($data->booking_id ?? 0);

		if ($bookingId <= 0) {
			return $this->response->setStatusCode(400)->setJSON([
				'status' => 'error',
				'message' => 'booking_id is required',
			]);
		}

		$booking = $this->bookingModel->find($bookingId);
		if (!$booking) {
			return $this->response->setStatusCode(404)->setJSON([
				'status' => 'error',
				'message' => 'Booking not found',
			]);
		}

		if ((int) ($booking['status'] ?? 0) !== 0) {
			return $this->response->setStatusCode(400)->setJSON([
				'status' => 'error',
				'message' => 'Only pending bookings can be approved',
			]);
		}

		$approved = $this->bookingModel->update($bookingId, ['status' => 'confirmed']);

		if (!$approved) {
			return $this->response->setStatusCode(500)->setJSON([
				'status' => 'error',
				'message' => 'Failed to approve booking',
			]);
		}

		$this->createGenericNotification(
			'Booking Approved',
			'Your booking has been approved. We look forward to serving you at our branch!',
			[$booking['tag_uid']],
			'selected',
			[
				'booking_id' => $bookingId,
				'redirect' => '(booking)/' . $bookingId, // Decides where to navigate when the user taps the notification or an action button.
			],
			'booking_update'
		);

		return $this->response->setJSON([
			'status' => 'success',
			'message' => 'Booking approved successfully',
		]);
	}

	public function rejectBooking()
	{
		$data = $this->request->getJSON();
		$bookingId = (int) ($data->booking_id ?? 0);

		if ($bookingId <= 0) {
			return $this->response->setStatusCode(400)->setJSON([
				'status' => 'error',
				'message' => 'booking_id is required',
			]);
		}

		$booking = $this->bookingModel->find($bookingId);
		if (!$booking) {
			return $this->response->setStatusCode(404)->setJSON([
				'status' => 'error',
				'message' => 'Booking not found',
			]);
		}

		if ((int) ($booking['status'] ?? 0) !== 0) {
			return $this->response->setStatusCode(400)->setJSON([
				'status' => 'error',
				'message' => 'Only pending bookings can be rejected',
			]);
		}

		$rejected = $this->bookingModel->update($bookingId, ['status' => 'rejected']);

		if (!$rejected) {
			return $this->response->setStatusCode(500)->setJSON([
				'status' => 'error',
				'message' => 'Failed to reject booking',
			]);
		}

		$this->createGenericNotification(
			'Booking Rejected',
			'Your booking has been rejected. Please contact the branch for more information.',
			[$booking['tag_uid']],
			'selected',
			['booking_id' => $bookingId],
			'booking_update'
		);

		return $this->response->setJSON([
			'status' => 'success',
			'message' => 'Booking rejected successfully',
		]);
	}

	public function rescheduleBooking()
	{
		$data = $this->request->getJSON();
		$bookingId = (int) ($data->booking_id ?? 0);
		$newSlotId = (int) ($data->new_slot_id ?? 0);

		if ($bookingId <= 0 || $newSlotId <= 0) {
			return $this->response->setStatusCode(400)->setJSON([
				'status' => 'error',
				'message' => 'booking_id and new_slot_id are required',
			]);
		}

		$booking = $this->bookingModel->find($bookingId);

		if (!$booking) {
			return $this->response->setStatusCode(404)->setJSON([
				'status' => 'error',
				'message' => 'Booking not found',
			]);
		}

		// Only confirmed bookings can be rescheduled
		$bookingStatus = strtolower(trim($booking['status'] ?? ''));
		if ($bookingStatus !== 'confirmed') {
			return $this->response->setStatusCode(400)->setJSON([
				'status' => 'error',
				'message' => 'Only confirmed bookings can be rescheduled. Current status: ' . $bookingStatus,
			]);
		}

		$slot = $this->bookingSlotModel->getSlotWithAvailability($newSlotId);


		if (!$slot) {
			return $this->response->setStatusCode(404)->setJSON([
				'status' => 'error',
				'message' => 'New slot not found',
			]);
		}

		if ((int) ($slot['is_available'] ?? 0) !== 1) {
			return $this->response->setStatusCode(400)->setJSON([
				'status' => 'error',
				'message' => 'Selected new slot is not available',
			]);
		}

		$rescheduled = $this->bookingModel->update($bookingId, ['slot_id' => $newSlotId]);

		if (!$rescheduled) {
			return $this->response->setStatusCode(500)->setJSON([
				'status' => 'error',
				'message' => 'Failed to reschedule booking',
			]);
		}

		$this->createGenericNotification(
			'Booking Rescheduled',
			'Your booking has been rescheduled to ' . ($slot['slot_time'] ?? 'the new slot') . '.',
			[$booking['tag_uid']],
			'selected',
			['booking_id' => $bookingId, 'new_slot_id' => $newSlotId],
			'booking_update'
		);

		return $this->response->setJSON([
			'status' => 'success',
			'message' => 'Booking rescheduled successfully',
		]);
	}

	public function createSlot()
	{
		$data = $this->request->getJSON();

		$branchId = (int) ($data->branch_id ?? 0);
		$slotDate = trim((string) ($data->slot_date ?? ''));
		$timeStart = trim((string) ($data->time_start ?? ''));
		$timeEnd = trim((string) ($data->time_end ?? ''));

		if ($branchId <= 0 || !$slotDate || !$timeStart || !$timeEnd) {
			return $this->response->setStatusCode(400)->setJSON([
				'status' => 'error',
				'message' => 'branch_id, slot_date, time_start, and time_end are required',
			]);
		}

		if (!$this->branchModel->find($branchId)) {
			return $this->response->setStatusCode(404)->setJSON([
				'status' => 'error',
				'message' => 'Branch not found',
			]);
		}

		if ($timeStart >= $timeEnd) {
			return $this->response->setStatusCode(400)->setJSON([
				'status' => 'error',
				'message' => 'time_start must be before time_end',
			]);
		}

		$existingSlot = $this->bookingSlotModel->where('branch_id', $branchId)
			->where('slot_date', $slotDate)
			->where('time_start', $timeStart)
			->first();

		if ($existingSlot) {
			return $this->response->setStatusCode(409)->setJSON([
				'status' => 'error',
				'message' => 'A slot with the same date and start time already exists for this branch',
			]);
		}

		$payload = [
			'branch_id' => $branchId,
			'slot_date' => $slotDate,
			'time_start' => $timeStart,
			'time_end' => $timeEnd
		];

		$slotId = $this->bookingSlotModel->insert($payload);

		if (!$slotId) {
			return $this->response->setStatusCode(500)->setJSON([
				'status' => 'error',
				'message' => 'Failed to create slot',
			]);
		}

		return $this->response->setJSON([
			'status' => 'success',
			'message' => 'Slot created successfully',
			'data' => [
				'slot_id' => $slotId,
				'branch_id' => $branchId,
				'slot_date' => $slotDate,
				'time_start' => $timeStart,
				'time_end' => $timeEnd
			],
		]);
	}

	public function deleteSlot()
	{
		$data = $this->request->getJSON();

		$slotId = (int) ($data->slot_id ?? 0);

		if ($slotId <= 0) {
			return $this->response->setStatusCode(400)->setJSON([
				'status' => 'error',
				'message' => 'slot_id is required',
			]);
		}

		$slot = $this->bookingSlotModel->find($slotId);
		if (!$slot) {
			return $this->response->setStatusCode(404)->setJSON([
				'status' => 'error',
				'message' => 'Slot not found',
			]);
		}

		$bookings = $this->bookingModel->where('slot_id', $slotId)->findAll();
		if (!empty($bookings)) {
			return $this->response->setStatusCode(400)->setJSON([
				'status' => 'error',
				'message' => 'Cannot delete slot with existing bookings',
			]);
		}

		$this->bookingSlotModel->delete($slotId);

		return $this->response->setJSON([
			'status' => 'success',
			'message' => 'Slot deleted successfully',
		]);
	}

	public function updateSlotAvailability()
	{
		$data = $this->request->getJSON();

		$slotId = (int) ($data->slot_id ?? 0);
		$isAvailable = isset($data->is_available) ? (int) $data->is_available : null;

		if ($slotId <= 0 || $isAvailable === null) {
			return $this->response->setStatusCode(400)->setJSON([
				'status' => 'error',
				'message' => 'slot_id and is_available are required',
			]);
		}

		$slot = $this->bookingSlotModel->find($slotId);
		if (!$slot) {
			return $this->response->setStatusCode(404)->setJSON([
				'status' => 'error',
				'message' => 'Slot not found',
			]);
		}

		$this->bookingSlotModel->update($slotId, [
			'is_available' => $isAvailable,
		]);

		return $this->response->setJSON([
			'status' => 'success',
			'message' => 'Slot availability updated successfully',
			'data' => [
				'slot_id' => $slotId,
				'is_available' => $isAvailable,
			],
		]);
	}

}
