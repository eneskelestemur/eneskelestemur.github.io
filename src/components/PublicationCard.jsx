import React, { useState } from 'react';
import { Box, Badge, Group, Text, Anchor, Stack, useMantineColorScheme, Tooltip } from '@mantine/core';
import { IconBrandGithub, IconFileText, IconLink, IconVideo } from '@tabler/icons-react';
import styles from './PublicationCard.module.css';

export function PublicationCard({ publication }) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const [isHovered, setIsHovered] = useState(false);

  const typeColors = {
    journal: '#ff8c00',      // Dark Orange
    conference: '#fab005',    // Yellow
    preprint: '#ffd700',      // Gold
    talk: '#61ff00'           // Chartreuse
  };

  const typeLabels = {
    journal: 'Journal',
    conference: 'Conference',
    preprint: 'Preprint',
    talk: 'Talk'
  };

  const renderAuthors = (authors) => {
    return authors.slice(0, 2).join(', ') + (authors.length > 2 ? ` et al.` : '');
  };

  return (
    <Box
      className={styles.cardContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: isDark
          ? 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 100%)'
          : 'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.06) 100%)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
        borderRadius: '12px',
        padding: '24px',
        boxShadow: isHovered
          ? isDark
            ? '0 12px 40px rgba(250,176,5,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
            : '0 12px 40px rgba(250,176,5,0.1), inset 0 1px 0 rgba(255,255,255,0.8)'
          : isDark
            ? '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)'
            : '0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.320, 1)',
        transform: isHovered ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
      }}
    >
      {/* Type Badge and Year */}
      <Group justify="space-between" mb="12px">
        <Badge 
          size="sm" 
          color={typeColors[publication.type]}
          className={styles.badge}
        >
          {typeLabels[publication.type]}
        </Badge>
        <Text size="xs" c="dimmed" fw={500}>{publication.year}</Text>
      </Group>

      {/* Title */}
      <Text
        component="h3"
        size="lg"
        fw={700}
        mb="8px"
        className={styles.title}
        style={{
          lineHeight: 1.4
        }}
      >
        {publication.title}
      </Text>

      {/* Authors and Publication Info */}
      <Stack gap="8px" mb="16px">
        <Text size="sm" c="dimmed">
          {renderAuthors(publication.authors)}
        </Text>
        {publication.journal && (
          <Text size="sm" fw={500}>
            {publication.journal}
          </Text>
        )}
        {publication.conference && (
          <Text size="sm" fw={500}>
            {publication.conference}
          </Text>
        )}
        {publication.event && (
          <Text size="sm" fw={500}>
            {publication.event}
          </Text>
        )}
      </Stack>

      {/* Abstract - expandable on hover */}
      <Text
        size="sm"
        c="dimmed"
        mb="16px"
        lineClamp={isHovered ? undefined : 2}
        style={{
          opacity: isHovered ? 1 : 0.75,
          transition: 'all 0.4s ease'
        }}
      >
        {publication.abstract}
      </Text>

      {/* Links/Actions Footer */}
      <Group gap="12px" wrap="wrap">
        {publication.link && (
          <Tooltip label="View publication" position="top">
            <Anchor
              href={publication.link}
              target="_blank"
              rel="noopener noreferrer"
              size="xs"
              className={styles.link}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: '#fab005'
              }}
            >
              <IconLink size={14} />
              Link
            </Anchor>
          </Tooltip>
        )}
        {publication.slides && (
          <Tooltip label="View slides" position="top">
            <Anchor
              href={publication.slides}
              target="_blank"
              rel="noopener noreferrer"
              size="xs"
              className={styles.link}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: '#fab005'
              }}
            >
              <IconFileText size={14} />
              Slides
            </Anchor>
          </Tooltip>
        )}
        {publication.video && (
          <Tooltip label="Watch video" position="top">
            <Anchor
              href={publication.video}
              target="_blank"
              rel="noopener noreferrer"
              size="xs"
              className={styles.link}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: '#fab005'
              }}
            >
              <IconVideo size={14} />
              Video
            </Anchor>
          </Tooltip>
        )}
      </Group>
    </Box>
  );
}
