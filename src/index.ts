import express from 'express';
import path from 'path';
import { auth, requiresAuth } from 'express-openid-connect'; 

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:3000',
  clientID: 'LvuYKUd63kumjsBt7gTOeETUGF0Pp5Vz',
  issuerBaseURL: 'https://dev-rnrkynepkbpmq6qo.us.auth0.com'
};

const app = express();
app.set("views", path.join(__dirname, "views"));


// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

app.get('/', function(req, res) {
  req.oidc.isAuthenticated() ? res.sendFile(path.join(__dirname, 'views/logged.html')) : res.sendFile(path.join(__dirname, 'views/index.html'));
});

// req.isAuthenticated is provided from the auth router
app.get('/login', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
})