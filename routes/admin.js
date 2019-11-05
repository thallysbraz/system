const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

require("../models/Usuario");
require("../models/Categoria");
require("../models/Postagem");
require("../models/Disciplina");
require("../models/Cursos");

const Categoria = mongoose.model("categorias");
const Postagem = mongoose.model("postagens");
const Disciplina = mongoose.model("disciplinas");
const Usuario = mongoose.model("usuarios");
const Curso = mongoose.model("cursos");
const { eAdmin } = require("../helpers/eAdmin");

router.get("/", eAdmin, (req, res) => {
  res.render("admin/index");
});

// ROTAS DE CATEGORIAS

//rota para categorias
router.get("/categorias", eAdmin, (req, res) => {
  Categoria.find()
    .sort({ date: "desc" })
    .then(categorias => {
      res.render("admin/categorias", { categorias: categorias });
    })
    .catch(err => {
      req.flash("error_msg", "Houve error ao listar as categorias");
      req.redirect("/admin");
    });
});

//view para categorias/add
router.get("/categorias/add", eAdmin, (req, res) => {
  res.render("admin/addcategorias");
});

//rota para validar e inserir nova categoria no Banco de Dados
router.post("/categorias/nova", eAdmin, (req, res) => {
  var erros = [];

  if (
    !req.body.nome ||
    typeof req.body.nome == undefined ||
    req.body.nome == null
  ) {
    erros.push({ texto: "Nome invalido" });
  }

  if (
    !req.body.slug ||
    typeof req.body.slug == undefined ||
    req.body.slug == null
  ) {
    erros.push({ texto: "Slug invalido" });
  }

  if (erros.length > 0) {
    res.render("admin/addcategorias", { erros: erros });
  } else {
    const novaCategoria = {
      nome: req.body.nome,
      slug: req.body.slug
    };

    new Categoria(novaCategoria)
      .save()
      .then(() => {
        req.flash("success_msg", "Categoria criada com sucesso!");
        res.redirect("/admin/categorias");
      })
      .catch(err => {
        req.flash("error_msg", "Error ao salvar a categoria, tente novamente!");
        res.redirect("/admin");
      });
  }
});

//rota par view categoria/edit
router.get("/categorias/edit/:id", eAdmin, (req, res) => {
  Categoria.findOne({ _id: req.params.id })
    .then(categoria => {
      res.render("admin/editcategorias", { categoria: categoria });
    })
    .catch(err => {
      req.flash("error_msg", "Essa categoria não existe");
      res.redirect("/admin/categorias");
    });
});

//rota para validar e registrar edição na categoria
router.post("/categorias/edit", eAdmin, (req, res) => {
  var erros = [];

  if (
    !req.body.nome ||
    typeof req.body.nome == undefined ||
    req.body.nome == null
  ) {
    erros.push({ texto: "Nome invalido" });
  }

  if (
    !req.body.slug ||
    typeof req.body.slug == undefined ||
    req.body.slug == null
  ) {
    erros.push({ texto: "Slug invalido" });
  }

  if (erros.length > 0) {
    req.flash("error_msg", "Error ao salvar a categoria, tente novamente!");
    res.redirect("/admin/categorias");
  } else {
    Categoria.findOne({ _id: req.body.id })
      .then(categoria => {
        categoria.nome = req.body.nome;
        categoria.slug = req.body.slug;

        categoria
          .save()
          .then(() => {
            req.flash("success_msg", "categoria editada com sucesso");
            res.redirect("/admin/categorias");
          })
          .catch(err => {
            req.flash(
              "error_msg",
              "Houve erro ao salvar a edição da categoria"
            );
            res.redirect("/admin/categorias");
          });
      })
      .catch(err => {
        req.flash("error_msg", "Houve um error ao editar a categoria");
        res.redirect("/admin/categorias");
      });
  }
});

//rota para deletar categoria
router.post("/categorias/deletar", eAdmin, (req, res) => {
  Categoria.remove({ _id: req.body.id })
    .then(() => {
      req.flash("success_msg", "Categoria deletada com sucesso!");
      res.redirect("/admin/categorias");
    })
    .catch(err => {
      req.flash("error_msg", "Error ao deletar categoria!");
      res.redirect("/admin/categorias");
    });
});

// ROTAS DE POST

//rota da pagina de post
router.get("/postagens", eAdmin, (req, res) => {
  Postagem.find()
    .populate("categoria")
    .sort({ data: "desc" })
    .then(postagens => {
      res.render("admin/postagens", { postagens: postagens });
    })
    .catch(err => {
      req.flash("error_msg", "Houve error ao listar posts!");
      res.redirect("admin/postagens");
    });
});

//rota para criar post
router.get("/postagens/add", eAdmin, (req, res) => {
  Categoria.find()
    .then(categorias => {
      res.render("admin/addpostagem", { categorias: categorias });
    })
    .catch(err => {
      req.flash("error_msg", "Houve error ao carregar o formulario");
      res.redirect("/admin");
    });
});

//rota para validar e inserir post no Banco de Dados
router.post("/postagens/nova", eAdmin, (req, res) => {
  var erros = [];

  if (req.body.categoria == "0") {
    erros.push({ texto: "Categoria inválida, registre uma categoria" });
  }

  if (erros.length > 0) {
    res.render("admin/addpostagem", { erros: erros });
  } else {
    const novaPostagem = {
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      conteudo: req.body.conteudo,
      categoria: req.body.categoria,
      slug: req.body.slug
    };
    new Postagem(novaPostagem)
      .save()
      .then(() => {
        req.flash("success_msg", "Postagem criada com sucesso!");
        res.redirect("/admin/postagens");
      })
      .catch(err => {
        req.flash("error_msg", "Houve erro ao salvar postagem");
        res.redirect("/admin/postagens");
      });
  }
});

// editar post
router.get("/postagens/edit/:id", eAdmin, (req, res) => {
  Postagem.findOne({ _id: req.params.id })
    .then(postagem => {
      Categoria.find()
        .then(categorias => {
          res.render("admin/editpostagens", {
            categorias: categorias,
            postagem: postagem
          });
        })
        .catch(err => {
          req.flash("error_msg", "Houve error ao listar as categorias");
          res.redirect("/admin/postagens");
        });
    })
    .catch(err => {
      req.flash("error_msg", "Houve error ao carregar o formulario de edição");
      res.redirect("/admin/postagens");
    });
});

//rota para atualizar os dados do post
router.post("/postagem/edit", eAdmin, (req, res) => {
  Postagem.findOne({ _id: req.body.id })
    .then(postagem => {
      (postagem.titulo = req.body.titulo),
        (postagem.slug = req.body.slug),
        (postagem.descricao = req.body.descricao),
        (postagem.conteudo = req.body.conteudo),
        (postagem.categoria = req.body.categoria);

      postagem
        .save()
        .then(() => {
          req.flash("success_msg", "post editado com sucesso!");
          res.redirect("/admin/postagens");
        })
        .catch(err => {
          req.flash("error_msg", "Error interno");
          res.redirect("/admin/postagens");
        });
    })
    .catch(err => {
      req.flash("error_msg", "Error ao salvar a edição");
      res.redirect("/admin/postagens");
    });
});

//rota para deletar
router.get("/postagens/deletar/:id", eAdmin, (req, res) => {
  Postagem.remove({ _id: req.params.id })
    .then(() => {
      req.flash("success_msg", "Sucesso ao deletar post!");
      res.redirect("/admin/postagens");
    })
    .catch(err => {
      req.flash("error_msg", "Error ao deletar post");
      res.redirect("/admin/postagens");
    });
});

// ROTAS DE DISCIPLINAS

router.get("/disciplinas", eAdmin, (req, res) => {
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

//view para disciplina/add
router.get("/disciplinas/add", eAdmin, (req, res) => {
  Usuario.find({ eAdmin: false, eProf: true })
    .sort({ codigo: 1 })
    .then(usuarios => {
      res.render("admin/adddisciplinas", { usuarios: usuarios });
    })
    .catch(err => {
      req.flash("error_msg", "Houve error ao listar as categorias");
      req.redirect("/admin");
    });
});

//rota para validar e inserir nova disciplina no Banco de Dados
router.post("/disciplinas/nova", eAdmin, async (req, res) => {
  var erros = [];

  if (
    !req.body.codigo ||
    typeof req.body.codigo == undefined ||
    req.body.codigo == null
  ) {
    erros.push({ texto: "Codigo invalido" });
  }
  if (erros.length > 0) {
    res.render("admin/adddisciplinas", { erros: erros });
  } else {
    const codigo = req.body.codigo;
    console.log("codigo: ", codigo);
    Disciplina.findOne({ codigo })
      .then(disciplina => {
        if (disciplina) {
          erros.push({ texto: "Disciplina ja cadastrada" });
          res.render("admin/adddisciplinas", { erros: erros });
        } else {
          const novaDisciplina = {
            nome: req.body.nome,
            codigo: req.body.codigo,
            ementa: req.body.ementa,
            curso: req.body.curso,
            professor: req.body.professor,
            semestreVigente: "2/2019"
            /* matriculados: [
            { aluno: ["5d9cb6fa369c1d778493fd2b", "MM", "2/2019"] },
            { aluno: ["5d5ee71cb9156b4c28a432d6", "SS", "2/2019"] },
            { aluno: ["5d9795601088223e8cc40760", "II", "2/2019"] }
          ]*/
          };
          //const prof = req.body.professor;
          new Disciplina(novaDisciplina)
            .save()
            .then(() => {
              req.flash("success_msg", "Disciplina criada com sucesso!");
              res.redirect("/admin/disciplinas");
            })
            .catch(err => {
              req.flash(
                "error_msg",
                "Error ao salvar a disciplina, tente novamente!"
              );
              console.log("error: ", err);
              res.redirect("/admin");
            });
        }
      })
      .catch(err => {
        req.flash(
          "error_msg",
          "Houve error interno, por favor repita o processo"
        );
        res.render("admin/adddisciplinas", { erros: erros });
      });
  }
});

//rota para cadastrar alunos na disciplina
router.get("/disciplinas/edit/:id", eAdmin, (req, res) => {
  Disciplina.findOne({ _id: req.params.id })
    .then(disciplina => {
      Usuario.find({ eAdmin: false, eProf: false })
        .then(usuarios => {
          res.render("admin/editdisciplinas", {
            usuarios: usuarios,
            disciplina: disciplina
          });
        })
        .catch(err => {
          req.flash("error_msg", "Houve error ao listar os alunos");
          res.redirect("/admin/postagens");
        });
    })
    .catch(err => {
      req.flash(
        "error_msg",
        "Houve error ao carregar o formulario de matricula"
      );
      res.redirect("/admin/disciplinas");
    });
});

//rota para validar e cadastrar alunos na disciplina
router.post("/disciplinas/edit", eAdmin, async (req, res) => {
  Disciplina.findOne({ _id: req.body.id })
    .then(disciplina => {
      const alun = req.body.matricula;
      const semestre = req.body.semestre;
      //const matricula = disciplina.matriculados;
      const erros = [];
      for (var i = 0; i < disciplina.matriculados.length; i++) {
        if (
          disciplina.matriculados[i].user == alun &&
          disciplina.matriculados[i].semestre == semestre
        ) {
          erros.push({ texto: "Aluno ja matriculado" });
          break;
        }
      }
      if (erros.length > 0) {
        req.flash("error_msg", "Aluno ja matriculado");
        res.redirect("/admin/disciplinas");
      } else {
        //Salvar disciplina no aluno
        const NomeDisc = disciplina.nome;
        Usuario.findOne({ _id: alun }).then(usuario => {
          usuario.notas.push({
            nota: 0,
            disciplina: NomeDisc,
            semestre: semestre
          });
          usuario
            .save()
            .then(() => {})
            .catch(err => {
              console.log("error ao adicionar disciplina ao aluno: ", err);
              res.redirect("/admin/disciplinas");
            });
        });
        //FInalizando Salvar disicplina no aluno
        // ----------------------------------\\

        //salvando aluno na disciplina
        disciplina.matriculados.push({
          user: alun,
          semestre: semestre
        });
        disciplina
          .save()
          .then(() => {
            req.flash("success_msg", "Aluno matriculado com sucesso");
            res.redirect("/admin/disciplinas");
          })
          .catch(err => {
            req.flash("error_msg", "Houve erro ao salvar a matricula");
            res.redirect("/admin/disciplinas");
          });
        //res.redirect("/admin/disciplinas");
      }
    })
    .catch(err => {
      console.log("err: ", err);
      req.flash("error_msg", "Houve um error ao editar a matricula");
      res.redirect("/admin/disciplinas");
    });
});

//rota para deletar disciplina, falta implementar
router.post("/disciplinas/deletar", eAdmin, (req, res) => {
  Categoria.remove({ _id: req.body.id })
    .then(() => {
      req.flash("success_msg", "Categoria deletada com sucesso!");
      res.redirect("/admin/categorias");
    })
    .catch(err => {
      req.flash("error_msg", "Error ao deletar categoria!");
      res.redirect("/admin/categorias");
    });
});

// CURSOS -----

//rota pra add curso
router.get("/cursos", async (req, res) => {
  try {
    Curso.find()
      .then(cursos => {
        res.render("cursos/index", { cursos: cursos });
      })
      .catch(err => {
        console.log("error ao listar os cursos: ", err);
        res.redirect("/");
      });
  } catch {
    res.redirect("/");
  }
});

module.exports = router;
