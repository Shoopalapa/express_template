const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const authFunctions = require('../middleware/authenticate');

// add the auth middleware
router.all('*', authFunctions.checkAuthMiddleware);
// homepage
router.get('/', (req, res) => {
  res.render('pages/index', {
    layout: 'public',
    template: 'homepage',
  });
});
// tabs Page
router.get('/page2', (req, res) => {
  res.render('pages/page2', {
    layout: 'public',
    template: 'page2',
  });
});
// profile page
router.get('/profile', (req, res) => {
  res.render('pages/profile', {
    layout: 'public',
    template: 'homepage',
    session: req.session,
  });
});
// login page (GET)
router.get('/login', (req, res) => {
  res.render('pages/login', {
    layout: 'login',
    template: 'login',
  });
});
// login page (POST)
router.post('/login', (req, res) => {
  if (req.body.username && req.body.password) {
    // check auth with ops api here
    /*
      This is just used for debug
    */
    req.session.username = req.body.username.split('@')[0];
    req.session.password = req.body.password;
    // end dubug
    req.session.authenticated = true;
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});
// logout
router.get('/logout', (req, res) => {
  req.session.cookie.expires = new Date(Date.now());
  req.session.destroy(function(err) {
    if (err) console.log(err);
  });
  res.redirect(301, '/login');
});
// default 404
router.use((req, res) => {
  res.render('pages/error_404', {
    layout: 'public',
    template: '404',
  });
});

module.exports = router;
