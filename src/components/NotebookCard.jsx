import React from 'react';
import { Box, Badge, Group, Text, Anchor, Tooltip } from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconBrandGoogle } from '@tabler/icons-react';
import { formatPostDate } from '../utils/date';
import styles from './NotebookCard.module.css';

export function NotebookCard({ post }) {
  const formattedDate = formatPostDate(post.date, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link to={`/notebook/${post.slug}`} className={styles.cardLink}>
      <Box
        className={`glassCard glassCardInteractive ${styles.cardContainer}`}
        style={{ '--card-glow-rgb': 'var(--accent-notebook-rgb)' }}
      >
        {/* Read time is derived from the markdown, so it only appears here if
            the metadata sets it explicitly; the post page always computes it. */}
        <Group justify="space-between" mb="12px">
          <Text size="xs" c="dimmed" fw={500}>{formattedDate}</Text>
          {post.readTime && (
            <Text size="xs" c="dimmed" fw={400}>{post.readTime}</Text>
          )}
        </Group>

        <Text component="h3" size="lg" fw={600} mb="12px" className={styles.title}>
          {post.title}
        </Text>

        <Text size="sm" c="dimmed" mb="16px" lineClamp={2} className={styles.excerpt}>
          {post.excerpt}
        </Text>

        <Group gap={6} mb="16px" wrap="wrap">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              size="xs"
              variant="light"
              color="var(--accent-notebook)"
              className={styles.tagBadge}
            >
              {tag}
            </Badge>
          ))}
          {post.tags.length > 3 && (
            <Text size="xs" c="dimmed">+{post.tags.length - 3}</Text>
          )}
        </Group>

        {post.colabLink && (
          <Tooltip label="View source code and experiments on Google Colab" position="top">
            <Anchor
              href={post.colabLink}
              target="_blank"
              rel="noopener noreferrer"
              size="xs"
              className={styles.colabLink}
            >
              <IconBrandGoogle size={14} />
              View in Colab
            </Anchor>
          </Tooltip>
        )}
      </Box>
    </Link>
  );
}
