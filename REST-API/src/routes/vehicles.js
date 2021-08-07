const { Router, request, json } = require('express');
const router = Router();
const _ = require('underscore');

const vehicles = require('../vehicles.json');
const spaces = require('../spaces.json');

router.get('/reservations', (req, res) => {
    res.json(vehicles);
});

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
        if(idSpace !== null){
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