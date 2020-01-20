const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const authFunctions = require('../middleware/authenticate');

// add the auth middleware
router.all('*', authFunctions.checkAuthMiddleware);

router.get('/', (req, res) => {
  res.redirect('/swagger');
});
router.get('/route', (req, res) => {
  res.status(200).send('test');
});
router.use((req, res) => {
  res.redirect('/swagger');
});

module.exports = router;