/* UPGrade — scripts compartilhados */

const WHATSAPP_GUILD = 'https://chat.whatsapp.com/DLlMZGtaeJPGh1DOwT4HQP';

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initScrollReveal();
    initHeaderScroll();
    initConsoleFilters();
});

function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav-menu');
    const overlay = document.querySelector('.nav-overlay');

    if (!toggle || !nav) return;

    const closeMenu = () => {
        nav.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
        overlay?.classList.remove('visible');
    };

    toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        toggle.classList.toggle('active', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        document.body.classList.toggle('menu-open', isOpen);
        overlay?.classList.toggle('visible', isOpen);
    });

    overlay?.addEventListener('click', closeMenu);

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });
}

function initScrollReveal() {
    const targets = document.querySelectorAll(
        '.reveal, .console-card, .beneficio-card, .card-loot, .step-card, .stat-card, .depoimento-card'
    );

    if (!targets.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${(i % 4) * 0.08}s`;
        observer.observe(el);
    });
}

function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 20);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}

function initConsoleFilters() {
    document.querySelectorAll('.filter-item input[type="checkbox"]').forEach((checkbox) => {
        checkbox.addEventListener('change', function () {
            const label = this.nextElementSibling;
            if (this.checked) {
                label?.classList.add('filter-active');
            } else {
                label?.classList.remove('filter-active');
            }
        });
    });
}
