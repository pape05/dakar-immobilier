<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('batiments', function (Blueprint $table) {
            $table->string('photo')->nullable()->after('description');
        });

        Schema::table('appartements', function (Blueprint $table) {
            $table->string('photo')->nullable()->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('batiments', function (Blueprint $table) {
            $table->dropColumn('photo');
        });

        Schema::table('appartements', function (Blueprint $table) {
            $table->dropColumn('photo');
        });
    }
};
