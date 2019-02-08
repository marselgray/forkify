import Search from './models/search.js';
import * as searchView from './views/searchView.js'
import {elements, renderLoader, clearLoader} from './views/base.js'
import Recipe from './models/recipe.js';

/* Global state of the app
- Search object
- Current recipe object
- Shopping list object
- Liked recipes
*/
const state = {};


//SEARCH CONTROLLER
const controlSearch = async () => {
    // 1. Get query from view
    const query = searchView.getInput();
        
    if (query) {
        // 2. New search object and add to state
        state.search = new Search(query)

        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4. Search for recipes 
            await state.search.getResults();

            // 5. Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (err) {
            alert('Something went wrong with the search...');
            clearLoader();
        }
    }
}
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    //https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});


//RECIPE CONTROLLER
const controlRecipe = async () => {
    // get id from url
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        // 1. prepare UI for changes

        // 2. create new recipe object
        state.recipe = new Recipe(id);

        try {
            // 3. get recipe data
            await state.recipe.getRecipe();

            // 4. calculate servings and cook time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // 5. render recipe
            console.log(state.recipe);
        } catch (err) {
            alert('Error processing recipe');
        }        
    }
}

// save the two events into a for each loop
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));