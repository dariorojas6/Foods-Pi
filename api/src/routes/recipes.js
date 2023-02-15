const axios = require('axios');
const { Router } = require('express');
const {Recipe,Diet} = require('../db')
const {API_KEY} = process.env;

const router = Router();


const getAllRecipesApi = async()=>{
    const resu = await axios(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=100`)
    // console.log(resu.data.results[0].title)
    const recetas = resu.data.results.map(r=>{
        return {
            id: r.id,
            name: r.title,
            image: r.image,
            nivelSalubre: r.healthScore,
            diets: r.diets
        }
    })
    return recetas
}

const getAllRecipesDb = async()=>{
    const recetas = Recipe.findAll({
        include: {
            model: Diet,
            attributes: ['id','name'],
            through:{
                attributes: []
            }
        }
    })
    return recetas
}

const getAllRecipes = async()=>{
    const rec1 = await getAllRecipesApi()
    const rec2 = await getAllRecipesDb()
    const allRecipes = rec2.concat(rec1)
    return allRecipes;
}

router.get("/", async (req, res) => {
    try {
      const { name } = req.query;
      const allRecipes = await getAllRecipes();
  
      if (name) {
        const recipeName = allRecipes.filter((recipe) =>
          recipe.name.toLowerCase().includes(name.toLowerCase())
        );
        if (recipeName.length > 0) {
          res.status(200).send(recipeName);
        } else {
          res.status(400).send("Recipe not found");
        }
      } else {
        res.status(200).send(allRecipes);
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

router.get('/:idReceta',async(req,res,next)=>{
    const id = req.params.idReceta
    try {
        if(id.length < 15){
            const resuApi = await axios(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`)
            if(resuApi){
                const receta = {
                    id: resuApi.data.id,
                    name: resuApi.data.title,
                    image: resuApi.data.image,
                    tipoDePlato: resuApi.data.dishTypes,
                    resumenDePlato: resuApi.data.summary,
                    nivelSalubre: resuApi.data.healthScore,
                    pasos: resuApi.data.analyzedInstructions[0] && resuApi.data.analyzedInstructions[0].steps.map(p=> p.step),
                    diets: resuApi.data.diets
                }
                return res.json(receta)
            }
        }
        let resuDb = await Recipe.findByPk(id)
        if(resuDb){
            let dietsDb = await resuDb.getDiets()
            let diets = dietsDb.map(d=> d.dataValues.name)
            return res.json({...resuDb.dataValues, diets})
        }
    } catch (error) {
        next(error)
    }
})


module.exports = router;
