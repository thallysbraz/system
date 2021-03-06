const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Nota = new Schema({
  nota: {
    type: Number
  },
  disciplina: {
    type: String
  },
  semestre: {
    type: String
  }
});

const Usuario = new Schema({
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  curso: {
    type: String,
    require: true
  },
  eAdmin: {
    type: Boolean,
    default: 0
  },
  eProf: {
    type: Boolean,
    default: 0
  },
  senha: {
    type: String,
    required: true
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  notas: [Nota]
});

mongoose.model("usuarios", Usuario);
