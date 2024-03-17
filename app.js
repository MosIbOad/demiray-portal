const express = require('express');
const session = require('express-session');

const expbs = require('express-handlebars');
const path = require("path");
const cookieParser = require('cookie-parser');
const app = express();
const dotenv = require("dotenv");
const hbs = require('hbs');

// const config = require('./src/config.json');
const configPath = path.join(__dirname, './src/config.json');
const config = require(configPath);

// Body parser middleware'leri
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const partialDirectory = path.join(__dirname, './views/partials');
const layoutsDirectory = path.join(__dirname, './views/layouts');
hbs.registerPartials(partialDirectory);

app.set('view engine', 'hbs'); // Görünüm motoru olarak Handlebars'ı kullan
app.set('views', './views'); // Görünüm dosyalarının bulunduğu dizin
  
// Statik dosyalar için klasör
const publicDirectory = path.join(__dirname, './public');
console.log(publicDirectory);
app.use(express.static(publicDirectory));


app.use(session({
  secret: config.SESSION_SECRET_CODE, // Bu değeri güvenli ve özel tutun
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // HTTPS kullanıyorsanız, bu değeri true yapın
}));

dotenv.config({ path: './.env' });

//const secret = process.env.COOKIE_SECRET_CODE;
const secret = config.COOKIE_SECRET_CODE;

app.use(cookieParser(secret));

app.listen(config.PORT, async () => {
  console.log(`Uygulama http://localhost:${config.PORT} adresinde çalışıyor.`);
});

// Define Back
const pagesPath = path.join(__dirname, './src/pages.js');
const databasePath = path.join(__dirname, './src/database.js');
const handleBarsHelpersPath = path.join(__dirname, './src/handlebarsHelpers.js');

app.use('/', require(pagesPath));
const db = require(databasePath);
const handleBarsHelpers = require(handleBarsHelpersPath);