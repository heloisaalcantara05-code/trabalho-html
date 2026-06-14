<?php
session_start();
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header("Location: login.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Loja Online</title>

<link rel="stylesheet" href="style.css">

</head>

<body>

<div id="header-padrao"></div>

<!-- BOTÃO DO CARRINHO  -->
<button onclick="abrirCarrinho()" style="position: fixed; right: 20px; top: 20px; background: none; border: none; cursor: pointer; z-index: 9999;">
    <div style="position: relative;">
        <img src="src/carrinho2..webp" alt="Carrinho" style="width: 60px;">
        <span id="carrinho-contador" style="position: absolute; top: 0px; right: 0px; background: #ff3366; color: white; border-radius: 50%; padding: 2px 8px; font-size: 12px; font-weight: bold;">0</span>
    </div>
</button>

<main>
<div class="banner-carousel">
    <div class="carousel-container">
        <div class="carousel-slides">
            <div class="carousel-slide slide1">
                <h1> Ofertas Imperdíveis</h1>
                <p> Em produtos de tecnologia</p>
            </div>
        <div class="carousel-slide slide2">
    <h1>Eleve o seu Setup</h1>
    <p> Mais potência e maior desempenho</p>
</div>

<div class="carousel-slide slide3">
      <h1>Desempenho profissional</h1>
      <p>Ideal para jogos e produtividade</p>
    </div>
    </div>

<button class="carousel-btn prev"id="prevBtn">&#10094;</button>
<button class="carousel-btn next" id="nextBtn">&#10095;</button>
</div>

<div class="carousel-dots" id="dotsContainer"></div>
</div>


<section class="pesquisa">

<input type="text" placeholder="Pesquisar produto...">

<button>Buscar</button>

</section>


</main>

<footer id="footer-padrao"></footer>

<aside id="carrinho-sidebar" class="cart-sidebar">
    <div class="cart-header">
        <h3>MEU CARRINHO</h3>
        <button onclick="fecharCarrinho()">X</button>
    </div>
    <div id="carrinho-itens-lista"></div>
    <div class="cart-footer">
        <p>Total: <strong id="carrinho-subtotal">R$ 0,00</strong></p>
        <button class="btn-login" onclick="window.location.href='pagamento.html'">FINALIZAR PEDIDO</button>
    </div>
</aside>

<script src="script.js"></script>

<script>

    let currentIndex = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const dotsContainer = document.getElementById('dotsContainer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let autoSlide;

    function updateCarousel() {
        const container = document.querySelector('.carousel-slides');
        container.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function createDots() {
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
                resetAutoSlide();
            });
            dotsContainer.appendChild(dot);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
    }

    function startAutoSlide() {
        autoSlide = setInterval(nextSlide, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlide);
        startAutoSlide();
    }

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });

    createDots();
    startAutoSlide();
</script>

</body>

</body>

</html>