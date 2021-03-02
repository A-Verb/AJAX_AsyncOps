const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const {movies} = require('./models/movies');

const port = 8080;
const server = `http://localhost:${port}`;
app.listen(port,() =>console.log(`Server is running at: ${server}`));

//CORS - cross origin resource sharing
app.use(cors());

//encode document
app.use(bodyParser.urlencoded({extended: false}));

//parsing json 
app.use(bodyParser.json());



//APIs and rest code

app.get('/', (req,res) => {
  res.send("It's working");
});

//GET ALL records /api/
app.get('/api/',(req, res) => {
    res.json(movies);
});

//GET ONE record: /api/:id
app.get('/api/:id', (req, res) => {
    let id = req.params.id;
    let record = "No Record Found."; 
    //if found record, return index position
    //else return -1
    let index = movies.findIndex( (movie) => movie.id==id );

    if(index != -1) {
      record = movies[index];  
    }
    //Return as an array
    res.json([record]);   
});

//DELETE ONE Record     /api/id
app.delete('/api/:id', (req, res) => {
   let id = req.params.id;
    let record = "No Record Found."; 
    //if found record, return index position
    //else return -1
    let index = movies.findIndex( (movie) => movie.id == id );

    if(index != -1) {
        movies.splice(index,1);
        message = "Record Deleted."
    }

    //res.json([record]); 
    res.json(message);
});

//DELETE ALL Records    /api/
app.delete('/api/', (req, res) => {
    movies.splice(0);
    res.json('All Records Deleted.');
});

//POST - Inserting a new record:  /api/
app.post('/api/',(req,res) => {
    let newMovie = req.body;
    movies.push(newMovie);
    res.json("New Movie Added.");
});

// PUT - Updating an existing record:   /api/:id
app.put('/api/:id', (req, res) => {
  let message = "No Record Found";
  let newMovie = req.body;
  let id = req.params.id;
  let index = movies.findIndex( movie => movie.id == id );

    if(index != -1) {
        movies[index] = newMovie;
        message = "Record Updated.";
    }
    res.json(message);
});
