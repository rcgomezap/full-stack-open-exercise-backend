const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url).then(result => console.log("Connected to DB with url", url))
.catch(er => console.log('Error connecting to db',er.message))

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        required: true,
        validate: {
            validator: (n) => /^\d{2,3}-\d+$/.test(n),
            message: props => `${props.value} is not a valid number` 
        }
    }
})

personSchema.set('toJSON',{
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports= mongoose.model('Person', personSchema) 


