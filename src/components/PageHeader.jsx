import React from 'react';
import { Box, Title, Text, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconHome } from '@tabler/icons-react';
import { usePageTitle } from '../hooks/usePageTitle';
import styles from './PageHeader.module.css';

/**
 * Consistent header component for all pages
 * @param {string} title - Page title
 * @param {string} subtitle - Page subtitle
 * @param {string} gradientStartVar - CSS variable for gradient start color
 * @param {string} gradientEndVar - CSS variable for gradient end color
 */
export function PageHeader({
  title,
  subtitle,
  gradientStartVar = '--gradient-start',
  gradientEndVar = '--gradient-end',
}) {
  const navigate = useNavigate();
  usePageTitle(title);

  return (
    <>
      {/* Home Button - Fixed in top-left corner */}
      <Button
        size="sm"
        leftSection={<IconHome size={16} />}
        onClick={() => navigate('/')}
        className={`enterDown ${styles.homeButton}`}
      >
        Home
      </Button>

      {/* Page Header Content */}
      <Box mb="48px">
        <Title
          order={1}
          size="clamp(1.9rem, 7vw, 2.5rem)"
          className={`enterDown ${styles.title}`}
          // The per-page accent is passed in as locals the stylesheet reads,
          // so the gradient itself stays defined in CSS.
          style={{
            '--gradientStart': `var(${gradientStartVar})`,
            '--gradientEnd': `var(${gradientEndVar})`,
          }}
        >
          {title}
        </Title>
        <Text c="dimmed" size="lg" className="enterUp" style={{ '--enter-delay': '0.1s' }}>
          {subtitle}
        </Text>
      </Box>
    </>
  );
}
