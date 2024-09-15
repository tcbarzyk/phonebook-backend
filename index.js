const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :data'))
app.use(express.static('dist'))

morgan.token('data', (request, response) => {
    if (request.method === 'POST') {
        return JSON.stringify(request.body)
    }
    else return ''
})

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
]

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} people. </p>
        <p>${new Date()}</p>
        `)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const id = (Math.random()*100000) + 1
    const body = request.body
    if (!body.name || !body.number) {
        response.status(400).send('error: name or number not present')
    }
    if (persons.find(p => p.name === body.name)) {
        response.status(400).send('error: person already in phonebook')
    }
    else {
        const person = {
            name: body.name,
            number: body.number,
            id: String(id)
        }
    
        persons = persons.concat(person)
    
        response.json(person)
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})