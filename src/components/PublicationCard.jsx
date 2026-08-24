import React, { useLayoutEffect, useRef, useState } from 'react';
import { Box, Badge, Group, Text, Anchor, Stack, Tooltip } from '@mantine/core';
import { IconFileText, IconLink, IconVideo } from '@tabler/icons-react';
import styles from './PublicationCard.module.css';

const TYPE_COLORS = {
  journal: '#ff8c00',    // Dark Orange
  conference: '#fab005', // Yellow
  preprint: '#ffd700',   // Gold
  talk: '#61ff00',       // Chartreuse
};

const TYPE_LABELS = {
  journal: 'Journal',
  conference: 'Conference',
  preprint: 'Preprint',
  talk: 'Talk',
};

// Bold the site owner wherever they appear in the author list
const renderAuthors = (authors) =>
  authors.map((author, idx) => {
    const isOwner = author.includes('Enes') || author.includes('Kelestemur');
    return (
      <span key={idx}>
        {isOwner ? <strong>{author}</strong> : author}
        {idx < authors.length - 1 ? ', ' : ''}
      </span>
    );
  });

export function PublicationCard({ publication }) {
  // Measure the abstract's real height so the expanded max-height is exact.
  // Animating toward a fixed cap (600px) meant the visible motion finished as
  // soon as the cap passed the content, leaving dead time at both ends — the
  // collapse in particular looked instant while max-height kept animating.
  const abstractRef = useRef(null);
  const [fullHeight, setFullHeight] = useState(null);

  useLayoutEffect(() => {
    const el = abstractRef.current;
    if (!el) return;
    const measure = () => setFullHeight(el.scrollHeight);
    measure();
    // Re-measure when the card is resized (viewport changes rewrap the text)
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [publication.abstract]);

  const publicationTypes = Array.isArray(publication.type)
    ? publication.type
    : [publication.type];

  const venue = publication.journal || publication.conference || publication.event;

  return (
    <Box
      className={`glassCard glassCardInteractive ${styles.cardContainer}`}
      style={{ '--card-glow-rgb': 'var(--accent-research-rgb)' }}
    >
      {/* Type Badge(s) and Year */}
      <Group justify="space-between" mb="12px" align="center">
        <Group gap="6px">
          {publicationTypes.map((type) => (
            <Badge key={type} size="sm" color={TYPE_COLORS[type]} className={styles.badge}>
              {TYPE_LABELS[type]}
            </Badge>
          ))}
        </Group>
        <Text size="xs" c="dimmed" fw={500}>{publication.year}</Text>
      </Group>

      {venue && (
        <Text size="sm" fw={500} mb="12px">
          {venue}
        </Text>
      )}

      <Text component="h3" size="lg" fw={700} mb="8px" className={styles.title}>
        {publication.title}
      </Text>

      <Text size="sm" c="dimmed" mb="16px">
        {renderAuthors(publication.authors)}
      </Text>

      {/* Abstract expands on hover */}
      {publication.abstract && (
        <Stack gap="4px" mb="16px">
          <Text size="sm" fw={600}>Abstract</Text>
          <Box
            className={styles.abstractContainer}
            style={{ '--abstract-full': fullHeight ? `${fullHeight}px` : '600px' }}
          >
            <Text ref={abstractRef} size="sm" c="dimmed" className={styles.abstract}>
              {publication.abstract}
            </Text>
          </Box>
        </Stack>
      )}

      <Group gap="12px" wrap="wrap">
        {publication.link && (
          <Tooltip label="View publication" position="top">
            <Anchor href={publication.link} target="_blank" rel="noopener noreferrer" size="xs" className={styles.link}>
              <IconLink size={14} />
              Link
            </Anchor>
          </Tooltip>
        )}
        {publication.slides && (
          <Tooltip label="View slides" position="top">
            <Anchor href={publication.slides} target="_blank" rel="noopener noreferrer" size="xs" className={styles.link}>
              <IconFileText size={14} />
              Slides
            </Anchor>
          </Tooltip>
        )}
        {publication.video && (
          <Tooltip label="Watch video" position="top">
            <Anchor href={publication.video} target="_blank" rel="noopener noreferrer" size="xs" className={styles.link}>
              <IconVideo size={14} />
              Video
            </Anchor>
          </Tooltip>
        )}
      </Group>
    </Box>
  );
}
