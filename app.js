document.addEventListener('DOMContentLoaded', () => {
    afficherFormulaireRecherche();
});

function afficherFormulaireRecherche() {
    let main = document.querySelector('main');

    main.innerHTML = `
        <form id="form" class="card">
            <label for="search">
                <h1 class="text-preset-1">What do you want to COOK ?</h1>
            </label>
            <input
                id="search"
                class="input text-preset-2"
                type="text"
                placeholder="Arrabiata penne"
            />
            <button class="btn rose-800 rose-50-text" type="submit">
                <h2 class="text-preset-2">Rechercher</h2>
            </button> 
        </form>
    `;

    let formulaire = document.getElementById('form');
    formulaire.addEventListener('submit', (event) => {
        event.preventDefault();
        let champ = document.getElementById('search');
        let nom = champ.value.trim();

        if (nom !== '') {
            chercherRecette(nom);
        }
    });
}

async function chercherRecette(nom) {
    let main = document.querySelector('main');

    let url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=' + encodeURIComponent(nom);

    let reponse = await fetch(url);
    let data = await reponse.json();

    if (data.meals && data.meals.length > 0) {
        afficherRecette(data.meals[0]);
    } else {
        main.innerHTML = '';
    }
}

function afficherRecette(recette) {
    let main = document.querySelector('main');
    let html = `
        <section class="card">
            <div class="illustration" style="background: center / cover no-repeat url('${recette.strMealThumb}');"></div>
            <div class="card-content">
                <h1 class="text-preset-1">${recette.strMeal}</h1>
                <div class="card-chips">
                    ${recette.strCategory ? `<span class="chip lime-100 stone-900-text">${recette.strCategory}</span>` : ''}
                    ${recette.strArea ? `<span class="chip yellow-100 stone-900-text">${recette.strArea}</span>` : ''}
                </div>
                <h2 class="text-preset-2 brown-800-text">Ingrédients</h2>
                <table class="card-ingredients-table"><tbody>
    `;
    

    for (let i = 1; i <= 20; i++) {
        let ingredient = recette['strIngredient' + i];
        let quantite = recette['strMeasure' + i];
        if (ingredient && ingredient.trim() !== '') {
            html += `
                <tr>
                    <th><span class="stone-600-text">${ingredient}</span></th>
                    <td><span class="brown-800-text bold">${quantite || ''}</span></td>
                </tr>
            `;
        }
    }

    html += `
                </tbody></table>
                <h2 class="text-preset-2 brown-800-text">Instructions</h2>
                <ul class="card-instructions-list">
    `;

    let etapes = recette.strInstructions.split('\r\n');
    if (etapes.length === 1) etapes = recette.strInstructions.split('. ');

    for (let etape of etapes) {
        etape = etape.trim();
        if (etape !== '') {
            html += `<li><span class="stone-600-text text-preset-body">${etape}</span></li>`;
        }
    }

    html += `</ul>`;
    if (recette.strYoutube) {
        html += `
            <div class="card-help">
                <h3 class="text-preset-3 rose-800-text">Help</h3>
                <ul class="card-help-list">
                    <li>
                        <span class="bold stone-600-text">Youtube:</span>
                        <a class="link" href="${recette.strYoutube}" target="_blank">${recette.strYoutube}</a>
                    </li>
                </ul>
            </div>
        `;
    }

    html += `</div></section>`;
    main.innerHTML = html;
}