//import required modules
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

//create app
const app = express()

//person model from mongoose
const Person = require('./models/person')

//allow for requests from all origins
app.use(cors())

//allow for requests to process json
app.use(express.json())

//for logging
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :data'))

//for distribution
app.use(express.static('dist'))

//create custom morgan token to allow for logging of json data
morgan.token('data', (request, response) => {
    if (request.method === 'POST') {
        return JSON.stringify(request.body)
    }
    else return ''
})

//gets person by id
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(p => {
        if (p) {
            response.json(p)
        }
        else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

//get all persons
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

//get phonebook info
app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        response.send(`
            <p>Phonebook has info for ${persons.length} people. </p>
            <p>${new Date()}</p>
            `)
    })
})

//delete person by id
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(result =>
        response.status(204).end()
    )
    .catch(error => next(error))
})

//update person by id
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).send({error: 'name or number not present'})
    }

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true, runValidators: true, context: 'query'})
        .then(p => {
            response.json(p)
        })
        .catch(error => next(error))
})

//add new person
app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).send({error: 'name or number not present'})
    }
    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(p => {
         response.json(p)
    })
    .catch(error => next(error))
})

//error handler middlware
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
  
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})