require('dotenv').config();
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const Persons = require("./models/person")

const app = express()
app.use(express.json())
app.use(cors())
// app.use(morgan('tiny'))
morgan.token('type', function (req, res) {return JSON.stringify(req.body) })
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))
app.use(express.static('dist'))

const badRequest = (response,message) => response.status(400).json({error: message}) 
const notFound = (response, message) => response.status(404).send(message ? {error: message} : null)


app.get("/api/persons", (request,response) => {
    Persons.find({}).then(persons => {
        response.json(persons)
    })
})

app.get("/info", (request,response) => {
    date = new Date()
    string = `
    <p>Phonebook has info por ${data.length} people</p>
    <p>${date.toString()}</p>
    `
    response.send(string)
})

app.get("/api/persons/:id", (request,response) => {
    const id = request.params.id
    Persons.findById(id).then(found => {
        if (found === null)
            return notFound(response)
        response.json(found)})
    .catch(er => {
        return notFound(response,'malformatted ID')
    })
})

app.post("/api/persons", (request,response) => {
    body = request.body
    // console.log(body.name);
    // console.log(body.number);
    
    if (!body.name || !body.number)
        return badRequest(response,"name or number missing")
    
    // if (data.find((p) => p.name === body.name)) // TODO
    //     return badRequest(response,"name must be unique")

    const person = new Persons({
        name: body.name,
        number: body.number
    })    

    person.save().then(result => response.json(result))
})


app.delete("/api/persons/:id", (request,response) => {
    const id = request.params.id
    Persons.findByIdAndDelete(id).then(data => response.json(data))
})

const PORT = 3001
app.listen(PORT, () => console.log("App running"))


