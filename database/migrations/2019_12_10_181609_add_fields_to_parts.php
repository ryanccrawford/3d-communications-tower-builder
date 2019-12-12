<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFieldsToParts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('parts', function (Blueprint $table) {
            $table->string('name');
            $table->string('manufacturer_code');
            $table->string('file');
            $table->double('price', 10, 2)->default(0.00);
            $table->integer('material')->default(0);
            $table->float('height')->default(0.000000000);
            $table->float('width')->default(0.000000000);
            $table->float('length')->default(0.000000000);
            $table->float('weight')->default(0.000000000);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('parts', function (Blueprint $table) {
            //
        });
    }
}
