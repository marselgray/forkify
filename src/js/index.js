import Search from './models/search.js';
import * as searchView from './views/searchView.js'
import * as recipeView from './views/recipeView.js'
import * as listView from './views/listView.js'
import {elements, renderLoader, clearLoader} from './views/base.js'
import Recipe from './models/recipe.js';
import List from './models/list.js';

/* Global state of the app
- Search object
- Current recipe object
- Shopping list object
- Liked recipes
*/
const state = {};
window.state = state;


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

/*
List Controller
*/
const controlList = () => {
	// create a new list if there is none yet
	if (!state.list) state.list = new List();
	// add each ingredient to the list and UI
	state.recipe.ingredients.forEach(el =>{
		const item = state.list.addItem(el.count, el.unit, el.ingredient);
		listView.renderItem(item);
	});
}
	
//Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
	const id = e.target.closest('.shopping__item').dataset.itemid;
	if (e.target.matches('.shopping__delete, .shopping__delete *')){
		// delete from state 
		state.list.deleteItem(id);
		// delete from UI
		listView.deleteItem(id);
	} 
	// handle count update 
	else if (e.target.matches('.shopping__count-value')){
		const val = parseFloat(e.target.value, 10);
		state.list.updateCount(id, val);
	}
});


// handling recipe button clicks
elements.recipe.addEventListener('click', e => {
	// the second part with the * means any child element
	if (e.target.matches('.btn-decrease, .btn-decrease *')){
		// decrease button is clicked
		if (state.recipe.servings > 1){
			state.recipe.updateServings('dec');
			recipeView.updateServingsIngredients(state.recipe)
		}
	} else if (e.target.matches('.btn-increase, .btn-increase *')){
		// increase button is clicked
		state.recipe.updateServings('inc');
		recipeView.updateServingsIngredients(state.recipe)
	} else if (e.target.matches('.recipe__btn-add, .recipe__btn--add *')){
		controlList();
	}
})

window.l = new List();