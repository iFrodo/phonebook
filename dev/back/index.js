const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/Person.ts')

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('dist'));
app.use(morgan(function (tokens, req, res) {
    return (JSON.stringify(req.body)); // added for displaying POST data
}));

app.get('/api/persons/', async (req, res, next) => {
    try {
        const persons = await Person.find({}).then();
        res.json(persons);
    } catch (error) {
        next(error)
        console.error(error);
        res.status(500).end();
    }
});

app.get('/api/persons/info', async (req, res, next) => {
    try {
        const count = await Person.countDocuments({});
        res.send(`Phonebook has info for ${count} people <p>${new Date()}</p>`);
    } catch (error) {
        next(error)
        console.error(error);

    }
});

app.post('/api/persons/', async (req, res, next) => {
    try {
        if (!req.body.name || !req.body.number || req.body.name.length < 3) {
            return res.status(400).json({
                error: 'content missing, must be {name:"length > 3 ",number:"length > 3 "}'
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
        next(error)
    }
});
app.get('/api/persons/:id', async (req, res, next) => {
    try {
        const person = await Person.findById(req.params.id);
        if (person) {
            res.json(person);
        } else {
            res.status(404).end();
        }
    } catch (error) {
        next(error)
    }
});
app.put('/api/persons/:id', async (req, res, next) => {
    const { name, number } = req.body
    try {
        const updatedPerson = await Person.findByIdAndUpdate(
            req.params.id,
            { name, number },
            { new: true, runValidators: true, context: 'query' }
        );

        if (updatedPerson) {
            res.json(updatedPerson);
        } else {
            res.status(404).send({ error: 'Person not found' });
        }
    } catch (error) {
        next(error)

    }
});
app.delete('/api/persons/:id', async (req, res, next) => {
    try {
        const person = await Person.findById(req.params.id);
        if (person) {
            await Person.findByIdAndDelete(req.params.id);
            res.status(204).end();
        } else {
            res.status(404).send({ error: 'unknown endpoint' });
        }
    } catch (error) {
        next(error)
    }
});
// const unknownEndpoint = (request, response) => {
//     response.status(404).send({ error: 'unknown endpoint' });
// };
// app.use(unknownEndpoint);

// this has to be the last loaded middleware, also all the routes should be registered before this!
const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error) {
        return response.status(400).json({ error: `шото поломалось,${error.message}` })
    }

    next(error)
}
app.use(errorHandler)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
