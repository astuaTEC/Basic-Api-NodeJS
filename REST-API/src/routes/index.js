const { Router } = require('express');
const router = Router();

router.get('/test', (req, res) => {
    const data = {
        "nombre": "Saymon",
        "apellido": "Astua"
    };
    res.json(data);
});

module.exports = router;