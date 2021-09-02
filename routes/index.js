var express = require('express');
var { isLoggedin } = require('../helper/util.js')
var router = express.Router();

const navLinks = [
  { title: "Home", pathTo: "/" },
  { title: "Post", pathTo: "/upload" },
  { title: "Sell", pathTo: "/category/sell" },
  { title: "Rent", pathTo: "/category/rent" }
]
/* GET home page. */
module.exports = function (pool) {

  router.get('/', function (req, res, next) {
    const { loggedIn, user } = req.session
    res.status(200).render('home/index', {
      title: "Selling House",
      user,
      isLogin: loggedIn,
      navLinks
    })
  });

  router.get('/category/rent', function (req, res, next) {
    res.status(200).render('category/rent', {
      title: "Rent",
      user: req.session.user,
      isLogin: req.session.loggedIn,
      navLinks
    })
  });
  router.get('/category/sell', function (req, res, next) {
    res.status(200).render('category/sell', {
      title: "Sell",
      user: req.session.user,
      isLogin: req.session.loggedIn,
      navLinks
    })
  });

  router.get('/detail', function (req, res, next) {
    res.render('detail/index', {
      user: req.session.user,
      isLogin: req.session.loggedIn,
      navLinks,
      title: 'Detail',
    });
  });

  router.get('/compare', function (req, res, next) {
    res.render('compare', {
      user: req.session.user,
      isLogin: req.session.loggedIn,
      navLinks,
      title: 'Compare Pages'
    })
  })

  router.get('/signup', function (req, res, next) {
    res.render('auth/signup', {
      title: 'Express',
      user: req.session.user,
      isLogin: req.session.loggedIn,
      navLinks
    });
  });

  router.get('/signin', function (req, res, next) {
    res.render('auth/signin', {
      title: 'Express',
      user: req.session.user,
      isLogin: req.session.loggedIn,
      navLinks
    });
  });

  router.get('/logout', function (req, res, next) {
    req.session.destroy(function (err) {
      res.redirect('/')
    })
  })

  router.get('/upload', isLoggedin, (req, res) => {
    res.render('upload/index', {
      title: 'Tambah Iklan',
      user: req.session.user,
      isLogin: req.session.loggedIn,
      navLinks
    });
  });
  router.get('/iklan?id', (req, res) => {
    res.render('index', {
      title: 'Tambah Iklan',
      user: req.session.user,
      isLogin: req.session.loggedIn,
      navLinks
    });
  });
  return router
}
