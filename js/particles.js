// Particle Background Animation
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mousePosition = { x: 0, y: 0 };
        this.isDarkMode = false;
        
        this.init();
        this.bindEvents();
        this.animate();
    }
    
    init() {
        this.resizeCanvas();
        this.createParticles();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        const particleCount = Math.min(150, Math.floor((this.canvas.width * this.canvas.height) / 10000));
        this.particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height));
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
        });
        
        // Listen for theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    this.isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
                }
            });
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach((particle, index) => {
            particle.update(this.mousePosition);
            particle.draw(this.ctx, this.isDarkMode);
            
            // Connect nearby particles
            for (let j = index + 1; j < this.particles.length; j++) {
                const distance = this.getDistance(particle, this.particles[j]);
                if (distance < 100) {
                    this.drawConnection(particle, this.particles[j], distance);
                }
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    getDistance(p1, p2) {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }
    
    drawConnection(p1, p2, distance) {
        const opacity = (1 - distance / 100) * 0.3;
        this.ctx.strokeStyle = this.isDarkMode 
            ? `rgba(139, 92, 246, ${opacity})` 
            : `rgba(59, 130, 246, ${opacity})`;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
    }
}

class Particle {
    constructor(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.originalRadius = this.radius;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }
    
    update(mousePosition) {
        // Update position
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off edges
        if (this.x <= 0 || this.x >= this.canvasWidth) {
            this.vx = -this.vx;
        }
        if (this.y <= 0 || this.y >= this.canvasHeight) {
            this.vy = -this.vy;
        }
        
        // Mouse interaction
        const distance = Math.sqrt(
            Math.pow(this.x - mousePosition.x, 2) + 
            Math.pow(this.y - mousePosition.y, 2)
        );
        
        if (distance < 100) {
            const force = (100 - distance) / 100;
            this.radius = this.originalRadius + force * 2;
            
            // Slight repulsion from mouse
            const angle = Math.atan2(this.y - mousePosition.y, this.x - mousePosition.x);
            this.vx += Math.cos(angle) * force * 0.01;
            this.vy += Math.sin(angle) * force * 0.01;
        } else {
            this.radius = this.originalRadius;
        }
        
        // Limit velocity
        this.vx = Math.max(-2, Math.min(2, this.vx));
        this.vy = Math.max(-2, Math.min(2, this.vy));
    }
    
    draw(ctx, isDarkMode) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        
        // Create gradient
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius
        );
        
        if (isDarkMode) {
            gradient.addColorStop(0, 'rgba(139, 92, 246, 0.8)');
            gradient.addColorStop(1, 'rgba(139, 92, 246, 0.2)');
        } else {
            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0.2)');
        }
        
        ctx.fillStyle = gradient;
        ctx.fill();
    }
}

// Initialize particle system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        new ParticleSystem(canvas);
    }
});