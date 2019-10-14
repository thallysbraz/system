const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

require("../models/Usuario");
require("../models/Categoria");
require("../models/Postagem");
require("../models/Disciplina");
require("../models/Nota");

const Categoria = mongoose.model("categorias");
const Postagem = mongoose.model("postagens");
const Disciplina = mongoose.model("disciplinas");
const Usuario = mongoose.model("usuarios");
const { eAdmin } = require("../helpers/eAdmin");
const { eProf } = require("../helpers/eProf");

//rota para pegar a matricula do professor
router.get("/", eProf, (req, res) => {
  res.render("professor/index");
});
router.post("/consulta", async (req, res) => {
  const professor = req.body.matricula;
  const user = req.user._id;
  console.log("user: ", user);
  await Disciplina.find({ professor })
    .then(disciplinas => {
      res.render("professor/disciplinas", { disciplinas: disciplinas });
    })
    .catch(err => {
      req.flash(
        "error_msg",
        "Houve error ao listar as discplinas que vc da aula"
      );
      req.redirect("/professor");
    });

  /*try {
    const disciplina = await Disciplina.find({ professor });
    return res.send({ disciplina });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "Error, loading disciplina" });
  }*/
});
//rota para mostrar ao professor suas disciplinas
router.get("/disciplinasList", async (req, res) => {
  const professor = res.locals.user._id;
  console.log("professor: ", professor);
  //res.send(professor);
  try {
    const disciplina = await Disciplina.find({ professor }).populate([
      "matriculados"
    ]);
    return res.send({ disciplina });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "Error, loading disciplina" });
  }
});

router.get("/disciplinas", eProf, (req, res) => {
  Disciplina.find()
    .sort({ date: "desc" })
    .then(disciplinas => {
      res.render("admin/disciplinas", { disciplinas: disciplinas });
    })
    .catch(err => {
      req.flash("error_msg", "Houve error ao listar as categorias");
      req.redirect("/admin");
    });
});

module.exports = router;
