<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Weather extends Model
{
    use HasFactory;

    protected $table = 'weathers';

    protected $guarded = [];

    function setWeatherlogAttribute($weather_array) {
        $this->attributes['weatherlog'] = json_encode($weather_array);
    }

    function getWeatherlogAttribute() {
        return json_decode($this->attributes['weatherlog']);
    }
}
