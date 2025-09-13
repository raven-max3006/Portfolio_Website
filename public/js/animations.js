// Intersection Observer for scroll animations
class ScrollAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        this.createObserver();
        this.observeElements();
    }
    
    createObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // Trigger counter animation for stats
                    if (entry.target.classList.contains('stat')) {
                        this.animateCounter(entry.target.querySelector('h3'));
                    }
                    
                    // Trigger timeline animations
                    if (entry.target.classList.contains('timeline-item')) {
                        entry.target.classList.add('show');
                    }
                    
                    // Trigger project card animations
                    if (entry.target.classList.contains('project-card')) {
                        entry.target.classList.add('show');
                    }
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });
    }
    
    observeElements() {
        // Observe elements with animation classes
        const elementsToObserve = document.querySelectorAll(
            '.animate-on-scroll, .timeline-item, .project-card, .stat'
        );
        
        elementsToObserve.forEach(el => {
            this.observer.observe(el);
        });
    }
    
    animateCounter(element) {
        if (element.dataset.animated) return;
        
        const target = parseInt(element.textContent);
        const duration = 1000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
            
            if (current >= target) {
                element.textContent = target + (element.textContent.includes('+') ? '+' : '');
                clearInterval(timer);
                element.dataset.animated = 'true';
            }
        }, 16);
    }
    
    // Staggered animations for project grid
    staggerProjectCards() {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('show');
            }, index * 100);
        });
    }
}

// Typing animation for hero section
class TypingAnimation {
    constructor(element, words, typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000) {
        this.element = element;
        this.words = words;
        this.typingSpeed = typingSpeed;
        this.deletingSpeed = deletingSpeed;
        this.pauseTime = pauseTime;
        this.currentWordIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        
        this.start();
    }
    
    start() {
        this.type();
    }
    
    type() {
        const currentWord = this.words[this.currentWordIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentWord.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
        } else {
            this.element.textContent = currentWord.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
        }
        
        let typeSpeed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;
        
        if (!this.isDeleting && this.currentCharIndex === currentWord.length) {
            typeSpeed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
            typeSpeed = 200;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

// Smooth reveal animations
class SmoothReveal {
    constructor() {
        this.init();
    }
    
    init() {
        this.addRevealElements();
        this.createObserver();
    }
    
    addRevealElements() {
        // Add reveal classes to various elements
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const children = section.children;
            for (let i = 0; i < children.length; i++) {
                if (!children[i].classList.contains('animate-on-scroll')) {
                    children[i].classList.add('animate-on-scroll');
                }
            }
        });
    }
    
    createObserver() {
        this.revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.15
        });
        
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            this.revealObserver.observe(el);
        });
    }
}

// Button ripple effect
function addRippleEffect() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Parallax effect for hero section
class ParallaxEffect {
    constructor() {
        this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        window.addEventListener('scroll', () => {
            this.updateParallax();
        });
    }
    
    updateParallax() {
        const scrollY = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        
        if (hero && heroContent) {
            const speed = 0.5;
            heroContent.style.transform = `translateY(${scrollY * speed}px)`;
        }
        
        // Parallax for other elements
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll animations
    new ScrollAnimations();
    
    // Initialize typing animation
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
        const words = [
            'Aspiring Software Developer',
            'Full Stack Developer',
            'Creative Problem Solver',
            'Tech Enthusiast'
        ];
        new TypingAnimation(typingElement, words);
    }
    
    // Initialize smooth reveal
    new SmoothReveal();
    
    // Add ripple effects to buttons
    addRippleEffect();
    
    // Initialize parallax effect
    new ParallaxEffect();
    
    // Add CSS classes for initial animations
    document.body.classList.add('loaded');
});

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('page-loaded');
    
    // Trigger staggered animations
    const staggerElements = document.querySelectorAll('.stagger-animation');
    staggerElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('show');
        }, index * 100);
    });
});