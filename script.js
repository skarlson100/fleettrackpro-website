document.addEventListener('DOMContentLoaded', () => {

    /* ─── Navbar scroll state ─────────────────────────────────────────── */
    const navbar    = document.getElementById('navbar');
    const phoneOuter = document.getElementById('phoneOuter');

    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 24);
        if (phoneOuter) {
            phoneOuter.style.transform = `translateY(${window.scrollY * 0.1}px)`;
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ─── Mobile hamburger ────────────────────────────────────────────── */
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

    /* ─── Hero stagger animation ──────────────────────────────────────── */
    document.querySelectorAll('[data-stagger]').forEach(el => {
        const delay = parseInt(el.dataset.stagger, 10) || 0;
        setTimeout(() => el.classList.add('visible'), 200 + delay);
    });

    /* ─── Scroll reveal (Intersection Observer) ───────────────────────── */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const delay = parseInt(entry.target.dataset.revealDelay, 10) || 0;
            setTimeout(() => entry.target.classList.add('visible'), delay);
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -56px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => {
        revealObserver.observe(el);
    });

    /* ─── Feature card stagger within grid ───────────────────────────── */
    const featureGridObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const cards = entry.target.querySelectorAll('.feature-card, .testimonial-card, .pricing-card');
            cards.forEach((card, i) => {
                setTimeout(() => card.classList.add('visible'), i * 90);
            });
            featureGridObserver.unobserve(entry.target);
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.features-grid, .testimonials-grid, .pricing-grid').forEach(g => {
        g.querySelectorAll('.feature-card, .testimonial-card, .pricing-card').forEach(card => {
            card.setAttribute('data-reveal', '');
        });
        featureGridObserver.observe(g);
    });

    /* ─── Smooth-scroll nav links ─────────────────────────────────────── */
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
