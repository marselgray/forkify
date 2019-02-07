import {elements} from './base.js'

export const getInput = () => elements.searchInput.value;

//clears input
export const clearInput = () => {
    elements.searchInput.value = '';
};

//clear previous results
export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
}
/*
Pasta with totato and spinach
acc : 0 / acc + cur.lenth = 5
5 is still less than 17,
New Title now has Pasta
acc now 5 and repeats
*/

const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit){
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        // return the result
        return `${newTitle.join(' ')} ...`;
    }
    return title;
}

//mark up for list
const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup)
};

// type can be previous or next
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderButtons  = (page, numResults, resPerPage) => {
    // math.ceil always rounds up! 
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/ceil
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if (page  === 1 && pages > 1){
        // only button to go to next page
        button = createButton(page, 'next');
    } else if (page < pages){
        // both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `        
    } else if (page === pages && pages > 1) {
        // only button to go to previous page
        button = createButton(page, 'prev');
    } 
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //render results of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    //render pagination buttons
    renderButtons(page, recipes.length, resPerPage);
};