function irParaJogo(personagem) {
    if (personagem == 'frieren') {
        window.location.href = "./pages/frieren.html"
    }

    else if (personagem == 'stark') {
        window.location.href = "./pages/stark.html"
    }

    else {
        window.location.href = "./pages/fern.html"
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const personagens = document.querySelectorAll('.personagem');
    const designTexto = document.getElementById('textoEscolhaTema');

    personagens.forEach(personagem => {
        // Evento quando o mouse entra na div do personagem
        personagem.addEventListener('mouseenter', () => {
            // Pega o ID completo da div do personagem (e.g., 'personagem-frieren')
            const personagemId = personagem.id;

            // Remove todas as classes de fundo existentes do body
            body.classList.remove('fundo-frieren', 'fundo-stark', 'fundo-fern', 'fundo-padrao');

            // Adiciona a classe de fundo correspondente ao ID do personagem
            if (personagemId === 'personagem-frieren') {
                body.classList.add('fundo-frieren');
                designTexto.classList.add("textoFrieren");
            } else if (personagemId === 'personagem-stark') {
                body.classList.add('fundo-stark');
                designTexto.classList.add("textoStark");
            } else if (personagemId === 'personagem-fern') {
                body.classList.add('fundo-fern');
                designTexto.classList.add("textoFern");
            }
        });

        // Evento quando o mouse sai da div do personagem
        personagem.addEventListener('mouseleave', () => {
            // Remove todas as classes de fundo e adiciona a classe de fundo padrão
            body.classList.remove('fundo-frieren', 'fundo-stark', 'fundo-fern');
            designTexto.classList.remove('textoFrieren', 'textoStark', 'textoFern');
            body.classList.add('fundo-padrao');
        });
    });

});

document.addEventListener('DOMContentLoaded', () => {
    let inputpalpiteNumerico = document.getElementById("palpiteNumerico");
    let resultado = document.getElementById("result");
    let btnVerificar = document.getElementById("btnVerificar");
    let btnReiniciar = document.getElementById("btnReiniciar");
    btnReiniciar.style.display = "none";

    let numeroSecretoDoComputador;
    let tentativas;

    let mostrarTentativas = document.getElementById('tentativas');
    let tentativasRestantes = document.getElementById('tentativasRestantes')
    
    mostrarTentativas.textContent = tentativas;
    tentativasRestantes.style.display = "none";
    btnVoltarMenu.style.display = "none";

    numeroSecretoDoComputador = Math.floor(Math.random() * 50) + 1;

    tentativas = 10;

    function iniciarNovoJogo() {
        numeroSecretoDoComputador = Math.floor(Math.random() * 50) + 1;
        tentativas = 10;
        tentativas -= 1;
        inputpalpiteNumerico.value = '';
        limparResultado();
        btnVerificar.style.display = "block";
        textoPalpite.style.display = "block";
        tentativasRestantes.style.display = "none";
        btnReiniciar.style.display = "none";
        btnVoltarMenu.style.display = "none";
    }

    window.checarResultado = function () {
        
    let palpiteUsuario = Number(inputpalpiteNumerico.value.trim());

        if (palpiteUsuario === "") {
            tentativas = tentativas;
            alert("Ops! Por favor, digite um número antes de tentar adivinhar.");
            return;
        }

        if (isNaN(palpiteUsuario) || palpiteUsuario <= 0 || palpiteUsuario > 50) {
            tentativas = tentativas;
            alert("Por favor, digite um número válido entre 1 e 50.");
            return;
        }

        tentativasRestantes.style.display = 'block'
        tentativasRestantes.textContent = 'Tentativas : '+ tentativas

        tentativas -= 1;

        if (palpiteUsuario === numeroSecretoDoComputador) {
            textoPalpite.style.display = "none";
            resultado.textContent = `🎉 Parabéns! Você acertou! 🎉`;
            btnReiniciar.style.display = "block";
            btnVoltarMenu.style.display = "block";
            tentativasRestantes.style.display = "block";
            btnVerificar.style.display = "none";
        }

        else if (tentativas < 0) {
            textoPalpite.style.display = "none";
            resultado.textContent = `Fim de jogo! Você não acertou em 10 tentativas. O número era ${numeroSecretoDoComputador}.`;
            btnReiniciar.style.display = "block";
            btnVoltarMenu.style.display = "block";
            btnVerificar.style.display = "none";
            tentativasRestantes.style.display = "none";
        }

        else if (palpiteUsuario < numeroSecretoDoComputador) {
            resultado.textContent = `😉 Dica: O número secreto é maior!! 😉`;
        }

        else {
            resultado.textContent = `😉 Dica: O número secreto é menor!! 😉`;
        }

        resultado.style.display = "block";
    }

    function limparResultado() {
        resultado.style.display = "none";
        resultado.textContent = "";
    }

    inputpalpiteNumerico.addEventListener("input", limparResultado);
    btnReiniciar.addEventListener('click', iniciarNovoJogo);
    btnReiniciar.addEventListener('click', iniciarNovoJogo);
});