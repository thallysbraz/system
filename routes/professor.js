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
      //res.send({ disciplinas });
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

//rota par view disciplina/edit
router.get("/disciplinas/notas/edit/:id", async (req, res) => {
  Disciplina.findOne({ _id: req.params.id })
    .then(disciplina => {
      //const limite = disciplina.matriculados.length; // saber quantos alunos tem cadastrados
      //console.log("limite: ", limite);
      //matricula.push({ text: disciplina.matriculados }); // vou usar
      const matricula = []; //array de alunos
      //for para colocar os alunos matriculados dentro de matricula
      for (var i = 0; i < disciplina.matriculados.length; i++) {
        //matricula.push({ mat: disciplina.matriculados[i].user });
        matricula.push(disciplina.matriculados[i].user);
      }
      Usuario.find({ _id: matricula })
        .then(usuario => {
          //console.log("id: ", matricula);
          //return res.send({ usuario });
          res.render("professor/teste2", { usuario: usuario });
        })
        .catch(err => {
          console.log(err);
          req.flash("error_msg", "Houve error interno ao testar");
          res.redirect("/");
        });
      //res.send({ matricula });
      //res.render("professor/teste2", { matricula: matricula });
    })
    .catch(err => {
      console.log("err: ", err);
      req.flash(
        "error_msg",
        "Houve error ao carregar o formulario de lançamento"
      );
      res.redirect("/professor");
    });
});

//rota para validar e registrar edição na disciplina
router.post("/notas/edit/:id", eProf, (req, res) => {
  //const resultado = req.params.id;
  const matricula = req.body.matricula;
  try {
    console.log("nota: ", matricula);
  } catch (err) {
    console.log("err: ", err);
  }
  //res.send({ resultado });
});

router.post("/notas/matricula/:id", (req, res) => {
  const nota = req.body.nota;
  const id = req.body.id;
  const semestre = req.body.semestre;
  const disci = req.body.disci;
  try {
    console.log("id: ", id);
    console.log("disc: ", disci);
    console.log("semestre: ", semestre);
    console.log("nota: ", nota);
  } catch (err) {
    console.log("err: ", err);
  }
});

module.exports = router;

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
/*router.get("/:disciplinaId", async (req, res) => {
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
});*/
