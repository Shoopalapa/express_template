/*
    Exposed functions
*/
module.exports = {
  checkAuthMiddleware: function(req, res, next) {
    if (req.path.includes('public/') ||
     (req.session && req.session.authenticated) ||
     req.url == '/login') {
      next();
    } else {
      res.redirect('/login');
    }
  },
};
