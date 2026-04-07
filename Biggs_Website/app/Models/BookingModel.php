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
        'party_size',
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

    public function getBookingsByTagUid($tagUid)
    {
        return $this->db->table('bookings b')
            ->select('b.*, b.booking_id AS id, s.branch_id, s.slot_date, s.time_start, s.time_end, s.max_seats, p.package_name, p.price as price_per_head')
            ->join('booking_slots s', 's.slot_id = b.slot_id', 'left')
            ->join('packages p', 'p.package_id = b.package_id', 'left')
            ->where('b.tag_uid', $tagUid)
            ->orderBy('b.created_at', 'DESC')
            ->get()
            ->getResultArray();
    }
}
