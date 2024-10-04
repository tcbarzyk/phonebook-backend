//import mongoose
const mongoose = require('mongoose')

//get databse url
const url = process.env.MONGODB_URI

//strictQuery off for more flexibility
mongoose.set('strictQuery', false)

//connect to databse
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB', error.message)
    })

//create Schema of person
const personSchema = new mongoose.Schema( {
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: function(v) {
                return /\d{3}-\d{3}-\d{4}/.test(v)
            },
            message: n => `${n.value} is not a valid phone number`
        },
        required: true
    }
})

//update toJSON method to return id in String format
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

//export mongoose model
module.exports = mongoose.model('Person', personSchema)