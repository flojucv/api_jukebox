const Music = require("../model/Music");
const fs = require('fs');
const path = require('path');

const controllerMusic = {
    find: async (req,res) => {
        const data = await Music.findAll();
        if(req.query.search){
            const query = req.query.search;
            const result = data.filter(song => song.title.toLowerCase().includes(query.toLowerCase()));
            if(result.length === 0) {
                return res.status(404).json({error: "Not found"});
            } else {
                return res.status(200).json({result})
            }
        } else {
            res.status(200).json({result: data});
        }
    },

    create: async (req,res)=> {
        if(!req.files.cover || !req.files.sound || !req.body.title || !req.body.category) {
            return res.status(400).json({error: `One or more param are not found (${(!req.files.cover) ? 'cover,' : ''} ${(!req.body.sound) ? 'sound,' : ''} ${(!req.body.title) ? 'title,' : ''} ${(!req.body.category) ? 'category' : ''})`})
        }
        const nextAutoIncrementValue = await sequelize.query("SELECT seq FROM sqlite_sequence WHERE name='musics'", { raw: true });
        const id = nextAutoIncrementValue[0][0].seq+1;
        const musicAdd = await Music.create(
            {
                cover: `${id}-${req.files.cover[0].originalname}`,
                sound: `${id}-${req.files.sound[0].originalname}`,
                title: req.body.title,
                category: req.body.category

            }
        );
        return res.status(201).json({message: 'You music have been add', result: musicAdd})
    },

    update: async(req, res) => {
        const id = req.params.id;
        if(isNaN(id)){
            return res.status(405).json({error: "Param is not a number"});
        }
        const music = await Music.findByPk(id);
        if(!music) {
            return res.status(404).json({error: "Music not found"});
        }
        if( !req.body.title || !req.body.category) {
            return res.status(400).json({error: `One or more param are not found (${(!req.body.title) ? 'title ' : ''}${(!req.body.category) ? 'category' : ''})`})
        }

        const updateObject = { title: req.body.title, category: req.body.category };
        if(req.files.cover)
            updateObject['cover'] = `${id}-${req.files.cover[0].originalname}`;
        if(req.files.sound)
            updateObject['sound'] = `${id}-${req.files.sound[0].originalname}`;

        await Music.update(
            updateObject,
            {
                where: {
                    id
                }
            }
        );
        const musicUpdate = await Music.findByPk(id);
        return res.status(200).json({message: `Music with id = ${id} have been updated`, result: [musicUpdate] })
    },

    delete: async (req,res) => {
        const id = req.params.id;
        if(isNaN(id)){
            return res.status(405).json({error: "Param is not a number"});
        }
        const music = await Music.findByPk(id);
        if(!music) {
            return res.status(404).json({error: "Music not found"});
        }

        fs.unlinkSync(`./uploads/cover/${music.id}-${music.cover}`);
        fs.unlinkSync(`./uploads/musics/${music.id}-${music.sound}`);
        await Music.destroy({ where: { id } });
        const data = await Music.findAll();
        return res.status(200).json({message: `${id} have been deleted`, result: data})
    },

    findById: async (req,res) => {
        const data = await Music.findAll();
        const id = req.params.id;
        if(isNaN(id)){
            res.status(405).json({error: "Param is not a number"});
        }
        if(data.filter((music) => music.id == id).length == 0){
            res.status(404).json({error: "Music not found"});
        }
        res.status(200).json({result: data[id-1]});
    },

    //Créer la méthode pour renvoyer une musique au hasard
    random: async (req,res) => {
        const data = await Music.findAll();
        const music = data[Math.floor(Math.random()*data.length)];
        res.status(200).json({result: music});
    },

    downloadCover: (req, res) => {
        const fileName = req.params.fileName;
        const directory = req.params.directory;
        if (directory !== "cover" && directory !== "sound") {
            return res.status(400).json({ error: "Directory not exist ! It's cover or sound" });
        }
        const filePath = path.resolve(`./uploads/${directory}/${fileName}`);
        if (fs.existsSync(filePath)) {
            // Envoyer le fichier au client sans le télécharger
            return res.sendFile(filePath);
        } else {
            return res.status(404).json({ error: "File not found" });
        }
    }
};

module.exports = controllerMusic;