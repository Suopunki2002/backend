const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

require('dotenv').config();
const Person = require('./models/person');

const app = express();

app.use(express.json());
app.use(express.static('dist'));
app.use(cors());
morgan.token('data', (req, res) => { return JSON.stringify(req.body) });
app.use(morgan(
  ':method :url :status :res[content-length] - :response-time ms :data'
));

app.get('/info', (request, response) => {
  const personCount = `Phonebook has info for ${persons.length} people`;
  const date = new Date().toUTCString();
  response.send(`<p>${personCount}</p><p>${date}</p>`);
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number
  });
  
  person.save().then(savedPerson => {
    response.json(savedPerson);
  });
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    console.log(persons);
    response.json(persons);
  });
});

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      console.log(person);
      response.json(person);
    });
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  persons = persons.filter(p => p.id !== id);
  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
