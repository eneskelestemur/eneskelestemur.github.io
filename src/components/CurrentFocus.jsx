import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMantineColorScheme, Box, Text } from '@mantine/core';

export function CurrentFocus() {
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const [isHovered, setIsHovered] = useState(false);
  const [focusData, setFocusData] = useState(null);

  useEffect(() => {
    // Dynamically import the JSON data
    import('../data/currentFocus.json')
      .then((data) => setFocusData(data.default || data))
      .catch((err) => console.error('Failed to load focus data:', err));
  }, []);

  if (!focusData) return null;

  return (
    <Box
      onClick={() => focusData.link && navigate(focusData.link)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        width: '320px',
        padding: '16px 24px',
        borderRadius: '16px',
        background: isDark
          ? 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 100%)'
          : 'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.06) 100%)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
        boxShadow: isDark
          ? '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
          : '0 4px 20px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
        cursor: focusData.link ? 'pointer' : 'default',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Background logo that appears on hover */}
      <Box
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '80px',
          opacity: isHovered ? 0.20 : 0,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <img src={focusData.logo} alt={focusData.title} style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }} />
      </Box>

      {/* Content */}
      <Box style={{ position: 'relative', zIndex: 1 }}>
        {/* Title - always visible at top center */}
        <Text
          size="xs"
          fw={600}
          style={{
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            marginBottom: '10px',
            color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)',
          }}
        >
          Current Focus
        </Text>

        {/* Research description */}
        <Text
          size="sm"
          fw={500}
          style={{
            textAlign: 'center',
            color: isDark ? '#fff' : '#000',
            lineHeight: 1.5,
          }}
        >
          {focusData.description}
        </Text>
      </Box>
    </Box>
  );
}
