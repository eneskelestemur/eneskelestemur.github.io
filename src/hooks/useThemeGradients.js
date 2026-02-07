import { useMantineColorScheme } from '@mantine/core';
import { useEffect } from 'react';

/**
 * Hook to manage CSS variables for theme-aware gradients
 * Solves the issue of gradients not updating on theme switch
 */
export function useThemeGradients() {
  const { colorScheme } = useMantineColorScheme();

  useEffect(() => {
    const root = document.documentElement;

    if (colorScheme === 'dark') {
      root.style.setProperty('--gradient-start', '#ffffff');
      root.style.setProperty('--gradient-end', '#a0aec0');
      root.style.setProperty('--gradient-green-start', '#00d966');
      root.style.setProperty('--gradient-green-end', '#12b559');
      root.style.setProperty('--gradient-cyan-start', '#00d4ff');
      root.style.setProperty('--gradient-cyan-end', '#0099cc');
      root.style.setProperty('--gradient-purple-start', '#9945ff');
      root.style.setProperty('--gradient-purple-end', '#7c3aed');
    } else {
      root.style.setProperty('--gradient-start', '#1a202c');
      root.style.setProperty('--gradient-end', '#4a5568');
      root.style.setProperty('--gradient-green-start', '#2f9e44');
      root.style.setProperty('--gradient-green-end', '#1f7a26');
      root.style.setProperty('--gradient-cyan-start', '#0077be');
      root.style.setProperty('--gradient-cyan-end', '#004daa');
      root.style.setProperty('--gradient-purple-start', '#5e3fbf');
      root.style.setProperty('--gradient-purple-end', '#3c2da0');
    }
  }, [colorScheme]);
}
