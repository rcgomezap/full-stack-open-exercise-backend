const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(cors())
// app.use(morgan('tiny'))
morgan.token('type', function (req, res) {return JSON.stringify(req.body) })
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))
app.use(express.static('dist'))

data = [
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

const badRequest = (response,message) => response.status(400).json({error: message}) 


app.get("/api/persons", (request,response) => {
    response.json(data)
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
    found = data.find((p) => p.id === id)
    found ? response.json(found) : response.status(404).send()
})

app.post("/api/persons", (request,response) => {
    body = request.body
    // console.log(body.name);
    // console.log(body.number);
    
    if (!body.name || !body.number)
        return badRequest(response,"name or number missing")
    
    if (data.find((p) => p.name === body.name))
        return badRequest(response,"name must be unique")

    const person = {
        id: Math.floor(Math.random()*100000)  ,
        name: body.name,
        number: body.number
    }

    data.push(person)

    response.json(data)

    
})


app.delete("/api/persons/:id", (request,response) => {
    const id = request.params.id
    data = data.filter((p) => p.id != id) 
    response.json(data)
})

const PORT = 3001
app.listen(PORT, () => console.log("App running"))


