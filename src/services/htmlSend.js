export function htmlSend ({ nombre, cedula, telefono }) {
  function getLastThreeChars (str) {
    str = str.toString()
    if (typeof str !== 'string') {
      console.error('Error: str is not a string')
      return
    }
    return str.slice(-3)
  }

  const cc3 = getLastThreeChars(cedula)
  const tel3 = getLastThreeChars(telefono)

  return (
    `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
        }
    
        .spa1{
          font-size: 18px;
          color: #000;
          text-align: center;
          font-weight: bold;
        }
    
        .container {
          width: 70%;
          margin: auto;
          padding: 20px;
          border: 2px solid #ddd;
          border-radius: 5px;
        }
        h1 {
          color: #444;
        }
        p {
          color: #666;
        }
        .pmain {
          font-size: 18px;
          color: #000;
          text-align: justify;
        }
        .pnombres{
          font-size: 16px;
          color: #000;
          text-align: left;
        }
        .span1{
          font-size: 18px;
          font-weight: bold;
          color: #000;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Confirmación De Cliente Fiel</h1>
    
          <h3>Información De Usuario Creada:</h3>
          <p class="pnombres"><strong>Nombre:</strong> ${nombre} | <strong>Cedula:</strong> ******${cc3} | <strong>Telefono:</strong> *****${tel3}</p>
    
          <p class="pmain">
            Estimado(a) <span class="span1">${nombre}</span>,
          
            Nos complace informarle que su solicitud para crear una cuenta de Cliente Fiel con el Grupo Empresarial Multired SA (Gane Yumbo) ha sido procesada con éxito.
          
            Como titular de una cuenta de Cliente Fiel, ahora puede acumular puntos cada vez que compre formularios de Azar (Chance). en nuestros puntos de venta autorizados en el municipio de Yumbo. 
          
            Agradecemos su preferencia y esperamos que disfrute de los beneficios de ser un Cliente Fiel.
            <br>
            <br>
            <br>
            Atentamente: <br> <br>
            <span class="spa1">Grupo Empresarial Multired SA</span>
          </p>
    
          <p>Generado automaticamente, No responder este correo.</p>
      </div>
    </body>
    </html>
    `
  )
}
