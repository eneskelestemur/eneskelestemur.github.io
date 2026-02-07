import React from 'react';
import { Group, Tooltip, Anchor, useMantineColorScheme } from '@mantine/core';
import { IconBrandLinkedin, IconBrandGithub, IconMail, IconBook } from '@tabler/icons-react';

export function SocialLinks() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const links = [
    {
      icon: IconBrandLinkedin,
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/enesk',
      color: '#0a66c2'
    },
    {
      icon: IconBrandGithub,
      label: 'GitHub',
      href: 'https://github.com/eneskelestemur',
      color: isDark ? '#ffffff' : '#000000'
    },
    {
      icon: IconMail,
      label: 'Email',
      href: 'mailto:your.email@example.com',
      color: '#d54b4b'
    },
    {
      icon: IconBook,
      label: 'Google Scholar',
      href: 'https://scholar.google.com/citations?user=your-id',
      color: '#4285f4'
    }
  ];

  return (
    <Group gap="8px">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Tooltip key={link.label} label={link.label} position="bottom">
            <Anchor
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: isDark
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(0,0,0,0.05)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                color: link.color,
                transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
                textDecoration: 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `inset 0 0 15px ${link.color}40, 0 0 20px ${link.color}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Icon size={18} />
            </Anchor>
          </Tooltip>
        );
      })}
    </Group>
  );
}
