import React, { useEffect, useRef } from 'react';

const LuxuryBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;
        let animationFrameId;

        // Set canvas size
        const setSize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        setSize();
        window.addEventListener('resize', setSize);

        // Particle configuration
        const particleCount = 60;
        const particles = [];

        class Particle {
            constructor() {
                this.reset();
                // Randomize initial Y so they don't all start at bottom
                this.y = Math.random() * height;
            }

            reset() {
                this.x = Math.random() * width;
                this.y = height + 10;
                this.size = Math.random() * 2 + 0.5; // Small, elegant size
                this.speedY = Math.random() * 0.3 + 0.1; // Very slow rise
                this.opacity = Math.random() * 0.5 + 0.1; // Subtle opacity
                this.fadeSpeed = Math.random() * 0.002 + 0.001;
                this.color = '#D4AF37'; // Gold color
            }

            update() {
                this.y -= this.speedY;

                // Subtle fade in/out slightly
                if (this.opacity <= 0.1 || this.opacity >= 0.5) {
                    this.fadeSpeed *= -1;
                }
                this.opacity += this.fadeSpeed;

                // Reset if off screen
                if (this.y < -10) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`; // Gold with alpha
                ctx.fill();
            }
        }

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Animation Loop
        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', setSize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
            style={{ background: 'transparent' }}
        />
    );
};

export default LuxuryBackground;
