// ================= CONFIG =================

const CONFIG = {
    API_URL: null, // 🔥 SEM BACKEND POR ENQUANTO
    STORAGE_KEYS: {
        USERS: "usuarios_mvp",
        SESSION: "usuario_logado",
        ANUNCIOS: "anuncios_mvp"
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
        id: Date.now(),
        titulo: document.getElementById('nomeJogo')?.value,
        foto_url: document.getElementById('fotoJogo')?.value,
        whatsapp: document.getElementById('whatsapp')?.value,
        preco: document.getElementById('preco')?.value,
        plataforma: document.getElementById('plataforma')?.value
    };

    try {
        // 🔥 SALVA NO LOCALSTORAGE (mock banco)
        let anuncios = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.ANUNCIOS)) || [];

        anuncios.push(formData);

        localStorage.setItem(CONFIG.STORAGE_KEYS.ANUNCIOS, JSON.stringify(anuncios));

        alert('Anúncio publicado com sucesso!');
        window.location.href = 'vitrine.html';

    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao salvar anúncio');
    }
}

// ================= CARREGAR PREVIEW =================

function carregarPreview() {
    try {
        let anuncios = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.ANUNCIOS)) || [];

        const grid = document.getElementById('grid-jogos');
        if (!grid) return;

        if (anuncios.length === 0) {
            grid.innerHTML = '<p class="nenhum-anuncio">Nenhum anúncio publicado ainda</p>';
            return;
        }

        grid.innerHTML = "";

        anuncios.forEach(anuncio => {
            grid.innerHTML += `
                <div class="card">
                    <img src="${anuncio.foto_url || 'https://via.placeholder.com/150'}" alt="jogo">
                    <h3>${anuncio.titulo}</h3>
                    <p>${anuncio.plataforma}</p>
                    <strong>R$ ${anuncio.preco}</strong>
                    <a href="https://wa.me/55${anuncio.whatsapp}" target="_blank">Contato</a>
                </div>
            `;
        });

    } catch (error) {
        console.error("Erro ao carregar anúncios:", error);
    }
}

// ================= AUTENTICAÇÃO =================

function initLoginPage() {
    const form = document.getElementById("authForm");
    if (!form) return;

    const formTitle = document.getElementById("formTitle");
    const toggleLink = document.getElementById("toggleLink");
    const nomeGroup = document.getElementById("nomeGroup");
    const btnSubmit = document.getElementById("btnSubmit");

    let isLogin = true;

    function atualizarUI() {
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

    toggleLink?.addEventListener("click", function(e) {
        e.preventDefault();
        isLogin = !isLogin;
        atualizarUI();
    });

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
                alert("Login realizado!");
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

            alert("Conta criada!");
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

    if (usuario && document.getElementById("authForm")) {
        window.location.href = "index.html";
    }
}

// ================= INIT =================

document.addEventListener("DOMContentLoaded", function() {
    checkUser();

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