const express = require('express');
const router = express.Router();
const controllerMusic = require('./../controller/Music');
const { random } = require('./../controller/Music');
const multer = require('multer');
const Music = require('../model/Music');
const fs = require('fs');
const sequelize = require('../db/dbConnect');

const createStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname == "sound")
            cb(null, './uploads/sound');
        else if (file.fieldname == 'cover')
            cb(null, './uploads/cover');

    },
    filename: async function (req, file, cb) {
        if(file.fieldname == "sound") {
            const acceptedTypes = file.mimetype.split('/');

            if(acceptedTypes[0] != 'audio') {
                const error = new Error('Audio only for field sound');
                error.code = 500;
                return cb(error)
            }
        } else if(file.fieldname == "cover") {
            const acceptedTypes = file.mimetype.split('/');

            if(acceptedTypes[0] != 'image') {
                const error = new Error('image only for field cover');
                error.code = 500;
                return cb(error)
            }
        }
        const nextAutoIncrementValue = await sequelize.query("SELECT seq FROM sqlite_sequence WHERE name='musics'", { raw: true });
        cb(null, `${(nextAutoIncrementValue[0][0].seq+1)}-${file.originalname}`);
    }
})

const updateStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(file.fieldname == "sound")
            cb(null, './uploads/sound');
        else if(file.fieldname == "cover")
            cb(null, './uploads/cover');
    },
    filename: async (req, file, cb) => {
        if(file.fieldname == "sound") {
            const acceptedTypes = file.mimetype.split('/');

            if(acceptedTypes[0] != 'audio') {
                const error = new Error('Audio only for field sound');
                error.code = 500;
                return cb(error)
            }
        } else if(file.fieldname == "cover") {
            const acceptedTypes = file.mimetype.split('/');

            if(acceptedTypes[0] != 'image') {
                const error = new Error('image only for field cover');
                error.code = 500;
                return cb(error)
            }
        }
        const id = req.params.id;
        const music = await Music.findByPk(id);
        if(music) {
            if (fs.existsSync(`./uploads/${(file.fieldname == 'sound') ? 'sound' : 'cover'}/${id}-${(file.fieldname) == 'sound' ? music.sound : music.cover}`))
                fs.unlinkSync(`./uploads/${(file.fieldname == 'sound') ? 'sound' : 'cover'}/${id}-${(file.fieldname) == 'sound' ? music.sound : music.cover}`);
            return cb(null, `${id}-${file.originalname}`);
        } else {
            const error = new Error('Music not found');
            error.code = 404
            return cb(error);
        }
    }
})

const auth = (req, res, next) => {
    const bearerHeaders = req.headers['authorization'];
    if(typeof bearerHeaders !== 'undefined') {
        const bearer = bearerHeaders.split(' ');
        const bearerToken = bearer[1];
        
        if(bearerToken == process.env.TOKEN) {
            next();
        } else {
            return res.status(403).json({error: 'Token invalid'});
        }
    } else {
        return res.status(403).json({error: 'Token missing'});
    }
}

const create = multer({ storage: createStorage });
const update = multer({ storage: updateStorage });

router.get("/", (req, res) => {
    res.status(200).json({ success: "racine API" });
});

router.post('/', (req, res) => {
    res.status(200).json({ success: 'Bravo' });
});


router.get('/music', controllerMusic.find);
router.post('/music', auth, create.fields([{ name: "sound" }, { name: "cover" }]), controllerMusic.create);
router.get('/music/random', random);
router.get('/music/:id', controllerMusic.findById);
router.delete('/music/:id', auth,  controllerMusic.delete);
const updateFiles = update.fields([{name: 'sound'},{name: 'cover'}]);
router.put('/music/:id', auth, function(req,res){
    updateFiles(req,res,function(err){
        if (err) {
            return res.status(err.code).send({ error: err.message })
        } else {
            controllerMusic.update(req, res);
        }
    })
});
router.get('/downloads/:directory/:fileName', controllerMusic.downloadCover);

module.exports = router;