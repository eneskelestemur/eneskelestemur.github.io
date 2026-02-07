import React, { useState } from 'react';
import { Box, Badge, Group, Text, Anchor, useMantineColorScheme, Tooltip } from '@mantine/core';
import { IconBrandGoogle } from '@tabler/icons-react';
import styles from './NotebookCard.module.css';

export function NotebookCard({ post }) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const [isHovered, setIsHovered] = useState(false);

  const postDate = new Date(post.date);
  const formattedDate = postDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

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
            ? '0 12px 40px rgba(230,73,128,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
            : '0 12px 40px rgba(230,73,128,0.1), inset 0 1px 0 rgba(255,255,255,0.8)'
          : isDark
            ? '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)'
            : '0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.320, 1)',
        transform: isHovered ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
        cursor: 'pointer'
      }}
    >
      {/* Header with date and read time */}
      <Group justify="space-between" mb="12px">
        <Text size="xs" c="dimmed" fw={500}>{formattedDate}</Text>
        <Text size="xs" c="dimmed" fw={400}>{post.readTime}</Text>
      </Group>

      {/* Title */}
      <Text
        component="h3"
        size="lg"
        fw={600}
        mb="12px"
        className={styles.title}
        style={{
          lineHeight: 1.4
        }}
      >
        {post.title}
      </Text>

      {/* Excerpt */}
      <Text
        size="sm"
        c="dimmed"
        mb="16px"
        lineClamp={2}
        style={{
          opacity: isHovered ? 1 : 0.8,
          transition: 'opacity 0.4s ease'
        }}
      >
        {post.excerpt}
      </Text>

      {/* Tags */}
      <Group gap={6} mb="16px" wrap="wrap">
        {post.tags.slice(0, 3).map((tag, idx) => (
          <Badge
            key={tag}
            size="xs"
            variant="light"
            color="#e64980"
            className={styles.tagBadge}
            style={{
              opacity: 0.8,
              animation: isHovered ? `${styles.fadeIn} 0.3s ease ${idx * 0.05}s` : 'none'
            }}
          >
            {tag}
          </Badge>
        ))}
        {post.tags.length > 3 && (
          <Text size="xs" c="dimmed">+{post.tags.length - 3}</Text>
        )}
      </Group>

      {/* Footer with Colab link */}
      {post.colabLink && (
        <Tooltip label="View source code and experiments on Google Colab" position="top">
          <Anchor
            href={post.colabLink}
            target="_blank"
            rel="noopener noreferrer"
            size="xs"
            className={styles.colabLink}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#e64980',
              opacity: isHovered ? 1 : 0.7,
              transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)'
            }}
          >
            <IconBrandGoogle size={14} />
            View in Colab
          </Anchor>
        </Tooltip>
      )}
    </Box>
  );
}
