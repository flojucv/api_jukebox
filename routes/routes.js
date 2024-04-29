const express = require('express');
const router = express.Router();
const controllerMusic = require('./../controller/Music');

router.get("/", (req,res) => {
    res.status(200).json({success: "racine API"});
});

router.post('/', (req, res) => {
    res.status(200).json({ success: 'Bravo'})
})

router.get('/music', controllerMusic.find)
router.get('/music/:id', controllerMusic.findById)
router.get('/music/random',controllerMusic.random)

module.exports = router;