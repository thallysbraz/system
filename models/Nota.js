const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;

const Nota = new Schema({
  mencao: {
    type: String,
    enum: ["SS", "MS", "MM", "MI", "II", "SR"]
  },
  alunos: {
    type: Schema.Types.ObjectId,
    ref: "usuarios"
  },
  semestre: {
    type: String,
    required: true
  }
});

mongoose.model("notas", Nota);
