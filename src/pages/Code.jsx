import React, { useMemo } from 'react';
import { Container, Title, Text, Box, SimpleGrid, Loader, Center } from '@mantine/core';
import { ProjectCard } from '../components/ProjectCard';
import { PageHeader } from '../components/PageHeader';
import { useDataLoader } from '../hooks/useDataLoader';
import { useThemeGradients } from '../hooks/useThemeGradients';

export function Code() {
  const { data, loading, error } = useDataLoader('projects/projects.json');
  useThemeGradients();

  // Sort projects by year (newest first)
  const sortedProjects = useMemo(() => {
    if (!data?.projects) return [];
    return [...data.projects].sort((a, b) => b.year - a.year);
  }, [data]);

  if (error) {
    return (
      <Container size="md" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Text c="red">Error loading projects: {error}</Text>
      </Container>
    );
  }

  return (
    <Container size="lg" style={{ paddingTop: '80px', paddingBottom: '80px', minHeight: '100vh' }}>
      {/* Header with navigation */}
      <PageHeader
        title="Code"
        subtitle="A selection of personal projects, open-source contributions, and research implementations."
        gradientStartVar="--gradient-green-start"
        gradientEndVar="--gradient-green-end"
      />

      {loading ? (
        <Center style={{ minHeight: '60vh' }}>
          <Loader />
        </Center>
      ) : (
        <>
          {/* Projects Grid */}
          <SimpleGrid
            cols={{ base: 1, sm: 2, lg: 3 }}
            spacing="24px"
            mb="40px"
          >
            {sortedProjects.map((project, idx) => (
              <Box
                key={project.id}
                style={{
                  animation: `slideInUp 0.6s cubic-bezier(0.23, 1, 0.320, 1) ${idx * 0.1}s backwards`
                }}
              >
                <ProjectCard project={project} />
              </Box>
            ))}
          </SimpleGrid>

          {/* Footer stats */}
          <Box pt="20px" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Text size="xs" c="dimmed">
              Total projects: {sortedProjects.length}
            </Text>
          </Box>
        </>
      )}
    </Container>
  );
}

