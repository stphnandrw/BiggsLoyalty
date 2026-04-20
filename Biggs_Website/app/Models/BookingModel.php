<?php

namespace App\Models;

use CodeIgniter\Model;

class BookingModel extends Model
{
    protected $table      = 'bookings';
    protected $primaryKey = 'booking_id';

    protected $returnType     = 'array';

    protected $allowedFields = [
        'slot_id',
        'package_id',
        'tag_uid',
        'note',
        'status',
    ];

    public function createBooking(array $payload)
    {
        $data = array_intersect_key($payload, array_flip($this->allowedFields));
        $inserted = $this->insert($data);

        if (!$inserted) {
            return false;
        }

        return (int) $this->getInsertID();
    }

    public function checkBookingExists($tagUid, $slotId)
    {
        return $this->where('tag_uid', $tagUid)
            ->where('slot_id', $slotId)
            ->whereIn('status', ['pending', 'confirmed'])
            ->first();
    }

    public function getBookingsByTagUid($tagUid)
    {
        return $this->db->table('bookings b')
            ->select('b.*, b.booking_id AS id, s.branch_id, s.slot_date, s.time_start, s.time_end, p.package_name, p.pax_size, p.price as price_per_head')
            ->join('booking_slots s', 's.slot_id = b.slot_id', 'left')
            ->join('packages p', 'p.package_id = b.package_id', 'left')
            ->where('b.tag_uid', $tagUid)
            ->orderBy('b.created_at', 'DESC')
            ->get()
            ->getResultArray();
    }

    public function countBookingsByTagUid($tagUid)
    {
        return $this->where('tag_uid', $tagUid)
            ->whereIn('status', ['pending'])
            ->countAllResults();
    }

    public function getBookingsByBranchId($branchId)
    {
        return $this->db->table('bookings b')
            ->select('b.*, b.booking_id AS id, s.branch_id, s.slot_date, s.time_start, s.time_end, p.package_name, p.pax_size, p.price as price_per_head')
            ->join('booking_slots s', 's.slot_id = b.slot_id', 'left')
            ->join('packages p', 'p.package_id = b.package_id', 'left')
            ->where('s.branch_id', $branchId)
            ->orderBy('b.created_at', 'DESC')
            ->get()
            ->getResultArray();
    }

    public function getBookingDetailsById($bookingId)
    {
        return $this->db->table('bookings b')
            ->select('b.*, b.booking_id AS id, s.branch_id, s.slot_date, s.time_start, s.time_end, p.package_name, p.pax_size, p.price as price_per_head, u.name as customer_name, u.phone_number as customer_phone, u.email as customer_email')
            ->join('booking_slots s', 's.slot_id = b.slot_id', 'left')
            ->join('packages p', 'p.package_id = b.package_id', 'left')
            ->join('btc_profile u', 'u.tag_uid = b.tag_uid', 'left')
            ->join('btc_loyalty l', 'l.tag_uid = b.tag_uid', 'left')
            ->where('b.booking_id', $bookingId)
            ->get()
            ->getFirstRow('array');
    }

    
}
