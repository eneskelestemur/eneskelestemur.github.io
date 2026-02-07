import React, { useState, useMemo } from 'react';
import { Container, Title, Text, Box, Group, Stack, Loader, Center, Badge, Tooltip } from '@mantine/core';
import { NotebookCard } from '../components/NotebookCard';
import { PageHeader } from '../components/PageHeader';
import { useDataLoader } from '../hooks/useDataLoader';
import { useThemeGradients } from '../hooks/useThemeGradients';
import { IconFilter } from '@tabler/icons-react';

export function Notebook() {
  const { data, loading, error } = useDataLoader('notebooks/metadata.json');
  useThemeGradients();
  const [selectedTags, setSelectedTags] = useState([]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    if (!data?.posts) return [];
    const tags = new Set();
    data.posts.forEach(post => {
      post.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [data]);

  // Filter posts based on selected tags
  const filteredPosts = useMemo(() => {
    if (!data?.posts) return [];
    if (selectedTags.length === 0) {
      return [...data.posts].sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    return data.posts
      .filter(post => selectedTags.some(tag => post.tags.includes(tag)))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [data, selectedTags]);

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  if (error) {
    return (
      <Container size="md" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Text c="red">Error loading notebooks: {error}</Text>
      </Container>
    );
  }

  return (
    <Container size="md" style={{ paddingTop: '80px', paddingBottom: '80px', minHeight: '100vh' }}>
      {/* Header with navigation */}
      <PageHeader
        title="Notebook"
        subtitle="A collection of blog posts exploring ideas in machine learning, chemistry, and software engineering."
        gradientStartVar="--gradient-notebook-start"
        gradientEndVar="--gradient-notebook-end"
      />

      {loading ? (
        <Center style={{ minHeight: '60vh' }}>
          <Loader />
        </Center>
      ) : (
        <>
          {/* Tag Filter */}
          <Box
            mb="40px"
            p="16px"
            style={{
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
              animation: 'slideInDown 0.6s cubic-bezier(0.23, 1, 0.320, 1)'
            }}
          >
            <Group gap="8px" mb="12px">
              <IconFilter size={18} />
              <Text size="sm" fw={600}>Filter by tag:</Text>
            </Group>
            <Group gap="6px" wrap="wrap">
              {allTags.map((tag, idx) => {
                // Cycle through different tones of red/pink
                const colorTones = ['#e64980', '#d63860', '#ff6b9d', '#ec6b8a'];
                const color = colorTones[idx % colorTones.length];
                
                return (
                  <Tooltip key={tag} label={`Click to filter`} position="top">
                    <Badge
                      size="lg"
                      variant={selectedTags.includes(tag) ? 'filled' : 'light'}
                      color={color}
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
                        animation: `slideInUp 0.4s cubic-bezier(0.23, 1, 0.320, 1) ${idx * 0.05}s backwards`
                      }}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  </Tooltip>
                );
              })}
            </Group>
            {selectedTags.length > 0 && (
              <Text
                size="xs"
                c="dimmed"
                mt="12px"
                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                onClick={() => setSelectedTags([])}
              >
                Clear filters
              </Text>
            )}
          </Box>

          {/* Posts Timeline */}
          <Stack gap="20px">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => (
                <Box
                  key={post.id}
                  style={{
                    position: 'relative',
                    animation: `slideInUp 0.6s cubic-bezier(0.23, 1, 0.320, 1) ${index * 0.1}s backwards`
                  }}
                >
                  {/* Timeline connector for visual flow */}
                  {index < filteredPosts.length - 1 && (
                    <Box
                      style={{
                        position: 'absolute',
                        width: '2px',
                        height: '20px',
                        background: 'linear-gradient(180deg, rgba(0,212,255,0.3) 0%, transparent 100%)',
                        left: '-24px',
                        top: '100%'
                      }}
                    />
                  )}
                  <NotebookCard post={post} />
                </Box>
              ))
            ) : (
              <Center style={{ minHeight: '40vh' }}>
                <Text c="dimmed">No posts found with the selected tags.</Text>
              </Center>
            )}
          </Stack>

          {/* Footer stats */}
          <Box mt="40px" pt="20px" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Text size="xs" c="dimmed">
              Showing {filteredPosts.length} of {data?.posts?.length || 0} posts
            </Text>
          </Box>
        </>
      )}
    </Container>
  );
}
