const path = require("path");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 587,
  auth: {
    user: "d353c962f1ad2a",
    pass: "df06f3c72a7c17"
  }
});

transport.use(
  "compile",
  hbs({
    // configurando transporte
    viewEngine: {
      viewEngine: "handlebars",
      partialsDir: "some/path",
      defaultLayout: false
    },
    viewPath: path.resolve("./resources/mail/"),
    extName: ".html"
  })
);

module.exports = transport;
