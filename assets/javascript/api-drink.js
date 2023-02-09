'use strict'

const LISTA_CONTEUDO = document.querySelector('.conteudo');
const BTN_PESQUISAR_DRINK = document.querySelector('#btn-pesquisar');
const SELECT = document.querySelector('#drink-ingrediente');
const LABEL_INPUT = document.querySelector('.form__label');

SELECT.addEventListener('change', (e)=>{
    if(e.target.value === 'nome do drink'){
        LABEL_INPUT.innerText = `Digite o ${e.target.value}`;
    }else{
        LABEL_INPUT.innerText = `Digite o ${e.target.value}`;
    }
})

const ESTRUTURA = {
    div: 'div',
    ul: 'ul',
    li: 'li',
    imagem: 'img',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    p: 'p',
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

function criaElementoEAtributo(elemento, attr, valor){
    const ELEMENTO_HTML = document.createElement(elemento);
    ELEMENTO_HTML.setAttribute(attr, valor)
    
    return ELEMENTO_HTML;
};

function criarImagemIngrediente(url){
    const URL_IMAGEM_INGREDIENTE = URL.createObjectURL(url);

    const THUMB_INGREDIENTE = ESTRUTURA.criarElemento(ESTRUTURA.imagem);
    ESTRUTURA.criarAtributo(THUMB_INGREDIENTE, ESTRUTURA.attrSrc, URL_IMAGEM_INGREDIENTE);

    return THUMB_INGREDIENTE;
};

function fetchDrinks(nomeDrink){
    return fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${nomeDrink}`)
};

function fetchDrinksUmaLetra(primeiraLetraDrink){
    return fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${primeiraLetraDrink}`)
};

function fetchDrinksIngrediente(nomeIngrediente){
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${nomeIngrediente}`)
    .then(resposta => resposta.json())
    .then(respostaJson => {
        for (const key in respostaJson.drinks) {
            if (Object.hasOwnProperty.call(respostaJson.drinks, key)) {
                const element = respostaJson.drinks[key];
                fetchDrinks(element.strDrink)
                .then(resposta => resposta.json())
                .then(respostaJson => {
                    respostaJson.drinks.forEach((item) => {
                        if(item.strAlcoholic === "Alcoholic"){
                            criarEstrutura(item)
                        };
                    });
                });
            };
        };
    });
};

function imgIngrediente(ingrediente){
    return fetch(`https://www.thecocktaildb.com/images/ingredients/${ingrediente}-Small.png`);
};

function mostrarDrinks(valorInput){
    const RESPOSTA_API = valorInput.length === 1 ? fetchDrinksUmaLetra(valorInput) : fetchDrinks(valorInput);
    
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

function pesquisarDrink(valorSelect){
    const DRINK_A_PESQUISAR = document.querySelector('#pesquisa');
    const FOOTER = document.querySelector('.footer');

    const PEQUISA_NAO_VAZIA = DRINK_A_PESQUISAR.value;
    const PESQUISA_COM_LETRA = !parseInt(DRINK_A_PESQUISAR.value);

    if(PEQUISA_NAO_VAZIA && PESQUISA_COM_LETRA){
        document.querySelector('.form__alerta').classList.add('visivel-hidden');
        
        if(valorSelect === "nome do drink"){
            mostrarDrinks(DRINK_A_PESQUISAR.value);
        }else{
            fetchDrinksIngrediente(DRINK_A_PESQUISAR.value);
        }

        FOOTER.style.display = "none";

        setTimeout(()=>{
            FOOTER.style.display = "block";
            FOOTER.style.position = "initial";
        }, 1000);

        DRINK_A_PESQUISAR.value = '';
        
    }else{
        document.querySelector('.form__alerta').classList.remove('visivel-hidden');
        DRINK_A_PESQUISAR.value = '';
    }

    LISTA_CONTEUDO.innerHTML = '';
};

function criarEstrutura(item){
    const CONTEUDO_ITEM = criaElementoEAtributo(ESTRUTURA.li, ESTRUTURA.attrClass, 'conteudo__item p-3 mb-4');

    const CONTEUDO_HEADER = criaElementoEAtributo(ESTRUTURA.div, ESTRUTURA.attrClass, 'conteudo__header d-flex align-items-center mb-4');
    
    const CONTEUDO_BODY = criaElementoEAtributo(ESTRUTURA.div, ESTRUTURA.attrClass, 'conteudo__body');

    const THUMB_DRINK = criaElementoEAtributo(ESTRUTURA.imagem, ESTRUTURA.attrClass, 'conteudo__img img-fluid conteudo__img me-4');
    ESTRUTURA.criarAtributo(THUMB_DRINK, ESTRUTURA.attrSrc, item.strDrinkThumb);

    const TITULO_DRINK = criaElementoEAtributo(ESTRUTURA.h2, ESTRUTURA.attrClass, 'conteudo__titulo mb-0')
    
    TITULO_DRINK.innerText = item.strDrink;

    const LISTA_INGREDIENTES = criaElementoEAtributo(ESTRUTURA.ul, ESTRUTURA.attrClass, 'conteudo__body-lista row');

    const TITULO_DESC = criaElementoEAtributo(ESTRUTURA.h4, ESTRUTURA.attrClass, 'conteudo__body-preparo mt-5');

    const DESC = criaElementoEAtributo(ESTRUTURA.p, ESTRUTURA.attrClass, 'conteudo__body-descricao');

    TITULO_DESC.innerText = 'Modo de Preparo';
    DESC.innerText = item.strInstructions.split('\n').join(' ').split('\r').join(' ');

    for (let index = 1; index < 15; index++) {
        const NUM_INGREDIENTE = `strIngredient${index}`;
        const QUANT_INGREDIENTE = `strMeasure${index}`;

        const INGREDIENTE_DRINK = item[NUM_INGREDIENTE];
        const QUANT_INGREDIENTE_DRINK = item[QUANT_INGREDIENTE];
        
        if(INGREDIENTE_DRINK){
            const ITEM_INGREDIENTE = criaElementoEAtributo(ESTRUTURA.li, ESTRUTURA.attrClass, 'conteudo__body-item col-lg-3 col-sm-4 col-12 mt-4 d-flex align-items-center flex-column');
            
            const BOX_THUMB_INGREDIENTE = criaElementoEAtributo(ESTRUTURA.div, ESTRUTURA.attrClass, 'conteudo__body-ingrediente mb-2');

            imgIngrediente(INGREDIENTE_DRINK) 
            .then((response) => response.blob())
            .then((url) => {
                const INFO_INGREDIENTE = criaElementoEAtributo(ESTRUTURA.h3, ESTRUTURA.attrClass, 'conteudo__body-quantidade');

                INFO_INGREDIENTE.innerText = `${INGREDIENTE_DRINK} - ${QUANT_INGREDIENTE_DRINK}`;

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
}

function listaDrinks(lista){
    const LISTA_DRINK = lista.drinks;

    LISTA_DRINK.forEach((item) => {
        if(item.strAlcoholic === "Alcoholic"){
            criarEstrutura(item)
        };
    });
};

BTN_PESQUISAR_DRINK.addEventListener('click', (e)=>{
    e.preventDefault();
    const VALOR_SELECT = SELECT.value;
    pesquisarDrink(VALOR_SELECT);
});

BTN_PESQUISAR_DRINK.addEventListener('keyup', (e)=>{
    e.preventDefault();
    if(e.code === 'Enter'){
        const VALOR_SELECT = SELECT.value;
        pesquisarDrink(VALOR_SELECT);
    }
});