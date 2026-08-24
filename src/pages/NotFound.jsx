import React from 'react';
import { Container, Title, Text, Button, Stack } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconHome } from '@tabler/icons-react';
import styles from './NotFound.module.css';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <Container
      size="md"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Stack align="center" gap="16px">
        <Title order={1} size="clamp(3.5rem, 14vw, 5rem)" className={`enterDown ${styles.code}`}>
          404
        </Title>
        <Text c="dimmed" size="lg" ta="center" className={`enterUp ${styles.message}`} style={{ '--enter-delay': '0.1s' }}>
          That page doesn&apos;t exist — it may have moved, or the link may be wrong.
        </Text>
        <Button
          variant="subtle"
          leftSection={<IconHome size={18} />}
          onClick={() => navigate('/')}
          className={`enterUp ${styles.button}`}
          style={{ '--enter-delay': '0.2s' }}
        >
          Back Home
        </Button>
      </Stack>
    </Container>
  );
}
