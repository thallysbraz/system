module.exports = {
  eProf: function(req, res, next) {
    if (req.isAuthenticated() && req.user.eProf == true) {
      return next();
    }
    req.flash("error_msg", "Você precisa ser Professor!");
    res.redirect("/");
  }
};
