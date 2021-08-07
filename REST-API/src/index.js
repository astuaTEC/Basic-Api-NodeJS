const express = require ('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors')


//configuraciones
app.set('port', process.env.PORT || 4000)
app.set('json spaces', 2);
app.use(cors()); //se configura el cors (Cross-Origin)

//middlewares
app.use(morgan('dev')); //sirve para ver en consola lo que llega al servidor
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// rutas
app.use(require('./routes/index'));
app.use(require('./routes/spaces'));
app.use(require('./routes/vehicles'));
app.all('/*', (req, res) => {
    res.status(405).json({error: 'Metodo no aceptado'});
});

// inicializando el servidor
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});