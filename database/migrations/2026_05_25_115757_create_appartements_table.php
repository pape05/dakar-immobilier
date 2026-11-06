<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('appartements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('batiment_id')->constrained('batiments')->onDelete('cascade');
            $table->string('numero');
            $table->decimal('superficie', 8, 2);
            $table->decimal('loyer_mensuel', 10, 2);
            $table->enum('etat', ['libre', 'occupé', 'en_travaux'])->default('libre');
            $table->integer('nombre_pieces')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appartements');
    }
};
