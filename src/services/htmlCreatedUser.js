export function htmlCreatedUser ({ nombre, cedula, telefono }) {
  return (
    `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    
    <style>
        body {
            margin: 0;
            padding: 20px 40px;
        }
    
        h1 {
            text-align: center;
        }
    
        .art1 {
            display: flex;
            justify-content: space-around;
            font-size: 1.3rem;
            font-weight: bold;
        }
    
        .art2 {
            padding-top: 20px;
            font-size: 1.1rem;
            text-align: justify;
        }
    
        .art3 {
            margin-top: 20px;
            font-size: 1.1rem;
        }
    
        span {
            font-weight: bold;
        }
    </style>
    
    <body>
        <h1>Información De Usuario Creada</h1>
    
        <article class="art1">
            <p>Nombre ${nombre}</p>
            <p>Cedula *****${cedula}</p>
            <p>Telefono ***${telefono}</p>
        </article>
    
        <article class="art2">
            <p class="p-1"><span>Estimado (a) ${nombre},</span></p>
            Es un honor dirigirnos a usted <span> ${nombre}</span>
            Hemos tenido el privilegio de trabajar he informarle que su solicitud para crear una cuenta de Cliente Fiel con
            <span> Grupo Empresarial Multired (Gane Yumbo)</span> ha sido exitosa.
            Ahora podras acumular puntos cada vez que compre formularios de Azar (Chance). Seria autorizado en nuestros
            puntos de veta del Municipio de Yumbo.
        </article>
    
        <article class="art3">
            <span>Atentamente,</span>
            <br>
            <br>
            Grupo Empresarial Multired SA
            Generado Automaticamente. <span>No responder este correo.</span>
        </article>
    
    </body>
    
    </html>
    `
  )
}
