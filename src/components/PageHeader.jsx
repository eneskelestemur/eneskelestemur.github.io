import React from 'react';
import { Box, Title, Text, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconHome } from '@tabler/icons-react';
import { useMantineColorScheme } from '@mantine/core';

/**
 * Consistent header component for all pages
 * @param {string} title - Page title
 * @param {string} subtitle - Page subtitle
 * @param {string} gradientStartVar - CSS variable for gradient start color
 * @param {string} gradientEndVar - CSS variable for gradient end color
 */
export function PageHeader({ title, subtitle, gradientStartVar = '--gradient-start', gradientEndVar = '--gradient-end' }) {
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <>
      {/* Home Button - Fixed in top-left corner */}
      <Button
        size="sm"
        leftSection={<IconHome size={16} />}
        onClick={() => navigate('/')}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 100,
          background: 'linear-gradient(135deg, var(--gradient-home-start) 0%, var(--gradient-home-end) 100%)',
          border: 'none',
          color: 'white',
          fontWeight: 600,
          transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
          boxShadow: isDark
            ? '0 4px 16px rgba(34, 139, 230, 0.2)'
            : '0 4px 16px rgba(34, 139, 230, 0.15)',
          animation: 'slideInDown 0.6s cubic-bezier(0.23, 1, 0.320, 1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = isDark
            ? '0 8px 24px rgba(34, 139, 230, 0.35)'
            : '0 8px 24px rgba(34, 139, 230, 0.25)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = isDark
            ? '0 4px 16px rgba(34, 139, 230, 0.2)'
            : '0 4px 16px rgba(34, 139, 230, 0.15)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        Home
      </Button>

      {/* Page Header Content */}
      <Box mb="48px">
        <Title
          order={1}
          style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            marginBottom: '16px',
            background: `linear-gradient(135deg, var(${gradientStartVar}) 0%, var(${gradientEndVar}) 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'slideInDown 0.6s cubic-bezier(0.23, 1, 0.320, 1)'
          }}
        >
          {title}
        </Title>
        <Text 
          c="dimmed" 
          size="lg"
          style={{
            animation: 'slideInUp 0.6s cubic-bezier(0.23, 1, 0.320, 1) 0.1s backwards'
          }}
        >
          {subtitle}
        </Text>
      </Box>
    </>
  );
}
