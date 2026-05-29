document.addEventListener('DOMContentLoaded', () => {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ─── Navbar + hero scroll parallax ──────────────────────────────────── */
    const navbar      = document.getElementById('navbar');
    const heroScroll  = document.getElementById('heroScroll');

    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 24);
        if (heroScroll && !prefersReducedMotion) {
            heroScroll.style.transform = `translateY(${window.scrollY * 0.06}px)`;
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ─── Hero mouse-parallax tilt ───────────────────────────────────────── */
    const heroDevice  = document.getElementById('heroDevice');
    const heroSection = document.querySelector('.hero');
    const isTouch     = window.matchMedia('(pointer: coarse)').matches;

    if (heroDevice && heroSection && !isTouch && !prefersReducedMotion) {
        heroSection.addEventListener('mousemove', (e) => {
            const r  = heroSection.getBoundingClientRect();
            const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2); // −1 → 1
            const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2); // −1 → 1
            heroDevice.style.setProperty('--tilt-x', `${-dy * 4}deg`);
            heroDevice.style.setProperty('--tilt-y', `${dx  * 4}deg`);
        }, { passive: true });

        heroSection.addEventListener('mouseleave', () => {
            heroDevice.style.setProperty('--tilt-x', '0deg');
            heroDevice.style.setProperty('--tilt-y', '0deg');
        });
    }

    /* ─── Mobile hamburger ───────────────────────────────────────────────── */
    const hamburger = document.getElementById('navHamburger');
    const navLinks  = document.getElementById('navLinks');

    hamburger?.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        hamburger.classList.toggle('open', open);
        hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    navLinks?.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger?.classList.remove('open');
        });
    });

    /* ─── Hero stagger animation ─────────────────────────────────────────── */
    document.querySelectorAll('[data-stagger]').forEach(el => {
        const delay = parseInt(el.dataset.stagger, 10) || 0;
        setTimeout(() => el.classList.add('visible'), 200 + delay);
    });

    /* ─── Scroll reveal (IntersectionObserver) ───────────────────────────── */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const delay = parseInt(entry.target.dataset.revealDelay, 10) || 0;
            setTimeout(() => entry.target.classList.add('visible'), delay);
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -56px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

    /* ─── Feature card stagger within grid ──────────────────────────────── */
    const featureGridObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const cards = entry.target.querySelectorAll('.feature-card, .testimonial-card, .pricing-card');
            cards.forEach((card, i) => setTimeout(() => card.classList.add('visible'), i * 90));
            featureGridObserver.unobserve(entry.target);
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.features-grid, .testimonials-grid, .pricing-grid').forEach(g => {
        g.querySelectorAll('.feature-card, .testimonial-card, .pricing-card').forEach(card => {
            card.setAttribute('data-reveal', '');
        });
        featureGridObserver.observe(g);
    });

    /* ─── Sticky Showcase ────────────────────────────────────────────────── */
    const showcaseScreen = document.getElementById('showcaseScreen');
    const showcaseSlides = document.querySelectorAll('.showcase-slide');

    if (showcaseScreen && showcaseSlides.length) {
        let activeSlide    = null;
        let currentSrc     = showcaseSlides[0]?.dataset.screen ?? null;

        const activateSlide = (slide) => {
            if (slide === activeSlide) return;
            activeSlide = slide;

            showcaseSlides.forEach(s => s.classList.remove('is-active'));
            slide.classList.add('is-active');

            const newSrc = slide.dataset.screen;
            const newAlt = slide.dataset.alt;
            if (newSrc === currentSrc) return;
            currentSrc = newSrc;

            if (prefersReducedMotion) {
                showcaseScreen.src = newSrc;
                showcaseScreen.alt = newAlt;
            } else {
                showcaseScreen.classList.add('is-fading');
                setTimeout(() => {
                    showcaseScreen.src = newSrc;
                    showcaseScreen.alt = newAlt;
                    showcaseScreen.classList.remove('is-fading');
                }, 320);
            }
        };

        /* Trigger when a slide crosses the middle third of the viewport */
        const slideObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) activateSlide(entry.target);
            });
        }, { rootMargin: '-38% 0px -38% 0px', threshold: 0 });

        showcaseSlides.forEach(slide => slideObserver.observe(slide));

        /* Activate first slide immediately (before any scrolling) */
        activateSlide(showcaseSlides[0]);
    }

    /* ─── Smooth-scroll nav links ────────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offset = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        });
    });

});
