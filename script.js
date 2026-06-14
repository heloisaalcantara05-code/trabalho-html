function checkAuth() {
    let currentPage = window.location.pathname.split('/').pop() || 'index.php';
    let isLogin = (currentPage === 'login.php');
    let usuarioLogado = localStorage.getItem('usuarioLogado');

    // Bloqueia e redireciona se não houver marcação de login e a página não for pública
    if (!usuarioLogado && !isLogin && currentPage !== 'index.php' && currentPage !== '') {
        window.location.href = 'login.php';
    }
}

function loadHeader() {
    let headerPlaceholder = document.getElementById('header-padrao');
    if (headerPlaceholder) {
        fetch('header.html')
            .then(response => response.text())
            .then(data => {
                headerPlaceholder.innerHTML = data;
                setupHeaderDynamic();
            })
            .catch(error => console.error('Erro ao carregar o header:', error));
    }
}

function setupHeaderDynamic() {
    let usuarioLogado = localStorage.getItem('usuarioLogado');
    let topBarContainer = document.getElementById('top-bar-container');
    let mainNav = document.getElementById('main-nav');
    let loginItem = document.getElementById('nav-login-item');
    let currentPage = window.location.pathname.split('/').pop() || 'index.php';

    if (currentPage !== 'login.php') {
        if (mainNav) mainNav.style.display = 'block';
        
        if (usuarioLogado && currentPage === 'index.php') {
            if (topBarContainer) {
                topBarContainer.innerHTML = `
                    <div class="top-bar">
                        <span class="welcome-msg">Bem-vindo(a), <strong>${usuarioLogado}</strong>!</span>
                        <a href="#" onclick="fazerLogout()" class="btn-logout">Sair</a>
                    </div>
                `;
            }
        }
        if (usuarioLogado && loginItem) {
            loginItem.style.display = 'none';
        }
    }

    let navMap = {
        'index.php': 'nav-index',
        'produtos.html': 'nav-produtos',
        'ofertas.html': 'nav-ofertas',
        'contato.html': 'nav-contato',
        'sobre.html': 'nav-sobre'
    };

    let activeId = navMap[currentPage];
    if (activeId) {
        let activeLink = document.getElementById(activeId);
        if (activeLink) activeLink.classList.add('active');
    }
}

function fazerLogout() {
    // Limpa a marcação no JS e manda para o arquivo PHP destruir a sessão real no back-end
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'logout.php';
}

// Inicia as validações e carregamento de interface
checkAuth();
document.addEventListener('DOMContentLoaded', loadHeader);

let carrinho = [];

function adicionarAoCarrinho(id, nome, preco, imagem) {
    for (let i = 0; i < carrinho.length; i++) {
        if (carrinho[i].id === id) {
            carrinho[i].quantidade++;
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            atualizarCarrinho();
            abrirCarrinho();
            return;
        }
    }
    
    carrinho.push({
        id: id,
        nome: nome,
        preco: preco,
        imagem: imagem,
        quantidade: 1
    });
    
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarCarrinho();
    abrirCarrinho();
}

function removerItemCarrinho(id) {
    let novoCarrinho = [];
    for (let i = 0; i < carrinho.length; i++) {
        if (carrinho[i].id !== id) {
            novoCarrinho.push(carrinho[i]);
        }
    }
    carrinho = novoCarrinho;
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarCarrinho();
}

function atualizarCarrinho() {
    let salvo = localStorage.getItem('carrinho');
    if (salvo) {
        carrinho = JSON.parse(salvo);
    }
    
    let lista = document.getElementById('carrinho-itens-lista');
    let totalSpan = document.getElementById('carrinho-subtotal');
    let contador = document.getElementById('carrinho-contador');
    
    if (!lista) return;
    
    if (carrinho.length === 0) {
        lista.innerHTML = '<p style="padding:20px;text-align:center;">Carrinho vazio</p>';
        if (totalSpan) totalSpan.innerText = '0,00';
        if (contador) contador.innerText = '0';
        return;
    }
    
    let html = '';
    let total = 0;
    let totalItens = 0;
    
    for (let i = 0; i < carrinho.length; i++) {
        let item = carrinho[i];
        total += item.preco * item.quantidade;
        totalItens += item.quantidade;
        
        html += '<div style="display:flex; gap:10px; padding:15px; border-bottom:1px solid #eee;">';
        html += '<img src="' + item.imagem + '" style="width:50px; height:50px; object-fit:contain;">';
        html += '<div style="flex:1;">';
        html += '<h4 style="margin:0;">' + item.nome + '</h4>';
        html += '<p style="margin:5px 0; color:green;">R$ ' + item.preco.toFixed(2) + '</p>';
        html += '<p style="margin:0;">Quantidade: ' + item.quantidade + '</p>';
        html += '<button onclick="removerItemCarrinho(\'' + item.id + '\')" style="margin-top:5px; padding:5px 10px; background:#ff6666; border:none; color:white; border-radius:5px;">Remover</button>';
        html += '</div></div>';
    }
    
    lista.innerHTML = html;
    if (totalSpan) totalSpan.innerText = total.toFixed(2);
    if (contador) contador.innerText = totalItens;
}

function abrirCarrinho() {
    let sidebar = document.getElementById('carrinho-sidebar');
    if (sidebar) {
        sidebar.classList.add('active');
    }
}

function fecharCarrinho() {
    let sidebar = document.getElementById('carrinho-sidebar');
    if (sidebar) {
        sidebar.classList.remove('active');
    }
}

function irParaCheckout() {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    window.location.href = 'pagamento.html';
}

function carregarFooter() {
    let footerHTML = '<p>© 2026 Loja Online</p>';
    let footerEl = document.getElementById('footer-padrao');
    if (footerEl) {
        footerEl.innerHTML = footerHTML;
    }
}

carregarFooter();
atualizarCarrinho();

function finalizarPedido(event) {
    // Impede o envio padrao/recarregamento da página
    event.preventDefault(); 

    let modal = document.getElementById('modal-confirmacao');
    let modalContent = modal.querySelector('.modal-content');
    let metodoPagamento = document.querySelector('input[name="pgto"]:checked');
    let emailUsuario = document.querySelector('input[type="email"]').value;

    if (modal) {
        let htmlModal = '';
        
        if (metodoPagamento.value === 'pix') {
            let chavePix = '00020126580014br.gov.bcb.pix0136aleatoria-1234-5678-abcd-efgh5204000053039865802BR5913Circuito Zero6009Sao Paulo62070503***63041234';
            htmlModal = `
                <h2>Pedido Recebido!</h2>
                <p>Escaneie ou copie a chave Pix abaixo para pagar:</p>
                <div class="copia-cola-box">
                    <span id="texto-pix" class="texto-copia">${chavePix}</span>
                    <button type="button" class="btn-copiar" onclick="copiarTexto('texto-pix', this)">Copiar</button>
                </div>
                <p style="font-size: 14px; color: green; margin-top: 10px;">Cópia e detalhes enviados para: <b>${emailUsuario}</b></p>
                <p style="font-size: 12px; margin-top: 15px;">Redirecionando em 7 segundos...</p>
            `;
        } else if (metodoPagamento.value === 'boleto') {
            let linhaDigitavel = '34191.09008 61714.030018 71832.140001 5 88990000015000';
            htmlModal = `
                <h2>Boleto Gerado com Sucesso!</h2>
                <p>Utilize o código de barras abaixo para pagamento:</p>
                <div class="copia-cola-box">
                    <span id="texto-boleto" class="texto-copia">${linhaDigitavel}</span>
                    <button type="button" class="btn-copiar" onclick="copiarTexto('texto-boleto', this)">Copiar</button>
                </div>
                <p style="font-size: 14px; color: green; margin-top: 10px;">O boleto em PDF foi enviado para: <b>${emailUsuario}</b></p>
                <p style="font-size: 12px; margin-top: 15px;">Redirecionando em 7 segundos...</p>
            `;
        } else if (metodoPagamento.value === 'cartao') {
            htmlModal = `
                <span class="check-icon">✔</span>
                <h2>Pagamento Aprovado!</h2>
                <p style="font-size: 14px; color: green; margin-top: 10px;">O comprovante foi enviado para: <b>${emailUsuario}</b></p>
                <p style="font-size: 12px; margin-top: 15px;">Redirecionando em 7 segundos...</p>
            `;
        }

        modalContent.innerHTML = htmlModal;
        modal.style.display = 'flex';

        // Simulando envio de dados para o email inserido (apenas front-end concept)
        console.log(`[Sistema]: E-mail enviado com sucesso para ${emailUsuario} com os dados da forma de pagamento: ${metodoPagamento.value}.`);

        // Esvazia o carrinho de compras do usuário
        carrinho = [];
        localStorage.removeItem('carrinho');
        atualizarCarrinho();

        // Aguarda 7 segundos exatos (7000ms) e redireciona
        setTimeout(function() {
            window.location.href = 'index.html';
        }, 7000);
    }
}

function copiarTexto(idElemento, botao) {
    let texto = document.getElementById(idElemento).innerText;
    navigator.clipboard.writeText(texto).then(() => {
        let textoOriginal = botao.innerText;
        botao.innerText = 'Copiado!';
        botao.style.background = '#00aa55';
        
        setTimeout(() => {
            botao.innerText = textoOriginal;
            botao.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Falha ao copiar texto:', err);
        alert('Erro ao copiar. Tente copiar manualmente.');
    });
}