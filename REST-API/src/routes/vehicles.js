const { Router, request, json } = require('express');
const router = Router();
const _ = require('underscore');

const vehicles = require('../data/vehicles.json');
const spaces = require('../data/spaces.json');

/**
 * @swagger
 * paths:
 *  /reservations:
 *      get:
 *          description: Retorna un array con todos los vehículos que están en el parqueo. Cada objeto indica la placa, hora de ingreso y el id del espacio donde está
 *          responses:
 *              '200':
 *                  description: Una respuesta exitosa con la lista de carros.
 */
router.get('/reservations', (req, res) => {
    res.json(vehicles);
});

/**
 * @swagger
 * paths:
 *  /reservations:
 *      post:
 *          description: Reserva un espacio libre (lo selecciona automáticamente) para un vehículo. Guarda la hora de llegada.
 * 
 *          requestBody:
 *              description: El objeto con la placa del vehiculo.
 *              required: true
 *              content:
 *                  application/json
 * 
 *          responses:
 *              '200':
 *                  description: Una respuesta exitosa con todos los espacios reservados. Incluido el nuevo
 *              '404':
 *                  description: No se encontro ningun espacio disponible o No se ingreso numero de placa
 * 
 */
router.post('/reservations', (req, res) => {
    const {placa} = req.body;
    if(placa){
        let idSpace;
        for (let i = 0; i < spaces.length; i++) {
            if (spaces[i].state === 'free') {
                idSpace = spaces[i].id;
                spaces[i].state = 'in-use';
                break;
            }
        }
        if(idSpace != null){
            let date = new Date()
            let hora = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
            let vehicle = {placa: placa, spaceId: idSpace, horaIngreso: hora};
            vehicles.push(vehicle);
            res.json(vehicles);
        } else {
            res.status(404).json({error: 'No se encontro ningun espacio disponible'});
        }   
    } else {
        res.status(404).json({error: 'No se ingreso numero de placa'});
    }
});

/**
 * @swagger
 * paths:
 *  /reservations/{id}:
 *      delete:
 *          description: Elimina la reserva indicada por id.
 * 
 *          parameters:
 *            - in: path
 *              name: id
 *              description: indica el id de la reserva a eliminar.
 *              required: true
 * 
 *          responses:
 *              '200':
 *                  description: Una respuesta exitosa con la lista actualizada de carros.
 *              '404':
 *                  description: No se encontro la reservacion a eliminar.
 * 
 */
router.delete('/reservations/:id', (req, res) => {
    const { id } = req.params;
    let indice;
    for (let i = 0; i < vehicles.length; i++) {
        if (vehicles[i].spaceId == id) {
            indice = i;
            _.each(spaces, (space) => {
                if(space.id == id){
                    space.state = "free"; //se actualizan todos los atributos
                }
            });
            break;
        }
    }
    if (indice != null) {
        vehicles.splice(indice, 1);
        res.json(vehicles);
    }
    else {
        res.status(404).json({error: 'No se encontro la reservacion a eliminar'});
    }
});



router.all('/reservations', (req, res) => {
    res.status(405).json({error: 'Metodo no aceptado'});
});

module.exports = router;