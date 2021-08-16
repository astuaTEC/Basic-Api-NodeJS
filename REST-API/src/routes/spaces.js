const { Router } = require('express');
const router = Router();
const _ = require('underscore');

const spaces = require('../data/spaces.json');
const vehicles = require('../data/vehicles.json');

/**
 * @swagger
 * paths:
 *  /spaces:
 *      get:
 *          description: Retorna un arreglo con los datos de todos los espacios existentes en el parqueo.
 * 
 *          parameters:
 *            - in: query
 *              name: state
 *              description: los valores que puede recibir es free o in-use.
 *              required: false
 *
 *            - in: query
 *              name: offset
 *              description: para establecer la posición de partida de la lista.
 *              required: false
 * 
 *            - in: query
 *              name: limit
 *              description: número de elementos de la colección a devolver desde el offset.
 *              required: false
 * 
 *          responses:
 *              '200':
 *                  description: Una respuesta exitosa con la lista de espacios.
 *              '404':
 *                  description: State invalido
 * 
 */
router.get('/spaces', (req, res) => {
    const { state } = req.query;
    let { offset } = req.query;
    let { limit } = req.query;
    if(offset == undefined){
        offset = 0;
    }
    if(limit == undefined){
        limit = spaces.length;
    }
    if (state) {
        if ((state === 'free' || state === 'in-use')) {
            let result = [];
            let contador = 0;
            if(offset > 0){
                offset--;
            }
            for (let i =  offset; i < spaces.length; i++) {
                if (spaces[i].state == state && contador < limit) {
                    result.push(spaces[i]);
                    contador++;
                }
            }

            res.json(result);
        } else {
            res.status(404).json({ error: 'State invalido' });
        }
        
    } else {
        let result = [];
        let contador = 0;
        if(offset > 0){
            offset--;
        }
        for (let i =  offset; i < spaces.length; i++) {
            if(contador < limit){
                result.push(spaces[i]); 
                contador++;
            }
                      
        }
        res.json(result);
    }
});

/**
 * @swagger
 * paths:
 *  /spaces/{id}:
 *      get:
 *          description: Consulta un espacio específico indicado por el id.
 * 
 *          parameters:
 *            - in: path
 *              name: id
 *              description: El id del espacio a buscar.
 *              required: false
 * 
 *          responses:
 *              '200':
 *                  description: Una respuesta exitosa con el espacio
 *              '404':
 *                  description: No se encuentra el elemento especificado
 * 
 */
router.get('/spaces/:id', (req, res) => {
    const { id } = req.params;
    let result = '';

    for (let i = 0; i < spaces.length; i++) {
        if (spaces[i].id == id) {
            result = spaces[i];
            break;
        }
    }

    if(result != ''){
        res.json(result);
    } else {
        res.status(404).json({error: 'No se encuentra el elemento especificado'});
    }
    
});

/**
 * @swagger
 * paths:
 *  /spaces:
 *      post:
 *          description: Registra una nuevo espacio. Se le asigna un valor autogenerado como id. Se crea con el estado free
 * 
 *          requestBody:
 *              description: El objeto con la informacion del espacio a crear
 *              required: true
 *              content:
 *                  application/json
 * 
 *          responses:
 *              '200':
 *                  description: Una respuesta exitosa con todos los espacios. Incluido el nuevo
 *              '404':
 *                  description: No se encontro la informacion del espacio
 * 
 */
router.post('/spaces', (req, res) => {
    console.log(req.body);
    const { info } = req.body;
    if(info){
        let id = (spaces.length + 1).toString();
        let state = "free";
        let newSpace = {...req.body, id, state};
        spaces.push(newSpace);
        res.json(spaces);
    } else {
        res.status(404).json({error: 'No se encontro la informacion del espacio'});
    }
});

/**
 * @swagger
 * paths:
 *  /spaces/{id}:
 *      put:
 *          description: Registra una nuevo espacio. Se le asigna un valor autogenerado como id. Se crea con el estado free
 * 
 *          requestBody:
 *              name: id
 *              description: El objeto con la informacion del espacio a modificar
 *              required: true
 *              content:
 *                  application/json
 *
 *          parameters:
 *            - in: path
 *              name: id
 *              required: true
 *              description: El id del espacio a modificar
 * 
 *          responses:
 *              '200':
 *                  description: Una respuesta exitosa con todos los espacios. Incluido el actualizado
 *              '404':
 *                  description: No se encontro el espacio indicado
 * 
 */
router.put('/spaces/:id', (req, res) => {
    const { id } = req.params;
    const {info} = req.body;
    if(info){
        _.each(spaces, (space) => {
            if(space.id == id){
                space.info = info; //se actualizan todos los atributos
            }
        });
        res.json(spaces);
    } else {
        res.status(500).json({error: 'No se encontro el espacio indicado'});
    }
});


/**
 * @swagger
 * paths:
 *  /spaces/{id}:
 *      delete:
 *          description: Elimina el espacio indicado.
 *
 *          parameters:
 *            - in: path
 *              name: id
 *              required: true
 *              description: El id del espacio a eliminar
 * 
 *          responses:
 *              '200':
 *                  description: Una respuesta exitosa con todos los espacios que quedaron.
 *              '404':
 *                  description: Hay un vehiculo en ese espacio o No se encontro el espacio a eliminar.
 * 
 */
router.delete('/spaces/:id', (req, res) => {
    const { id } = req.params;
    let reservado = false;
    let indice;
    for (let i = 0; i < spaces.length; i++) {
        if (spaces[i].id == id) {
            indice = i;
            for (let j = 0; j < vehicles.length; j++) {
                if (vehicles[j].spaceId == id) {
                    reservado = true;
                    break;
                }
            }
            break;
        }
    }

    if(indice !== null){
        if(!reservado){
            spaces.splice(indice, 1);
            res.json(spaces);
        } else {
            res.status(404).json({error: 'Hay un vehiculo en ese espacio'});
        }
    }
    else {
        res.status(404).json({error: 'No se encontro el espacio a eliminar'});
    }
   
});

router.all('/spaces', (req, res) => {
    res.status(405).json({error: 'Metodo no aceptado'});
});

module.exports = router;

