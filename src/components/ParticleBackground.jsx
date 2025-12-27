import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useMantineColorScheme } from "@mantine/core";

const ParticleBackground = () => {
  const [init, setInit] = useState(false);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    console.log(container);
  };

  const options = useMemo(() => ({
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab",
        },
      },
      modes: {
        grab: {
          distance: 140,
          links: {
            opacity: 0.5,
          },
        },
      },
    },
    particles: {
      color: {
        value: [
          "#7f8c8d", "#7f8c8d", "#7f8c8d", "#7f8c8d", "#7f8c8d", "#7f8c8d", "#7f8c8d", "#7f8c8d", // Carbon (Gray)
          "#7f8c8d", "#7f8c8d", "#7f8c8d", "#7f8c8d", "#7f8c8d", "#7f8c8d", "#7f8c8d", "#7f8c8d",
          "#c0392b", "#c0392b", // Oxygen (Muted Red)
          "#2980b9", "#2980b9", // Nitrogen (Muted Blue)
          "#8e44ad", // Rare Purple
          "#f1c40f", // Rare Yellow
        ],
      },
      links: {
        color: isDark ? "#ffffff" : "#000000", // Black in light mode for visibility
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1.5,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 1,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 60,
      },
      opacity: {
        value: 0.8,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 4, max: 7 },
      },
    },
    detectRetina: true,
  }), [isDark]);

  if (init) {
    return (
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={options}
        style={{
            position: 'absolute',
            zIndex: -1,
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
        }}
      />
    );
  }

  return <></>;
};

export default ParticleBackground;
