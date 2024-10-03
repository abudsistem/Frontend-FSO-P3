//const mongoose = require('mongoose')
import mongoose from "mongoose"

mongoose.set('strictQuery', false)

//Esto deberia funcionar pero no va
//const url = process.env.MONGODB_URI

// Esto es peligroso no se debe hacer
//pero si no esta asi no funciona
const url = "mongodb+srv://fullstack:fullstackpassword@cluster0.dvseu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
const Note = mongoose.model('Note', noteSchema);
export default Note;