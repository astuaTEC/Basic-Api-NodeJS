const { Router, request } = require('express');
const router = Router();
const _ = require('underscore');

const spaces = require('../sample.json');

router.get('/spaces', (req, res) => {
    res.json(spaces);
});

router.post('/spaces', (req, res) => {
    console.log(req.body);
    const {state} = req.body;
    if(state){
        const id = spaces.length + 1
        let newSpace = {...req.body, id};
        spaces.push(newSpace);
        res.json(spaces);
    } else {
        res.status(500).json({error: 'Hay un error'});
    }
});

router.put('/spaces/:id', (req, res) => {
    const { id } = req.params;
    const {state} = req.body;
    if(state){
        _.each(spaces, (space, i) => {
            if(space.id == id){
                space.state = state; //se actualizan todos los atributos
            }
        });
        res.json(spaces);
    } else {
        res.status(500).json({error: 'Hay un error'});
    }
});


router.delete('/spaces/:id', (req, res) => {
    const { id } = req.params;
    _.each(spaces, (space, i) => {
        if (space.id == id ){
            spaces.splice(i, 1);
        }
    });
    res.json(spaces);
});

module.exports = router;