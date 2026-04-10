<?php

namespace App\Controllers;

class VoucherController extends BaseController
{
    public function getAllVouchers()
    {
        $vouchers = $this->voucherModel->findAll();

        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'Vouchers fetched successfully',
            'data' => $vouchers,
        ]);
    }

    public function getVouchersExcludingClaimed()
    {
        $data = $this->request->getJSON();

        $tagUid = $data->tag_uid;

        $vouchers = $this->voucherModel->getVouchersExcludingClaimed($tagUid);

        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'Available vouchers fetched successfully',
            'data' => $vouchers,
        ]);
    }
}
