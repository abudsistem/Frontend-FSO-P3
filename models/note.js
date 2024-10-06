//const mongoose = require('mongoose')  // Comentar: Usado en versiones más antiguas de Node.js. Reemplazado por import.
import mongoose from "mongoose"        // Importa 'mongoose' para manejar la conexión y los modelos de MongoDB.

mongoose.set('strictQuery', false)     // Desactiva el modo 'strictQuery' para permitir consultas más flexibles.

// Esto debería funcionar pero no va
//const url = process.env.MONGODB_URI  // Intenta obtener la URL de la base de datos de las variables de entorno.

// Esto es peligroso no se debe hacer
//pero si no esta asi no funciona
const url = "mongodb+srv://fullstack:fullstackpassword@cluster0.dvseu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
// **ALERTA**: Esta URL de conexión incluye el nombre de usuario y la contraseña en texto plano. Esto es muy inseguro, ya que puede ser expuesto en el código fuente, repositorios, o logs. Siempre debes usar variables de entorno (como `process.env.MONGODB_URI`) para almacenar credenciales sensibles.

// Verifica que la aplicación está intentando conectarse a la URL especificada.
console.log('connecting to', url)

mongoose.connect(url)                  // Intenta conectarse a la base de datos utilizando la URL proporcionada.
  .then(result => {                    // Si la conexión es exitosa, imprime un mensaje de confirmación.
    console.log('connected to MongoDB')
  })
  .catch(error => {                    // Si hay un error en la conexión, captura y muestra el mensaje de error.
    console.log('error connecting to MongoDB:', error.message)
  })

// Definición del esquema de Mongoose para los documentos 'Note'.
const noteSchema = new mongoose.Schema({
  content: String,                     // Campo 'content' de tipo String.
  important: Boolean,                  // Campo 'important' de tipo Boolean.
})

// Ajusta el método 'toJSON' del esquema para modificar la representación del documento cuando se convierte a JSON.
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => { // Se ejecuta cada vez que un documento se convierte a JSON.
    returnedObject.id = returnedObject._id.toString()  // Convierte '_id' a 'id' y lo transforma en una cadena.
    delete returnedObject._id           // Elimina el campo '_id'.
    delete returnedObject.__v           // Elimina el campo '__v' (versión interna de Mongoose).
  }
})

const Note = mongoose.model('Note', noteSchema);  // Crea el modelo 'Note' basado en el esquema 'noteSchema'.
export default Note;                             // Exporta el modelo 'Note' para su uso en otros módulos.
