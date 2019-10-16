const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

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

//rota para mostrar ao professor suas disciplinas
router.post("/consulta", eProf, async (req, res) => {
  const professor = req.body.matricula;
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

//rota para testar como mostrar o professor as suas disciplinas
/*router.get("/:disciplinaId", async (req, res) => {
  try {
    const professor = req.params.disciplinaId;
    console.log("professor: ", professor);
    const disciplina = await Disciplina.find({ professor });
    return res.send({ disciplina });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "Error, loading disciplina" });
  }
});*/

//rota para tentar mostrar somente os usuarios dessa disciplina (aprendendo)
router.get("/:disciplinaId", async (req, res) => {
  try {
    const professor = req.params.disciplinaId;
    console.log("professor: ", professor);
    Disciplina.find({ professor })
      .then(disciplina => {
        const erros = disciplina[0].matriculados[0].user;
        return res.send(erros);
        //res.render("professor/teste", { disciplina: disciplina });
      })
      .catch(err => {
        console.log("error: ", err);
        return res.send("Error");
      });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "Error, loading disciplina" });
  }
});

//rota par view disciplina/edit
router.get("/disciplinas/notas/edit/:id", eProf, (req, res) => {
  Disciplina.findOne({ _id: req.params.id })
    .then(disciplina => {
      Usuario.find()
        .then(usuarios => {
          res.render("admin/editdisciplinasnotas", {
            usuarios: usuarios,
            disciplina: disciplina
          });
        })
        .catch(err => {
          req.flash("error_msg", "Houve error ao listar as categorias");
          res.redirect("/professor");
        });
    })
    .catch(err => {
      req.flash("error_msg", "Houve error ao carregar o formulario de edição");
      res.redirect("/professor");
    });
});

//rota para validar e registrar edição na disciplina
router.post("/notas/edit/:id", eProf, (req, res) => {});

module.exports = router;
