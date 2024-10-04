import mongoose from 'mongoose'

// ejecuta node mongo.js 'y la contrasena'

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]


//const url =
//  `mongodb+srv://fullstack:${password}@cluster0.dvseu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const url = process.env.MONGODB_URI

console.log('conecting to', url );

mongoose.set('strictQuery',false)
mongoose.connect(url).then(()=> {
  const noteSchema = new mongoose.Schema({
//    content: String,
    content: {
      type: String,
      minLength: 5,
      required: true
    },
    important: Boolean,
  })
  
  const Note = mongoose.model('Note', noteSchema)

  const note = new Note({
    content: 'HTML is easy x ',
    important: true,
  })
/*
note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
*/

  Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
})