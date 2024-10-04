const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema( {
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 4) {
    const person = new Person({
        name: process.argv[2],
        number: process.argv[3]
    })

    person.save().then(result => {
        console.log('person saved')
        mongoose.connection.close()
    })
}
else {
    Person.find({}).then(result => {
        result.forEach(p => console.log(p))
        mongoose.connection.close()
    })
}