const Music = require("../model/Music");

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

    create: async (req,res)=>{
        if(!req.body.cover || !req.body.sound || !req.body.title || !req.body.category) {
            return res.status(400).json({error: `One or more param are not found (${(!req.body.cover) ? 'cover,' : ''} ${(!req.body.sound) ? 'sound,' : ''} ${(!req.body.title) ? 'title,' : ''} ${(!req.body.category) ? 'category' : ''})`})
        }
        const musicAdd = await Music.create({cover: req.body.cover, sound: req.body.sound, title: req.body.title, category: req.body.category});
        return res.status(201).json({message: 'You music have been add', result: musicAdd})
    },

    update: async(req, res) => {
        let data = await Music.findAll();
        const id = req.params.id;
        if(isNaN(id)){
            return res.status(405).json({error: "Param is not a number"});
        }
        if(id>data.length) {
            return res.status(404).json({error: "Music not found"});
        }
        if(!req.body.cover || !req.body.sound || !req.body.title || !req.body.category) {
            return res.status(400).json({error: `One or more param are not found (${(!req.body.cover) ? 'cover,' : ''} ${(!req.body.sound) ? 'sound,' : ''} ${(!req.body.title) ? 'title,' : ''} ${(!req.body.category) ? 'category' : ''})`})
        }

        await Music.update(
            req.body,
            {
                where: {
                    id
                }
            }
        );
        const musicUpdate = await Music.findByPk(id);
        return res.status(200).json({message: `Music with id = ${id} have been updated`, result: musicUpdate })
    },

    delete: async (req,res) => {
        let data = await Music.findAll();
        const id = req.params.id;
        if(isNaN(id)){
            return res.status(405).json({error: "Param is not a number"});
        }
        if(id>data.length) {
            return res.status(404).json({error: "Music not found"});
        }

        await Music.destroy({ where: { id } });
        data = await Music.findAll();
        return res.status(200).json({message: `${id} have been deleted`, result: data})
    },

    findById: async (req,res) => {
        const data = await Music.findAll();
        const id = req.params.id;
        if(isNaN(id)){
            res.status(405).json({error: "Param is not a number"});
        }
        if(id>data.length){
            res.status(404).json({error: "Music not found"});
        }
        res.status(200).json({result: data[id-1]});
    },

    //Créer la méthode pour renvoyer une musique au hasard
    random: async (req,res) => {
        const data = await Music.findAll();
        const music = data[Math.floor(Math.random()*data.length)];
        res.status(200).json({result: music});
    }
};

module.exports = controllerMusic;