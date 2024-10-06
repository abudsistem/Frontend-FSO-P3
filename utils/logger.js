const info = (...params) => {
    console.log(...params) // resgistros nommales
  }
  
  const error = (...params) => {
    console.error(...params) //mensajes de error
  }
  
  module.exports = {
    info, error
  }