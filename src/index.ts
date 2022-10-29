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
  baseURL: externalUrl || `http://localhost:${port}`,
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

// const pool = new Pool({
//   connectionString,
// })

type Match = {
  homeTeam: string,
  awayTeam: string,
  score: string,
  date: string
}

let playedMatches: Match[] = [];

const match : Match = {
  homeTeam: "Chelsea",
  awayTeam: "Arsenal",
  score: "3 - 1",
  date: "20.10.2022"
}

playedMatches.push(match);

type Team = {
  name: string,
  points: number,
  goalDiff: number
}

let teamTable: Team[] = [{name: "Arsenal", points: 28, goalDiff: 14},{name: "Manchester City", points: 26, goalDiff: 25},
{name: "Tottenham", points: 23, goalDiff: 9},{name: "Newcastle", points: 21, goalDiff: 10},{name: "Chelsea", points: 21, goalDiff: 5},
{name: "Manchester United", points: 20, goalDiff: 0},{name: "Fulham", points: 18, goalDiff: 0},{name: "Liverpool", points: 16, goalDiff: 9},
{name: "Brighton", points: 15, goalDiff: 1},{name: "West Ham", points: 14, goalDiff: -1},{name: "Brentford", points: 14, goalDiff: -3},
{name: "Everton", points: 13, goalDiff: -1},{name: "Crystal Palace", points: 13, goalDiff: -4},{name: "Bournemouth", points: 13, goalDiff: -15},
{name: "Aston Villa", points: 12, goalDiff: -5},{name: "Southampton", points: 12, goalDiff: -8},{name: "Leicester", points: 11, goalDiff: -3},
{name: "Leeds", points: 9, goalDiff: -5},{name: "Wolverhamtpon", points: 9, goalDiff: -13},{name: "Nottingham Forest", points: 9, goalDiff: -15},]

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug")

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

app.get('/',  function (req, res) {
  let username : string | undefined;
  if (req.oidc.isAuthenticated()) {
    username = req.oidc.user?.name ?? req.oidc.user?.sub;
  }
  res.render('index', {username,playedMatches,teamTable});
});

app.get('/newmatch',  function (req, res) {
  res.render('newmatch');
});

app.post('/add',  function (req, res) {
  const newMatch : Match = {
    homeTeam: req.body.homeTeam,
    awayTeam: req.body.awayTeam,
    score: req.body.score,
    date: req.body.date
  }
  playedMatches.push(newMatch)
  res.redirect('/');
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

// pool.query(`CREATE TABLE matches (
// 	match_id serial PRIMARY KEY,
// 	home_team VARCHAR ( 50 ) NOT NULL,
// 	away_team VARCHAR ( 50 ) NOT NULL,
// 	score VARCHAR ( 20 ),
// 	date VARCHAR (50) NOT NULL,
// );`)

// pool.query(`CREATE TABLE comments (
//   user_id INT NOT NULL,
//   match_id INT NOT NULL,
//   time TIMESTAMP NOT NULL,
//   PRIMARY KEY (user_id, match_id),
//   FOREIGN KEY (match_id)
//       REFERENCES matches (role_id),
// );`)

// pool.query(`INSERT INTO matches
// values("Chelsea","Arsenal","3-1","25.10.2022.")`)

// export async function getComments() {
//   const comments : string[] = [];
//   const results = await pool.query('SELECT id, match from comments');
//   results.rows.forEach(r => {
//   comments.push(r["comment"]);
//   });
//   return comments;
// }