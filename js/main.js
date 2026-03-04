// ─── Dark Mode ────────────────────────────────────────────────
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const icon = document.getElementById('themeIcon');
    if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function initTheme() {
    const saved = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(saved);
}

// Toggle via event delegation (header loads async)
document.addEventListener('click', (e) => {
    if (e.target.closest('#themeToggle')) {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        applyTheme(current === 'dark' ? 'light' : 'dark');
    }
});

// Apply theme immediately to prevent flash
initTheme();

// ─── Load Header and Footer ───────────────────────────────────
async function loadComponents() {
    try {
        // Load header
        const headerResponse = await fetch('components/header.html');
        const headerHTML = await headerResponse.text();
        document.getElementById('header-placeholder').innerHTML = headerHTML;

        // Sync theme icon now that the button exists in the DOM
        const icon = document.getElementById('themeIcon');
        if (icon) {
            icon.textContent = (document.documentElement.getAttribute('data-theme') === 'dark') ? '☀️' : '🌙';
        }

        // Load footer
        const footerResponse = await fetch('components/footer.html');
        const footerHTML = await footerResponse.text();
        document.getElementById('footer-placeholder').innerHTML = footerHTML;

        // Initialize navigation after header is loaded
        initNavigation();
    } catch (error) {
        console.error('Error loading components:', error);
    }
}

// Initialize Navigation
function initNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    function openMenu() {
        navMenu.classList.add('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        mobileMenuBtn.setAttribute('aria-label', 'Close navigation menu');
    }

    function closeMenu() {
        navMenu.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-label', 'Open navigation menu');
    }

    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.contains('active') ? closeMenu() : openMenu();
        });
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) && e.target !== mobileMenuBtn &&
            !mobileMenuBtn.contains(e.target)) {
            closeMenu();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            closeMenu();
            mobileMenuBtn.focus();
        }
    });

    // Set active link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === currentPage;
        if (isActive) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) closeMenu();
        });
    });
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', () => {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

// Form submission handler
function handleFormSubmit(formId, successMessage) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Here you would normally send data to a server
        console.log('Form submitted:', data);
        
        // Show success message
        alert(successMessage || 'Form submitted successfully! We will contact you soon.');
        form.reset();
    });
}

// Load courses data
async function loadCoursesData() {
    try {
        const response = await fetch('content/courses.json');
        const data = await response.json();
        return data.courses;
    } catch (error) {
        console.error('Error loading courses:', error);
        return [];
    }
}

// ─── Typewriter (restartable via generation token) ────────────
let twGen = 0;  // increment to cancel any in-flight tick

function startTypewriter() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const el = document.getElementById('typedHero');
        if (el) el.textContent = 'Intelligence.';
        return;
    }

    const gen = ++twGen;
    const phrases = ['Intelligence.','Model Minds', 'Analytical Thinking', 'AI Skills.', 'Data Mastery.','Predictive Thinkers', 'Your Future.', 'Real Careers.',  'Tomorrow.'];
    let phraseIdx = 0, charIdx = 0, deleting = false;

    function tick() {
        if (gen !== twGen) return;           // cancelled by a newer call
        const el = document.getElementById('typedHero');
        if (!el) return;                     // element removed, stop

        const phrase = phrases[phraseIdx];
        if (deleting) { charIdx--; } else { charIdx++; }
        el.textContent = phrase.slice(0, charIdx);

        let delay = deleting ? 55 : 85;
        if (!deleting && charIdx === phrase.length) { delay = 2200; deleting = true; }
        else if (deleting && charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; delay = 380; }

        setTimeout(tick, delay);
    }
    tick();
}

// ─── Scroll Reveal (staggered) ────────────────────────────────
function initScrollAnimations() {
    const SELECTORS = [
        '.course-card',
        '.feature-card',
        '.highlight-item',
        '.circle-item',
        '.about-text',
        '.about-highlights',
        'section h2',
        '.section-subtitle',
    ];

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    SELECTORS.forEach(sel => {
        document.querySelectorAll(sel).forEach((el, i) => {
            // stagger siblings within the same parent
            const siblings = el.parentElement
                ? Array.from(el.parentElement.querySelectorAll(sel))
                : [el];
            const idx = siblings.indexOf(el);
            el.style.setProperty('--reveal-delay', `${idx * 90}ms`);
            el.classList.add('reveal');
            observer.observe(el);
        });
    });
}

// ─── 3D Card Tilt ─────────────────────────────────────────────
function initCardTilt() {
    const TILT = 8; // max degrees
    function attachTilt(card) {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width  - 0.5;
            const y = (e.clientY - rect.top)  / rect.height - 0.5;
            card.style.transform =
                `perspective(900px) rotateY(${x * TILT}deg) rotateX(${-y * TILT}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    }

    // Attach immediately for static cards; re-run after dynamic course cards load
    document.querySelectorAll('.feature-card, .highlight-item').forEach(attachTilt);

    // Course cards are injected dynamically — observe DOM mutations
    const coursesEl = document.getElementById('coursesContainer');
    if (coursesEl) {
        new MutationObserver(() => {
            coursesEl.querySelectorAll('.course-card:not([data-tilt])').forEach(card => {
                card.setAttribute('data-tilt', '1');
                attachTilt(card);
            });
        }).observe(coursesEl, { childList: true });
    }
}

// ─── Cursor Spotlight ─────────────────────────────────────────
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow) return;

    // Dark-background sections where the glow is visible
    const DARK_SELECTORS = ['.promo-slider', '.tagline-ticker', 'section[style*="bg-darkest"]',
                             '.circle-highlights-section'];

    let visible = false;

    function isOverDark(x, y) {
        const el = document.elementFromPoint(x, y);
        if (!el) return false;
        return el.closest('.promo-slider, .tagline-ticker, .circle-highlights-section, [style*="bg-darkest"]') !== null;
    }

    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top  = e.clientY + 'px';
        const dark = isOverDark(e.clientX, e.clientY);
        glow.style.opacity = dark ? '1' : '0';
    });

    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
}

// ─── Hero Particles ───────────────────────────────────────────
function initHeroParticles() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const COLORS = ['rgba(110,231,183,', 'rgba(56,189,248,', 'rgba(59,130,246,'];
    const COUNT  = 55;

    function resize() {
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    const particles = Array.from({ length: COUNT }, () => ({
        x:    Math.random(),
        y:    Math.random(),
        r:    0.8 + Math.random() * 1.6,
        a:    Math.random() * Math.PI * 2,
        spd:  0.00015 + Math.random() * 0.00025,
        col:  COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 0.2 + Math.random() * 0.5,
    }));

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const W = canvas.width, H = canvas.height;
        particles.forEach(p => {
            p.a += p.spd;
            p.x += Math.cos(p.a) * 0.0003;
            p.y += Math.sin(p.a) * 0.0003;
            // wrap
            if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
            if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.col + p.alpha + ')';
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();
}

// ─── Promo Banner Slider ─────────────────────────────────────
function initPromoSlider() {
    const slider   = document.getElementById('promoBanner');
    const right    = document.getElementById('heroRight');
    const dotsWrap = document.getElementById('promoDots');
    const prevBtn  = document.getElementById('promoPrev');
    const nextBtn  = document.getElementById('promoNext');

    if (!right || !dotsWrap) return;

    const slides  = right.querySelectorAll('.promo-slide');
    if (!slides.length) return;

    const INTERVAL = 3000;
    let current = 0;
    let timer;
    const statusEl = document.getElementById('sliderStatus');

    // ── Progress bar
    const bar = document.createElement('div');
    bar.className = 'promo-progress';
    slider.appendChild(bar);

    // ── Dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'promo-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => { stop(); goTo(i); start(); });
        dotsWrap.appendChild(dot);
    });

    function getDots() { return dotsWrap.querySelectorAll('.promo-dot'); }

    function goTo(index) {
        const next = (index + slides.length) % slides.length;
        if (next === current) return;

        slides[current].classList.remove('active');
        getDots()[current].classList.remove('active');

        current = next;
        slides[current].classList.add('active');
        getDots()[current].classList.add('active');

        if (statusEl) {
            statusEl.textContent = `Slide ${current + 1} of ${slides.length}`;
        }

        // Progress bar restarts
        bar.style.transition = 'none';
        bar.style.width = '0%';
        requestAnimationFrame(() => requestAnimationFrame(() => {
            bar.style.transition = `width ${INTERVAL}ms linear`;
            bar.style.width = '100%';
        }));
    }

    function start() {
        stop();
        timer = setInterval(() => goTo(current + 1), INTERVAL);
        bar.style.transition = `width ${INTERVAL}ms linear`;
        bar.style.width = '100%';
    }

    function stop() {
        clearInterval(timer);
        bar.style.transition = 'none';
        bar.style.width = '0%';
    }

    prevBtn.addEventListener('click', () => { stop(); goTo(current - 1); start(); });
    nextBtn.addEventListener('click', () => { stop(); goTo(current + 1); start(); });

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);

    let touchStartX = 0;
    slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) { stop(); goTo(current + (diff > 0 ? 1 : -1)); start(); }
    }, { passive: true });

    start();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadComponents();
    setTimeout(initScrollAnimations, 100);
    initPromoSlider();
    initCardTilt();
    initCursorGlow();
    initHeroParticles();
    startTypewriter();
});

// Utility function to get URL parameters
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Export functions for use in other scripts
window.appUtils = {
    loadCoursesData,
    handleFormSubmit,
    getURLParameter
};
