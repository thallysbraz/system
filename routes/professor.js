const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

require("../models/Usuario");
require("../models/Disciplina");

const Disciplina = mongoose.model("disciplinas");
const Usuario = mongoose.model("usuarios");
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
      const matricula = []; //array de alunos
      //for para colocar os alunos matriculados dentro de matricula
      for (var i = 0; i < disciplina.matriculados.length; i++) {
        matricula.push(disciplina.matriculados[i].user);
      }
      const discID = [];
      discID.push({ text: disciplina._id });

      // ----------- teste -----------
      try {
        var limite = [];
        Usuario.find({ _id: matricula })
          .then(usuario => {
            res.send({ usuario });
          })
          .catch(err => {
            console.log(err);
            req.flash("error_msg", "Houve error interno ao testar");
            res.send("ok, deu erro, dentro do catch");
          });

        console.log("limite: ", limite.length);
      } catch {
        res.send("ok, deu erro");
      }
      // ----------- fim do teste -----------

      //continuar daqui
      /* , { nome: 0 } 0 oculta o objeto e 1 mostra somente o objeto*/
      //http://db4beginners.com/blog/consultas-no-mongodb/
      /*Usuario.find({ _id: matricula })
        .sort({ nome: 1, _id: 1 })
        .then(usuario => {
          res.render("professor/notas", {
            usuario: usuario,
            discID: discID,
            disciplina: disciplina
          });
        })
        .catch(err => {
          console.log(err);
          req.flash("error_msg", "Houve error interno ao testar");
          res.redirect("/");
        });*/
      //res.send({ matricula });
      //res.render("professor/teste", { matricula: matricula });
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

//rota para validar e lançar nota
router.post("/notas/matricula/:id", eProf, async (req, res) => {
  const matricula = req.body.matricula;
  const nota = req.body.nota;
  const semestre = req.body.semestre;
  const disciplina = req.body.disciplina;
  var nome;
  const error = [];

  if (nota < 0) {
    error.push({ texto: "nota invalida: Menor que 0" });
  }
  if (nota > 10) {
    error.push({ texto: "nota invalida: Maior que 10" });
  }
  if (error.length > 0) {
    req.flash("error_msg", "Nota invalida");
    res.redirect("/professor");
  } else {
    await Disciplina.findOne({ _id: disciplina })
      .then(disciplina => {
        nome = disciplina.nome; //pegando nome da disciplina
      })
      .catch(err => {
        req.flash(
          "error_msg",
          "Houve error interno, por favor tente novamente!"
        );
        res.redirect("/professor");
      });
    var edit = 0;
    //Salvar nota do aluno
    Usuario.findOne({ _id: matricula })
      .then(usuario => {
        for (var i = 0; i < usuario.notas.length; i++) {
          if (
            usuario.notas[i].disciplina == nome &&
            usuario.notas[i].semestre == semestre
          ) {
            usuario.notas[i].nota = nota;
            edit++;
            break;
          }
        }
        //if salvando aluno editado
        if (edit > 0) {
          usuario
            .save()
            .then(() => {
              Disciplina.findOne({ _id: disciplina })
                .then(disciplina => {
                  const matricula = [];
                  for (var i = 0; i < disciplina.matriculados.length; i++) {
                    matricula.push(disciplina.matriculados[i].user);
                  }
                  const discID = [];
                  discID.push({ text: disciplina._id });
                  Usuario.find({ _id: matricula })
                    .sort({ nome: 1, _id: 1 })
                    .then(usuario => {
                      //return res.send({ usuario });
                      res.render("professor/notas", {
                        usuario: usuario,
                        discID: discID
                      });
                    })
                    .catch(err => {
                      console.log(err);
                      req.flash("error_msg", "Houve error interno ao testar");
                      res.redirect("/");
                    });
                })
                .catch(err => {
                  req.flash(
                    "error_msg",
                    "Houve error ao carregar o formulario de lançamento"
                  );
                  res.redirect("/professor");
                });
            })
            .catch(err => {
              console.log("error ao adicionar disciplina ao aluno: ", err);
              res.redirect("/admin/disciplinas");
            });
        } else {
          req.flash(
            "error_msg",
            "Houve error interno. Semestre inválido, por favor, repita o processo"
          );
          res.redirect("/");
        }
      })
      .catch(err => {
        req.flash("error_msg", "Houve error interno ao testar!!!!!!!!");
        res.redirect("/");
      });
    edit = 0;
    //FInalizando Salvar nota do aluno
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
        const erros = disciplina.matriculados[0].user;
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
