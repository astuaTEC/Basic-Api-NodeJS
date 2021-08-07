const { Router } = require('express');
const router = Router();
const _ = require('underscore');

const spaces = require('../spaces.json');
const vehicles = require('../vehicles.json');

router.get('/spaces', (req, res) => {
    const { state } = req.query;
    if (state) {
        if ((state === 'free' || state === 'in-use')) {
            let result = [];
            _.each(spaces, (space, i) => {
                if (space.state == state) {
                    result.push(space);
                }
            });
            res.json(result);
        } else {
            res.status(404).json({ error: 'State invalido' });
        }
        
    } else {
        res.json(spaces);
    }
});

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

router.put('/spaces/:id', (req, res) => {
    const { id } = req.params;
    const {info} = req.body;
    if(info){
        _.each(spaces, (space, i) => {
            if(space.id == id){
                space.info = info; //se actualizan todos los atributos
            }
        });
        res.json(spaces);
    } else {
        res.status(500).json({error: 'Hay un error'});
    }
});


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

