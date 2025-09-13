// Main JavaScript functionality
class Portfolio {
    constructor() {
        this.init();
    }
    
    init() {
    this.setupNavigation();
    this.setupThemeToggle();
    this.setupScrollEffects();
    this.setupProjectFiltering();
    this.setupContactForm();
    this.setupScrollToTop();
    // this.loadProjects(); // Commented out to preserve existing HTML projects
    this.setupInteractiveCursor();
    }

    setupInteractiveCursor() {
        // Create main cursor dot
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        
        // Create cursor outline
        const cursorOutline = document.createElement('div');
        cursorOutline.className = 'custom-cursor-outline';
        
        // Style main cursor
        Object.assign(cursor.style, {
            position: 'fixed',
            width: '12px',
            height: '12px',
            backgroundColor: '#6C63FF',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: '9999',
            transform: 'translate(-50%, -50%)',
            transition: 'opacity 0.2s ease'
        });
        
        // Style cursor outline
        Object.assign(cursorOutline.style, {
            position: 'fixed',
            width: '24px',
            height: '24px',
            border: '2px solid rgba(108, 99, 255, 0.3)',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: '9998',
            transform: 'translate(-50%, -50%)',
            transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s ease'
        });
        
        document.body.appendChild(cursor);
        document.body.appendChild(cursorOutline);
        
        let mouseX = 0, mouseY = 0;
        let outlineX = 0, outlineY = 0;
        
        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        // Animate cursor
        function animateCursor() {
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
            
            // Smooth follow for outline
            outlineX += (mouseX - outlineX) * 0.1;
            outlineY += (mouseY - outlineY) * 0.1;
            cursorOutline.style.left = outlineX + 'px';
            cursorOutline.style.top = outlineY + 'px';
            
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
        
        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            cursorOutline.style.opacity = '0';
        });
        
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
            cursorOutline.style.opacity = '1';
        });
        
        // Hover effects
        const interactiveElements = document.querySelectorAll('a, button, .btn, .nav-link, .project-card, input, textarea');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.backgroundColor = '#FF6584';
                cursorOutline.style.width = '40px';
                cursorOutline.style.height = '40px';
                cursorOutline.style.borderColor = 'rgba(255, 101, 132, 0.5)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.backgroundColor = '#6C63FF';
                cursorOutline.style.width = '24px';
                cursorOutline.style.height = '24px';
                cursorOutline.style.borderColor = 'rgba(108, 99, 255, 0.3)';
            });
        });
        
        // Click effect
        document.addEventListener('mousedown', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.2)';
        });
        
        document.addEventListener('mouseup', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    }
    
    setupNavigation(){
        const navbar = document.getElementById('navbar');
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Update active navigation link
            this.updateActiveNavLink();
        });
        
        // Mobile menu toggle
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Smooth scroll for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) {
            console.error('Theme toggle button not found!');
            return;
        }
        
        const icon = themeToggle.querySelector('i');
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            document.body.setAttribute('data-theme', savedTheme);
            this.updateThemeIcon(icon, savedTheme);
        } else if (prefersDark) {
            document.body.setAttribute('data-theme', 'dark');
            this.updateThemeIcon(icon, 'dark');
        }
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon(icon, newTheme);
        });
    }
    
    updateThemeIcon(icon, theme) {
        icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
    
    setupScrollEffects() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    handleScroll() {
        // Add scroll-based animations and effects here
        const scrollY = window.scrollY;
        const hero = document.querySelector('.hero');
        
        if (hero) {
            const heroHeight = hero.clientHeight;
            const opacity = Math.max(0, 1 - (scrollY / heroHeight));
            hero.style.opacity = opacity;
        }
    }
    
    setupProjectFiltering() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectsGrid = document.getElementById('projects-grid');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active filter button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                this.filterProjects(filter);
            });
        });
    }
    
    filterProjects(filter) {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.classList.add('show');
                }, 100);
            } else {
                card.classList.remove('show');
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
    
    async loadProjects() {
        try {
            const response = await fetch('/api/projects');
            const projects = await response.json();
            this.renderProjects(projects);
        } catch (error) {
            console.error('Error loading projects:', error);
            this.renderDefaultProjects();
        }
    }
    
    renderProjects(projects) {
        const projectsGrid = document.getElementById('projects-grid');
        
        if (projects.length === 0) {
            this.renderDefaultProjects();
            return;
        }
        
        projectsGrid.innerHTML = projects.map(project => `
            <div class="project-card" data-category="${project.category}">
                <img src="${project.image || 'https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=500'}" 
                     alt="${project.title}" class="project-image">
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tech">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        ${project.githubUrl ? `<a href="${project.githubUrl}" class="project-link" target="_blank">
                            <i class="fab fa-github"></i> GitHub
                        </a>` : ''}
                        ${project.demoUrl ? `<a href="${project.demoUrl}" class="project-link" target="_blank">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    renderDefaultProjects() {
        const projectsGrid = document.getElementById('projects-grid');
        const defaultProjects = [
            {
                title: 'E-Commerce Platform',
                description: 'A full-stack e-commerce solution with React, Node.js, and MongoDB. Features include user authentication, payment processing, and admin dashboard.',
                image: 'https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=500',
                technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
                category: 'web',
                githubUrl: '#',
                demoUrl: '#'
            },
            {
                title: 'Task Management App',
                description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
                image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=500',
                technologies: ['Vue.js', 'Socket.io', 'Express', 'PostgreSQL'],
                category: 'web',
                githubUrl: '#',
                demoUrl: '#'
            },
            {
                title: 'Portfolio Design System',
                description: 'A comprehensive design system and component library for creating beautiful, consistent user interfaces across multiple projects.',
                image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=500',
                technologies: ['Figma', 'CSS', 'Storybook', 'Design Tokens'],
                category: 'design',
                githubUrl: '#',
                demoUrl: '#'
            },
            {
                title: 'Weather Prediction ML',
                description: 'Machine learning model for weather prediction using historical data and various atmospheric parameters with 85% accuracy.',
                image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=500',
                technologies: ['Python', 'TensorFlow', 'Pandas', 'Scikit-learn'],
                category: 'ml',
                githubUrl: '#',
                demoUrl: '#'
            },
            {
                title: 'Restaurant Website',
                description: 'Modern restaurant website with online ordering system, table reservations, and interactive menu with beautiful animations.',
                image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=500',
                technologies: ['HTML', 'CSS', 'JavaScript', 'PHP'],
                category: 'web',
                githubUrl: '#',
                demoUrl: '#'
            },
            {
                title: 'Brand Identity Design',
                description: 'Complete brand identity design for a tech startup including logo, color palette, typography, and marketing materials.',
                image: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=500',
                technologies: ['Adobe Illustrator', 'Photoshop', 'InDesign', 'Branding'],
                category: 'design',
                githubUrl: '#',
                demoUrl: '#'
            }
        ];
        
        projectsGrid.innerHTML = defaultProjects.map(project => `
            <div class="project-card" data-category="${project.category}">
                <img src="${project.image}" alt="${project.title}" class="project-image">
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tech">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        <a href="${project.githubUrl}" class="project-link" target="_blank">
                            <i class="fab fa-github"></i> GitHub
                        </a>
                        <a href="${project.demoUrl}" class="project-link" target="_blank">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    setupContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            const mailtoLink = `mailto:ragavhiiit@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(message + '\n\nSender Email: ' + email)}`;
            window.location.href = mailtoLink;
        });
    }
    
    setupScrollToTop() {
        const scrollTopBtn = document.getElementById('scroll-top');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });
        
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Initialize portfolio and additional features when DOM is loaded

document.addEventListener('DOMContentLoaded', () => {
    new Portfolio();
    // Add loading animation to images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
    });
    // Add hover effects to social links
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.classList.add('hover-scale');
        });
        link.addEventListener('mouseleave', () => {
            link.classList.remove('hover-scale');
        });
    });
    // Add click animation to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.add('clicked');
            setTimeout(() => {
                button.classList.remove('clicked');
            }, 200);
        });
    });
});