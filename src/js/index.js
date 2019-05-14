import Search from './models/search.js';
import * as searchView from './views/searchView.js'
import * as recipeView from './views/recipeView.js'
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
            console.log(err);
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
        recipeView.clearRecipe();
		renderLoader(elements.recipe);
		
		// 2. highlight selected search item
		if (state.search) searchView.highlightSelected(id); 

        // 3. create new recipe object
        state.recipe = new Recipe(id);


        try {
            // 3. get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // 4. calculate servings and cook time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // 5. render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);


        } catch (err) {
            console.log(err);
        }        
    }
}

// save the two events into a for each loop
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// handling recipe button clicks
elements.recipe.addEventListener('click', e => {
	// the second part with the * means any child element
	if (e.target.matches('.btn-decrease, .btn-decrease *')){
		// decrease button is clicked
		if (state.recipe.servings > 1){
			state.recipe.updateServings('dec');
			recipeView.updateServingsIngredients(state.recipe)
		}
	}
	if (e.target.matches('.btn-increase, .btn-increase *')){
		// increase button is clicked
		state.recipe.updateServings('inc');
		recipeView.updateServingsIngredients(state.recipe)
	}
})