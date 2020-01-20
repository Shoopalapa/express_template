require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT;
const hbs = require('express-handlebars');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const apiRoutes = require('./src/routes/apiRoutes');
const basicRoutes = require('./src/routes/basicRoutes');

// use body parser
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

// set express to use handlebars view engine
app.set('view engine', 'hbs');
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultView: 'public',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/',
  helpers: {
    if_not_eq: function(a, b, opts) {
      if (a != b) {
        return opts.fn(this);
      }
    },
  },
}));

// set the db options for sessions, etc...
const dbOptions = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};
const sessionStore = new MySQLStore(dbOptions);

// Use the session middleware with mysql db
app.use(session({
  name: 'checkmate_session',
  secret: 'dogs are better than cats',
  store: sessionStore,
  cookie: {
    maxAge: 3600000, // 60 minutes
  },
  resave: false,
  saveUninitialized: false,
}));

// set up swagger
// eslint-disable-next-line max-len
app.use('/swagger',
  swaggerUi.serve,
  swaggerUi.setup(
    swaggerDocument, {
      customCss: '.swagger-ui .topbar { display: none }',
      explorer: true,
    },
  ),
);

// make the public folder visibile at /public
app.use('/public', express.static('src/public'));
// set the api routes
app.use('/api', apiRoutes);
// set the basic routes
app.use('/', basicRoutes);

// launch the app at the port specified in the env file
app.listen(port);
console.log('express template started on port number: ' + port);
