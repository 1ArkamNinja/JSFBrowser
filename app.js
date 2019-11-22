const express = require('express'); //Load express framework module
const app = express(); //create an instance of express named "app"
const path = require('path'); //create an instance of the express direcrory handler
const request = require('request'); // For making API requests

const bodyParser = require('body-parser'); //Parses data from http request bodies
//Set up bodyParser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//Set up PUG view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static("public"));


app.listen(3000, function() {
  console.log('Listening on port ' + 3000 + '.');
});

app.get('/', function(req, res, err) {
  res.status(200).render('index');
});

app.post('/search', function(req, res, err) {
  request('http://localhost:3001/api/v0/search/' + req.body.search, function(request_err, request_res, request_body) {
    if (request_err || request_res.statusCode != 200) {
      res.send("Oops! There was a problem with the request module: <br>" + request_err);
    } else if (request_body == "undefined") {
      res.send("Oops! Server had no fighters!");
    } else {
      res.status(200).render('listfighters', {list: JSON.parse(request_body)});
    }
  })
});

app.get('/list/fighters', function(req, res, err) {
  request('http://localhost:3001/api/v0/list/all', function(request_err, request_res, request_body) {
    if (request_err || request_res.statusCode != 200) {
      res.send("Oops! There was a problem with the request module: <br>" + request_err);
    } else if (request_body == "undefined") {
      res.send("Oops! Server had no fighters!");
    } else {
      res.status(200).render('listfighters', {list: JSON.parse(request_body)});
    }
  })
});

app.get('/list/players', function(req, res, err) {
  request('http://localhost:3001/api/v0/list/players', function(request_err, request_res, request_body) {
    if (request_err || request_res.statusCode != 200) {
      res.send("Oops! There was a problem with the request module: <br>" + request_err);
    } else if (request_body == "undefined") {
      res.send("Oops! Server had no players!");
    } else {
      res.status(200).render('listplayers', {list: JSON.parse(request_body)});
    }
  })
});

app.get('/player/:player', function(req, res, err) {
  request('http://localhost:3001/api/v0/player/' + req.params.player, function(request_err, request_res, request_body) {
    if (request_err || request_res.statusCode != 200) {
      res.send("Oops! There was a problem with the request module: <br>" + request_err);
    } else if (request_body == "undefined") {
      res.send("Oops! Server didn't find that player in the database: <br>" + req.params.player);
    } else {
      res.status(200).render('listfighters', {list: JSON.parse(request_body)});
    }
  })
});

app.get('/fighter/:fighter', function(req, res, err) {
  request('http://localhost:3001/api/v0/fighter/' + req.params.fighter, function(request_err, request_res, request_body) {
    if (request_err || request_res.statusCode != 200) {
      res.send("Oops! There was a problem with the request module: <br>" + request_err);
    } else if (request_body == "undefined") {
      res.send("Oops! Server didn't find that fighter in the database: <br>" + req.params.fighter);
    } else {
      res.status(200).render('fighter', JSON.parse(request_body));
    }
  })
});

app.get('/add/', function(req, res, err) {
  res.status(200).render('add');
});

app.post('/add/', function(req, res, err) {
  request.post("http://localhost:3001/api/v0/fighter/", {form: {fightername: req.body.fightername, fighterID: req.body.fighterID}}, function(request_err, request_res, request_body) {
    if (request_res.statusCode == 201) {
      res.status(200).redirect("/fighter/" + req.body.fighterID);
    } else if (request_res.statusCode == 403) {
      res.status(200).redirect("/fighter/" + req.body.fighterID);
    } else {
      res.send("Error!")
    }
  })
});