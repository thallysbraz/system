const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Disciplina = new Schema({
  nome: {
    type: String,
    require: true
  },
  codigo: {
    type: Number,
    require: true
  },
  semestre: {
    type: String,
    require: true
  },
  Ementa: {
    type: String,
    require: true
  },
  aluno: [
    {
      type: Schema.Types.ObjectId,
      ref: "usuarios"
    }
  ],
  nota: {
    num: String
  }
});

mongoose.model("disciplinas", Disciplina);
