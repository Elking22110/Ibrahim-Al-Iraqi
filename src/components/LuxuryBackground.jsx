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
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 20 : 85; // Drastically reduce on mobile
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
                this.size = Math.random() * 2.5 + 0.5; // Slightly varied sizes
                this.speedY = Math.random() * 1.2 + 0.4; // FASTER: 0.4 to 1.6 px/frame
                this.speedX = (Math.random() - 0.5) * 0.5; // Slight drift
                this.opacity = Math.random() * 0.5 + 0.1;
                this.fadeSpeed = Math.random() * 0.01 + 0.005; // Faster fade for twinkle
                this.isTwinkling = Math.random() > 0.9; // 10% chance to be a high-glint particle
            }

            update() {
                this.y -= this.speedY;
                this.x += Math.sin(this.y * 0.02) * 0.3 + this.speedX; // Organic wave motion

                // Twinkle Effect
                if (this.isTwinkling) {
                    this.opacity += this.fadeSpeed * 2;
                    if (this.opacity >= 1 || this.opacity <= 0.2) {
                        this.fadeSpeed *= -1;
                    }
                } else {
                    // Standard pulse
                    if (this.opacity <= 0.1 || this.opacity >= 0.4) {
                        this.fadeSpeed *= -1;
                    }
                    this.opacity += this.fadeSpeed;
                }

                // Reset if off screen
                if (this.y < -10) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

                // Add a subtle glow to larger particles
                if (this.size > 2) {
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = "rgba(212, 175, 55, 0.5)";
                } else {
                    ctx.shadowBlur = 0;
                }

                ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`; // Gold with alpha
                ctx.fill();
                ctx.shadowBlur = 0; // Reset
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
