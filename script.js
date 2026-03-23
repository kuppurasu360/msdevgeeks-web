/* ========================================
   MSDevGeeks – Interactivity & Animations
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ========== NAVBAR SCROLL ==========
    const navbar = document.getElementById('navbar');
    if (navbar && !navbar.classList.contains('scrolled')) {
        const handleNavScroll = () => {
            navbar.classList.toggle('scrolled', window.scrollY > 40);
        };
        window.addEventListener('scroll', handleNavScroll);
        handleNavScroll();
    }

    // ========== HAMBURGER TOGGLE ==========
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    // ========== SCROLL REVEAL (IntersectionObserver) ==========
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, i * 80);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        reveals.forEach(el => revealObserver.observe(el));
    }

    // ========== COUNTDOWN TIMERS ==========
    const countdowns = document.querySelectorAll('.event-card__countdown');

    function updateCountdowns() {
        const now = new Date().getTime();
        countdowns.forEach(cd => {
            const target = new Date(cd.dataset.date).getTime();
            const diff = target - now;

            const nums = cd.querySelectorAll('.cd-num');
            if (diff <= 0) {
                nums[0].textContent = '0';
                nums[1].textContent = '0';
                nums[2].textContent = '0';
                nums[3].textContent = '0';
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);

            nums[0].textContent = String(days).padStart(2, '0');
            nums[1].textContent = String(hours).padStart(2, '0');
            nums[2].textContent = String(mins).padStart(2, '0');
            nums[3].textContent = String(secs).padStart(2, '0');
        });
    }

    if (countdowns.length) {
        updateCountdowns();
        setInterval(updateCountdowns, 1000);
    }

    // ========== EVENT FILTER ==========
    const filterBtns = document.querySelectorAll('.filter-btn');
    const eventCards = document.querySelectorAll('.event-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            eventCards.forEach(card => {
                const visible = filter === 'all' || card.dataset.category === filter;
                card.style.display = visible ? '' : 'none';

                if (visible) {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(16px)';
                    requestAnimationFrame(() => {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    });
                }
            });
        });
    });

    // ========== FORM VALIDATION HELPERS ==========
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function markError(group, show) {
        group.classList.toggle('error', show);
        return !show;
    }

    function validateField(input) {
        const group = input.closest('.form-group');
        if (!group) return true;

        if (input.type === 'email') {
            return markError(group, !validateEmail(input.value));
        }
        if (input.required) {
            return markError(group, !input.value.trim());
        }
        return true;
    }

    // Live validation on blur
    document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(el => {
        el.addEventListener('blur', () => validateField(el));
        el.addEventListener('input', () => {
            const group = el.closest('.form-group');
            if (group && group.classList.contains('error')) {
                validateField(el);
            }
        });
        if (el.tagName !== 'SELECT') {
            el.setAttribute('placeholder', ' ');
        }
    });

    // ========== TOAST ==========
    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.innerHTML = `<span>${type === 'success' ? '✅' : '❌'}</span><span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('toast-out');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // ========== SPEAKER FORM ==========
    const speakerForm = document.getElementById('speakerForm');
    if (speakerForm) {
        speakerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fields = speakerForm.querySelectorAll('input[required], textarea[required], select[required]');
            let valid = true;

            fields.forEach(f => {
                if (!validateField(f)) valid = false;
            });

            if (!valid) {
                showToast('Please fill in all required fields correctly.', 'error');
                return;
            }

            const btn = document.getElementById('speakerSubmitBtn');
            btn.disabled = true;
            btn.querySelector('span').textContent = 'Submitting...';

            setTimeout(() => {
                showToast('🎉 Speaker proposal submitted successfully! We\'ll be in touch soon.');
                speakerForm.reset();
                btn.disabled = false;
                btn.querySelector('span').textContent = 'Submit Proposal';
            }, 1200);
        });
    }

    // ========== REGISTRATION FORM ==========
    const regForm = document.getElementById('registrationForm');
    if (regForm) {
        // Pre-select event from URL param
        const urlParams = new URLSearchParams(window.location.search);
        const eventParam = urlParams.get('event');
        if (eventParam) {
            const eventSelect = document.getElementById('regEvent');
            if (eventSelect) {
                const option = eventSelect.querySelector(`option[value="${eventParam}"]`);
                if (option) {
                    eventSelect.value = eventParam;
                    // Trigger label float
                    eventSelect.dispatchEvent(new Event('change'));
                }
            }
        }

        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fields = regForm.querySelectorAll('input[required], textarea[required], select[required]');
            let valid = true;

            fields.forEach(f => {
                if (!validateField(f)) valid = false;
            });

            if (!valid) {
                showToast('Please fill in all required fields correctly.', 'error');
                return;
            }

            const btn = document.getElementById('regSubmitBtn');
            btn.disabled = true;
            btn.querySelector('span').textContent = 'Registering...';

            setTimeout(() => {
                showToast('🎟️ Registration complete! Check your email for confirmation.');
                regForm.reset();
                btn.disabled = false;
                btn.querySelector('span').textContent = 'Complete Registration';
            }, 1200);
        });
    }

    // ========== NEWSLETTER FORM ==========
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('newsletterEmail');
            if (!validateEmail(email.value)) {
                showToast('Please enter a valid email address.', 'error');
                return;
            }
            showToast('📬 You\'re subscribed! Welcome to the MSDevGeeks community.');
            newsletterForm.reset();
        });
    }

    // ========== FAQ ACCORDION ==========
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');
                // Close all
                faqItems.forEach(i => i.classList.remove('open'));
                // Toggle current
                if (!isOpen) {
                    item.classList.add('open');
                }
            });
        }
    });

    // ========== ACTIVE NAV LINK HIGHLIGHT (single-page only) ==========
    const sections = document.querySelectorAll('section[id]');
    if (document.querySelector('.hero#hero')) {
        function updateActiveNav() {
            const scrollY = window.scrollY + 120;
            sections.forEach(section => {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                const id = section.id;
                const link = document.querySelector(`.nav-link[href="#${id}"]`);
                if (link && !link.classList.contains('nav-cta')) {
                    link.classList.toggle('active', scrollY >= top && scrollY < top + height);
                }
            });
        }
        window.addEventListener('scroll', updateActiveNav);
    }

});
