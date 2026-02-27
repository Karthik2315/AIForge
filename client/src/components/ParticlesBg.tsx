import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useCallback, useEffect, useState } from 'react';

export default function ParticlesBg() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = useCallback((container: any) => {
    console.log('Indigo particles loaded!');
  }, []);

  return init ? (
    <Particles
      id="tsparticles"
      className="fixed inset-0 pointer-events-none z-[-1]"
      init={particlesLoaded}
      options={{
        fullScreen: { enable: false, zIndex: -1 },
        background: { color: { value: '#1e1b4b' } },
        fpsLimit: 60,
        particles: {
          number: { value: 100, density: { enable: true, value_area: 800 } },
          color: { value: '#8b5cf6' }, // Indigo
          shape: { type: 'circle' },
          opacity: { 
            value: 0.6, random: true, 
            anim: { enable: true, speed: 1, opacity_min: 0.2 } 
          },
          size: { value: 4, random: true },
          move: {
            enable: true, speed: 1.5, direction: 'none', random: true,
            straight: false, outModes: { default: 'destroy' }
          },
          lineLinked: {
            enable: true, distance: 120, color: '#a78bfa',
            opacity: 0.3, width: 1
          }
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: 'repulse' },
            onClick: { enable: true, mode: 'push' }
          },
          modes: {
            repulse: { distance: 100 },
            push: { quantity: 5 }
          }
        },
        detectRetina: true
      }}
    />
  ) : null;
}
