import React, { useMemo } from 'react';
import {
  Container,
  Title,
  Text,
  Box,
  Group,
  Stack,
  Loader,
  Badge,
  Anchor,
  Tooltip,
  Button,
} from '@mantine/core';
import { useParams, useNavigate } from 'react-router-dom';
import { useDataLoader } from '../hooks/useDataLoader';
import { useMarkdownLoader } from '../hooks/useMarkdownLoader';
import { resolveArtifact } from '../hooks/useNotebookArtifacts';
import { IconArrowLeft, IconBrandGoogle } from '@tabler/icons-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import 'highlight.js/styles/github-dark.css';
import 'katex/dist/katex.min.css';
import { formatPostDate } from '../utils/date';
import styles from './NotebookDetail.module.css';

const markdownComponents = {
  // Tables can overflow narrow screens, so each one gets a scroll container.
  table: ({ children, ...props }) => (
    <div className={styles.tableWrapper}>
      <table {...props}>{children}</table>
    </div>
  ),
  // The post title is already rendered as the page's h1 from metadata.json, so
  // a stray "# Heading" in a post body is demoted rather than creating a second h1.
  h1: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
  // Point relative image paths at the bundled artifact
  img: ({ src, alt, ...props }) => <img src={resolveArtifact(src)} alt={alt ?? ''} {...props} />,
};

export function NotebookDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const {
    data: metadata,
    loading: metadataLoading,
    error: metadataError,
  } = useDataLoader('notebooks/metadata.json');

  const {
    content,
    loading: contentLoading,
    error: contentError,
    readTime,
  } = useMarkdownLoader(slug);

  const post = useMemo(
    () => metadata?.posts?.find((p) => p.slug === slug),
    [metadata, slug]
  );

  const loading = metadataLoading || contentLoading;
  const error = metadataError || contentError;

  if (error) {
    return (
      <Container size="md" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px' }}>
        <Stack align="center" gap="lg">
          <Text c="red" size="lg" fw={600}>
            Error loading post: {error}
          </Text>
          <Button onClick={() => navigate('/notebook')} leftSection={<IconArrowLeft size={16} />}>
            Back to Notebook
          </Button>
        </Stack>
      </Container>
    );
  }

  if (loading || !post) {
    return (
      <Container size="md" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px' }}>
        <Loader />
      </Container>
    );
  }

  const formattedDate = formatPostDate(post.date);

  return (
    <Container size="md" style={{ paddingTop: '80px', paddingBottom: '80px', minHeight: '100vh' }}>
      <Button
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => navigate('/notebook')}
        mb="32px"
        className={styles.backButton}
      >
        Back to Notebook
      </Button>

      <Stack gap="16px" mb="32px">
        <Title order={1} size="clamp(2rem, 6vw, 3rem)" className={`enterDown ${styles.title}`}>
          {post.title}
        </Title>

        <Group gap="16px" wrap="wrap">
          <Text size="sm" c="dimmed">{formattedDate}</Text>
          <Text size="sm" c="dimmed">•</Text>
          <Text size="sm" c="dimmed">{readTime || post.readTime}</Text>
          {post.tags?.length > 0 && (
            <>
              <Text size="sm" c="dimmed">•</Text>
              <Group gap="6px">
                {post.tags.map((tag) => (
                  <Badge key={tag} size="sm" variant="light" color="var(--accent-notebook)">
                    {tag}
                  </Badge>
                ))}
              </Group>
            </>
          )}
        </Group>

        {post.colabLink && (
          <Tooltip label="View source code and experiments on Google Colab" position="bottom">
            <Anchor
              href={post.colabLink}
              target="_blank"
              rel="noopener noreferrer"
              size="sm"
              className={styles.colabLink}
            >
              <IconBrandGoogle size={16} />
              View in Colab
            </Anchor>
          </Tooltip>
        )}
      </Stack>

      <Box className={styles.divider} />

      <Box className={`enterUp ${styles.prose}`} style={{ '--enter-delay': '0.1s' }}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeHighlight, rehypeKatex]}
          components={markdownComponents}
        >
          {content}
        </ReactMarkdown>
      </Box>

      <Box mt="48px" pt="32px" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate('/notebook')}
          fullWidth
        >
          Back to all posts
        </Button>
      </Box>
    </Container>
  );
}
