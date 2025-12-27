import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMantineColorScheme, Box } from '@mantine/core';
import { IconHome, IconCode, IconFlask, IconNotebook, IconPlus } from '@tabler/icons-react';

// Based on actual Mozenavir SVG coordinates, scaled and centered
const S = 1.7; // Scale factor
const OX = -10; // X offset for centering
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
  
  // Top-right benzene (phenyl) - "Future"
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
    path: '/blog', 
    points: TOP_LEFT_BENZENE,
    center: ringCenter(TOP_LEFT_BENZENE),
    icon: IconNotebook, 
    color: '#e64980'
  },
  { 
    id: 'future', 
    label: 'Future', 
    path: '#', 
    points: TOP_RIGHT_BENZENE,
    center: ringCenter(TOP_RIGHT_BENZENE),
    icon: IconPlus, 
    color: '#868e96'
  },
];

export function MoleculeNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const [hoveredRing, setHoveredRing] = useState(null);

  const strokeColor = isDark ? '#e9ecef' : '#343a40';
  const bondWidth = 2;
  const bondProps = { stroke: strokeColor, strokeWidth: bondWidth, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const doubleBondProps = { ...bondProps, strokeWidth: 2 };
  const atomStroke = isDark ? '#1a1b1e' : '#ffffff';
  
  const nitrogenBlue = '#3b82f6';
  const oxygenRed = '#ef4444';

  // Double bond renderer
  const doubleBond = (from, to, offset = 4) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.hypot(dx, dy) || 1;
    const ox = (-dy / len) * offset;
    const oy = (dx / len) * offset;
    return (
      <g key={`db-${from.x}-${to.x}`}>
        <line x1={from.x + ox} y1={from.y + oy} x2={to.x + ox} y2={to.y + oy} {...doubleBondProps} />
        <line x1={from.x - ox} y1={from.y - oy} x2={to.x - ox} y2={to.y - oy} {...doubleBondProps} />
      </g>
    );
  };

  // Single bond
  const bond = (from, to, key) => (
    <line key={key} x1={from.x} y1={from.y} x2={to.x} y2={to.y} {...bondProps} />
  );

  return (
    <Box style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
      <svg width="750" height="580" viewBox="0 0 750 580" style={{ overflow: 'visible' }}>
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* === ALL SKELETAL BONDS === */}
        
        {/* Right benzene ring bonds */}
        {bond(ATOMS.rb1, ATOMS.rb2, 'rb12')}
        {doubleBond(ATOMS.rb2, ATOMS.rb3, 3)}
        {bond(ATOMS.rb3, ATOMS.rb4, 'rb34')}
        {doubleBond(ATOMS.rb4, ATOMS.rb5, 3)}
        {bond(ATOMS.rb5, ATOMS.rb6, 'rb56')}
        {doubleBond(ATOMS.rb6, ATOMS.rb1, 3)}
        
        {/* Left benzene ring bonds */}
        {bond(ATOMS.lb1, ATOMS.lb2, 'lb12')}
        {doubleBond(ATOMS.lb2, ATOMS.lb3, 3)}
        {bond(ATOMS.lb3, ATOMS.lb4, 'lb34')}
        {doubleBond(ATOMS.lb4, ATOMS.lb5, 3)}
        {bond(ATOMS.lb5, ATOMS.lb6, 'lb56')}
        {doubleBond(ATOMS.lb6, ATOMS.lb1, 3)}
        
        {/* Top-left benzene ring bonds */}
        {bond(ATOMS.tlb1, ATOMS.tlb2, 'tlb14')}
        {doubleBond(ATOMS.tlb2, ATOMS.tlb3, 3)}
        {bond(ATOMS.tlb3, ATOMS.tlb4, 'tlb36')}
        {doubleBond(ATOMS.tlb4, ATOMS.tlb5, 3)}
        {bond(ATOMS.tlb5, ATOMS.tlb6, 'tlb58')}
        {doubleBond(ATOMS.tlb6, ATOMS.tlb1, 3)}
        
        {/* Top-right benzene ring bonds */}
        {bond(ATOMS.cbtr, ATOMS.trb1, 'cbtr2')}
        {doubleBond(ATOMS.trb1, ATOMS.trb2, 3)}
        {bond(ATOMS.trb2, ATOMS.trb3, 'trb24')}
        {doubleBond(ATOMS.trb3, ATOMS.trb4, 3)}
        {bond(ATOMS.trb4, ATOMS.trb5, 'trb46')}
        {doubleBond(ATOMS.trb5, ATOMS.trb6, 3)}
        {bond(ATOMS.trb6, ATOMS.trb1, 'trb61')}
        
        {/* Central core connections */}
        {bond(ATOMS.rb5, ATOMS.cbr, 'rb5-cbr')}
        {bond(ATOMS.cbr, ATOMS.n1, 'cbr-n1')}
        {bond(ATOMS.n1, ATOMS.c2, 'n1-c2')}
        {doubleBond(ATOMS.c2, ATOMS.carbonyl_o, 3)}
        {bond(ATOMS.c2, ATOMS.n3, 'c2-n3')}
        {bond(ATOMS.n3, ATOMS.cbl, 'n3-cbl')}
        {bond(ATOMS.cbl, ATOMS.lb1, 'cbl-lb1')}
        
        {/* Top chain with OH groups */}
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
        
        {/* NH2 branches */}
        {bond(ATOMS.lb5, ATOMS.nh2_left, 'lb5-nh2')}
        {bond(ATOMS.rb1, ATOMS.nh2_right, 'rb1-nh2')}

        {/* === ATOM CIRCLES (no text, just colors) === */}
        
        {/* Right NH2 */}
        <circle cx={ATOMS.nh2_right.x} cy={ATOMS.nh2_right.y} r="10" fill={nitrogenBlue} stroke={atomStroke} strokeWidth="1.5" />
        
        {/* Left NH2 */}
        <circle cx={ATOMS.nh2_left.x} cy={ATOMS.nh2_left.y} r="10" fill={nitrogenBlue} stroke={atomStroke} strokeWidth="1.5" />
        
        {/* Central C=O */}
        <circle cx={ATOMS.carbonyl_o.x} cy={ATOMS.carbonyl_o.y} r="9" fill={oxygenRed} stroke={atomStroke} strokeWidth="1.5" />
        
        {/* Central nitrogens */}
        <circle cx={ATOMS.n1.x} cy={ATOMS.n1.y} r="8" fill={nitrogenBlue} stroke={atomStroke} strokeWidth="1" />
        <circle cx={ATOMS.n3.x} cy={ATOMS.n3.y} r="8" fill={nitrogenBlue} stroke={atomStroke} strokeWidth="1" />
        
        {/* OH groups */}
        <circle cx={ATOMS.oh_left.x} cy={ATOMS.oh_left.y} r="9" fill={oxygenRed} stroke={atomStroke} strokeWidth="1.5" />
        <circle cx={ATOMS.oh_right.x} cy={ATOMS.oh_right.y} r="9" fill={oxygenRed} stroke={atomStroke} strokeWidth="1.5" />

        {/* === NAVIGATION RING OVERLAYS === */}
        {RINGS.map((ring) => {
          const isActive = location.pathname === ring.path;
          const isHovered = hoveredRing === ring.id;
          const Icon = ring.icon;
          const showLabel = isHovered || isActive;
          
          return (
            <g 
              key={ring.id} 
              onClick={() => ring.path !== '#' && navigate(ring.path)}
              onMouseEnter={() => setHoveredRing(ring.id)}
              onMouseLeave={() => setHoveredRing(null)}
              style={{ cursor: ring.path !== '#' ? 'pointer' : 'default' }}
              className="molecule-ring"
            >
              {/* Invisible hit area */}
              <circle
                cx={ring.center.x}
                cy={ring.center.y}
                r={45}
                fill="transparent"
              />
              
              {/* Highlight circle when active or hovered */}
              {(isActive || isHovered) && (
                <circle
                  cx={ring.center.x}
                  cy={ring.center.y}
                  r={38}
                  fill={`${ring.color}15`}
                  stroke={ring.color}
                  strokeWidth="2"
                  filter={isActive ? "url(#glow)" : undefined}
                  style={{ transition: 'all 0.2s ease' }}
                />
              )}

              {/* Icon */}
              <foreignObject
                x={ring.center.x - 14}
                y={ring.center.y - 14}
                width={28}
                height={28}
                style={{ pointerEvents: 'none' }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: '100%',
                  background: isDark ? 'rgba(26,27,30,0.95)' : 'rgba(255,255,255,0.95)',
                  borderRadius: '50%',
                  border: `2px solid ${(isActive || isHovered) ? ring.color : strokeColor}`,
                  boxShadow: isActive ? `0 0 12px ${ring.color}50` : 'none',
                  transition: 'all 0.2s ease'
                }}>
                  <Icon 
                    size={16} 
                    color={(isActive || isHovered) ? ring.color : strokeColor} 
                    strokeWidth={2}
                  />
                </div>
              </foreignObject>

              {/* Label - only shown on hover/active */}
              {showLabel && (
                <text
                  x={ring.center.x}
                  y={ring.center.y + 52}
                  textAnchor="middle"
                  fill={ring.color}
                  style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    pointerEvents: 'none',
                    opacity: showLabel ? 1 : 0,
                    transition: 'opacity 0.2s ease'
                  }}
                >
                  {ring.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      
      <style>{`
        .molecule-ring {
          transition: all 0.2s ease;
        }
      `}</style>
    </Box>
  );
}
