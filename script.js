// ============================================
// TX ENERGIA SOLAR - INTERACTIVE JAVASCRIPT
// Calculadora: mesma variável da Taumana (90% economia)
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initParticles();
    initCounters();
    initCalculator();
    initFAQ();
    initSmoothScroll();
    initScrollAnimations();
});

// ============================================
// NAVBAR
// ============================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ============================================
// PARTICLES BACKGROUND
// ============================================
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    // Cores TX: azul e laranja
    const colors = ['rgba(15, 63, 143,', 'rgba(242, 107, 31,'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 1}px;
        height: ${Math.random() * 4 + 1}px;
        background: ${color} ${Math.random() * 0.5 + 0.1});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: particleFloat ${Math.random() * 10 + 10}s linear infinite;
        animation-delay: ${Math.random() * 5}s;
    `;
    container.appendChild(particle);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// ANIMATED COUNTERS
// ============================================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

// ============================================
// SOLAR CALCULATOR
// Mesma variável da Taumana: 90% economia
// ============================================
function initCalculator() {
    const input = document.getElementById('conta-luz');
    const quickBtns = document.querySelectorAll('.quick-btn');
    const calcBtn = document.getElementById('calcular-btn');

    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            input.value = btn.getAttribute('data-value');
            quickBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    calcBtn.addEventListener('click', () => {
        const valorConta = parseFloat(input.value);

        if (!valorConta || valorConta < 100) {
            showAlert('Por favor, insira um valor válido (mínimo R$ 100)');
            return;
        }

        const tipo = document.querySelector('input[name="tipo"]:checked').value;
        calculateSavings(valorConta, tipo);
    });

    input.addEventListener('input', () => {
        quickBtns.forEach(b => b.classList.remove('active'));
    });
}

function calculateSavings(valorConta, tipo) {
    // Mesma variável da Taumana - 90% de economia
    const params = {
        residencial: { economia: 0.90, custoKwp: 4500, paybackFactor: 4 },
        comercial:   { economia: 0.90, custoKwp: 4200, paybackFactor: 3.5 },
        rural:       { economia: 0.90, custoKwp: 4800, paybackFactor: 4.5 },
        industrial:  { economia: 0.90, custoKwp: 4000, paybackFactor: 3.5 }
    };

    const config = params[tipo];

    const economiaMensal = valorConta * config.economia;
    const economiaAnual = economiaMensal * 12;
    const economia25Anos = economiaAnual * 25;

    // Sizing: ~R$ 0.80/kWh, 130 kWh/mês por kWp (mesma referência da Taumana)
    const consumoKwh = valorConta / 0.80;
    const sistemaKwp = Math.ceil(consumoKwh / 130 * 10) / 10;

    const custoSistema = sistemaKwp * config.custoKwp;
    const paybackAnos = Math.ceil(custoSistema / economiaAnual * 10) / 10;

    updateResults({
        economiaMensal,
        economiaAnual,
        economia25Anos,
        sistemaKwp,
        paybackAnos,
        valorConta
    });
}

function updateResults(data) {
    const result = document.getElementById('calc-result');
    result.classList.add('active');

    animateValue('economia-mensal', data.economiaMensal, 'R$ ');
    animateValue('economia-anual', data.economiaAnual, 'R$ ');
    animateValue('economia-25anos', data.economia25Anos, 'R$ ');

    document.getElementById('sistema-kwp').textContent = `${data.sistemaKwp} kWp`;
    document.getElementById('payback').textContent = `~${data.paybackAnos} anos`;

    const circle = document.getElementById('progress-circle');
    const percentage = Math.min((data.economiaMensal / data.valorConta) * 100, 95);
    const circumference = 2 * Math.PI * 90;
    const offset = circumference - (percentage / 100) * circumference;

    setTimeout(() => {
        circle.style.strokeDashoffset = offset;
    }, 100);

    const whatsappBtn = document.getElementById('whatsapp-orcamento');
    const message = `Olá! Fiz a simulação no site da TX Energia Solar e gostaria de um orçamento. Minha conta de luz é de aproximadamente R$ ${data.valorConta}/mês.`;
    whatsappBtn.href = `https://wa.me/5522997797660?text=${encodeURIComponent(message)}`;

    result.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function animateValue(elementId, target, prefix = '') {
    const element = document.getElementById(elementId);
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;

    const updateValue = () => {
        current += step;
        if (current < target) {
            element.textContent = prefix + formatCurrency(Math.floor(current));
            requestAnimationFrame(updateValue);
        } else {
            element.textContent = prefix + formatCurrency(target);
        }
    };

    updateValue();
}

function formatCurrency(value) {
    return value.toLocaleString('pt-BR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

function showAlert(message) {
    const alert = document.createElement('div');
    alert.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #F26B1F 0%, #D14A0D 100%);
        color: white;
        padding: 16px 32px;
        border-radius: 12px;
        font-weight: 600;
        z-index: 10000;
        animation: slideDown 0.3s ease;
        box-shadow: 0 10px 40px rgba(242, 107, 31, 0.4);
        max-width: calc(100vw - 32px);
        text-align: center;
    `;
    alert.textContent = message;
    document.body.appendChild(alert);

    setTimeout(() => {
        alert.style.animation = 'slideUp 0.3s ease forwards';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

const alertStyles = document.createElement('style');
alertStyles.textContent = `
    @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    @keyframes slideUp {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(-20px); opacity: 0; }
    }
`;
document.head.appendChild(alertStyles);

// ============================================
// FAQ ACCORDION
// ============================================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            faqItems.forEach(i => i.classList.remove('active'));

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.section-header, .diff-card, .project-card, .faq-item, .feature-item, .location-item'
    );

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s`;
        observer.observe(el);
    });
}

// ============================================
// TYPING EFFECT
// ============================================
const typingTexts = ['Conta de Luz', 'Fatura Mensal', 'Despesa Fixa', 'Conta Elevada'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const element = document.querySelector('.typing-text');
    if (!element) return;

    const currentText = typingTexts[textIndex];

    if (isDeleting) {
        element.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        element.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typingTexts.length;
        typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
}

setTimeout(typeEffect, 2000);

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
