const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url).then(result => console.log("Connected to DB with url", url))
.catch(er => console.log('Error connecting to db',er.message))

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON',{
    transform: (document, returnedObject) => {
        console.log(returnedObject)
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports= mongoose.model('Person', personSchema) 


