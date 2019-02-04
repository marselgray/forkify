import axios from 'axios';

async function getResults(query){
    const key = '269fb249d36c1e29f6a2c032c838b610';
    try{
        const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${query}`);
        const recipes = res.data.recipes;
        //console.log(res);
        console.log(recipes); 
    } catch(error) {
        console.log(error)
    }
}
getResults('tomato pasta');