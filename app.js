//carregando modulos
const express = require("express");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const admin = require("./routes/admin");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

require("./models/Usuario");
require("./models/Categoria");
require("./models/Postagem");
require("./config/auth")(passport);
//require("./config/authADM")(passport);

const Categoria = mongoose.model("categorias");
const Postagem = mongoose.model("postagens");
const usuarios = require("./routes/usuario");
const app = express();

//configurações

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

//Middleware
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
  .connect("mongodb://localhost/sistemaEscola", { useNewUrlParser: true })
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
app.get("/", (req, res) => {});

app.use("/admin", admin); // rota admin
app.use("/usuarios", usuarios); // rota usuario
//outros

app.listen(3000);
