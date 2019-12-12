<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Part;

class PartsController extends Controller
{
    public function index()
      {

        $parts = Part::all();

        return $parts->toJson();

      }

      public function store(Request $request)
      {
        $validatedData = $request->validate([
          'name' => 'required',
          'manufacturer_code' => 'required',
        ]);

        $part = Part::create([
          'name' => $validatedData['name'],
          'manufacturer_code' => $validatedData['manufacturer_code'],
        ]);

        return response()->json('Part Created');
      }

      public function show($id)
      {
        $part = Part::find($id);

        return $part->toJson();
      }

      public function update(Part $part)
      {
        $part->update();
        return response()->json('Part Updated');

      }

}
