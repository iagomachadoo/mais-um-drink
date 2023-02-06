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
};

function criarElemento(elemento){
    return document.createElement(elemento);
};

function criarAtributo(elemento, attr, value){
    return elemento.setAttribute(attr, value);
};

function inserirUltimoFilho(pai, filho){
    return pai.appendChild(filho);
};

const LISTA_CONTEUDO = document.querySelector('.conteudo');
const BTN_PESQUISAR_DRINK = document.querySelector('#btn-pesquisar');

/* const URL_PARAMETRO = new URLSearchParams(window.location.search);
const PESQUISA = URL_PARAMETRO.get('pesquisa');
console.log(PESQUISA); */

function mostrarDrinks(nomeDrink){
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${nomeDrink}`)
    .then((response) => {
        return response.json(); 
    })
    .then((body) => {
        const LISTA_DE_DRINKS = body.drinks;
        
        LISTA_DE_DRINKS.forEach((item) => {
            const CONTEUDO_ITEM = criarElemento(ESTRUTURA.item);
            criarAtributo(CONTEUDO_ITEM, 'class', 'conteudo__item p-3 mb-4');
            
            const CONTEUDO_HEADER = criarElemento(ESTRUTURA.box);
            criarAtributo(CONTEUDO_HEADER, ESTRUTURA.attrClass, 'conteudo__header d-flex align-items-center mb-4');
    
            const CONTEUDO_BODY = criarElemento(ESTRUTURA.box);
            criarAtributo(CONTEUDO_BODY, ESTRUTURA.attrClass, 'conteudo__body');
    
    
            const THUMB_DRINK = criarElemento(ESTRUTURA.imagem);
            criarAtributo(THUMB_DRINK, ESTRUTURA.attrClass, 'conteudo__img img-fluid conteudo__img me-4');
            criarAtributo(THUMB_DRINK, ESTRUTURA.attrSrc, item.strDrinkThumb);
    
            const TITULO_DRINK = criarElemento(ESTRUTURA.titulo);
            criarAtributo(TITULO_DRINK, ESTRUTURA.attrClass, 'conteudo__titulo mb-0');
    
            
            TITULO_DRINK.innerText = item.strDrink;
    
    
            const LISTA_INGREDIENTES = criarElemento(ESTRUTURA.lista);
            criarAtributo(LISTA_INGREDIENTES, ESTRUTURA.attrClass, 'conteudo__body-lista row');
    
            const TITULO_DESC = criarElemento(ESTRUTURA.subTitulo2);
            criarAtributo(TITULO_DESC, ESTRUTURA.attrClass, 'conteudo__body-preparo mt-5');
    
            const DESC = criarElemento(ESTRUTURA.texto);
            criarAtributo(DESC, ESTRUTURA.attrClass, 'conteudo__body-descricao');
    
            TITULO_DESC.innerText = 'Modo de Preparo';
            DESC.innerText = item.strInstructions.split('\n').join(' ').split('\r').join(' ');

            for (let index = 1; index < 15; index++) {
                const NUM_INGREDIENTE = `strIngredient${index}`;
                const QUANT_INGREDIENTE = `strMeasure${index}`;
    
                const INGREDIENTE_DRINK = item[NUM_INGREDIENTE];
                const QUANT_INGREDIENTE_DRINK = item[QUANT_INGREDIENTE];
                
                if(INGREDIENTE_DRINK){
                    const ITEM_INGREDIENTE = criarElemento(ESTRUTURA.item);
                    criarAtributo(ITEM_INGREDIENTE, ESTRUTURA.attrClass, 'conteudo__body-item col-lg-3 col-sm-4 col-12 mt-4 d-flex align-items-center flex-column');
    
                    const BOX_THUMB_INGREDIENTE = criarElemento(ESTRUTURA.box);
                    criarAtributo(BOX_THUMB_INGREDIENTE, ESTRUTURA.attrClass, 'conteudo__body-ingrediente mb-2');
    
                    imgIngrediente(INGREDIENTE_DRINK) 
                    .then((response) => response.blob())
                    .then((url) => {
                        const URL_IMAGEM_INGREDIENTE = URL.createObjectURL(url);
    
                        const THUMB_INGREDIENTE = criarElemento(ESTRUTURA.imagem);
                        criarAtributo(THUMB_INGREDIENTE, ESTRUTURA.attrSrc, URL_IMAGEM_INGREDIENTE);
    
                        const INFO_INGREDIENTE = criarElemento(ESTRUTURA.subTitulo);
                        criarAtributo(INFO_INGREDIENTE, ESTRUTURA.attrClass, 'conteudo__body-quantidade');
    
                        INFO_INGREDIENTE.innerText = `${INGREDIENTE_DRINK} - ${QUANT_INGREDIENTE_DRINK}`
    
                        inserirUltimoFilho(LISTA_INGREDIENTES, ITEM_INGREDIENTE);
                        inserirUltimoFilho(ITEM_INGREDIENTE, BOX_THUMB_INGREDIENTE);
                        inserirUltimoFilho(BOX_THUMB_INGREDIENTE, THUMB_INGREDIENTE);
                        inserirUltimoFilho(ITEM_INGREDIENTE, INFO_INGREDIENTE);
                    }); 
                };
            };
    
            inserirUltimoFilho(LISTA_CONTEUDO, CONTEUDO_ITEM);
    
    
            inserirUltimoFilho(CONTEUDO_ITEM, CONTEUDO_HEADER);
            inserirUltimoFilho(CONTEUDO_ITEM, CONTEUDO_BODY);
            
    
            inserirUltimoFilho(CONTEUDO_HEADER, THUMB_DRINK);
            inserirUltimoFilho(CONTEUDO_HEADER, TITULO_DRINK);
    
    
            inserirUltimoFilho(CONTEUDO_BODY, LISTA_INGREDIENTES);
            inserirUltimoFilho(CONTEUDO_BODY, TITULO_DESC);
            inserirUltimoFilho(CONTEUDO_BODY, DESC);
        })
    })
    .catch((error) => {
        console.log(error);
    });
}

function imgIngrediente(ingrediente){
    return fetch(`https://www.thecocktaildb.com/images/ingredients/${ingrediente}-Small.png`);
};

function pesquisarDrink(){
    const DRINK_A_PESQUISAR = document.querySelector('#pesquisa');

    if(DRINK_A_PESQUISAR.value && !parseInt(DRINK_A_PESQUISAR.value)){
        document.querySelector('.form__alerta').classList.add('visivel-hidden');
        mostrarDrinks(DRINK_A_PESQUISAR.value);
        DRINK_A_PESQUISAR.value = '';
        
    }else{
        document.querySelector('.form__alerta').classList.remove('visivel-hidden');
        DRINK_A_PESQUISAR.value = '';
    }

    LISTA_CONTEUDO.innerHTML = '';
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