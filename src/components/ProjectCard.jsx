import React, { useState } from 'react';
import { Box, Badge, Group, Text, Anchor, Stack, useMantineColorScheme, Tooltip, ThemeIcon } from '@mantine/core';
import { IconBrandGithub, IconExternalLink, IconStar, IconGitFork } from '@tabler/icons-react';
import styles from './ProjectCard.module.css';

export function ProjectCard({ project }) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const [isHovered, setIsHovered] = useState(false);

  const statusColors = {
    active: 'blue',
    completed: 'gray',
    archived: 'gray'
  };

  const statusLabels = {
    active: 'Active',
    completed: 'Completed',
    archived: 'Archived'
  };

  const glowColorRgb = '0, 217, 102'; // Green

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
            ? `0 12px 40px rgba(${glowColorRgb},0.15), inset 0 1px 0 rgba(255,255,255,0.1)`
            : `0 12px 40px rgba(${glowColorRgb},0.1), inset 0 1px 0 rgba(255,255,255,0.8)`
          : isDark
            ? '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)'
            : '0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.320, 1)',
        transform: isHovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Header: Status Badge and Year */}
      <Group justify="space-between" mb="12px">
        <Badge 
          size="sm" 
          color={statusColors[project.status]}
          className={styles.badge}
        >
          {statusLabels[project.status]}
        </Badge>
        <Text size="xs" c="dimmed" fw={500}>{project.year}</Text>
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
        {project.title}
      </Text>

      {/* Description - Fixed height with overflow handling */}
      <Box
        className={styles.descriptionContainer}
        style={{
          height: isHovered ? 'auto' : '52px',
          overflow: isHovered ? 'visible' : 'hidden',
          transition: 'height 0.4s cubic-bezier(0.23, 1, 0.320, 1)',
          flex: 1
        }}
      >
        <Text
          size="sm"
          c="dimmed"
          mb="16px"
          style={{
            opacity: isHovered ? 1 : 0.75,
            transition: 'opacity 0.4s ease'
          }}
        >
          {project.description}
        </Text>
      </Box>

      {/* Technology Stack */}
      <Group gap="6px" mb="16px" wrap="wrap">
        {project.technologies.slice(0, 3).map((tech, idx) => (
          <Badge
            key={tech}
            size="xs"
            variant="light"
            color="#40c057"
            className={styles.techBadge}
            style={{
              opacity: 0.8,
              animation: isHovered ? `${styles.slideIn} 0.5s ease ${idx * 0.1}s backwards` : 'none'
            }}
          >
            {tech}
          </Badge>
        ))}
        {project.technologies.length > 3 && (
          <Text size="xs" c="dimmed">+{project.technologies.length - 3}</Text>
        )}
      </Group>

      {/* GitHub Stats */}
      {project.metrics && (
        <Group 
          gap="12px" 
          mb="16px"
          className={styles.statsGroup}
          style={{
            opacity: isHovered ? 1 : 0.7,
            transition: 'opacity 0.4s ease'
          }}
        >
          <Tooltip label="Stars" position="top">
            <Group gap="4px">
              <IconStar size={14} style={{ opacity: 0.7 }} />
              <Text size="xs" c="dimmed">{project.metrics.stars}</Text>
            </Group>
          </Tooltip>
          <Tooltip label="Forks" position="top">
            <Group gap="4px">
              <IconGitFork size={14} style={{ opacity: 0.7 }} />
              <Text size="xs" c="dimmed">{project.metrics.forks}</Text>
            </Group>
          </Tooltip>
        </Group>
      )}

      {/* Links Footer */}
      <Group gap="12px" mt="auto">
        {project.repo && (
          <Anchor
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            size="xs"
            className={styles.link}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#40c057'
            }}
          >
            <IconBrandGithub size={14} />
            GitHub
          </Anchor>
        )}
        {project.demo && (
          <Anchor
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            size="xs"
            className={styles.link}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#40c057'
            }}
          >
            <IconExternalLink size={14} />
            Demo
          </Anchor>
        )}
      </Group>

      {/* Project Image - Bottom Right Corner */}
      {project.image && (
        <Box
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            width: '100px',
            height: '100px',
            borderRadius: '8px',
            overflow: 'hidden',
            opacity: isHovered ? 0.9 : 0.7,
            transition: 'all 0.4s cubic-bezier(0.23, 1, 0.320, 1)',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`,
            boxShadow: `0 4px 12px rgba(0,0,0,0.2)`
          }}
        >
          <img
            src={project.image}
            alt={project.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </Box>
      )}
    </Box>
  );
}
