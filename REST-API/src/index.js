const express = require ('express');
const https = require('https');
const app = express();
const morgan = require('morgan');
const cors = require('cors')
const fs = require('fs');
const path = require('path');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// https://swagger.io/specification/
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "API Investigacion #1",
            description: "Una API para la investigacion #1 de SOA",
            contact: {
                name: "DarkSolutions"
            },
            servers: ["https://localhost:4000"]
        }
    },
    apis: ["src/index.js", "src/routes/*.js"],
    version: "3.0.3"
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//configuraciones
app.set('port', process.env.PORT || 4000)
app.set('json spaces', 2);
app.use(cors()); //se configura el cors (Cross-Origin)

//middlewares
app.use(morgan('dev')); //sirve para ver en consola lo que llega al servidor
app.use(express.urlencoded({extended: false}));
app.use(express.json()); // para usar json

// rutas
app.use(require('./routes/spaces'));
app.use(require('./routes/vehicles'));

app.all('/*', (req, res) => {
    res.status(405).json({error: 'Metodo no aceptado'});
});


// inicializando el servidor en http
/*app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});*/

//Se configura el certificado ssl 
const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, '../cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../cert', 'cert.pem')),
}, app);

sslServer.listen(app.get('port'), () => {
    console.log(`Secure Server 🔥 on port ${app.get('port')}`);
});