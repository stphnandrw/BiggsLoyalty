<?php

namespace App\Models;

use CodeIgniter\Model;

class BookingSlotModel extends Model
{
    protected $table      = 'booking_slots';
    protected $primaryKey = 'slot_id';

    protected $returnType     = 'array';

    protected $allowedFields = [
        'branch_id',
        'slot_date',
        'time_start',
        'time_end',
        'max_seats',
        'is_active',
        'created_at',
        'updated_at',
    ];

    public function getAvailableSlots($branchId, $slotDate)
    {
        $rows = $this->db->table('booking_slots s')
            ->select('s.slot_id AS id, s.slot_id, s.branch_id, s.slot_date, s.time_start, s.time_end, s.max_seats, s.is_active')
            ->select('COALESCE(SUM(CASE WHEN b.status IN ("pending", "confirmed") THEN b.party_size ELSE 0 END), 0) AS booked_seats', false)
            ->join('bookings b', 'b.slot_id = s.slot_id', 'left')
            ->where('s.branch_id', $branchId)
            ->where('s.slot_date', $slotDate)
            ->where('s.is_active', 1)
            ->groupBy('s.slot_id')
            ->orderBy('s.time_start', 'ASC')
            ->get()
            ->getResultArray();

        return array_map(function ($slot) {
            $booked = (int) ($slot['booked_seats'] ?? 0);
            $maxSeats = (int) ($slot['max_seats'] ?? 0);
            $availableSeats = max($maxSeats - $booked, 0);

            $slot['booked_seats'] = $booked;
            $slot['available_seats'] = $availableSeats;
            $slot['is_available'] = $availableSeats > 0;

            return $slot;
        }, $rows);
    }

    public function getSlotWithAvailability($slotId)
    {
        $slot = $this->db->table('booking_slots s')
            ->select('s.slot_id AS id, s.slot_id, s.branch_id, s.slot_date, s.time_start, s.time_end, s.max_seats, s.is_active')
            ->select('COALESCE(SUM(CASE WHEN b.status IN ("pending", "confirmed") THEN b.party_size ELSE 0 END), 0) AS booked_seats', false)
            ->join('bookings b', 'b.slot_id = s.slot_id', 'left')
            ->where('s.slot_id', $slotId)
            ->groupBy('s.slot_id')
            ->get()
            ->getRowArray();

        if (!$slot) {
            return null;
        }

        $booked = (int) ($slot['booked_seats'] ?? 0);
        $maxSeats = (int) ($slot['max_seats'] ?? 0);

        $slot['booked_seats'] = $booked;
        $slot['available_seats'] = max($maxSeats - $booked, 0);
        $slot['is_available'] = $slot['available_seats'] > 0;

        return $slot;
    }
}
