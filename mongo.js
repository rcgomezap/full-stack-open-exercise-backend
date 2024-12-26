const mongoose = require('mongoose')

if (process.argv.length < 3){
    console.log('You must specify a passsord')
    process.exit(1)
}

const pass = process.argv[2]

const url = `mongodb+srv://rcgomeza:${pass}@cluster0.rtp7h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person',personSchema)

if (process.argv.length === 3){
    Person.find({}).then(people => {
        console.log('Phonebook')
        people.forEach(person => console.log(`${person.name} ${person.number}`))
        mongoose.connection.close()
    })
} else {

    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(result => {
        console.log(`Added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    }).catch(() => {
        console.log('Error')
        mongoose.connection.close()
    })
}