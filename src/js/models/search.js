import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }
    async getResults(){
        const key = '269fb249d36c1e29f6a2c032c838b610';
        try{
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
            //console.log(this.result); 
        } catch(error) {
            console.log(error)
        }
    }
}
