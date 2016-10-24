var express = require('express');
var bodyParser = require('body-parser');
var keys  = require("./config.js");
var request = require('request');
var query  = require("./query.js");
var parseString = require('xml2js').parseString;

var QPXClient = require('qpx-client');//for qpx
util = require('util');//for qpx

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname));

app.get('/', function(req,res){
  	res.send(200).end();
})

app.post('/hotels', function(req,res){
  query.city = req.body.city;
  var queryHotels = query.hotels + query.city + '&key=' + keys.google;

  request(queryHotels, function(error, resp, body){
    if(error) {
      console.log(error);
    }
    res.end(resp.body);
  })
})

app.post('/restaurants', function(req,res){
  query.city = req.body.city;
  var queryRestaurants = query.restaurants + query.city + '&key=' + keys.google;

  request(queryRestaurants, function(error, resp, body){
    if(error) {
      console.log(error);
    }
    res.end(resp.body);
  })
})

app.post('/arts', function(req,res){
  query.city = req.body.city;
  var queryArts = query.museum + query.city + '&key=' + keys.google;


  request(queryArts, function(error, resp, body){
    if(error) {
      console.log(error);
    }
    res.end(resp.body);
  })
})

app.post('/weather', function(req,res){
  query.city = req.body.city;
  var queryWeather = query.weather + query.city + '&appid=' + keys.weather;

  request(queryWeather, function(error, resp, body){
    if(error) {
      console.log(error);
    }
    res.end(body);
  })
})

app.post('/promos', function(req,res){
  query.city = req.body.city;
  var queryPromos = query.promos + keys.sqoot + '&location=' + query.city;
  request(queryPromos, function(error, resp, body){
    if(error) {
      console.log(error);
    }
    res.end(resp.body);
  })
})

app.post('/events', function(req,res){
  query.city = req.body.city;
  var queryEvents = query.events + keys.eventful + '&location=' + query.city + '&date=Future';
  request(queryEvents, function(error, resp, body){
    if(error) {
      console.log(error);
    }

    parseString(resp.body, function(err, result){
      // console.log(result);
      res.end(JSON.stringify(result));
    });

  })
})
app.post('/translate', function(req,res){
  query.text=req.body.inputText
  query.country = 'en-' + req.body.country;
  var queryTranslate = query.translate + keys.yandex + '&text=' + query.text + '&lang=' + query.country;

  request(queryTranslate, function(error, resp, body){
    if(error) {
      console.log(error);
    }
    res.end(resp.body);    
  })
})

options = { //for qpx
  key: keys.google,
  timeout: 15000
}

qpxClient = new QPXClient(options);

app.post('/flights', function(req,res){
  searchConfig = {
    body: {
      "request":{
       "passengers":{
          "adultCount": 1
        },
        "slice": [
          {
            "origin": req.body.origin,
            "destination": req.body.destination,
            "date": req.body.date
          }
        ],
        "solutions": 10
      }
    }
  }
  qpxClient.search(searchConfig, function(err,data){
    if(err){
      console.log('ERROR' + err);
    }else{
      res.send(data);
    }
  })

});

options = { //for qpx
  key: keys.google,
  timeout: 15000
}

qpxClient = new QPXClient(options);

app.post('/flights', function(req,res){
  searchConfig = {
    body: {
      "request":{
       "passengers":{
          "adultCount": 1
        },
        "slice": [
          {
            "origin": req.body.origin,
            "destination": req.body.destination,
            "date": req.body.date
          }
        ],
        "solutions": 10
      }
    }
  }
  qpxClient.search(searchConfig, function(err,data){
    if(err){
      console.log('ERROR' + err);
    }else{
      res.send(data);
    }
  })

});





app.listen(process.env.PORT || 3000)

