function iniciarAventura() {
    const nomeJogadorInput = document.getElementById('nome');
    const sexoSelecionadoInput = document.querySelector('input[name="sexo"]:checked');

    if (!nomeJogadorInput) {
        console.error("Campo de nome não encontrado!");
        return;
    }

    const nomeJogador = nomeJogadorInput.value.trim();

    if (!nomeJogador) {
        alert("Por favor, digite seu nome para começar!");
        nomeJogadorInput.focus();
        return;
    }

    if (!sexoSelecionadoInput) {
        alert("Por favor, selecione uma identidade de gênero!");
        return;
    }

    localStorage.setItem('nomeJogador', nomeJogador);
    localStorage.setItem('sexoJogador', sexoSelecionadoInput.value);

    window.location.href = 'pages/escolhaTema.html';
}

function formatarMensagem(template, nome, genero) {
    let mensagem = template.replace(/{nome}/g, nome);
    mensagem = mensagem.replace(/{genero:([^:]+):([^}]+)}/g, (match, masculino, feminino) => {
        return genero === 'F' ? feminino : masculino;
    });
    return mensagem;
}

function irParaJogo(personagem) {
    if (personagem === 'frieren') {
        window.location.href = "../pages/frieren.html";
    } else if (personagem === 'stark') {
        window.location.href = "../pages/stark.html";
    } else {
        window.location.href = "../pages/fern.html";
    }
}

const mensagensPersonagens = {
    frieren: { acerto: "Hmm, {nome}, parece que você tem alguma sabedoria. Acertou!", maior: "Minha mana é vasta, {nome}, mas esse número precisa ser maior.", menor: "Seja mais conciso, {nome}. É um número menor.", derrota: "A jornada termina aqui, {nome}? Pelo menos eu tentei...", vitoria: "Mais um feitiço concluído com sucesso. Parabéns, {nome}!", erroInput: "Ops, {nome}! Digite um número válido. Não me faça esperar.", dificuldadeFacil: "Fácil: Um desafio simples para você, {nome}. Números de 1 a 10 com 3 tentativas.", dificuldadeMedio: "Médio: Um teste de intuição, {nome}. Números de 1 a 50 com 7 tentativas.", dificuldadeDificil: "Difícil: Um feitiço complexo, {nome}. Adivinhe de 1 a 100 em 10 tentativas." },
    stark: { acerto: "YEAH, {nome}! Você acertou! Isso foi incrível!", maior: "É mais alto que isso, {nome}! Mostre sua força!", menor: "Um pouco para baixo, {genero:meu amigo:minha amiga}! Tente de novo!", derrota: "Ah não, {nome}! Eu deveria ter sido mais forte...", vitoria: "VITÓRIA, {nome}! Somos os melhores, não somos?!", erroInput: "Ei {nome}, isso não é um número! Tente de novo, por favor.", dificuldadeFacil: "Fácil? Moleza! De 1 a 10 e 3 chances pra acertar! Vamos nessa, {nome}!", dificuldadeMedio: "Médio! Agora sim! De 1 a 50 com 7 tentativas. Sem medo, {nome}!", dificuldadeDificil: "Difícil! O desafio supremo! Adivinhe de 1 a 100 em 10 chances. Mostre seu poder, {nome}!" },
    fern: { acerto: "Correto, {nome}. Previsível para alguém com seu potencial.", maior: "É necessário mais esforço, {nome}. O número é maior.", menor: "Seja mais {genero:específico:específica}. O número é menor.", derrota: "Senhorita Frieren... Não deu certo, {nome}. Da próxima vez, tente se concentrar mais.", vitoria: "Um resultado satisfatório. Agradeço sua dedicação, {nome}.", erroInput: "Isso não é um número apropriado. Por favor, digite corretamente, {nome}.", dificuldadeFacil: "Nível Fácil, {nome}. Adivinhe um número entre 1 e 10. Você possui 3 tentativas.", dificuldadeMedio: "Nível Médio. O alcance é de 1 a 50, com 7 tentativas, {nome}. Não se distraia.", dificuldadeDificil: "Nível Difícil, {nome}. O número está entre 1 e 100. Você tem 10 tentativas." }
};

let dificuldadeAtual = 'nao-definida';
let maxNumeroParaDificuldade;

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    const formInicial = document.getElementById('formulario');
    if (formInicial && formInicial.querySelector('.botao-aventura')) {
        formInicial.addEventListener('submit', function (event) {
            event.preventDefault();
            iniciarAventura();
        });
    }

    const personagens = document.querySelectorAll('.personagem');
    if (personagens.length > 0) {
        const designTexto = document.getElementById('textoEscolhaTema');
        if (designTexto) {
            body.classList.add('fundo-padrao');
            personagens.forEach(personagem => {
                personagem.addEventListener('mouseenter', () => {
                    const personagemId = personagem.id;
                    body.classList.remove('fundo-frieren', 'fundo-stark', 'fundo-fern', 'fundo-padrao');
                    if (personagemId === 'personagem-frieren') { body.classList.add('fundo-frieren'); designTexto.classList.add("textoFrieren"); }
                    else if (personagemId === 'personagem-stark') { body.classList.add('fundo-stark'); designTexto.classList.add("textoStark"); }
                    else if (personagemId === 'personagem-fern') { body.classList.add('fundo-fern'); designTexto.classList.add("textoFern"); }
                });
                personagem.addEventListener('mouseleave', () => {
                    body.classList.remove('fundo-frieren', 'fundo-stark', 'fundo-fern');
                    designTexto.classList.remove('textoFrieren', 'textoStark', 'textoFern');
                    body.classList.add('fundo-padrao');
                });
            });
        }
    }

    const inputpalpiteNumerico = document.getElementById("palpiteNumerico");
    if (inputpalpiteNumerico) {
        const btnVerificar = document.getElementById("btnVerificar");
        const btnReiniciar = document.getElementById("btnReiniciar");
        const btnVoltarMenu = document.getElementById("btnVoltarMenu");
        const textoPalpite = document.getElementById("textoPalpite");
        const dificuldadeBotoesDiv = document.querySelector('.dificuldade-botoes');
        const personagemNoJogo = document.getElementById('personagemNoJogo');
        const balaoMensagem = document.getElementById('balaoMensagem');
        const textoBalao = document.getElementById('textoBalao');
        const somPulo = document.getElementById('somPulo');
        let numeroSecretoDoComputador, tentativas, timerBalao;

        const personagemDaPagina = getCharacterFromUrl();
        if (personagemDaPagina) {
            body.classList.add(`fundo-${personagemDaPagina}`);
        }

        const dificuldadeBotoes = document.querySelectorAll('.dificuldade-botoes button');
        dificuldadeBotoes.forEach(button => {
            button.addEventListener('mouseenter', () => {
                const dificuldade = button.dataset.dificuldade;
                const personagemAtual = getCharacterFromUrl();
                const msgs = mensagensPersonagens[personagemAtual];
                let mensagem = '';
                if (dificuldade === 'facil') { mensagem = msgs.dificuldadeFacil; }
                else if (dificuldade === 'medio') { mensagem = msgs.dificuldadeMedio; }
                else { mensagem = msgs.dificuldadeDificil; }
                mostrarMensagemPersonagem(mensagem, true);
            });
            button.addEventListener('mouseleave', () => { esconderBalao(); });
        });

        function mostrarMensagemPersonagem(templateMensagem, persistir = false) {
            const nomeJogador = localStorage.getItem('nomeJogador') || 'Aventureiro(a)';
            const sexoJogador = localStorage.getItem('sexoJogador') || 'M';
            const mensagemFinal = formatarMensagem(templateMensagem, nomeJogador, sexoJogador);
            clearTimeout(timerBalao);
            textoBalao.textContent = mensagemFinal;
            balaoMensagem.classList.add('mostrar-balao');
            personagemNoJogo.classList.add('pulo');
            if (somPulo) { somPulo.currentTime = 0; somPulo.play(); }
            personagemNoJogo.addEventListener('animationend', () => { personagemNoJogo.classList.remove('pulo'); }, { once: true });
            if (!persistir) { timerBalao = setTimeout(() => { esconderBalao(); }, 8000); }
        }

        function esconderBalao() {
            if (balaoMensagem) balaoMensagem.classList.remove('mostrar-balao');
        }

        function iniciarNovoJogo() {
            const personagemAtual = getCharacterFromUrl();
            document.body.classList.remove(`fundo-vitoria-${personagemAtual}`, `fundo-derrota-${personagemAtual}`);
            document.body.classList.add(`fundo-${personagemAtual}`);
            if (personagemNoJogo) personagemNoJogo.style.display = 'block';
            if (formInicial) formInicial.style.display = "block";

            if (dificuldadeAtual === 'nao-definida') {
                if (document.getElementById('tentativaForm')) document.getElementById('tentativaForm').style.display = "none";
                if (btnReiniciar) btnReiniciar.style.display = "none";
                if (btnVoltarMenu) btnVoltarMenu.style.display = "none";
                if (dificuldadeBotoesDiv) dificuldadeBotoesDiv.style.display = "block";
                if (textoPalpite) textoPalpite.classList.add('escondido');
                return;
            }

            let numTentativas;
            if (dificuldadeAtual === 'facil') { maxNumeroParaDificuldade = 10; numTentativas = 3; }
            else if (dificuldadeAtual === 'medio') { maxNumeroParaDificuldade = 50; numTentativas = 7; }
            else { maxNumeroParaDificuldade = 100; numTentativas = 10; }

            numeroSecretoDoComputador = Math.floor(Math.random() * maxNumeroParaDificuldade) + 1;
            tentativas = numTentativas;

            inputpalpiteNumerico.value = '';
            if (document.getElementById("result")) document.getElementById("result").textContent = "";
            if (btnVerificar) btnVerificar.style.display = "block";
            if (textoPalpite) textoPalpite.classList.remove('escondido');
            if (btnReiniciar) btnReiniciar.style.display = "none";
            if (btnVoltarMenu) btnVoltarMenu.style.display = "none";
            esconderBalao();
            clearTimeout(timerBalao);
            if (document.getElementById('tentativaForm')) document.getElementById('tentativaForm').style.display = "block";
            if (dificuldadeBotoesDiv) dificuldadeBotoesDiv.style.display = "none";
        }

        window.checarResultado = function () {
            esconderBalao();
            let palpiteUsuario = Number(inputpalpiteNumerico.value.trim());
            const personagemAtual = getCharacterFromUrl();
            const msgs = mensagensPersonagens[personagemAtual];
            if (palpiteUsuario === 0 || isNaN(palpiteUsuario) || palpiteUsuario < 1 || palpiteUsuario > maxNumeroParaDificuldade) {
                mostrarMensagemPersonagem(msgs.erroInput + ` O número deve ser entre 1 e ${maxNumeroParaDificuldade}.`);
                return;
            }
            tentativas -= 1;
            if (palpiteUsuario === numeroSecretoDoComputador) {
                if (textoPalpite) textoPalpite.classList.add('escondido');
                mostrarMensagemPersonagem(msgs.vitoria, true);
                if (document.getElementById('tentativaForm')) document.getElementById('tentativaForm').style.display = "none";
                if (formInicial) formInicial.style.display = "none";
                document.body.classList.remove(`fundo-${personagemAtual}`);
                document.body.classList.add(`fundo-vitoria-${personagemAtual}`);
                if (personagemNoJogo) personagemNoJogo.style.display = 'block';
                if (btnReiniciar) btnReiniciar.style.display = "block";
                if (btnVoltarMenu) btnVoltarMenu.style.display = "block";
                if (btnVerificar) btnVerificar.style.display = "none";
            } else if (tentativas === 0) {
                if (textoPalpite) textoPalpite.classList.add('escondido');
                mostrarMensagemPersonagem(msgs.derrota + ` O número era ${numeroSecretoDoComputador}.`, true);
                if (document.getElementById('tentativaForm')) document.getElementById('tentativaForm').style.display = "none";
                if (formInicial) formInicial.style.display = "none";
                document.body.classList.remove(`fundo-${personagemAtual}`);
                document.body.classList.add(`fundo-derrota-${personagemAtual}`);
                if (personagemNoJogo) personagemNoJogo.style.display = 'block';
                if (btnReiniciar) btnReiniciar.style.display = "block";
                if (btnVoltarMenu) btnVoltarMenu.style.display = "block";
                if (btnVerificar) btnVerificar.style.display = "none";
            } else if (palpiteUsuario < numeroSecretoDoComputador) {
                mostrarMensagemPersonagem(msgs.maior + ` Restam ${tentativas} tentativas.`);
            } else {
                mostrarMensagemPersonagem(msgs.menor + ` Restam ${tentativas} tentativas.`);
            }
            inputpalpiteNumerico.value = '';
        }

        btnReiniciar.addEventListener('click', () => {
            dificuldadeAtual = 'nao-definida';
            iniciarNovoJogo();
            document.querySelectorAll('.dificuldade-botoes button').forEach(btn => {
                btn.classList.remove('ativo');
            });
        });

        window.mudarDificuldade = function (novaDificuldade, event) {
            dificuldadeAtual = novaDificuldade;
            esconderBalao();
            iniciarNovoJogo();
            document.querySelectorAll('.dificuldade-botoes button').forEach(btn => {
                btn.classList.remove('ativo');
            });
            event.target.classList.add('ativo');
        }

        iniciarNovoJogo();
    }

    const musicButton = document.getElementById('botao-musica');
    const audio = document.getElementById('musica-fundo');
    const musicIcon = document.getElementById('icone-musica');

    if (musicButton && audio && musicIcon) {
        const isSubPage = window.location.pathname.includes('/pages/');
        const basePath = isSubPage ? '../assets/' : './assets/';
        const iconPathOn = `${basePath}icon-music-on.svg`;
        const iconPathOff = `${basePath}icon-music-off.svg`;

        function salvarEstadoMusica() {
            localStorage.setItem('musicaTempo', audio.currentTime);
            localStorage.setItem('musicaPausada', audio.paused);
        }

        window.addEventListener('beforeunload', salvarEstadoMusica);

        const tempoSalvo = localStorage.getItem('musicaTempo');
        const estavaPausada = localStorage.getItem('musicaPausada') === 'true';

        if (tempoSalvo) {
            audio.currentTime = parseFloat(tempoSalvo);
        }

        if (!estavaPausada) {
            audio.muted = false;
            audio.volume = 0.3;
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Autoplay da música bloqueado. O ícone ficará como 'desligado'.");
                    musicIcon.src = iconPathOff;
                });
            }
        } else {
            musicIcon.src = iconPathOff;
        }

        musicButton.addEventListener('click', () => {
            if (audio.paused) {
                audio.muted = false;
                audio.volume = 0.3;
                audio.play();
            } else {
                audio.pause();
            }
        });

        audio.addEventListener('pause', () => {
            musicIcon.src = iconPathOff;
        });

        audio.addEventListener('play', () => {
            musicIcon.src = iconPathOn;
        });
    }

    const iconeAjuda = document.querySelector('.icone-ajuda');
    if (iconeAjuda) {
        window.abrirAjuda = async function () {
            const container = document.getElementById('container-ajuda');
            if (!container) return;
            if (container.innerHTML.trim() === '') {
                try {
                    let caminhoParaAjuda = '';

                    if (window.location.pathname.includes('/pages/')) {
                        caminhoParaAjuda = 'popUpAjuda.html';
                    } else {
                        caminhoParaAjuda = 'pages/popUpAjuda.html';
                    }

                    const resposta = await fetch(caminhoParaAjuda);

                    if (!resposta.ok) {
                        throw new Error(`Arquivo de ajuda não encontrado em: ${caminhoParaAjuda}`);
                    }

                    const html = await resposta.text();

                    container.innerHTML = `
                        <div class="modal-wrapper-ajuda">
                            <span class="modal-fechar-ajuda">×</span>
                            ${html}
                        </div>
                    `;
                }
                catch (erro) {
                    console.error("Erro ao carregar ajuda:", erro);
                    container.innerHTML = `<div class="modal-wrapper-ajuda" style="padding:20px; text-align:center; color:red;">Erro ao carregar o conteúdo da ajuda.</div>`;
                }
            }
            container.classList.add('visivel');
        }

        window.fecharAjuda = function () {
            const container = document.getElementById('container-ajuda');
            if (container) {
                container.classList.remove('visivel');
            }
        }

        document.addEventListener('click', function (event) {
            const container = document.getElementById('container-ajuda');
            if (!container || !container.classList.contains('visivel')) { return; }
            if (event.target.closest('.modal-fechar-ajuda') || event.target === container) {
                fecharAjuda();
            }
        });
    }
});

function getCharacterFromUrl() {
    const path = window.location.pathname;
    if (path.includes('frieren.html')) return 'frieren';
    if (path.includes('stark.html')) return 'stark';
    if (path.includes('fern.html')) return 'fern';
    return null;
}