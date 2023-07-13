<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Weather;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/* Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
}); */

Route::post('/weatherlog', function(Request $request) {
    $validated = $request->validate([
        'city'=> 'required|min:3',
        'weatherlog'=> 'required|min:3',
    ]);

    $validated['client_ip'] = request()->ip();
    Weather::create($validated);

    return response(['status' => 'success', 'message' => __('Request logged successfully.')]);
});
