const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Usuario = new Schema({
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  eAdmin: {
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
  }
});

mongoose.model("usuarios", Usuario);
