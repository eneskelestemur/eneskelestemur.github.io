import React from 'react';
import { Container, Title, Text, Box, Button, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconHome } from '@tabler/icons-react';
import { useThemeGradients } from '../hooks/useThemeGradients';

export function Future() {
  const navigate = useNavigate();
  useThemeGradients();

  return (
    <Container size="md" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box style={{ textAlign: 'center' }} mb={40}>
        <Group justify="center" mb="40px">
          <Button
            variant="subtle"
            leftSection={<IconHome size={18} />}
            onClick={() => navigate('/')}
            style={{
              transition: 'all 0.3s ease'
            }}
          >
            Back Home
          </Button>
        </Group>

        <Title
          order={1}
          style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #ff922b 0%, #fd7e14 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'slideInDown 0.6s cubic-bezier(0.23, 1, 0.320, 1)'
          }}
        >
          Coming Soon
        </Title>
        
        <Text 
          c="dimmed" 
          size="lg" 
          mb="24px"
          style={{
            animation: 'slideInUp 0.6s cubic-bezier(0.23, 1, 0.320, 1) 0.2s backwards'
          }}
        >
          This section is being designed and will be unveiled soon. Check back later for something exciting!
        </Text>
      </Box>
    </Container>
  );
}
