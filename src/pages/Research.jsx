import React, { useMemo } from 'react';
import { Container, Title, Text, Box, Stack, Loader, Center } from '@mantine/core';
import { PublicationCard } from '../components/PublicationCard';
import { PageHeader } from '../components/PageHeader';
import { useDataLoader } from '../hooks/useDataLoader';
import { useThemeGradients } from '../hooks/useThemeGradients';

export function Research() {
  const { data, loading, error } = useDataLoader('publications/publications.json');
  useThemeGradients();

  // Group publications by year, sorted descending (recent first)
  const sortedYearsAndPublications = useMemo(() => {
    if (!data?.publications) return [];
    const grouped = {};
    data.publications.forEach(pub => {
      if (!grouped[pub.year]) {
        grouped[pub.year] = [];
      }
      grouped[pub.year].push(pub);
    });
    // Sort years in descending order (recent first as an array)
    const sortedYears = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));
    return sortedYears.map(year => [year, grouped[year]]);
  }, [data]);

  if (error) {
    return (
      <Container size="md" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Text c="red">Error loading publications: {error}</Text>
      </Container>
    );
  }

  return (
    <Container size="md" style={{ paddingTop: '80px', paddingBottom: '80px', minHeight: '100vh' }}>
      {/* Header with navigation */}
      <PageHeader
        title="Research"
        subtitle="Peer-reviewed publications, talks, and conference presentations in computational chemistry and machine learning."
        gradientStartVar="--gradient-research-start"
        gradientEndVar="--gradient-research-end"
      />

      {loading ? (
        <Center style={{ minHeight: '60vh' }}>
          <Loader />
        </Center>
      ) : (
        <Stack gap="40px">
          {sortedYearsAndPublications.map(([year, publications], yearIdx) => (
            <Box
              key={year}
              style={{
                animation: `slideInUp 0.6s cubic-bezier(0.23, 1, 0.320, 1) ${yearIdx * 0.15}s backwards`
              }}
            >
              {/* Year Header */}
              <Box
                mb="24px"
                style={{
                  borderBottom: '2px solid rgba(255,255,255,0.1)',
                  paddingBottom: '12px'
                }}
              >
                <Text
                  size="xl"
                  fw={700}
                  style={{
                    background: 'var(--gradient-purple-start)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'fadeInScale 0.6s cubic-bezier(0.23, 1, 0.320, 1)'
                  }}
                >
                  {year}
                </Text>
              </Box>

              {/* Publications for this year */}
              <Stack gap="16px">
                {publications.map((pub, idx) => (
                  <Box
                    key={pub.id}
                    style={{
                      animation: `slideInUp 0.6s cubic-bezier(0.23, 1, 0.320, 1) ${idx * 0.1}s backwards`
                    }}
                  >
                    <PublicationCard publication={pub} />
                  </Box>
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      )}

      {/* Footer stats */}
      {!loading && data?.publications && (
        <Box mt="40px" pt="20px" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Text size="xs" c="dimmed">
            Total publications: {data.publications.length}
          </Text>
        </Box>
      )}
    </Container>
  );
}
