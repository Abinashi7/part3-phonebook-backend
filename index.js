const e = require('express');
const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(express.json());
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(
    morgan(function (tokens, req, res) {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms',
            JSON.stringify(req.body)
        ].join(' ')
    })
)

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/api/persons', (req, res) => {
    console.log("req is =============>", req.body);
    res.json(persons);
});

app.get('/api/info', (req, res) => {
    const date = new Date();
    res.send(`Phonebook has info for ${persons.length} people <br> ${date}`);
});

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.find(p => p.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).end("User not found");
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    persons = persons.filter(p => p.id !== id);
    res.status(204).end()
});

const generateId = () => {
  return Math.floor(Math.random() * 1000000).toString();
}

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: "name or number is missing"
        });
    }
    if (persons.find(p => p.name === body.name)) {
        return res.status(400).json({
            error: "name must be unique"
        });
    }
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person);
    res.json(person);
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
})