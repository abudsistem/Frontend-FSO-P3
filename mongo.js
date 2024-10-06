import mongoose from 'mongoose'  // Importa el módulo 'mongoose' para interactuar con MongoDB.

// Ejecuta el script usando el comando: node mongo.js 'la contraseña'.

if (process.argv.length < 3) {   // Verifica si el número de argumentos es menor a 3 (lo que indica que no se pasó la contraseña).
  console.log('give password as argument')  // Muestra un mensaje si no se proporciona una contraseña.
  process.exit(1)               // Termina el proceso con un código de salida 1 (error).
}

const password = process.argv[2]  // Obtiene la contraseña del tercer argumento proporcionado en la línea de comandos.

const url = process.env.MONGODB_URI  // Obtiene la URL de conexión a MongoDB desde las variables de entorno.

console.log('conecting to', url );   // Imprime la URL de conexión a la base de datos en la consola.

mongoose.set('strictQuery', false)   // Desactiva el modo 'strictQuery' para mayor flexibilidad en las consultas.
mongoose.connect(url)                // Conecta a la base de datos utilizando la URL proporcionada.
  .then(() => {                      // Si la conexión es exitosa, se ejecuta esta parte del código.

    // Definición del esquema para las notas.
    const noteSchema = new mongoose.Schema({
      content: {
        type: String,              // Define el tipo de dato 'String' para el campo 'content'.
        minLength: 5,              // Especifica que 'content' debe tener al menos 5 caracteres.
        required: true             // Indica que 'content' es un campo obligatorio.
      },
      important: Boolean,           // Define el tipo 'Boolean' para el campo 'important'.
    })

    const Note = mongoose.model('Note', noteSchema)  // Crea el modelo 'Note' basado en el esquema 'noteSchema'.

    const note = new Note({           // Crea una nueva instancia del modelo 'Note' con datos predefinidos.
      content: 'HTML is easy x ',      // El contenido de la nota.
      important: true,                 // La importancia de la nota.
    })

/*
    note.save().then(result => {      // (Comentado) Guarda la nota en la base de datos.
      console.log('note saved!')      // Imprime un mensaje confirmando que la nota fue guardada.
      mongoose.connection.close()     // Cierra la conexión a la base de datos.
    })
*/

    Note.find({}).then(result => {    // Encuentra todas las notas en la base de datos.
      result.forEach(note => {        // Itera sobre el resultado y imprime cada nota.
        console.log(note)             
      })
      mongoose.connection.close()     // Cierra la conexión a la base de datos una vez que ha terminado.
    })
  })
