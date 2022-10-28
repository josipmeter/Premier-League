import express from 'express';
import path from 'path';
import { auth, requiresAuth } from 'express-openid-connect'; 
import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()

const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 4080;

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: externalUrl || `https://localhost:${port}`,
  clientID: 'LvuYKUd63kumjsBt7gTOeETUGF0Pp5Vz',
  issuerBaseURL: 'https://dev-rnrkynepkbpmq6qo.us.auth0.com'
};

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: 'web2demo',
//   password: process.env.DB_PASSWORD,
//   port: 5432,
//   ssl : true
// })

const connectionString = 'postgres://premier_league_db_user:CWur2el7K0gceJumVRxpeE2LqYicL8XS@dpg-cdc3pg4gqg48t041h210-a.frankfurt-postgres.render.com/premier_league_db'

const pool = new Pool({
  connectionString,
})

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug")

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));


app.get('/',  function (req, res) {
  let username : string | undefined;
  if (req.oidc.isAuthenticated()) {
    username = req.oidc.user?.name ?? req.oidc.user?.sub;
  }
  res.render('index', {username});
});

app.get('/newmatch',  function (req, res) {
  res.render('newmatch');
});

app.get('/add',  function (req, res) {
  res.send('Added')
});

// app.get('/', function(req, res) {
//   req.oidc.isAuthenticated() ? res.sendFile(path.join(__dirname, 'views/logged.html')) : res.sendFile(path.join(__dirname, 'views/index.html'));
// });

// req.isAuthenticated is provided from the auth router
// app.get('/login', (req, res) => {
//   res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
// });

if (externalUrl) {
  const hostname = '127.0.0.1';
  app.listen(port, hostname, () => {
  console.log(`Server locally running at http://${hostname}:${port}/ and from outside on ${externalUrl}`);
  });
}
else{
  app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
})}

export async function getComments() {
  const comments : string[] = [];
  const results = await pool.query('SELECT id, comment from comments');
  results.rows.forEach(r => {
  comments.push(r["comment"]);
  });
  return comments;
}