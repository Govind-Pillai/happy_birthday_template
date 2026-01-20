import React, { useEffect, useRef } from 'react';

const FluidSimulation = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const width = canvas.width = window.innerWidth;
        const height = canvas.height = window.innerHeight;

        // Simulation parameters
        const SIM_RES = 64;
        const DYE_RES = 512;
        const iterations = 20;
        const viscosity = 0.8;
        const diffusion = 0.5;

        // Fluid state (simplified version for browser)
        // In a real production app, we'd use WebGL for this, 
        // but a 2D canvas approach with particles is often more reliable for quick prototypes.

        class FluidParticle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.vx = 0;
                this.vy = 0;
                this.life = Math.random() * 0.5 + 0.5;
                this.color = `hsla(${Math.random() * 30 + 330}, 100%, 70%, 0.5)`;
            }

            update(mouse) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    const force = (100 - dist) / 100;
                    this.vx += (dx / dist) * force * 5;
                    this.vy += (dy / dist) * force * 5;
                }

                this.vx *= 0.95;
                this.vy *= 0.95;
                this.x += this.vx;
                this.y += this.vy;

                // Boundary
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const mouse = { x: -1000, y: -1000 };
        const particles = [];
        for (let i = 0; i < 200; i++) {
            particles.push(new FluidParticle(Math.random() * width, Math.random() * height));
        }

        const animate = () => {
            ctx.fillStyle = 'rgba(255, 230, 240, 0.1)'; // Trail effect
            ctx.fillRect(0, 0, width, height);

            particles.forEach(p => {
                p.update(mouse);
                p.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        window.addEventListener('mousemove', handleMouseMove);
        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                pointerEvents: 'none'
            }}
        />
    );
};

export default FluidSimulation;
