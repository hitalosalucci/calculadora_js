window.onload = function(){

//variaveis elementos
const botoesCalculadora = document.querySelectorAll(".calculadora-botao");
const telaNumero = document.querySelector(".numero-tela");
const telaResultadoParcial = document.querySelector(".resultado-parcial-tela");

//variaveis ambiente
let calculadoraLigada = false;
let mostrandoResultado = false;
let apertouIgual = false;

let operadorConta;
let numeroAnterior;

let resultadoParcial = '';
let valorContaAtual = 0;
let numeroDigitadoTela = '';

//adicionar para cada botão uma ação de on click
for (let i = 0; i < botoesCalculadora.length; i++) {
    botoesCalculadora[i].onclick = clicouBotao;
}

function clicouBotao(){
    tipoBotao = this.dataset.tipo;
    valorBotao = this.dataset.valor;
    
    if (valorBotao == 'onoff')
        ligarDesligarCalculadora();
    else 
        verificaSeCalculadoraEstaLigada(tipoBotao, valorBotao);
}

function verificaSeCalculadoraEstaLigada(tipoBotao, valorBotao){

    if (calculadoraLigada){

        if(tipoBotao == 'numerico')
            adicionarNumeroDigitado(valorBotao);
        else if(tipoBotao == 'operacao')
                adicionarOperacao(valorBotao);
        else if(tipoBotao == 'acao')
            realizarAcao(valorBotao);
    }
    else
        alert('A calculadora está desligada! Ligue-a e tente novamente');
}

function ligarDesligarCalculadora(){
    
    const statusCalculadora = document.querySelector(".calculadora-status div");

    if (calculadoraLigada){
        calculadoraLigada = false;
        statusCalculadora.classList.remove('calculadora-ligada');
        statusCalculadora.classList.add('calculadora-desligada');
        statusCalculadora.innerHTML = 'OFF';

        zerarValoresCalculadora();
        atualizarNaTela();
        telaNumero.innerHTML = '';
    }
    else{
        calculadoraLigada = true;
        statusCalculadora.classList.remove('calculadora-desligada');
        statusCalculadora.classList.add('calculadora-ligada');
        statusCalculadora.innerHTML = 'ON';
        atualizarNaTela();
    }
}

function validarNumeroDigitado(valorDigitado){

    if (valorDigitado == '.' && numeroDigitadoTela == '')
        return '0.';    
    else if (valorDigitado == '.' && numeroDigitadoTela.indexOf('.') != -1) //vai impedir que seja adicionado 2 pontos no numero
        return '';
    else if (valorDigitado == '0' && (numeroDigitadoTela == '' || numeroDigitadoTela == '0')) //vai impedir que seja adicionado 2 pontos no numero
        return '';
    else
        return valorDigitado;

}

function adicionarNumeroDigitado(valor)
{
    if (mostrandoResultado)
        numeroDigitadoTela = '';

    apertouIgual = false;
    mostrandoResultado = false;
    numeroDigitadoTela = numeroDigitadoTela+validarNumeroDigitado(valor);
    atualizarNaTela();

}


function realizarAcao(valor){

    switch (valor) {
        case 'C':
            resetValoresCalculadora();
            break;
        case '=':
            if (!apertouIgual)
                mostrarResultado();
                break;
        case 'backspace':
            apagarUltimoNumeroDigitado();
            break;
    }
}

function separarNumerosDosSinalDeOperacao(numerosOperacao, sinal)
{

    let numerosSeparados = numerosOperacao.split(sinal);

    primeiroNumero = parseFloat(numerosSeparados[0]);
    segundoNumero = parseFloat(numerosSeparados[1]);

    return [primeiroNumero, segundoNumero, sinal];
}

function adicionarResultadoParcial(numeroAnterior, sinalOperacao, resultadoFinal = false){

    if (resultadoFinal == true){ //se for a últma conta(apertou igual)
        resultadoParcial = resultadoParcial+' '+numeroDigitadoTela+' = ';
    }else{ //se não for o ultimo resultado, mostre isso

        if (numeroAnterior == null)
            resultadoParcial = resultadoParcial.replace(resultadoParcial.slice(-1), sinalOperacao);
        else
            resultadoParcial = numeroAnterior+' '+sinalOperacao;

    }  

}

function adicionarOperacao(sinalOperacao){
    
    if (numeroAnterior === undefined){

        operadorConta = sinalOperacao;
        numeroAnterior = numeroDigitadoTela;

        adicionarResultadoParcial(numeroAnterior, operadorConta);
        atualizarNaTela();
        numeroDigitadoTela = '';
    
    }else{

        if (apertouIgual == false && (numeroDigitadoTela == '' || numeroDigitadoTela == 0)){
            operadorConta = sinalOperacao;
            adicionarResultadoParcial(null, operadorConta);
            atualizarNaTela('resultadoParcial');
        }else if (apertouIgual){

            apertouIgual = false;

            numeroDigitadoTela = valorContaAtual;
            operadorConta = sinalOperacao;

            adicionarResultadoParcial(numeroAnterior, operadorConta);
            atualizarNaTela();

        }else{

            let arrNumerosOperacao = separarNumerosDosSinalDeOperacao(numeroAnterior+operadorConta+numeroDigitadoTela, operadorConta);
            realizarOperacao(arrNumerosOperacao)
            operadorConta = sinalOperacao;

            numeroDigitadoTela = valorContaAtual;
            mostrandoResultado = true;

            numeroAnterior = numeroDigitadoTela;

            adicionarResultadoParcial(numeroAnterior, operadorConta);
            atualizarNaTela();

            numeroDigitadoTela = '';

        }
    }

}

function apagarUltimoNumeroDigitado(){
    
    if (numeroDigitadoTela != ''){
        numeroDigitadoTela = numeroDigitadoTela.substr(0, numeroDigitadoTela.length-1);
        atualizarNaTela();
    }

}

function mostrarResultado(){

    mostrandoResultado = true;
    resultadoFinal = true;

    let arrNumerosOperacao = separarNumerosDosSinalDeOperacao(numeroAnterior+operadorConta+numeroDigitadoTela, operadorConta);
    realizarOperacao(arrNumerosOperacao)

    adicionarResultadoParcial(numeroAnterior, operadorConta, true);//passando parametro de que o é o resultado final que deve ser mostrado

    numeroDigitadoTela = valorContaAtual;

    numeroAnterior = numeroDigitadoTela;

    atualizarNaTela();

    apertouIgual = true;

}

function realizarOperacao(arrNumerosOperacao){

    let primeiroNumero = arrNumerosOperacao[0]; 
    let segundoNumero = arrNumerosOperacao[1]; 
    let operacao = arrNumerosOperacao[2];
    
        if (operacao == '+')
            var resultadoOperacao = primeiroNumero+segundoNumero;
        else if (operacao == '-')
            var resultadoOperacao = primeiroNumero-segundoNumero;
        else if (operacao == '/')
            var resultadoOperacao = primeiroNumero/segundoNumero;
        else if (operacao == '×')
            var resultadoOperacao = primeiroNumero*segundoNumero;

        valorContaAtual = resultadoOperacao; 

}

function zerarValoresCalculadora(){

    mostrandoResultado = false;
    apertouIgual = false;

    operadorConta = undefined;
    numeroAnterior = undefined;
    
    resultadoParcial = '';
    valorContaAtual = 0;
    numeroDigitadoTela = '';
}

function resetValoresCalculadora(){
    zerarValoresCalculadora();
    atualizarNaTela();
}

function atualizarNaTela(parametroAtualizacao = null){

    if (parametroAtualizacao == null){ //se não tiver nenhum parametro atualiza toda a tela

        telaResultadoParcial.innerHTML = resultadoParcial;

        if (numeroDigitadoTela == '')
            telaNumero.innerHTML = '0';
        else
            telaNumero.innerHTML = numeroDigitadoTela;

    } else if(parametroAtualizacao == 'resultadoParcial'){
        telaResultadoParcial.innerHTML = resultadoParcial;
    } else if(parametroAtualizacao == 'numeroDigitadoTela'){
        if (numeroDigitadoTela == '')
            telaNumero.innerHTML = '0';
        else
            telaNumero.innerHTML = numeroDigitadoTela;
    }

}

}
