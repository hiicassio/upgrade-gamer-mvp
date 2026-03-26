// ================= CONFIG =================

const IS_LOCAL = window.location.hostname === "localhost";

const CONFIG = {
    API_URL: IS_LOCAL ? "http://localhost:3000" : null,
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
    if (CONFIG.API_URL) {
        // 🔹 Ambiente local (backend real)
        const response = await fetch(`${CONFIG.API_URL}/anuncios`, {
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

    } else {
        // 🔹 Ambiente produção (mock)
        console.log("Anúncio enviado (mock):", formData);
        alert('Anúncio publicado com sucesso! (modo teste)');
        window.location.href = 'vitrine.html';
    }

} catch (error) {
    console.error('Erro:', error);
    alert('Erro ao conectar com o servidor');
}

// ================= CARREGAR PREVIEW =================

async function carregarPreview() {
    try {
        let anuncios;

        if (CONFIG.API_URL) {
            // 🔹 Ambiente local (backend real)
            const response = await fetch(`${CONFIG.API_URL}/anuncios`);
            anuncios = await response.json();
        } else {
            // 🔹 Ambiente produção (mock)
            anuncios = [
                {
                    titulo: "Conta Valorant",
                    preco: 150,
                    plataforma: "PC",
                    whatsapp: "67999999999",
                    foto_url: "https://via.placeholder.com/150"
                },
                {
                    titulo: "Conta Free Fire",
                    preco: 80,
                    plataforma: "Mobile",
                    whatsapp: "67988888888",
                    foto_url: "https://via.placeholder.com/150"
                }
            ];
        }

        const grid = document.getElementById('grid-jogos');
        if (!grid) return;

        if (anuncios.length === 0) {
            grid.innerHTML = '<p class="nenhum-anuncio">Nenhum anúncio publicado ainda</p>';
            return;
        }

        // 👇 aqui continua seu código normal de renderização

    } catch (error) {
        console.error("Erro ao carregar anúncios:", error);
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