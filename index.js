const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const Person = require('./models/person');

const app = express();

app.use(express.static('dist'));
app.use(express.json());
app.use(cors());
morgan.token('data', (req, res) => { return JSON.stringify(req.body) });
app.use(morgan(
  ':method :url :status :res[content-length] - :response-time ms :data'
));

app.get('/info', (request, response, next) => {
  Person.countDocuments({}).then(count => {
    const personCount = `Phonebook has info for ${count} people`;
    const date = new Date().toUTCString();
    response.send(`<p>${personCount}</p><p>${date}</p>`);
  }).catch(error => next(error));
});

app.post('/api/persons', (request, response, next) => {
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
  }).catch(error => next(error));
});

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons);
  }).catch(error => next(error));
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  }).catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndDelete(request.params.id)
    .then(result => response.status(204).end())
    .catch(error => next(error));
});

const unknownEndPoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndPoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});