require('dotenv').config();
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const Persons = require("./models/person")

const app = express()
app.use(express.json())
app.use(cors())
morgan.token('type', function (req, res) {return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))
app.use(express.static('dist'))

const badRequest = (response, message) => response.status(400).json({error: message}) 
const notFound = (response, message) => response.status(404).send(message ? {error: message} : null)

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError')
        return badRequest(response, 'malformatted id')
    else if (error.name === 'ValidationError')
        return badRequest(response, error.message)

    next(error)
}

app.get("/api/persons", (request, response) => {
    Persons.find({}).then(persons => {
        response.json(persons)
    })
})

app.get("/info", (request, response) => {
    date = new Date()
    Persons.find({})
    .then(persons => {
        string = `
        <p>Phonebook has info por ${persons.length} people</p>
        <p>${date.toString()}</p>
        `
        response.send(string)
    })
})

app.get("/api/persons/:id", (request, response, next) => {
    const id = request.params.id
    Persons.findById(id).then(found => {
        if (found === null)
            return notFound(response)
        response.json(found)})
    .catch(er => next(er))
})

app.post("/api/persons", (request, response, next) => {
    body = request.body
    
    if (!body.name || !body.number)
        return badRequest(response, "name or number missing")
    
    Persons.find({name: body.name}).then(p => {
        if (p.length !== 0)
            return badRequest(response, "name must be unique")

        const person = new Persons({
            name: body.name,
            number: body.number
        })    

        person.save().then(result => response.json(result))
        .catch(er => next(er))
    })
})


app.delete("/api/persons/:id", (request, response, next) => {
    const id = request.params.id
    Persons.findByIdAndDelete(id).then(data => {
        if (data)
            response.json(data)
        else
            return badRequest(response, `Person with ID ${id} already deleted from server`)
    })
    .catch(er => next(er))
})

app.put("/api/persons/:id", (request, response, next) => {
    const id = request.params.id

    const name = request.body.name
    const number = request.body.number

    const person = {
        name: name,
        number: number
    }

    Persons.findByIdAndUpdate(id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => response.json(updatedPerson))
    .catch(er => next(er))
})

const PORT = 3001
app.use(errorHandler)
app.listen(PORT, () => console.log("App running"))


