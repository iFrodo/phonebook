const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('give password as argument');
    process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://cbojio432:${password}@fullstack.fd7x33p.mongodb.net/`;
mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String
});

const Person = mongoose.model('Person', personSchema);
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('dist'));
app.use(morgan(function (tokens, req, res) {
    return (JSON.stringify(req.body)); // added for displaying POST data
}));

app.get('/api/persons/', async (req, res) => {
    try {
        const persons = await Person.find({});
        res.json(persons);
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
});

app.get('/api/persons/info', async (req, res) => {
    try {
        const count = await Person.countDocuments({});
        res.send(`Phonebook has info for ${count} people <p>${new Date()}</p>`);
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
});

app.post('/api/persons/', async (req, res) => {
    try {
        if (!req.body.name || !req.body.number) {
            return res.status(400).json({
                error: 'content missing, must be {name:"default",number:"***"}'
            });
        }

        const existingPerson = await Person.findOne({ name: req.body.name });
        if (existingPerson) {
            return res.status(409).json({
                error: 'name must be unique'
            });
        }

        const person = new Person({
            name: req.body.name,
            number: req.body.number
        });

        const savedPerson = await person.save();
        res.json(savedPerson);
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
});

app.get('/api/persons/:id', async (req, res) => {
    try {
        const person = await Person.findById(req.params.id);
        if (person) {
            res.json(person);
        } else {
            res.status(404).end();
        }
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
});

app.delete('/api/persons/:id', async (req, res) => {
    try {
        await Person.findByIdAndRemove(req.params.id);
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
