import React from 'react';
import { Container, Text, Box, Stack, Group, Badge } from '@mantine/core';
import { PageHeader } from '../components/PageHeader';
import { SocialLinks } from '../components/SocialLinks';
import styles from './About.module.css';
// Statically imported rather than fetched: the page has nothing to show without
// it, and loading it asynchronously made the subtitle pop in after the header
// had already finished animating.
import data from '../data/about.json';

function Section({ title, delay, children }) {
  return (
    <Box component="section" className={`enterUp ${styles.section}`} style={{ '--enter-delay': `${delay}s` }}>
      <Text component="h2" className={styles.sectionTitle}>
        {title}
      </Text>
      {children}
    </Box>
  );
}

function Entry({ heading, subheading, period, detail, delay = 0 }) {
  return (
    <Box className={`enterUp ${styles.entry}`} style={{ '--enter-delay': `${delay}s` }}>
      <Group justify="space-between" align="baseline" gap="12px" wrap="wrap">
        <Text className={styles.entryHeading}>{heading}</Text>
        <Text size="xs" c="dimmed" className={styles.period}>{period}</Text>
      </Group>
      {subheading && <Text size="sm" className={styles.entrySub}>{subheading}</Text>}
      {detail && <Text size="sm" c="dimmed" className={styles.entryDetail}>{detail}</Text>}
    </Box>
  );
}

export function About() {
  return (
    <Container size="md" style={{ paddingTop: '80px', paddingBottom: '80px', minHeight: '100vh' }}>
      <PageHeader
        title="About"
        subtitle={data.role}
        gradientStartVar="--gradient-about-start"
        gradientEndVar="--gradient-about-end"
      />

      <Stack gap="0">
          {/* Intro: photo (once one is provided) beside the summary */}
          <Box className={`glassCard enterUp ${styles.introCard}`} style={{ '--enter-delay': '0.1s' }}>
            {data.photo && (
              <Box className={styles.photo}>
                <img src={data.photo} alt="" />
              </Box>
            )}
            <Box className={styles.introText}>
              <Text size="sm" fw={600} className={styles.affiliation}>
                {data.affiliation}
              </Text>
              {data.intro.map((paragraph, i) => (
                <Text key={i} size="sm" className={styles.introParagraph}>
                  {paragraph}
                </Text>
              ))}
              <Group gap="8px" mt="16px">
                <SocialLinks />
              </Group>
            </Box>
          </Box>

          <Section title="What I'm working on" delay={0.2}>
            <Stack gap="14px">
              {data.focus.map((item, i) => (
                <Box
                  key={item.title}
                  className={`enterUp ${styles.focusItem}`}
                  style={{ '--enter-delay': `${0.26 + i * 0.07}s` }}
                >
                  <Text className={styles.focusTitle}>{item.title}</Text>
                  <Text size="sm" c="dimmed">{item.detail}</Text>
                </Box>
              ))}
            </Stack>
          </Section>

          <Section title="Education" delay={0.3}>
            <Stack gap="18px">
              {data.education.map((e, i) => (
                <Entry
                  key={e.degree}
                  heading={e.degree}
                  subheading={e.institution}
                  period={e.period}
                  detail={e.detail}
                  delay={0.36 + i * 0.07}
                />
              ))}
            </Stack>
          </Section>

          <Section title="Research experience" delay={0.4}>
            <Stack gap="18px">
              {data.experience.map((e, i) => (
                <Entry
                  key={`${e.institution}-${e.role}`}
                  heading={e.role}
                  subheading={e.institution}
                  period={e.period}
                  detail={e.detail}
                  delay={0.46 + i * 0.07}
                />
              ))}
            </Stack>
          </Section>

          <Section title="Toolkit" delay={0.5}>
            <Group gap="8px" wrap="wrap">
              {data.toolkit.map((tool, i) => (
                <Badge
                  key={tool}
                  size="sm"
                  variant="light"
                  color="var(--accent-about)"
                  className={`enterScale ${styles.toolBadge}`}
                  style={{ '--enter-delay': `${0.56 + i * 0.04}s` }}
                >
                  {tool}
                </Badge>
              ))}
            </Group>
          </Section>
      </Stack>
    </Container>
  );
}
