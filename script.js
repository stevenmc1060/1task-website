// 1TaskAssistant + Notes Website JavaScript
// Modern, performant, and accessible interactions

class Website {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupAnimations();
        this.setupInteractions();
        this.setupPerformanceOptimizations();
    }

    // Navigation functionality
    setupNavigation() {
        const navbar = document.querySelector('.navbar');
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Navbar scroll effect
        let lastScrollTop = 0;
        let isScrolling = false;

        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    
                    // Add background blur effect when scrolled
                    if (scrollTop > 50) {
                        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                        navbar.style.backdropFilter = 'blur(20px)';
                        navbar.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
                    } else {
                        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                        navbar.style.backdropFilter = 'blur(20px)';
                        navbar.style.boxShadow = 'none';
                    }

                    // Hide/show navbar on scroll (mobile)
                    if (window.innerWidth <= 768) {
                        if (scrollTop > lastScrollTop && scrollTop > 100) {
                            navbar.style.transform = 'translateY(-100%)';
                        } else {
                            navbar.style.transform = 'translateY(0)';
                        }
                    }

                    lastScrollTop = scrollTop;
                    isScrolling = false;
                });
                isScrolling = true;
            }
        }, { passive: true });

        // Mobile menu toggle
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
                document.body.classList.toggle('menu-open');
                
                // Animate hamburger
                const spans = navToggle.querySelectorAll('span');
                spans.forEach((span, index) => {
                    span.style.transform = navToggle.classList.contains('active') 
                        ? `rotate(${index === 0 ? '45deg' : index === 1 ? '0deg' : '-45deg'}) translateY(${index === 0 ? '7px' : index === 1 ? '0px' : '-7px'})`
                        : 'none';
                    span.style.opacity = navToggle.classList.contains('active') && index === 1 ? '0' : '1';
                });
            });
        }

        // Smooth scroll for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offsetTop = target.offsetTop - 80;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                        
                        // Close mobile menu if open
                        if (navMenu.classList.contains('active')) {
                            navMenu.classList.remove('active');
                            navToggle.classList.remove('active');
                            document.body.classList.remove('menu-open');
                        }
                    }
                }
            });
        });
    }

    // Scroll-triggered animations
    setupScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Add stagger effect for grid items
                    if (entry.target.classList.contains('features-grid') || 
                        entry.target.classList.contains('steps')) {
                        const children = entry.target.children;
                        Array.from(children).forEach((child, index) => {
                            setTimeout(() => {
                                child.classList.add('animate-in');
                            }, index * 150);
                        });
                    }
                }
            });
        }, observerOptions);

        // Observe sections for animation
        const sections = document.querySelectorAll('.features, .how-it-works, .download');
        const cards = document.querySelectorAll('.feature-card, .step');
        
        sections.forEach(section => observer.observe(section));
        cards.forEach(card => observer.observe(card));
    }

    // Advanced animations
    setupAnimations() {
        // Parallax effect for hero background
        const hero = document.querySelector('.hero');
        if (hero) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                hero.style.transform = `translateY(${rate}px)`;
            }, { passive: true });
        }

        // Floating cards animation enhancement
        const floatingCards = document.querySelectorAll('.floating-card');
        floatingCards.forEach((card, index) => {
            // Add mouse interaction
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.05)';
                card.style.boxShadow = '0 25px 50px -12px rgb(0 0 0 / 0.25)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.boxShadow = '';
            });

            // Random movement
            setInterval(() => {
                const randomX = (Math.random() - 0.5) * 20;
                const randomY = (Math.random() - 0.5) * 20;
                card.style.transform = `translate(${randomX}px, ${randomY}px)`;
            }, 3000 + index * 1000);
        });

        // AI brain animation enhancement
        const brainCore = document.querySelector('.brain-core');
        if (brainCore) {
            // Add interactive glow effect
            brainCore.addEventListener('mouseenter', () => {
                brainCore.style.boxShadow = '0 0 50px rgba(99, 102, 241, 0.6)';
                brainCore.style.transform = 'translate(-50%, -50%) scale(1.2)';
            });

            brainCore.addEventListener('mouseleave', () => {
                brainCore.style.boxShadow = '';
                brainCore.style.transform = '';
            });
        }
    }

    // Interactive elements
    setupInteractions() {
        // Button hover effects
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (button.classList.contains('btn-primary')) {
                    button.style.backgroundSize = '110% 110%';
                }
            });

            button.addEventListener('mouseleave', () => {
                button.style.backgroundSize = '100% 100%';
            });

            // Ripple effect on click
            button.addEventListener('click', (e) => {
                const rect = button.getBoundingClientRect();
                const ripple = document.createElement('span');
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 600ms ease-out;
                    pointer-events: none;
                `;

                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Feature cards interactive tilt
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });

        // Stats counter animation
        const stats = document.querySelectorAll('.stat-number');
        const countUpAnimation = (element, target) => {
            const increment = target / 60; // 60 frames
            let current = 0;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                if (target.toString().includes('x')) {
                    element.textContent = Math.floor(current) + 'x';
                } else if (target.toString().includes('%')) {
                    element.textContent = Math.floor(current) + '%';
                } else {
                    element.textContent = target;
                }
            }, 16);
        };

        // Trigger counter when stats come into view
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const text = entry.target.textContent;
                    const number = parseInt(text);
                    if (!isNaN(number)) {
                        countUpAnimation(entry.target, number);
                    }
                    statsObserver.unobserve(entry.target);
                }
            });
        });

        stats.forEach(stat => statsObserver.observe(stat));
    }

    // Performance optimizations
    setupPerformanceOptimizations() {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));

        // Preload critical resources
        this.preloadCriticalResources();

        // Optimize scroll performance
        let ticking = false;
        const optimizedScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Scroll-dependent operations here
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', optimizedScroll, { passive: true });

        // Page visibility API for performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause animations when page is not visible
                document.body.style.animationPlayState = 'paused';
            } else {
                document.body.style.animationPlayState = 'running';
            }
        });
    }

    preloadCriticalResources() {
        const criticalImages = [
            'logo.svg',
            'app-store.svg',
            'google-play.svg'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Add CSS animations for scroll effects
const animationCSS = `
    .animate-in {
        animation: slideInUp 0.6s ease-out forwards;
    }

    .feature-card.animate-in,
    .step.animate-in {
        animation: slideInUp 0.6s ease-out forwards;
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .loaded {
        animation: fadeIn 0.3s ease-out;
    }

    /* Mobile menu styles */
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 80px;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            flex-direction: column;
            padding: 2rem;
            transform: translateY(-100%);
            transition: transform 0.3s ease;
            border-bottom: 1px solid var(--border-light);
            z-index: 999;
        }

        .nav-menu.active {
            display: flex;
            transform: translateY(0);
        }

        .nav-link {
            padding: 1rem 0;
            border-bottom: 1px solid var(--border-light);
        }

        .nav-link:last-child {
            border-bottom: none;
        }

        .menu-open {
            overflow: hidden;
        }
    }
`;

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = animationCSS;
    document.head.appendChild(style);

    // Initialize website functionality
    new Website();

    // Add loading class to trigger animations
    document.body.classList.add('loading');

    // Remove loading class after a short delay
    setTimeout(() => {
        document.body.classList.remove('loading');
    }, 100);
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Website;
}
