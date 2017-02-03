// require express
var express = require("express");
// path module -- try to figure out where and why we use this
var path = require("path");
// create the express app
var app = express();
var bodyParser = require('body-parser');
// use it!
app.use(bodyParser.urlencoded({ extended: true }));
// static content
app.use(express.static(path.join(__dirname, "./static")));
// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// root route to render the index.ejs view

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/basic_mongoose');
var MongooseSchema = new mongoose.Schema({
  name: String,
  color: String,
  age: Number
})
var Mongoose = mongoose.model('Mongoose', MongooseSchema);

app.get('/', function(req, res) {
  Mongoose.find({}, function(err, results) {
    if (err) { console.log(err); }
    res.render('index', { mongooses: results });
  })
})
// post route for adding a user
app.post('/', function(req, res) {
  Mongoose.create(req.body, function(err, result) {
    if(err) {console.log(err)}
    res.redirect('/')
  })
})
app.get('/new', function(req,res){
  res.render('new')
})

app.get('/mongooses/:id', function(req, res) {
  Mongoose.find({ _id: req.params.id }, function(err, response) {
    if (err) { console.log(err); }
    res.render('show', { mongoose: response[0] });
  });
})

app.get('/:id/edit', function(req, res) {
  Mongoose.find({ _id: req.params.id }, function(err, response) {
    if (err) { console.log(err); }
    res.render('edit', { mongoose: response[0] });
  })
});

app.post('/:id', function(req, res) {
  Mongoose.update({_id: req.params.id},req.body, function(err, result) {
    if (err) { console.log(err); }
    res.redirect('/');
  })
})

app.post('/:id/delete', function(req, res) {
  Mongoose.remove({_id: req.params.id}, function(err, result) {
    if (err) { console.log(err); }
    res.redirect('/');
  })
})

// tell the express app to listen on port 8000
app.listen(8000, function() {
  console.log("listening on port 8000");
});
