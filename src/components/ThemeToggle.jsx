import { ActionIcon, useMantineColorScheme, useComputedColorScheme, Group, Box } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { SocialLinks } from './SocialLinks';

export function ThemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('dark', { getInitialValueInEffect: true });

  return (
    <Box
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 1000,
      }}
    >
      <Group gap="12px" align="center">
        <SocialLinks />
        <ActionIcon
          onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
          variant="default"
          size="xl"
          aria-label="Toggle color scheme"
          style={{
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)'
          }}
        >
          {computedColorScheme === 'light' ? (
            <IconMoon stroke={1.5} />
          ) : (
            <IconSun stroke={1.5} />
          )}
        </ActionIcon>
      </Group>
    </Box>
  );
}
