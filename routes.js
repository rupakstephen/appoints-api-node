var express = require('express');
var passport = require('passport');

var middleware = require('./routehandlers/middleware');
var index = require('./routehandlers/index');
var auth = require('./routehandlers/auth');
var me = require('./routehandlers/me');
var appointments = require('./routehandlers/appointments');

var router = express.Router();

// Index
router.get('/', index.index);

// Me
router.get('/me', middleware.ensureAuthenticated, me)

router.get('/all',)

  // Authentication provider routes
router.get('/auth/google', 
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get('/auth/google/callback', 
  passport.authenticate('google', { scope: ['email', 'profile'] }),
  auth.externalcallback
);

router.post('/auth/google', auth.googletoken);

router.get('/auth/loggedin', auth.loggedin);

router.get('/auth/facebook',
  passport.authenticate('facebook', {scope: ['public_profile','email'] }));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login'}),
  auth.externalcallback
);

// Appointments
router.route('/appointments')
  .all(middleware.ensureAuthenticated)
  .get(appointments.getByUser)
  .post(middleware.sanitizeRequestBody, appointments.create);

router.route('/appointments/all')
  .all(middleware.ensureAuthenticated)
  .get(appointments.getAll)

router.route('/appointments/:id')
  .all(middleware.ensureAuthenticated)
  .get(appointments.getById)
  .put(middleware.sanitizeRequestBody, appointments.update)
  .patch(middleware.sanitizeRequestBody, appointments.update)
  .delete(appointments.delete);

// --
module.exports.router = router;