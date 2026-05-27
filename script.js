
let currentIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dotsContainer = document.getElementById('dotsContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let autoSlide;

function updateCarousel() {
    const container = document.querySelector('.carousel-slides');
    if (container) {
        container.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    

    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

function createDots() {
    if (!dotsContainer) return;
    
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

// Verificar se os elementos existem antes de adicionar eventos
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });
}

// Inicializar o carrossel quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    if (slides.length > 0) {
        createDots();
        startAutoSlide();
    }
});