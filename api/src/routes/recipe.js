// const axios = require('axios');
const { Router } = require('express');
const {Recipe,Diet} = require('../db')

const router = Router();



router.post('/',async(req,res,next)=>{
    const {name,image,tipoDePlato,resumenDePlato,nivelSalubre,pasos,diets} = req.body;
    try {
       let nuevaRec =  await Recipe.create({name,image,tipoDePlato,resumenDePlato,nivelSalubre,pasos})
        if(diets && diets.length && typeof diets === 'object'){
            // const newReci = await Recipe.findOne({where: {name}});
            diets.forEach(async d=>{
                await nuevaRec.addDiet(d)
            })
        }
        res.send('Receta creada')
    } catch (error) {
        res.status(500)
    }
})

router.delete('/:idReceta', (req, res, next) => {
    try {
        const { idReceta } = req.params
        Recipe.destroy({ where: {id: idReceta} })
        res.send('Deleted ' + idReceta)
    } catch(error) {
        next(error)
    }
})




module.exports = router;