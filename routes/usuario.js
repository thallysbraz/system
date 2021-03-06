global.ID = "<strong> Olá, {0}.</strong>";
global.FORGOT = "<strong> Olá, {0}</strong>";

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const passport = require("passport");
const nodemailer = require("nodemailer");

require("dotenv").config();
require("../models/Usuario");
require("../models/Disciplina");

const { eAdmin } = require("../helpers/eAdmin");
const Usuario = mongoose.model("usuarios");
const Disciplina = mongoose.model("disciplinas");

router.get("/registro", eAdmin, (req, res) => {
  res.render("usuarios/registro");
});

//validação de usuário
router.post("/registro", eAdmin, (req, res) => {
  try {
    var erros = [];
    if (
      !req.body.nome ||
      typeof req.body.nome == undefined ||
      req.body.nome == null
    ) {
      erros.push({ texto: "Nome inválido" });
    }
    if (
      !req.body.email ||
      typeof req.body.email == undefined ||
      req.body.email == null
    ) {
      erros.push({ texto: "E-mail inválido" });
    }
    if (erros.length > 0) {
      res.render("usuarios/registro", { erros: erros });
    } else {
      Usuario.findOne({ email: req.body.email })
        .then(usuario => {
          if (usuario) {
            req.flash("error_msg", "Email ja registrado!");
            res.redirect("/usuarios/registro");
          } else {
            //gera uma password convertendo em base36 e depois usando somente os ultimos 8 caracteres
            const passSenha = Math.random()
              .toString(36)
              .slice(-8);
            console.log("passSenha: ", passSenha);
            const novoUsuario = new Usuario({
              nome: req.body.nome,
              email: req.body.email,
              senha: passSenha,
              eProf: req.body.professor,
              eAdmin: req.body.eAdmin,
              curso: req.body.curso
            });
            bcrypt.genSalt(10, (erro, salt) => {
              bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                if (erro) {
                  req.flash("error_msg", "Error ao salvar usuário");
                  res.redirect("/");
                }
                novoUsuario.senha = hash;
                novoUsuario
                  .save()
                  .then(() => {
                    //iniciando envio de email
                    let transporter = nodemailer.createTransport({
                      service: "gmail",
                      auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PASSWORD
                      }
                    });
                    const nom = novoUsuario.nome;
                    const text =
                      nom +
                      ", use seu email e senha: " +
                      passSenha +
                      ". Para entrar no portal da faculdade pelo link http://localhost:3000";
                    let mailOptions = {
                      from: "",
                      to: req.body.email,
                      subject: "Seja bem-vindo", //assunto
                      html: global.ID.replace("{0}", text)
                    };

                    transporter.sendMail(mailOptions, function(err, data) {
                      if (err) {
                        req.flash(
                          "error_msg",
                          "Error ao criar o usuário, tente novamente!"
                        );
                        res.redirect("/usuarios/registro");
                        //console.log("error occurs: ", err);
                      } else {
                        console.log("email enviado!!!");
                      }
                    });
                    //finalizando envio de email
                    req.flash("success_msg", "Usuário criado com sucesso!");
                    res.redirect("/");
                  })
                  .catch(err => {
                    req.flash(
                      "error_msg",
                      "Error ao criar o usuário, tente novamente!"
                    );
                    console.log("errCath: ", err);
                    res.redirect("/usuarios/registro");
                  });
              });
            });
          }
        })
        .catch(err => {
          req.flash("error_msg", "Houve error interno");
          res.redirect("/");
        });
    }
  } catch (err) {
    console.log("err: ", err);
    res.send("error no registro");
  }
});

//rota de login de usuario
router.get("/login", (req, res) => {
  res.render("usuarios/login");
});
//rota para logar o usuario
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/usuarios/login",
    failureFlash: true
  })(req, res, next);
});
//rota para logout do usuario
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "Deslogado com sucesso!");
  res.redirect("/");
});
//rota render esqueci senha
router.get("/forgot_password", (req, res) => {
  res.render("usuarios/forgot_password");
});
//rota para esqueci senha
router.post("/forgot_password", async (req, res) => {
  const { email } = req.body;

  try {
    // verificando se o email esta cadastrado
    const user = await Usuario.findOne({ email });
    const name = user.nome;
    //res.send({ name });

    if (!user) {
      return res.status(400).send({ error: "Usuario não existe" });
    }
    const token = crypto.randomBytes(20).toString("hex"); //gerando um token

    const now = new Date();
    now.setHours(now.getHours() + 1);

    await Usuario.findByIdAndUpdate(user.id, {
      $set: {
        passwordResetToken: token,
        passwordResetExpires: now
      }
    });
    //console.log(token, now);
    const text =
      name +
      ". Seu código para recuperar senha: " +
      token +
      ". Caso não tenha solicitado a troca de senha, por favor desconsidere";
    //iniciando envio de email
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });
    let mailOptions = {
      from: "",
      to: req.body.email,
      subject: "Seja bem-vindo", //assunto
      html: global.FORGOT.replace("{0}", text)
    };

    transporter.sendMail(mailOptions, function(err, data) {
      if (err) {
        req.flash(
          "error_msg",
          "Error ao enviar email de recuperação de senha!"
        );
        res.redirect("/");
        //console.log("error occurs: ", err);
      } else {
        console.log("email enviado!!!");
      }
    });
    //finalizando envio de email
    console.log("finalizou");

    res.redirect("/usuarios/reset_password");
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: "Error na rota de esqueci minha senha." });
  }
});
//rota render resetar senha
router.get("/reset_password", (req, res) => {
  res.render("usuarios/reset_password");
});
//rota para resetar senha
router.post("/reset_password", async (req, res) => {
  const { email, token, senha } = req.body;
  const user = await Usuario.findOne({ email });
  if (!user) {
    //verificando se email e valido. arrumar vieew de error
    req.flash("error_msg", "Usuario não existe");
    res.redirect("/usuarios/reset_password");
  }
  try {
    const user = await Usuario.findOne({ email }).select(
      "+passwordResetToken passwordResetExpires"
    );

    if (!user) {
      //verificando se usuário exites
      req.flash("error_msg", "Usuário incorreto!");
      res.redirect("/usuarios/reset_password");
    }
    //console.log(token);
    if (token !== user.passwordResetToken) {
      // verificar se o token e valido
      req.flash("error_msg", "Token invalido");
      res.redirect("/usuarios/reset_password");
    }
    //verificar se o token esta expirado
    const now = new Date();

    if (now > user.passwordResetExpires) {
      req.flash("error_msg", "Token expirado, por favor gerar novo token");
      res.redirect("/usuarios/reset_password");
    }

    if (req.body.senha != req.body.senha2) {
      req.flash("error_msg", "Senhas são diferentes");
      res.redirect("/usuarios/reset_password");
    }

    //atualizando senha.

    user.senha = senha;
    //console.log("user senha:", user.senha);
    //await user.save();

    bcrypt.genSalt(10, (erro, salt) => {
      bcrypt.hash(user.senha, salt, (erro, hash) => {
        if (erro) {
          req.flash("error_msg", "Error ao salvar usuário");
          res.redirect("/");
        }
        user.senha = hash;
        user
          .save()
          .then(() => {
            req.flash("success_msg", "senha alterada com sucesso!");
            res.redirect("/");
          })
          .catch(err => {
            req.flash(
              "error_msg",
              "Error ao criar o usuário, tente novamente!"
            );
            res.redirect("/usuarios/registro");
          });
      });
    });
  } catch (err) {
    res.status(400).send({ error: "Cannot reset passord, try again" });
  }
});

router.get("/historico", async (req, res) => {
  try {
    const user = req.user.id;
    await Usuario.findOne({ _id: user })
      .sort({ semestre: 1 })
      .then(usuario => {
        const mencao = [];
        for (var i = 0; i < usuario.notas.length; i++) {
          if (usuario.notas[i].nota >= 5) {
            mencao.push({
              nota: usuario.notas[i].nota,
              disciplina: usuario.notas[i].disciplina,
              semestre: usuario.notas[i].semestre,
              status: true
            });
          } else {
            mencao.push({
              nota: usuario.notas[i].nota,
              disciplina: usuario.notas[i].disciplina,
              semestre: usuario.notas[i].semestre,
              status: false
            });
          }
        }
        res.render("usuarios/index", { mencao: mencao, usuario: usuario });
      })
      .catch(err => {
        console.log("err: ", err);
        req.flash("error_msg", "Error!");
        res.redirect("/");
      });
  } catch (err) {
    res.redirect("/usuarios/login");
  }
});
router.get("/dados", async (req, res) => {
  try {
    const user = req.user.id;
    var aprovado = 0;
    var reprovado = 0;
    await Usuario.findOne({ _id: user })
      .then(usuario => {
        const mencao = [];
        for (var i = 0; i < usuario.notas.length; i++) {
          if (usuario.notas[i].nota >= 5) {
            mencao.push({
              nota: usuario.notas[i].nota,
              disciplina: usuario.notas[i].disciplina,
              semestre: usuario.notas[i].semestre,
              status: true
            });
            aprovado++;
          } else {
            mencao.push({
              nota: usuario.notas[i].nota,
              disciplina: usuario.notas[i].disciplina,
              semestre: usuario.notas[i].semestre,
              status: false
            });
            reprovado++;
          }
        }
        res.render("usuarios/dados", {
          mencao: mencao,
          usuario: usuario,
          reprovado,
          aprovado
        });
      })
      .catch(err => {
        console.log("err: ", err);
        req.flash("error_msg", "Error!");
        res.redirect("/");
      });
  } catch (err) {
    res.redirect("/usuarios/login");
  }
});

module.exports = router;
