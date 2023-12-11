export function htmlCreatedUser ({ nombre, cedula, telefono }) {
  function lastThreeLetters (str) {
    return str.slice(-3)
  }

  const redCedula = lastThreeLetters(cedula.toString())
  const redTelefono = lastThreeLetters(telefono.toString())

  return (
        `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Información de Usuario Creada</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
    
        main {
          max-width: 800px;
          margin: 0 auto;
          background-color: #fff;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
        }
    
        h1 {
          color: #444;
        }
    
        article {
          margin-top: 20px;
          font-size: 1.1rem;
        }
    
        p {
          line-height: 1.6;
          color: #666;
        }
    
        span {
          font-weight: bold;
        }
    
        .art1{
          display: flex;
          width: 100%;
          flex-direction: row;
          justify-content: space-around;
        }
    
        .art2{
          text-align: justify;
        }
    
        .pfoter {
          font-size: 1.2rem;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <main>
        <h2>Información de Usuario Recibida y Creada</h2>
    
        <article class="art1">
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Cédula:</strong> *****${redCedula}</p>
          <p><strong>Teléfono:</strong> ****${redTelefono}</p>
        </article>
    
        <article class="art2">
          <p><strong>Estimado(a) ${nombre},</strong></p>
          <p>Hemos recibido su información suministrada por el ChatBot de la compañia y tenido el privilegio de trabajar para informarle que su solicitud para crear una cuenta de <span> Cliente Fiel</span> con el <span>Grupo Empresarial Multired</span> (Gane Yumbo) ha sido exitosa. Ahora podrá acumular puntos cada vez que compre formularios de Azar (Chance). en nuestros puntos de venta autorizados del Municipio de Yumbo.</p>
        </article>
    
        <article>
          <p><strong>Atentamente,</strong></p>
          <p class="pfoter">Grupo Empresarial Multired SA</p>
          <p>Correo generado automaticamente <span>No responder este correo</span></p>
        </article>
      </main>
    </body>
    </html>
    `
  )
}

export function htmlCreatedUserServired ({ nombre, cedula, telefono }) {
  function lastThreeLetters (str) {
    return str.slice(-3)
  }

  const redCedula = lastThreeLetters(cedula.toString())
  const redTelefono = lastThreeLetters(telefono.toString())

  return (
        `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Información de Usuario Creada</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
    
        main {
          max-width: 800px;
          margin: 0 auto;
          background-color: #fff;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
        }
    
        h1 {
          color: #444;
        }
    
        article {
          margin-top: 20px;
          font-size: 1.1rem;
        }
    
        p {
          line-height: 1.6;
          color: #666;
        }
    
        span {
          font-weight: bold;
        }
    
        .art1{
          display: flex;
          width: 100%;
          flex-direction: row;
          justify-content: space-around;
        }
    
        .art2{
          text-align: justify;
        }
    
        .pfoter {
          font-size: 1.2rem;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <main>
        <h2>Información de Usuario Recibida y Creada</h2>
    
        <article class="art1">
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Cédula:</strong> *****${redCedula}</p>
          <p><strong>Teléfono:</strong> ****${redTelefono}</p>
        </article>
    
        <article class="art2">
          <p><strong>Estimado(a) ${nombre},</strong></p>
          <p>Hemos recibido su información suministrada por el ChatBot de la compañia y tenido el privilegio de trabajar para informarle que su solicitud para crear una cuenta de <span> Cliente Fiel</span> con el <span>Grupo Empresarial Servired</span> (Gane Jamundí) ha sido exitosa. Ahora podrá acumular puntos cada vez que compre formularios de Azar (Chance). en nuestros puntos de venta autorizados del Municipio de Jamundí.</p>
        </article>
    
        <article>
          <p><strong>Atentamente,</strong></p>
          <p class="pfoter">Grupo Empresarial Servired SA</p>
          <p>Correo generado automaticamente <span>No responder este correo</span></p>
        </article>
      </main>
    </body>
    </html>
    `
  )
}
