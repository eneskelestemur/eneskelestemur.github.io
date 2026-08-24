import React from 'react';
import { Group, Tooltip, ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconBrandLinkedin, IconBrandGithub, IconMail, IconBook } from '@tabler/icons-react';
import styles from './SocialLinks.module.css';

export function SocialLinks() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const links = [
    {
      icon: IconBrandLinkedin,
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/eneskelestemur',
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
      href: 'mailto:enesk@unc.edu',
      color: '#d54b4b'
    },
    {
      icon: IconBook,
      label: 'Google Scholar',
      href: 'https://scholar.google.com/citations?user=sqHSmbkAAAAJ&hl=en',
      color: '#4285f4'
    }
  ];

  return (
    <Group gap="8px">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Tooltip key={link.label} label={link.label} position="bottom">
            {/* ActionIcon (not Anchor) because it centres its glyph by
                construction; Anchor's own styles defeat any flex centring. */}
            <ActionIcon
              component="a"
              href={link.href}
              target={link.href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noopener noreferrer"
              aria-label={link.label}
              variant="default"
              size={38}
              radius="9px"
              className={styles.link}
              style={{
                '--linkColor': link.color,
                '--linkGlow': `${link.color}40`,
                '--linkHalo': `${link.color}30`,
              }}
            >
              <Icon size={21} stroke={1.75} />
            </ActionIcon>
          </Tooltip>
        );
      })}
    </Group>
  );
}
