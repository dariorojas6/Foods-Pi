import axios from 'axios'


export function getAllRecipes(){
    return async function(dispatch){
        const resu =  await axios('https://foods-pi-production-81b5.up.railway.app/recipes')
        dispatch({
            type: "GET_ALL_RECIPES",
            payload: resu.data
        })
    }
}




export function getAllDiets(){
    return async function(dispatch){
        const resu =  await axios('https://foods-pi-production-81b5.up.railway.app/types')
        dispatch({
            type: "GET_ALL_DIETS",
            payload: resu.data
        })
    }
}
export function getRecipesByName(name){
    return async function(dispatch){
        const resu =  await axios(`https://foods-pi-production-81b5.up.railway.app/recipes?name=${name}`)
        dispatch({
            type: "GET_RECIPES_BY_NAME",
            payload: resu.data
        })
    }
}
export function getRecipesById(id){
    return async function(dispatch){
        const resu =  await axios(`https://foods-pi-production-81b5.up.railway.app/recipes/${id}`)
        dispatch({
            type: "GET_RECIPES_BY_ID",
            payload: resu.data
        })
    }
}
export function deleteRecipe(id){
    return async function(dispatch){
        await axios.delete(`https://foods-pi-production-81b5.up.railway.app/recipe/${id}`)
        dispatch({
            type: "DEL_RECIPE",
            payload: id
        })
    }
}

export function filterByDiets(payload){
    return {
        type: 'FILTER_BY_DIETS',
        payload
    }
}
export function orderPerAlfa(payload){
    return {
        type: 'ORDEN_ALFA',
        payload
    }
}
export function orderPerPunt(payload){
    return {
        type: 'ORDEN_PUNT',
        payload
    }
}
export function createRecipe(payload){
    return async function(dispatch){
      await axios.post('https://foods-pi-production-81b5.up.railway.app/recipe',payload)
        dispatch ({
            type: 'CREATE_RECIPE',
            payload
        })
    }
}

export function unMount(){
    return {
        type:'UNMOUNT'
    }
}