const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())

app.use(morgan(function (tokens, req, res) {
    return (JSON.stringify(req.body))// добавлено для отображения данных POST

}))

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
// app.use(requestLogger)

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]


app.get('/api/persons/', (req, res) => {
    res.json(persons)

})
app.get('/api/persons/info', (req, res) => {
    res.send(`Phonebook has info for ${persons.length} peaple <p>${new Date()}</p>`)

})
app.post('/api/persons/', (req, res) => {
    try {
        if (!req.body.name || !req.body.number) {
            return res.status(400).json({
                error: 'content missing, must be {name:"default",number:"***"}'
            })
        }
        if (persons.find(e => e.name === req.body.name)) {
            return res.status(409).json({
                error: 'name must be unique'
            })
        }

        const personBody = {
            "id": persons.length + 1,
            "name": req.body.name,
            "number": req.body.number
        }

        persons = persons.concat(personBody)
        res.json(personBody)

    } catch (error) {
        res.status(500).end('error')
    }
})
app.get('/api/persons/:id', (req, res) => {
    try {
        const id = Number(req.params.id)
        const person = persons.find(el => el.id === id)
        if (person) {
            res.json(person)
        } else {
            res.statusMessage = "Note is not defined";
            res.status(404).end('Note not found')
        }
    } catch (error) {
        res.status(500).end('error')
    }
})
app.delete('/api/persons/:id', (req, res) => {
    try {
        const id = Number(req.params.id)
        if (id) {
            persons = persons.filter(el => el.id !== id)
            res.statusMessage = `Note was deleted`;
            res.status(204).end('deleted')
        } else {
            res.statusMessage = "Note is not defined";
            res.status(404).end('Note not found')
        }
    } catch (error) {
        res.status(500).end('error')
    }


})
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// app.use(unknownEndpoint)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})