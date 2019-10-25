const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;

const Alunos = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "usuarios"
  }
});

const Disciplina = new Schema({
  nome: {
    type: String,
    require: true
  },
  codigo: {
    type: Number,
    require: true,
    unique: true
  },
  ementa: {
    type: String,
    required: true
  },
  curso: {
    type: String,
    required: true
  },
  professor: {
    type: Schema.Types.ObjectId,
    ref: "usuarios"
  },
  matriculados: [Alunos]
});

mongoose.model("disciplinas", Disciplina);
