'use strict'

const ESTRUTURA = {
    box: 'div',
    lista: 'ul',
    item: 'li',
    imagem: 'img',
    titulo: 'h2',
    subTitulo: 'h3',
    subTitulo2: 'h4',
    texto: 'p',
    attrClass: 'class',
    attrSrc: 'src',
    criarElemento(elemento){
        return document.createElement(elemento);
    },
    criarAtributo(elemento, attr, value){
        return elemento.setAttribute(attr, value);
    },
    inserirUltimoFilho(pai, filho){
        return pai.appendChild(filho);
    },

};

const LISTA_CONTEUDO = document.querySelector('.conteudo');
const BTN_PESQUISAR_DRINK = document.querySelector('#btn-pesquisar');

function fetchDrinks(nomeDrink){
    return fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${nomeDrink}`)
};

function fetchDrinksUmaLetra(primeiraLetraDrink){
    return fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${primeiraLetraDrink}`)
};

function imgIngrediente(ingrediente){
    return fetch(`https://www.thecocktaildb.com/images/ingredients/${ingrediente}-Small.png`);
};

function mostrarDrinks(respostaFetch){
    const RESPOSTA_API = respostaFetch.length === 1 ? fetchDrinksUmaLetra(respostaFetch) : fetchDrinks(respostaFetch);
    
    RESPOSTA_API
    .then((response) => {
        return response.json(); 
    })
    .then((body) => {
        listaDrinks(body);
    })
    .catch((error) => {
        console.log(Error(error));
    });
}

function pesquisarDrink(){
    const DRINK_A_PESQUISAR = document.querySelector('#pesquisa');

    const PEQUISA_NAO_VAZIA = DRINK_A_PESQUISAR.value;
    const PESQUISA_COM_LETRA = !parseInt(DRINK_A_PESQUISAR.value);

    if(PEQUISA_NAO_VAZIA && PESQUISA_COM_LETRA){
        document.querySelector('.form__alerta').classList.add('visivel-hidden');
        mostrarDrinks(DRINK_A_PESQUISAR.value);
        DRINK_A_PESQUISAR.value = '';
        
    }else{
        document.querySelector('.form__alerta').classList.remove('visivel-hidden');
        DRINK_A_PESQUISAR.value = '';
    }

    LISTA_CONTEUDO.innerHTML = '';
};

function criaElementoEAtributo(elemento, attr, valor){
    const ELEMENTO_HTML = document.createElement(elemento);
    ELEMENTO_HTML.setAttribute(attr, valor)
    
    return ELEMENTO_HTML;
}

function criarImagemIngrediente(url){
    const URL_IMAGEM_INGREDIENTE = URL.createObjectURL(url);

    const THUMB_INGREDIENTE = ESTRUTURA.criarElemento(ESTRUTURA.imagem);
    ESTRUTURA.criarAtributo(THUMB_INGREDIENTE, ESTRUTURA.attrSrc, URL_IMAGEM_INGREDIENTE);

    return THUMB_INGREDIENTE;
}

function listaDrinks(lista){
    const LISTA_DE_DRINKS = lista.drinks;
        
    LISTA_DE_DRINKS.forEach((item) => {
        const CONTEUDO_ITEM = criaElementoEAtributo(ESTRUTURA.item, ESTRUTURA.attrClass, 'conteudo__item p-3 mb-4');

        const CONTEUDO_HEADER = criaElementoEAtributo(ESTRUTURA.box, ESTRUTURA.attrClass, 'conteudo__header d-flex align-items-center mb-4');
        
        const CONTEUDO_BODY = criaElementoEAtributo(ESTRUTURA.box, ESTRUTURA.attrClass, 'conteudo__body');

        const THUMB_DRINK = criaElementoEAtributo(ESTRUTURA.imagem, ESTRUTURA.attrClass, 'conteudo__img img-fluid conteudo__img me-4');
        ESTRUTURA.criarAtributo(THUMB_DRINK, ESTRUTURA.attrSrc, item.strDrinkThumb);

        const TITULO_DRINK = criaElementoEAtributo(ESTRUTURA.titulo, ESTRUTURA.attrClass, 'conteudo__titulo mb-0')
        
        TITULO_DRINK.innerText = item.strDrink;

        const LISTA_INGREDIENTES = criaElementoEAtributo(ESTRUTURA.lista, ESTRUTURA.attrClass, 'conteudo__body-lista row');

        const TITULO_DESC = criaElementoEAtributo(ESTRUTURA.subTitulo2, ESTRUTURA.attrClass, 'conteudo__body-preparo mt-5');

        const DESC = criaElementoEAtributo(ESTRUTURA.texto, ESTRUTURA.attrClass, 'conteudo__body-descricao');

        TITULO_DESC.innerText = 'Modo de Preparo';
        DESC.innerText = item.strInstructions.split('\n').join(' ').split('\r').join(' ');

        for (let index = 1; index < 15; index++) {
            const NUM_INGREDIENTE = `strIngredient${index}`;
            const QUANT_INGREDIENTE = `strMeasure${index}`;

            const INGREDIENTE_DRINK = item[NUM_INGREDIENTE];
            const QUANT_INGREDIENTE_DRINK = item[QUANT_INGREDIENTE];
            
            if(INGREDIENTE_DRINK){
                const ITEM_INGREDIENTE = criaElementoEAtributo(ESTRUTURA.item, ESTRUTURA.attrClass, 'conteudo__body-item col-lg-3 col-sm-4 col-12 mt-4 d-flex align-items-center flex-column');
                
                const BOX_THUMB_INGREDIENTE = criaElementoEAtributo(ESTRUTURA.box, ESTRUTURA.attrClass, 'conteudo__body-ingrediente mb-2');

                imgIngrediente(INGREDIENTE_DRINK) 
                .then((response) => response.blob())
                .then((url) => {
                    const INFO_INGREDIENTE = ESTRUTURA.criarElemento(ESTRUTURA.subTitulo);
                    ESTRUTURA.criarAtributo(INFO_INGREDIENTE, ESTRUTURA.attrClass, 'conteudo__body-quantidade');

                    INFO_INGREDIENTE.innerText = `${INGREDIENTE_DRINK} - ${QUANT_INGREDIENTE_DRINK}`

                    ESTRUTURA.inserirUltimoFilho(LISTA_INGREDIENTES, ITEM_INGREDIENTE);
                    ESTRUTURA.inserirUltimoFilho(ITEM_INGREDIENTE, BOX_THUMB_INGREDIENTE);
                    ESTRUTURA.inserirUltimoFilho(BOX_THUMB_INGREDIENTE, criarImagemIngrediente(url));
                    ESTRUTURA.inserirUltimoFilho(ITEM_INGREDIENTE, INFO_INGREDIENTE);
                }); 
            };
        };

        ESTRUTURA.inserirUltimoFilho(LISTA_CONTEUDO, CONTEUDO_ITEM);

        ESTRUTURA.inserirUltimoFilho(CONTEUDO_ITEM, CONTEUDO_HEADER);
        ESTRUTURA.inserirUltimoFilho(CONTEUDO_ITEM, CONTEUDO_BODY);
        
        ESTRUTURA.inserirUltimoFilho(CONTEUDO_HEADER, THUMB_DRINK);
        ESTRUTURA.inserirUltimoFilho(CONTEUDO_HEADER, TITULO_DRINK);

        ESTRUTURA.inserirUltimoFilho(CONTEUDO_BODY, LISTA_INGREDIENTES);
        ESTRUTURA.inserirUltimoFilho(CONTEUDO_BODY, TITULO_DESC);
        ESTRUTURA.inserirUltimoFilho(CONTEUDO_BODY, DESC);
    })
};

BTN_PESQUISAR_DRINK.addEventListener('click', (e)=>{
    e.preventDefault();
    pesquisarDrink();
});

BTN_PESQUISAR_DRINK.addEventListener('keyup', (e)=>{
    e.preventDefault();
    if(e.code === 'Enter'){
        pesquisarDrink();
    }
});