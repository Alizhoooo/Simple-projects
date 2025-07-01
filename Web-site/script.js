// Get canvas element and its 2D rendering context
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

// Array to store particle objects
const particles = [];

// Mouse position object
const mouse = {
    x: undefined,
    y: undefined,
    radius: 100 // Radius within which particles react to mouse
};

// --- Canvas Setup ---

/**
 * Sets the canvas dimensions to match the window size.
 * Also clears the canvas when resized.
 */
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = '#1a1a2e'; // Ensure background color matches CSS
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill with background color on resize
}

// Initial canvas resize and add event listener for window resize
window.addEventListener('load', resizeCanvas); // Ensure canvas is sized after everything loads
window.addEventListener('resize', resizeCanvas);


// --- Particle Class ---

/**
 * Represents a single particle in the animation.
 * @class
 * @param {number} x - Initial x-coordinate.
 * @param {number} y - Initial y-coordinate.
 * @param {string} color - Color of the particle.
 */
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 1; // Random size between 1 and 6
        this.baseSize = this.size; // Store original size
        this.speedX = Math.random() * 3 - 1.5; // Random horizontal speed (-1.5 to 1.5)
        this.speedY = Math.random() * 3 - 1.5; // Random vertical speed (-1.5 to 1.5)
        this.color = color;
        this.lifetime = 0; // Tracks how long the particle has been alive
        this.maxLifetime = Math.random() * 80 + 100; // Random max lifetime (100-180 frames)
        this.alpha = 1; // Initial opacity
    }

    /**
     * Updates the particle's position, size, and opacity based on its lifetime and mouse interaction.
     */
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.lifetime++;

        // Fade out as particle ages
        this.alpha = 1 - (this.lifetime / this.maxLifetime);
        if (this.alpha < 0) this.alpha = 0; // Ensure alpha doesn't go negative

        // Shrink particle as it fades
        this.size = this.baseSize * this.alpha; // Shrink proportionally to alpha

        // Check for mouse collision (optional: makes particles repel/attract or grow)
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius + this.baseSize) {
            // Example: particles slightly grow and push away near mouse
            if (this.size < this.baseSize * 1.5) { // Max size increase
                this.size += 0.1;
            }
            // Simple repulsion effect (optional, can be complex)
            // const angle = Math.atan2(dy, dx);
            // this.x -= Math.cos(angle) * (mouse.radius - distance) * 0.05;
            // this.y -= Math.sin(angle) * (mouse.radius - distance) * 0.05;
        } else if (this.size > this.baseSize) {
            this.size -= 0.05; // Shrink back to base size if mouse moves away
            if (this.size < this.baseSize) this.size = this.baseSize;
        }

        // Remove particle if it's too small or lived too long
        if (this.size <= 0.1 || this.lifetime >= this.maxLifetime) {
            return false; // Indicate particle should be removed
        }
        return true; // Indicate particle is still active
    }

    /**
     * Draws the particle on the canvas.
     */
    draw() {
        ctx.fillStyle = `rgba(${parseInt(this.color.slice(1, 3), 16)}, ${parseInt(this.color.slice(3, 5), 16)}, ${parseInt(this.color.slice(5, 7), 16)}, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// --- Particle Generation ---

// Array of vibrant colors for particles
const particleColors = ['#8A2BE2', '#4169E1', '#00BFFF', '#7B68EE', '#ADFF2F', '#FFD700', '#FF4500'];

/**
 * Creates new particles at a given position.
 * @param {number} x - The x-coordinate for new particles.
 * @param {number} y - The y-coordinate for new particles.
 * @param {number} count - The number of particles to create.
 */
function createParticles(x, y, count) {
    for (let i = 0; i < count; i++) {
        const randomColor = particleColors[Math.floor(Math.random() * particleColors.length)];
        particles.push(new Particle(x, y, randomColor));
    }
}

// --- Animation Loop ---

/**
 * The main animation loop. Updates and draws particles.
 */
function animate() {
    // Clear canvas for next frame. We clear with a slight transparency
    // to create a "trailing" effect for particles.
    ctx.fillStyle = 'rgba(26, 26, 46, 0.1)'; /* Matches body background, but transparent */
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Filter out dead particles and update/draw remaining ones
    for (let i = 0; i < particles.length; i++) {
        if (particles[i].update()) {
            particles[i].draw();
        } else {
            // Remove particle if its update method returns false
            particles.splice(i, 1);
            i--; // Adjust index after removal
        }
    }

    requestAnimationFrame(animate); // Request next animation frame
}

// --- Event Listeners ---

// Update mouse position and create particles on mouse move
canvas.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    // Create a small burst of particles at mouse position
    createParticles(event.clientX, event.clientY, 2);
});

// Reset mouse position when mouse leaves the canvas
canvas.addEventListener('mouseleave', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

// --- Start Animation ---
animate(); // Start the animation loop when the script loads
