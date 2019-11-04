const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;

const Curso = new Schema({
  nome: {
    type: String,
    require: true
  },
  codigo: {
    type: Number,
    require: true
  }
});

mongoose.model("cursos", Curso);
