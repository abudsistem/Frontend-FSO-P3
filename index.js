import express from 'express'   // Importa el módulo 'express' para manejar la lógica del servidor web.
import cors from 'cors'         // Importa el módulo 'cors' para permitir solicitudes de dominios cruzados (cross-origin).
//import mongoose from 'mongoose'; // Comentar: el módulo 'mongoose' para interactuar con MongoDB (no está en uso en este código).

const app = express()           // Crea una aplicación de Express.

import Note from './models/note.js'; // Importa el modelo 'Note' desde el archivo 'note.js' para interactuar con la base de datos.
//require('dotenv').config()     // Comentar: Cargar variables de entorno desde un archivo .env.
import dotenv from 'dotenv'      // Importa dotenv para manejar variables de entorno.
dotenv.config();                 // Carga las variables de entorno del archivo '.env'.

/* 
let notes = [                  // (Comentado) Array de ejemplo con notas predefinidas.
 {
    id: 1,                      // ID de la nota.
    content: "HTML is easy",     // Contenido de la nota.
    important: true              // Indica si la nota es importante o no.
  },
  ...
]
*/

app.use(express.static('dist'))  // Sirve archivos estáticos desde el directorio 'dist'.

// Middleware que registra las solicitudes al servidor.
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)  // Imprime el método HTTP de la solicitud.
  console.log('Path:  ', request.path)    // Imprime la ruta de la solicitud.
  console.log('Body:  ', request.body)    // Imprime el cuerpo de la solicitud (si lo tiene).
  console.log('---')                      // Imprime una línea divisoria.
  next()                                  // Llama a la siguiente función en la pila de middleware.
}

// Middleware para manejar errores.
const errorHandler = (error, request, response, next) => {
  console.error(error.message)  // Imprime el mensaje de error en la consola.

  if (error.name === 'CastError') { // Si el error es de tipo 'CastError', responde con un estado 400 (solicitud incorrecta).
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)                    // Si no es un 'CastError', pasa el error al siguiente middleware.
}

app.use(cors())                  // Habilita el middleware CORS para permitir solicitudes de otros orígenes.
app.use(express.json())           // Middleware que convierte el cuerpo de las solicitudes a JSON.
app.use(requestLogger)            // Añade el middleware 'requestLogger' para registrar las solicitudes.

const unknownEndpoint = (error, request, response, next) => {
  console.error(error.message)   // Imprime el mensaje de error en la consola.

  if (error.name === 'CastError') {  // Si el error es de tipo 'CastError', responde con un estado 400.
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') { // Si es un 'ValidationError', responde con un estado 400 y el mensaje del error.
    return response.status(400).json({ error: error.message })
  }

  next(error)                    // Si no coincide con los errores anteriores, pasa al siguiente middleware.
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')  // Ruta GET para la página principal, responde con un mensaje "Hello World!".
})

app.get('/api/notes', (request, response) => {
  //response.json(notes)         // Comentar: Esta línea responde con un array estático.
  Note.find({}).then(notes => {   // Busca todas las notas en la base de datos y las devuelve como respuesta.
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {  // Ruta GET que busca una nota por ID.
  Note.findById(request.params.id)
      .then(note => {
        if (note) {                // Si la nota existe, responde con ella.
          response.json(note)
        } else {                   // Si no, responde con un estado 404 (no encontrada).
          response.status(404).end()
        }
      })
      .catch(error => next(error))  // Si ocurre un error, lo pasa al siguiente middleware de manejo de errores.
})

app.post('/api/notes', (request, response, next) => {  // Ruta POST para agregar una nueva nota.
  const body = request.body

  if (body.content === undefined) {   // Si no se envía el contenido de la nota, responde con un estado 400.
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = new Note ({            // Crea una nueva instancia del modelo Note con los datos proporcionados.
    content: body.content,
    important: body.important || false, // Si 'important' no está definido, se asigna como 'false'.
  })

  note.save().then(savedNote => {     // Guarda la nueva nota en la base de datos.
    response.json(savedNote)          // Responde con la nota guardada.
  })
  .catch(error => next(error))        // Si ocurre un error, lo pasa al middleware de errores.
})

app.delete('/api/notes/:id', (request, response, next) => {  // Ruta DELETE que elimina una nota por su ID.
  Note.findByIdAndDelete(request.params.id)   // Busca y elimina la nota en la base de datos.
    .then(result => {
      response.status(204).end()              // Si se elimina correctamente, responde con un estado 204 (sin contenido).
    })
    .catch(error => next(error))              // Si ocurre un error, lo pasa al middleware de errores.
})

app.put('/api/notes/:id', (request, response, next) => {  // Ruta PUT para actualizar una nota por ID.
  const {content, important }= request.body               // Desestructura el contenido y la importancia del cuerpo de la solicitud.

  Note.findByIdAndUpdate(                                 // Busca y actualiza la nota en la base de datos.
    request.params.id, 
    {content, important},                                 // Actualiza solo los campos de 'content' e 'important'.
    { new: true, runValidators: true, context: 'query'}   // Configura la opción para devolver la nota actualizada.
  )
    .then(updatedNote => {                                // Si la actualización es exitosa, responde con la nota actualizada.
      response.json(updatedNote)
    })
    .catch(error => next(error))                          // Si ocurre un error, lo pasa al middleware de errores.
})

app.use(unknownEndpoint)      // Middleware para manejar rutas no encontradas.
app.use(errorHandler)         // Middleware para manejar errores.

const PORT = process.env.PORT  // Obtiene el puerto de las variables de entorno.
app.listen(PORT, () => {       // Inicia el servidor en el puerto especificado.
  console.log(`Server running on port ${PORT}`) // Muestra un mensaje en la consola cuando el servidor está en ejecución.
})
