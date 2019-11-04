const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;

const Alunos = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "usuarios"
  },
  semestre: {
    type: String
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
    type: Schema.Types.ObjectId,
    ref: "cursos"
  },
  semestreVigente: {
    type: String
  },
  professor: {
    type: Schema.Types.ObjectId,
    ref: "usuarios"
  },
  matriculados: [Alunos]
});

mongoose.model("disciplinas", Disciplina);
