export function htmlSend ({ nombre, cedula, telefono, motivo }) {
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
        <h2>Solicitud Eliminación Registro</h1>
    
          <h3>Información De Usuario Recibida:</h3>
          <p class="pnombres"><strong>Nombre:</strong> ${nombre} | <strong>Cedula:</strong> ${cedula} | <strong>Telefono:</strong> *****${telefono}</p>
    
          <p class="pmain">
            Motivo Eliminación(a) <span class="span1">${motivo}</span>,
          
            Municipio De Yumbo - Valle Del Cauca
            
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
