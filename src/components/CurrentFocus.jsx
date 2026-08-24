import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Text } from '@mantine/core';
import { useDataLoader } from '../hooks/useDataLoader';
import styles from './CurrentFocus.module.css';

export function CurrentFocus() {
  const navigate = useNavigate();
  const { data: focusData } = useDataLoader('currentFocus.json');

  if (!focusData) return null;

  const isClickable = Boolean(focusData.link);

  return (
    <Box
      className={`glassCard ${styles.card}`}
      role={isClickable ? 'link' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={() => isClickable && navigate(focusData.link)}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          navigate(focusData.link);
        }
      }}
      style={{ cursor: isClickable ? 'pointer' : 'default' }}
    >
      {/* Logo fades in behind the text on hover */}
      <Box className={styles.logo}>
        <img src={focusData.logo} alt="" />
      </Box>

      <Box className={styles.content}>
        <Text size="xs" fw={600} className={styles.label}>
          Current Focus
        </Text>
        <Text size="sm" fw={500} className={styles.description}>
          {focusData.description}
        </Text>
      </Box>
    </Box>
  );
}
