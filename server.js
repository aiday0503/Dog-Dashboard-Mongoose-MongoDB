var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

var path = require('path');
app.use(express.static(path.join(__dirname, './static')));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/basic_mongoose');
var DogSchema = new mongoose.Schema({
    name: { type: String, required: true },
    breed: { type: String, required: true }
}, { timestamps: true });

mongoose.model('Dog', DogSchema);
var Dog = mongoose.model('Dog');

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    Dog.find({}, function(err, results) {
        if (err) { console.log(err); }
        res.render('index', { dogs: results });
    });
});

// Create
app.post('/add', function(req, res) {

    Dog.create(req.body, function(err, result) {
        if (err) { console.log(err); }
        res.redirect('/')
    });
});

// New
app.get('/add', function(req, res) {
    res.render('add');
});

// Get a dog
app.get('/:id', function(req, res) {
    Dog.find({ _id: req.params.id }, function(err, response) {
        if (err) { console.log(err); }
        res.render('display', { dog: response[0] });
    });
});

// Show Edit Page
app.get('/:id/edit/', function(req, res) {
    Dog.find({ _id: req.params.id }, function(err, response) {
        if (err) { console.log(err); }
        res.render('edit', { dog: response[0] });
    })
});

// Update
app.post('/:id', function(req, res) {
    Dog.update({ _id: req.params.id }, req.body, function(err, result) {
        if (err) { console.log(err); }
        res.redirect('/');
    });
});

// Delete
app.post('/:id/delete', function(req, res) {
    Dog.remove({ _id: req.params.id }, function(err, result) {
        if (err) { console.log(err); }
        res.redirect('/');
    });
});

app.listen(8000, function() {
    console.log("listening on port 8000");
})