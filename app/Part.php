<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Part extends Model
{
    protected $primaryKey = 'id';

    protected $fillable = ['name', 'manufacturer_code'];

    protected $attributes = [
        'price' => 0.00,
        'material' => 0,
        'height' => 0.000000000,
        'width' => 0.000000000,
        'length' => 0.000000000,
        'weight' => 0.000000000,
    ];
    
}
