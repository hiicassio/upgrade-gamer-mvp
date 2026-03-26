// ================= CONFIG =================

const CONFIG = {
    API_URL: "http://localhost:3000/anuncios",
    STORAGE_KEYS: {
        USERS: "usuarios_mvp",
        SESSION: "usuario_logado"
    }
};

// ================= PUBLICAR ANÚNCIO =================

async function publicarAnuncio(event) {
    event.preventDefault();

    const usuarioLogado = localStorage.getItem(CONFIG.STORAGE_KEYS.SESSION);
    if (!usuarioLogado) {
        alert("Você precisa estar logado para publicar um anúncio.");
        window.location.href = "login.html";
        return;
    }

    const formData = {
        titulo: document.getElementById('nomeJogo')?.value,
        foto: document.getElementById('fotoJogo')?.value,
        whatsapp: document.getElementById('whatsapp')?.value,
        preco: document.getElementById('preco')?.value,
        plataforma: document.getElementById('plataforma')?.value
    };

    try {
        const response = await fetch(CONFIG.API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Anúncio publicado com sucesso!');
            window.location.href = 'vitrine.html';
        } else {
            alert('Erro ao publicar anúncio');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor');
    }
}

// ================= CARREGAR PREVIEW =================

async function carregarPreview() {
    try {
        const response = await fetch(CONFIG.API_URL);
        const anuncios = await response.json();

        const grid = document.getElementById('grid-jogos');
        if (!grid) return;

        if (anuncios.length === 0) {
            grid.innerHTML = '<p class="nenhum-anuncio">Nenhum anúncio publicado ainda</p>';
            return;
        }

        const previewAnuncios = anuncios.slice(0, 3);

        grid.innerHTML = previewAnuncios.map(anuncio => `
        <div class="card-jogo">
            <div class="card-imagem">
                <img 
                    class="img-anuncio"
                    src="${anuncio.foto_url || anuncio.foto || '../assets/consoles/spiderman-ps5.png'}" 
                    alt="${anuncio.titulo}"
                    onerror="this.src='../assets/consoles/spiderman-ps5.png'"
                >
                <span class="badge-plataforma">${anuncio.plataforma}</span>
            </div>
            <div class="card-info">
                <h4>${anuncio.titulo}</h4>
                <p class="preco">R$ ${anuncio.preco}</p>
            </div>
        </div>
        `).join('');

    } catch (error) {
        console.error('Erro ao carregar preview:', error);
    }
}

// ================= AUTENTICAÇÃO =================

function initLoginPage() {
    console.log("Inicializando página de login");

    const form = document.getElementById("authForm");
    if (!form) return;

    const formTitle = document.getElementById("formTitle");
    const toggleLink = document.getElementById("toggleLink");
    const nomeGroup = document.getElementById("nomeGroup");
    const btnSubmit = document.getElementById("btnSubmit");

    let isLogin = true; // 🔥 COMEÇA EM LOGIN

    function atualizarUI() {
        if (!formTitle || !btnSubmit || !toggleLink) return;

        if (isLogin) {
            formTitle.innerText = "Login";
            btnSubmit.innerText = "Entrar";
            if (nomeGroup) nomeGroup.style.display = "none";
            toggleLink.innerText = "Criar Conta";
        } else {
            formTitle.innerText = "Criar Conta";
            btnSubmit.innerText = "Cadastrar";
            if (nomeGroup) nomeGroup.style.display = "block";
            toggleLink.innerText = "Fazer Login";
        }
    }

    if (toggleLink) {
        toggleLink.addEventListener("click", function(e) {
            e.preventDefault();
            isLogin = !isLogin;
            atualizarUI();
        });
    }

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const nome = document.getElementById("nome")?.value;
        const email = document.getElementById("email")?.value;
        const senha = document.getElementById("senha")?.value;

        if (!email || !senha) {
            alert("Preencha email e senha.");
            return;
        }

        let usuarios = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.USERS)) || [];

        if (isLogin) {
            const usuario = usuarios.find(user => user.email === email && user.senha === senha);

            if (usuario) {
                localStorage.setItem(CONFIG.STORAGE_KEYS.SESSION, JSON.stringify(usuario));
                alert("Login realizado com sucesso!");
                window.location.href = "index.html";
            } else {
                alert("Email ou senha incorretos.");
            }
        } else {
            if (!nome) {
                alert("Preencha o nome.");
                return;
            }

            if (usuarios.some(user => user.email === email)) {
                alert("Email já cadastrado.");
                return;
            }

            const novoUsuario = {
                id: Date.now(),
                nome,
                email,
                senha
            };

            usuarios.push(novoUsuario);
            localStorage.setItem(CONFIG.STORAGE_KEYS.USERS, JSON.stringify(usuarios));

            alert("Conta criada! Faça login.");
            isLogin = true;
            atualizarUI();
            form.reset();
        }
    });

    atualizarUI();
}

// ================= LOGOUT =================

function logout() {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.SESSION);
    window.location.href = "login.html";
}

// ================= VERIFICAR USUÁRIO =================

function checkUser() {
    const usuario = localStorage.getItem(CONFIG.STORAGE_KEYS.SESSION);

    // Só redireciona se estiver na tela de login
    if (usuario && document.getElementById("authForm")) {
        window.location.href = "index.html";
    }
}

// ================= INICIALIZAÇÃO =================

document.addEventListener("DOMContentLoaded", function() {
    console.log("Página carregada");

    checkUser();

    // 🔥 Inicialização baseada no DOM (CORRETO)
    if (document.getElementById("authForm")) {
        initLoginPage();
    }

    if (document.getElementById("grid-jogos")) {
        carregarPreview();
    }

    const formAnuncio = document.querySelector('.container-anuncio form');
    if (formAnuncio) {
        formAnuncio.addEventListener('submit', publicarAnuncio);
    }

    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
});