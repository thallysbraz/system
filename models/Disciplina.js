const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;

const Alunos = new Schema({
  aluno: [
    {
      type: String
    }
  ]
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
  professor: {
    type: Schema.Types.ObjectId,
    ref: "usuarios"
  },
  matriculados: [Alunos]
});

mongoose.model("disciplinas", Disciplina);
