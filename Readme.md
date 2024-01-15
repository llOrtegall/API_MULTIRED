API_MUTLIRED_SERVIRED

VERSION: 1.0.1 ---> Se estable primera versión estable para la API
--- 
Api desarrollada con el proposito de crear diferentes recursos de la compañia Multired y Servired

* Rutas de logín para validación de usuarios en los diferentes desarrollos
* Rutas Chat_Boot de ambas compañias que recopilan información mediante el Whatsapp - Cliente Fiel
* Rutas Para Agregar Clientes Fiels En plataforma Bnet

La presente documentación establece los pasos para inicializar la API.

* Funcionalidad De Oracle para acceder a plataforma Bnet:

--- # Configuración Oracle DB
  - La api en su package.json actualmente contiene libreria "oracledb": "6.2.0", la cual interactua con la base de datos Oracle.
  sin embargo se requiere en el SO donde se desea desplegar la API tenga instalado y funcional -> instantclient_11_2 <-

  - Se debe definir la Ruta de instalación del instaClient en la variable de entorno ( ORACLE_ROUTE ) ejemplo:
   --> Para Windows = 'C:\instantclient_11_2' ---> Para Linux = '/opt/oracle/instantclient_11_2'
   --> Eso establecera y proveera a oracledb las librerias necesarias para la funcionalidad de la misma.

  - Establecer Varibles De Entorno de DB Oracle:

    # Variables De Cliente Fiel Base De Datos Oracle
      USER_NAME=''
      PASS_WORD=''
      CONECT_STRING=''

  - Configuración Login y ChatBoot

  - Se debe establecer en las variables de entorno las bases de Datos necesarias para acceder al Schema del login y registros ChatBot

  --> Este mediante la variables:

        # Credenciales De DataBase Chat Boot MySQL
        HOSTMYSQL=''
        USUARIO=''
        PASSWORD=''
        PUERTO=''
        NAME_DATABASE=''

        # login
        MYSQLLOGIN=''
        USR=''
        PASS=''
        PORT='300'
        DATABASE=''

 ---

  - Configuración Secret Key Y Correos

  # Variables llave Secreta Tokens y Envio de Correos
  --> Este mediante la variables:

      * llave Secreta Es Buena practica Cambiarla de vez en cuando
        JWT_SECRET=''

      * El servicio de email se realiza mediante una libreria gratutia se deben colocar correo y contraseña de gmail
        EMAIL_USER=''
        EMAIL_PASS=''

      * Envio De Reportes
        EMAIL_SEND_REPORTS=''

---
# Definidas las variables de entorno

# 1 --> Instalar Dependencias ya se npm yarn o pnpm
  Example desde consola : yarn - npm install 
        yarn install v1.22.21
        [1/4] Resolving packages...
        success Already up-to-date.
        Done in 0.22s.

# 2 -> Iniciarlizar API en package punto Json el Script apunta al archivo principal


      "scripts": {
        "start": "node ./src/index.js",
      },

      Ejemplo Ejecución: 

      PS C:\..\..\..\API_MULTIRED> yarn start
      yarn run v1.22.21
      $ node ./src/index.js
      Todas las variables de entorno están definidas
      Server Iniciado En El Puerto http://localhost:3080