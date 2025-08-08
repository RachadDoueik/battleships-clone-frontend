import { useEffect, useRef } from 'react';
import '../css/AnimatedBackground.css';

function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Wave animation
    const waves = [];
    const waveCount = 3;

    for (let i = 0; i < waveCount; i++) {
      waves.push({
        y: canvas.height * 0.7 + i * 30,
        length: 0.01 + i * 0.002,
        amplitude: 20 + i * 15,
        frequency: 0.02 + i * 0.01,
        opacity: 0.3 - i * 0.1
      });
    }

    // Floating particles (bubbles)
    const particles = [];
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 4 + 2,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.3 + 0.1
      });
    }

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#1a237e');
      gradient.addColorStop(0.5, '#283593');
      gradient.addColorStop(1, '#3949ab');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw waves
      waves.forEach((wave, index) => {
        ctx.beginPath();
        ctx.globalAlpha = wave.opacity;
        
        for (let x = 0; x <= canvas.width; x++) {
          const y = wave.y + Math.sin(x * wave.length + time * wave.frequency) * wave.amplitude;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        
        const waveGradient = ctx.createLinearGradient(0, wave.y - 50, 0, canvas.height);
        waveGradient.addColorStop(0, `rgba(63, 81, 181, ${0.3 - index * 0.1})`);
        waveGradient.addColorStop(1, `rgba(63, 81, 181, ${0.5 - index * 0.1})`);
        
        ctx.fillStyle = waveGradient;
        ctx.fill();
      });

      // Draw particles (bubbles)
      ctx.globalAlpha = 1;
      particles.forEach(particle => {
        particle.y -= particle.speed;
        
        if (particle.y < -particle.radius) {
          particle.y = canvas.height + particle.radius;
          particle.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();
        
        // Add bubble shine effect
        ctx.beginPath();
        ctx.arc(particle.x - particle.radius * 0.3, particle.y - particle.radius * 0.3, particle.radius * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * 0.8})`;
        ctx.fill();
      });

      time += 0.02;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="animated-background">
      <canvas ref={canvasRef} className="wave-canvas"></canvas>
      <div className="floating-ships">
        <div className="ship ship-1">🚢</div>
        <div className="ship ship-2">⛵</div>
        <div className="ship ship-3">🛥️</div>
      </div>
    </div>
  );
}

export default AnimatedBackground;
