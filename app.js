//carregando modulos
const express = require("express");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

require("./models/Usuario");
require("./models/Categoria");
require("./models/Postagem");
require("./models/Disciplina");
require("./config/auth")(passport);

const Categoria = mongoose.model("categorias");
const Postagem = mongoose.model("postagens");
const Disciplina = mongoose.model("disciplinas");
const admin = require("./routes/admin");
const professor = require("./routes/professor");
const usuarios = require("./routes/usuario");
const app = express();

//configurações
const PORT = process.env.PORT || 3000;
//Sessão
app.use(
  session({
    secret: "885A5AE84FFE73BAB99184CA5B04F405",
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Middleware para controle de acesso/sessão
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  if (global.adm == true) {
    res.locals.adm2 = true;
  } else {
    res.locals.adm2 = false;
  }
  if (global.prof == true) {
    res.locals.prof2 = true;
  } else {
    res.locals.prof2 = false;
  }
  next();
});

//Body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Handlebars
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Mongoose
mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost/scholl", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("conectado ao banco MONGODB");
  })
  .catch(err => {
    console.log("error ao conectar no banco " + err);
  });

//Public
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  next();
});

//rotas
app.get("/", (req, res) => {
  Postagem.find()
    .populate("categoria")
    .sort({ data: "desc" })
    .then(postagens => {
      //res.send(postagens);
      res.render("index", { postagens: postagens });
    })
    .catch(err => {
      req.flash("error_msg", "Error interno ");
      res.redirect("/404");
    });
});

app.get("/postagem/:slug", (req, res) => {
  Postagem.findOne({ slug: req.params.slug })
    .then(postagem => {
      if (postagem) {
        res.render("postagem/index", { postagem: postagem });
      } else {
        req.flash("error_msg", "Esta postagem não existe!");
        res.redirect("/");
      }
    })
    .catch(err => {
      req.flash("error_msg", "Error interno ao buscar postagem");
      res.redirect("/");
    });
});

//rota para listar categorias
app.get("/categorias", (req, res) => {
  Categoria.find()
    .then(categorias => {
      res.render("categorias/index", { categorias: categorias });
    })
    .catch(err => {
      req.flash("error_msg", "Error ao listar categorias");
      res.redirect("/");
    });
});

app.get("/categorias/:slug", (req, res) => {
  Categoria.findOne({ slug: req.params.slug })
    .then(categoria => {
      if (categoria) {
        Postagem.find({ categoria: categoria._id })
          .then(postagens => {
            res.render("categorias/postagens", {
              postagens: postagens,
              categoria: categoria
            });
          })
          .catch(err => {
            req.flash("error_msg", "Error ao listar posts!");
            res.redirect("/categorias");
          });
      } else {
        req.flash("error_msg", "Essa categoria não existe");
        res.redirect("/categorias");
      }
    })
    .catch(err => {
      req.flash("error_msg", "Houve error ao carregar está página!");
      res.redirect("/categorias");
    });
});

app.get("/404", (req, res) => {
  res.send("Erro 404!");
});

app.get("/posts", (req, res) => {
  Postagem.find()
    .populate("categoria")
    .sort({ data: "desc" })
    .then(postagens => {
      res.render("posts", { postagens: postagens });
    })
    .catch(err => {
      req.flash("error_msg", "Error interno ");
      res.redirect("/404");
    });
});

app.get("/disciplinas", (req, res) => {
  Disciplina.find()
    .then(disciplinas => {
      res.render("disciplinas/index", { disciplinas: disciplinas });
    })
    .catch(err => {
      req.flash("error_msg", "Error ao listar disciplinas");
      res.redirect("/");
    });
});

//possivelmente poderei usar esse teste
app.get("/teste", (req, res) => {
  const valor = 5;
  res.render("teste", { valor: valor });
});

app.use("/admin", admin); // rota admin
app.use("/usuarios", usuarios); // rota usuario
app.use("/professor", professor); //rota de professor;
//outros

app.listen(PORT, () => {
  console.log("server startado, na porta: " + PORT);
});
