export function htmlSend ({ nombre, cedula, telefono, motivo, emp }) {
  function Empresa (empresa) {
    if (empresa === 'Servired') {
      return 'Grupo Empresarial Servired'
    } else if (empresa === 'Multired') {
      return 'Grupo Empresarial Multired'
    }
  }

  return (
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Solicitud de Eliminación de Registro</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
    
        .container {
          max-width: 800px;
          margin: 0 auto;
          background-color: #fff;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
        }
    
        h1, h2, h3 {
          color: #444;
        }
    
        p {
          line-height: 1.6;
          color: #666;
        }
    
        .user-info {
          font-size: 16px;
          color: #000;
          margin-bottom: 20px;
        }
    
        .reason {
          font-size: 18px;
          color: #000;
          text-align: justify;
          margin-bottom: 20px;
        }
    
        .reason span {
          font-weight: bold;
        }
    
        .footer {
          font-size: 18px;
          font-weight: bold;
          color: #000;
          text-align: start;
          margin-top: 30px;
        }
    
        .auto-generated {
          font-size: 14px;
          color: #999;
          text-align: start;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Solicitud de Eliminación de Registro</h2>
    
        <h3>Información del Usuario Recibida:</h3>
        <p class="user-info"><strong>Nombre:</strong> ${nombre} | <strong>Cédula:</strong> ${cedula} | <strong>Teléfono:</strong> ${telefono}</p>
    
        <p class="reason">
          Motivo de Eliminación: <span>${motivo}</span>
        </p>
    
        <p class="footer">Atentamente, <br><br><br>${Empresa(emp)}</p>
    
        <p class="auto-generated">Generado automáticamente, no responder este correo.</p>
      </div>
    </body>
    </html>
    `
  )
}
