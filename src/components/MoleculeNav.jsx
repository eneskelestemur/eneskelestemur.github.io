import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMantineColorScheme, Box, Text } from '@mantine/core';
import { IconHome, IconCode, IconFlask, IconNotebook, IconUser } from '@tabler/icons-react';

// Based on actual Mozenavir SVG coordinates, scaled and centered
const S = 1.7; // Scale factor
const OX = -20; // X offset for centering
const OY = -150; // Y offset

// Transform original coordinates
const t = (x, y) => ({ x: x * S + OX, y: y * S + OY });

// Key atom positions from the Mozenavir SVG
const ATOMS = {
  // Central urea/diazepinone core - "Home"
  n1: t(280, 210),
  c2: t(255.3, 250.3),
  n3: t(206, 252),
  c4: t(179.2, 217.2),
  c5: t(187.7, 171.9),
  c6: t(228.4, 150.3),
  c7: t(270.7, 168.7),
  oh_right: t(227, 105),
  oh_left: t(148, 145),
  carbonyl_o: t(276, 290),

  // Bridges to central core
  cbr: t(327.9, 221.7), //bridge to right benzene
  cbl: t(190.9, 294.3), //bridge to left benzene
  cbtl: t(134.7, 229.2), //bridge to top-left benzene
  cbtr: t(305.6, 138.6), //bridge to top-right benzene

  // Right benzene ring (with NH2) - "Research"
  nh2_right: t(454, 330),
  rb1: t(403.7, 317.1),
  rb2: t(373.7, 352.1),
  rb3: t(328.5, 343.6),
  rb4: t(313.2, 300.1),
  rb5: t(343.2, 265.2),
  rb6: t(388.5, 273.7),

  // Left benzene ring (with NH2) - "Code"
  lb1: t(145.2, 299.5),
  lb2: t(117.8, 262.5),
  lb3: t(72.0, 267.7),
  lb4: t(53.6, 310.0),
  lb5: t(81.0, 347.0),
  lb6: t(126.8, 341.8),
  nh2_left: t(62, 388),
  
  // Top-left benzene (phenyl) - "Notebook"
  tlb1: t(102.1, 196.6),
  tlb2: t(114.0, 152.1),
  tlb3: t(81.4, 119.6),
  tlb4: t(36.9, 131.6),
  tlb5: t(25.0, 176.1),
  tlb6: t(57.6, 208.6),
  
  // Top-right benzene (phenyl) - "About"
  trb1: t(349.1, 153.8),
  trb2: t(357.7, 199.0),
  trb3: t(401.2, 214.2),
  trb4: t(436.1, 184.1),
  trb5: t(427.4, 138.8),
  trb6: t(383.9, 123.7),
};

// Calculate ring centers
const ringCenter = (points) => ({
  x: points.reduce((sum, p) => sum + p.x, 0) / points.length,
  y: points.reduce((sum, p) => sum + p.y, 0) / points.length
});

// Define the 5 navigation rings
const RIGHT_BENZENE = [ATOMS.rb1, ATOMS.rb2, ATOMS.rb3, ATOMS.rb4, ATOMS.rb5, ATOMS.rb6];
const LEFT_BENZENE = [ATOMS.lb1, ATOMS.lb2, ATOMS.lb3, ATOMS.lb4, ATOMS.lb5, ATOMS.lb6];
const TOP_LEFT_BENZENE = [ATOMS.tlb1, ATOMS.tlb2, ATOMS.tlb3, ATOMS.tlb4, ATOMS.tlb5, ATOMS.tlb6];
const TOP_RIGHT_BENZENE = [ATOMS.trb1, ATOMS.trb2, ATOMS.trb3, ATOMS.trb4, ATOMS.trb5, ATOMS.trb6];
const CENTRAL_REGION = [ATOMS.n1, ATOMS.c2, ATOMS.n3, ATOMS.c4, ATOMS.c5, ATOMS.c6, ATOMS.c7];

// Ring descriptions for hover effect
const RING_DESCRIPTIONS = {
  home: "Welcome to my portfolio — explore my work",
  code: "Browse my software projects & repositories",
  research: "Learn about my scientific research & publications",
  notebook: "Read my thoughts on science & technology",
  about: "Background, education & what I'm working on"
};

// Define electron flow paths along the molecule backbone
const ELECTRON_PATHS = [
  // Path from left NH2 through central core to right NH2
  [ATOMS.nh2_left, ATOMS.lb5, ATOMS.lb6, ATOMS.lb1, ATOMS.cbl, ATOMS.n3, ATOMS.c2, ATOMS.n1, ATOMS.cbr, ATOMS.rb5, ATOMS.rb6, ATOMS.rb1, ATOMS.nh2_right],
  // Path through top chain
  [ATOMS.n3, ATOMS.c4, ATOMS.c5, ATOMS.c6, ATOMS.c7, ATOMS.n1],
  // Path to top-left benzene
  [ATOMS.c4, ATOMS.cbtl, ATOMS.tlb1, ATOMS.tlb2, ATOMS.tlb3, ATOMS.tlb4, ATOMS.tlb5, ATOMS.tlb6, ATOMS.tlb1],
  // Path to top-right benzene
  [ATOMS.c7, ATOMS.cbtr, ATOMS.trb1, ATOMS.trb6, ATOMS.trb5, ATOMS.trb4, ATOMS.trb3, ATOMS.trb2, ATOMS.trb1],
];

// All bond segments for electron attraction
const BOND_SEGMENTS = [
  // Right benzene
  [ATOMS.rb1, ATOMS.rb2], [ATOMS.rb2, ATOMS.rb3], [ATOMS.rb3, ATOMS.rb4],
  [ATOMS.rb4, ATOMS.rb5], [ATOMS.rb5, ATOMS.rb6], [ATOMS.rb6, ATOMS.rb1],
  // Left benzene
  [ATOMS.lb1, ATOMS.lb2], [ATOMS.lb2, ATOMS.lb3], [ATOMS.lb3, ATOMS.lb4],
  [ATOMS.lb4, ATOMS.lb5], [ATOMS.lb5, ATOMS.lb6], [ATOMS.lb6, ATOMS.lb1],
  // Top-left benzene
  [ATOMS.tlb1, ATOMS.tlb2], [ATOMS.tlb2, ATOMS.tlb3], [ATOMS.tlb3, ATOMS.tlb4],
  [ATOMS.tlb4, ATOMS.tlb5], [ATOMS.tlb5, ATOMS.tlb6], [ATOMS.tlb6, ATOMS.tlb1],
  // Top-right benzene
  [ATOMS.trb1, ATOMS.trb2], [ATOMS.trb2, ATOMS.trb3], [ATOMS.trb3, ATOMS.trb4],
  [ATOMS.trb4, ATOMS.trb5], [ATOMS.trb5, ATOMS.trb6], [ATOMS.trb6, ATOMS.trb1],
  // Central core and bridges
  [ATOMS.rb5, ATOMS.cbr], [ATOMS.cbr, ATOMS.n1], [ATOMS.n1, ATOMS.c2],
  [ATOMS.c2, ATOMS.carbonyl_o], [ATOMS.c2, ATOMS.n3], [ATOMS.n3, ATOMS.cbl],
  [ATOMS.cbl, ATOMS.lb1], [ATOMS.n3, ATOMS.c4], [ATOMS.c4, ATOMS.cbtl],
  [ATOMS.cbtl, ATOMS.tlb1], [ATOMS.c4, ATOMS.c5], [ATOMS.c5, ATOMS.oh_left],
  [ATOMS.c5, ATOMS.c6], [ATOMS.c6, ATOMS.oh_right], [ATOMS.c6, ATOMS.c7],
  [ATOMS.c7, ATOMS.cbtr], [ATOMS.cbtr, ATOMS.trb1], [ATOMS.c7, ATOMS.n1],
  // NH2 branches
  [ATOMS.lb5, ATOMS.nh2_left], [ATOMS.rb1, ATOMS.nh2_right],
];

// Helper to generate a unique key for points (handling floating point precision)
const pointKey = (p) => `${Math.round(p.x * 10) / 10},${Math.round(p.y * 10) / 10}`;

// Build Connectivity Graph
const GRAPH = {};
BOND_SEGMENTS.forEach((seg, index) => {
  const startKey = pointKey(seg[0]);
  const endKey = pointKey(seg[1]);

  if (!GRAPH[startKey]) GRAPH[startKey] = [];
  if (!GRAPH[endKey]) GRAPH[endKey] = [];

  // Connectivity:
  GRAPH[startKey].push({ segmentIndex: index, neighborKey: endKey, startNode: startKey, endNode: endKey, enterAt: 0 });
  GRAPH[endKey].push({ segmentIndex: index, neighborKey: startKey, startNode: endKey, endNode: startKey, enterAt: 1 });
});

const dotProduct = (v1, v2) => v1.x * v2.x + v1.y * v2.y;
const normalize = (v) => {
  const len = Math.hypot(v.x, v.y) || 1;
  return { x: v.x / len, y: v.y / len };
};
const sub = (v1, v2) => ({ x: v1.x - v2.x, y: v1.y - v2.y });

// Atoms that should "breathe" (N and O atoms)
const BREATHING_ATOMS = [
  { atom: ATOMS.nh2_right, color: 'nitrogen', baseR: 12 },
  { atom: ATOMS.nh2_left, color: 'nitrogen', baseR: 12 },
  { atom: ATOMS.n1, color: 'nitrogen', baseR: 10 },
  { atom: ATOMS.n3, color: 'nitrogen', baseR: 10 },
  { atom: ATOMS.carbonyl_o, color: 'oxygen', baseR: 11 },
  { atom: ATOMS.oh_left, color: 'oxygen', baseR: 11 },
  { atom: ATOMS.oh_right, color: 'oxygen', baseR: 11 },
];

const RINGS = [
  { 
    id: 'home', 
    label: 'Home', 
    path: '/', 
    points: CENTRAL_REGION,
    center: ringCenter(CENTRAL_REGION),
    icon: IconHome, 
    color: '#228be6',
  },
  { 
    id: 'code', 
    label: 'Code', 
    path: '/code', 
    points: LEFT_BENZENE,
    center: ringCenter(LEFT_BENZENE),
    icon: IconCode, 
    color: '#40c057'
  },
  { 
    id: 'research', 
    label: 'Research', 
    path: '/research', 
    points: RIGHT_BENZENE,
    center: ringCenter(RIGHT_BENZENE),
    icon: IconFlask, 
    color: '#fab005'
  },
  { 
    id: 'notebook', 
    label: 'Notebook', 
    path: '/notebook', 
    points: TOP_LEFT_BENZENE,
    center: ringCenter(TOP_LEFT_BENZENE),
    icon: IconNotebook, 
    color: '#e64980'
  },
  { 
    id: 'about', 
    label: 'About', 
    path: '/about', 
    points: TOP_RIGHT_BENZENE,
    center: ringCenter(TOP_RIGHT_BENZENE),
    icon: IconUser, 
    color: '#9775fa'
  },
];

export function MoleculeNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const [hoveredRing, setHoveredRing] = useState(null);
  
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [time, setTime] = useState(0);
  const [vibrationOffsets, setVibrationOffsets] = useState({});
  const [attractedElectrons, setAttractedElectrons] = useState([]);
  const mousePosRef = useRef({ x: 375, y: 290 });
  const isHoveringRef = useRef(isHovering);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (svgRef.current && isHoveringRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 750;
        const y = ((e.clientY - rect.top) / rect.height) * 580;
        const newPos = { x, y };
        mousePosRef.current = newPos;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let animationId;
    let lastVibrationTime = 0;
    const animate = (currentTime) => {
      setTime(currentTime / 1000);
      
      if (currentTime - lastVibrationTime > 50) {
        setVibrationOffsets(prev => {
          const newOffsets = { ...prev };
          Object.keys(ATOMS).forEach(key => {
            if (!newOffsets[key] || Math.random() < 0.15) {
              newOffsets[key] = {
                x: (Math.random() - 0.5) * 2.5,
                y: (Math.random() - 0.5) * 2.5
              };
            }
          });
          return newOffsets;
        });
        lastVibrationTime = currentTime;
      }
      
      if (isHoveringRef.current) {
        setAttractedElectrons(prev => prev.map(electron => {
            const segment = BOND_SEGMENTS[electron.segmentIndex];
            const start = segment[0];
            const end = segment[1];
            const currentPos = {
                x: start.x + (end.x - start.x) * electron.t,
                y: start.y + (end.y - start.y) * electron.t
            };
            const mouse = mousePosRef.current;
            const mouseVec = normalize(sub(mouse, currentPos));
            const segVec = normalize(sub(end, start));
            const alignment = dotProduct(mouseVec, segVec);
            let nextT = electron.t + alignment * electron.speed;
            let nextSegIdx = electron.segmentIndex;
            
            if (nextT > 1 || nextT < 0) {
                const nodeKey = nextT > 1 ? pointKey(end) : pointKey(start);
                const neighbors = GRAPH[nodeKey] || [];
                let bestNeighbor = null;
                let maxScore = -Infinity;
                neighbors.forEach(n => {
                    if (neighbors.length > 1 && n.segmentIndex === electron.segmentIndex) return;
                    const nSeg = BOND_SEGMENTS[n.segmentIndex];
                    const pStart = n.enterAt === 0 ? nSeg[0] : nSeg[1];
                    const pEnd = n.enterAt === 0 ? nSeg[1] : nSeg[0];
                    const vecOut = normalize(sub(pEnd, pStart));
                    const score = dotProduct(mouseVec, vecOut);
                    if (score > maxScore) {
                        maxScore = score;
                        bestNeighbor = n;
                    }
                });
                if (bestNeighbor) {
                    nextSegIdx = bestNeighbor.segmentIndex;
                    nextT = bestNeighbor.enterAt; 
                } else {
                    nextT = Math.max(0, Math.min(1, nextT));
                }
            }
            return {
                ...electron,
                segmentIndex: nextSegIdx,
                t: nextT
            };
        }));
      }
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Initialize attracted electrons on hover
  const handleMouseEnter = () => {
    if (isHoveringRef.current) return; // Prevent reset if already hovering
    
    setIsHovering(true);
    isHoveringRef.current = true;
    const newElectrons = [];
    const startSegments = [0, 8, 16, 24, 30, 36, 42]; 
    for (let i = 0; i < 7; i++) {
      const segIndex = startSegments[i] % BOND_SEGMENTS.length;
      newElectrons.push({
        id: i,
        segmentIndex: segIndex,
        t: 0.5,
        speed: 0.015 + Math.random() * 0.02,
        size: 4 + Math.random() * 2
      });
    }
    setAttractedElectrons(newElectrons);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    isHoveringRef.current = false;
    setAttractedElectrons([]);
  };

  const strokeColor = isDark ? '#adb5bd' : '#495057'; // Lighter grey for cylinders
  const bondWidth = 6; 
  const bondProps = { stroke: 'url(#cylinder-gradient)', strokeWidth: bondWidth, strokeLinecap: 'round', strokeLinejoin: 'round' };
  // Thinner stroke for double bonds so they don't merge
  const doubleBondProps = { ...bondProps, strokeWidth: 4 }; 
  const atomStroke = 'none'; // No stroke for 3D spheres

  const doubleBond = (from, to, offset = 12) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.hypot(dx, dy) || 1;
    const ox = (-dy / len) * offset;
    const oy = (dx / len) * offset;
    return (
      <g key={`db-${from.x}-${to.x}`}>
        <line x1={from.x + ox/2} y1={from.y + oy/2} x2={to.x + ox/2} y2={to.y + oy/2} {...doubleBondProps} />
        <line x1={from.x - ox/2} y1={from.y - oy/2} x2={to.x - ox/2} y2={to.y - oy/2} {...doubleBondProps} />
      </g>
    );
  };

  const bond = (from, to, key) => (
    <line key={key} x1={from.x} y1={from.y} x2={to.x} y2={to.y} {...bondProps} />
  );

  const getBreathingScale = (index) => {
    const phase = index * 0.5;
    return 1 + Math.sin(time * 2 + phase) * 0.08;
  };

  const allAtoms = Object.entries(ATOMS).map(([key, pos]) => {
     let type = 'carbon';
     let radius = 9; // Slightly larger for 3D
     let fillUrl = 'url(#sphere-carbon)';
     
     if (key.startsWith('n') || key.includes('nh')) {
         type = 'nitrogen';
         radius = 12;
         fillUrl = 'url(#sphere-nitrogen)';
     } else if (key.includes('o') || key.includes('oh')) {
         type = 'oxygen';
         radius = 13;
         fillUrl = 'url(#sphere-oxygen)';
     }
     
     return { key, ...pos, type, radius, fillUrl };
  });

  const electronParticles = useMemo(() => {
    const particles = [];
    ELECTRON_PATHS.forEach((path, pathIndex) => {
      for (let i = 0; i < 2; i++) {
        particles.push({
          pathIndex,
          path,
          delay: i * 0.5 + pathIndex * 0.3,
          duration: 4 + pathIndex * 0.5
        });
      }
    });
    return particles;
  }, []);

  return (
    <Box
      ref={containerRef}
      style={{
        width: '100%',
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '0.5rem',
        padding: 'clamp(8px, 2vw, 20px)',
        borderRadius: '16px',
        transform: 'translateX(10px)',
        background: isDark
          ? 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.06))'
          : 'linear-gradient(180deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.04))',
        backgroundColor: isDark ? 'transparent' : 'rgba(228,230,233,0.03)',
        backdropFilter: 'blur(16px) saturate(135%)',
        WebkitBackdropFilter: 'blur(16px) saturate(135%)',
        border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
        boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.45)' : '0 14px 40px rgba(10,10,10,0.06), inset 0 1px 0 rgba(255,255,255,0.08)',
        backgroundClip: 'padding-box'
      }}
    >
      {/* Fluid width with the viewBox doing the scaling: the molecule keeps its
          internal coordinates, so hover targets and electron paths behave the
          same at any size. */}
      <svg
        ref={svgRef}
        viewBox="0 0 750 525"
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: 'auto', maxWidth: '750px', overflow: 'visible' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <filter id="backdrop-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="40" result="blur"/>
          </filter>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="atomGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="blur"/>
             <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
          <filter id="electronGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* 3D Sphere Gradients */}
          <radialGradient id="sphere-carbon" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#d1d5db" />
            <stop offset="50%" stopColor="#6c757d" />
            <stop offset="100%" stopColor="#343a40" />
          </radialGradient>
          
          <radialGradient id="sphere-nitrogen" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </radialGradient>
          
          <radialGradient id="sphere-oxygen" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="50%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </radialGradient>
          
          {/* Cylinder Gradient for Bonds */}
          <linearGradient id="cylinder-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            {/* Dark Mode: #495057 -> #adb5bd. Light Mode: #868e96 -> #dee2e6 (Darker than before) */}
            <stop offset="0%" stopColor={isDark ? '#495057' : '#868e96'} />
            <stop offset="40%" stopColor={isDark ? '#adb5bd' : '#dee2e6'} />
            <stop offset="60%" stopColor={isDark ? '#adb5bd' : '#dee2e6'} />
            <stop offset="100%" stopColor={isDark ? '#495057' : '#868e96'} />
          </linearGradient>

          {ELECTRON_PATHS.map((path, idx) => (
            <path
              key={`electron-path-${idx}`}
              id={`electronPath${idx}`}
              d={`M ${path.map(p => `${p.x},${p.y}`).join(' L ')}`}
              fill="none"
            />
          ))}
        </defs>

        {/* BONDS LAYER (Cylinders) */}
        <g className="bonds-layer">
        {bond(ATOMS.rb1, ATOMS.rb2, 'rb12')}
        {doubleBond(ATOMS.rb2, ATOMS.rb3, 10)}
        {bond(ATOMS.rb3, ATOMS.rb4, 'rb34')}
        {doubleBond(ATOMS.rb4, ATOMS.rb5, 10)}
        {bond(ATOMS.rb5, ATOMS.rb6, 'rb56')}
        {doubleBond(ATOMS.rb6, ATOMS.rb1, 10)}
        
        {bond(ATOMS.lb1, ATOMS.lb2, 'lb12')}
        {doubleBond(ATOMS.lb2, ATOMS.lb3, 10)}
        {bond(ATOMS.lb3, ATOMS.lb4, 'lb34')}
        {doubleBond(ATOMS.lb4, ATOMS.lb5, 10)}
        {bond(ATOMS.lb5, ATOMS.lb6, 'lb56')}
        {doubleBond(ATOMS.lb6, ATOMS.lb1, 10)}
        
        {bond(ATOMS.tlb1, ATOMS.tlb2, 'tlb14')}
        {doubleBond(ATOMS.tlb2, ATOMS.tlb3, 10)}
        {bond(ATOMS.tlb3, ATOMS.tlb4, 'tlb36')}
        {doubleBond(ATOMS.tlb4, ATOMS.tlb5, 10)}
        {bond(ATOMS.tlb5, ATOMS.tlb6, 'tlb58')}
        {doubleBond(ATOMS.tlb6, ATOMS.tlb1, 10)}
        
        {bond(ATOMS.cbtr, ATOMS.trb1, 'cbtr2')}
        {doubleBond(ATOMS.trb1, ATOMS.trb2, 10)}
        {bond(ATOMS.trb2, ATOMS.trb3, 'trb24')}
        {doubleBond(ATOMS.trb3, ATOMS.trb4, 10)}
        {bond(ATOMS.trb4, ATOMS.trb5, 'trb46')}
        {doubleBond(ATOMS.trb5, ATOMS.trb6, 10)}
        {bond(ATOMS.trb6, ATOMS.trb1, 'trb61')}
        
        {bond(ATOMS.rb5, ATOMS.cbr, 'rb5-cbr')}
        {bond(ATOMS.cbr, ATOMS.n1, 'cbr-n1')}
        {bond(ATOMS.n1, ATOMS.c2, 'n1-c2')}
        {doubleBond(ATOMS.c2, ATOMS.carbonyl_o, 10)}
        {bond(ATOMS.c2, ATOMS.n3, 'c2-n3')}
        {bond(ATOMS.n3, ATOMS.cbl, 'n3-cbl')}
        {bond(ATOMS.cbl, ATOMS.lb1, 'cbl-lb1')}
        
        {bond(ATOMS.n3, ATOMS.c4, 'n3-c4')}
        {bond(ATOMS.c4, ATOMS.cbtl, 'c4-cbtl')}
        {bond(ATOMS.cbtl, ATOMS.tlb1, 'cbtl-tlb1')}
        {bond(ATOMS.c4, ATOMS.c5, 'c4-c5')}
        {bond(ATOMS.c5, ATOMS.oh_left, 'c5-oh')}
        {bond(ATOMS.c5, ATOMS.c6, 'c5-c6')}
        {bond(ATOMS.c6, ATOMS.oh_right, 'c6-oh')}
        {bond(ATOMS.c6, ATOMS.c7, 'c6-c7')}
        {bond(ATOMS.c7, ATOMS.cbtr, 'c7-cbtr')}
        {bond(ATOMS.c7, ATOMS.n1, 'c7-n1')}
        
        {bond(ATOMS.lb5, ATOMS.nh2_left, 'lb5-nh2')}
        {bond(ATOMS.rb1, ATOMS.nh2_right, 'rb1-nh2')}
        </g>

        {/* ATOMS LAYER (3D Spheres) */}
        <g className="atoms-layer">
          {allAtoms.map((atom) => {
             const breatherIdx = BREATHING_ATOMS.findIndex(b => b.atom === ATOMS[atom.key]);
             let r = atom.radius;
             if (breatherIdx !== -1) {
                 const scale = getBreathingScale(breatherIdx);
                 r = atom.radius * scale; 
             }
             const vib = vibrationOffsets[atom.key] || {x:0, y:0};

             return (
               <circle 
                 key={atom.key}
                 cx={atom.x + vib.x}
                 cy={atom.y + vib.y}
                 r={r}
                 fill={atom.fillUrl} // Use Gradient
                 stroke={atomStroke}
                 strokeWidth="0"
                 // Removed blur filter for sharper 3D look, or can keep slightly
                 style={{ transition: 'r 0.1s ease-out' }}
               />
             );
          })}
        </g>

        {/* Electron flow particles (Now on top of bonds but below nav rings) */}
        <g className="electron-layer" style={{ opacity: 0.7 }}>
          {electronParticles.map((particle, idx) => (
            <circle
              key={`electron-${idx}`}
              r="3"
              fill={isDark ? '#60a5fa' : '#3b82f6'}
              filter="url(#electronGlow)"
            >
              <animateMotion
                dur={`${particle.duration}s`}
                repeatCount="indefinite"
                begin={`${particle.delay}s`}
              >
                <mpath href={`#electronPath${particle.pathIndex}`} />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0.3;0.8;0.3"
                dur={`${particle.duration}s`}
                repeatCount="indefinite"
                begin={`${particle.delay}s`}
              />
            </circle>
          ))}
        </g>
        
        {isHovering && (
          <g className="attracted-electrons">
            {attractedElectrons.map((electron) => {
              const seg = BOND_SEGMENTS[electron.segmentIndex];
              const sx = seg[0].x + (seg[1].x - seg[0].x) * electron.t;
              const sy = seg[0].y + (seg[1].y - seg[0].y) * electron.t;
              return (
                <circle
                  key={`attracted-${electron.id}`}
                  cx={sx}
                  cy={sy}
                  r={electron.size}
                  fill={isDark ? '#a78bfa' : '#8b5cf6'}
                  filter="url(#electronGlow)"
                  style={{ opacity: 0.8 }}
                />
              );
            })}
          </g>
        )}

        {/* NAVIGATION RING OVERLAYS */}
        <g className="nav-layer">
        {RINGS.map((ring) => {
          const isActive = location.pathname === ring.path;
          const isHovered = hoveredRing === ring.id;
          const showText = isHovered || isActive;
          const Icon = ring.icon;
          
          return (
            <g 
              key={ring.id} 
              onClick={() => ring.path !== '#' && navigate(ring.path)}
              onMouseEnter={() => setHoveredRing(ring.id)}
              onMouseLeave={() => setHoveredRing(null)}
              style={{ cursor: ring.path !== '#' ? 'pointer' : 'default' }}
              className="molecule-ring"
            >
              <circle cx={ring.center.x} cy={ring.center.y} r={45} fill="transparent" />
              <circle
                cx={ring.center.x}
                cy={ring.center.y}
                r={38}
                fill={showText ? `${ring.color}35` : 'transparent'}
                stroke={showText ? ring.color : 'transparent'}
                strokeWidth="2"
                filter={isActive ? "url(#glow)" : undefined}
                style={{ transition: 'all 0.25s ease' }}
              />
              <foreignObject
                x={ring.center.x - 30}
                y={ring.center.y - 25}
                width={60}
                height={50}
                style={{ pointerEvents: 'none' }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: '100%',
                  transition: 'all 0.25s ease'
                }}>
                  {showText ? (
                    <span style={{
                      fontSize: ring.id === 'research' || ring.id === 'notebook' ? '10px' : '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: isDark ? '#fff' : ring.color,
                      textShadow: isDark ? '0 1px 3px rgba(0,0,0,0.9)' : `0 1px 2px rgba(255,255,255,0.9)`,
                    }}>
                      {ring.label}
                    </span>
                  ) : (
                    <Icon size={32} color={strokeColor} strokeWidth={1.5} />
                  )}
                </div>
              </foreignObject>
            </g>
          );
        })}
        </g>
      </svg>
      
      <Box style={{ height: '24px', marginTop: '-20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Text 
          size="sm" 
          c="dimmed"
          style={{ 
            fontStyle: 'italic',
            opacity: hoveredRing ? 1 : 0,
            transition: 'opacity 0.3s ease',
            letterSpacing: '0.3px'
          }}
        >
          {hoveredRing ? RING_DESCRIPTIONS[hoveredRing] : ''}
        </Text>
      </Box>
      
      <style>{`
        .molecule-ring { transition: all 0.2s ease; }
        .bonds-layer line { animation: bondPulse 2.5s ease-in-out infinite; }
        .bonds-layer line:nth-child(odd) { animation-delay: 0.4s; }
        .bonds-layer line:nth-child(3n) { animation-delay: 0.8s; }
        @keyframes bondPulse {
          0%, 100% { opacity: 0.9; stroke-width: 5.5px; }
          50% { opacity: 1; stroke-width: 6.5px; }
        }
        .electron-layer circle { filter: url(#electronGlow); }
        .attracted-electrons circle { filter: url(#electronGlow); }
      `}</style>
    </Box>
  );
}