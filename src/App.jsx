import React from 'react'
import { Container, Title, Text } from '@mantine/core'
import ParticleBackground from './components/ParticleBackground'
import { ThemeToggle } from './components/ThemeToggle'
import { MoleculeNav } from './components/MoleculeNav'

function App() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      
      {/* 1. The Toggle Switch (Top Right) */}
      <ThemeToggle />

      {/* 2. The Background */}
      <ParticleBackground />

      {/* 3. The Content */}
      <Container size="md" style={{ 
          position: 'relative', 
          zIndex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          height: '100vh', // Full height to fit the large molecule
          textAlign: 'center'
      }}>
        
        <Title order={1} style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-2px' }}>
          <Text component="span" inherit variant="gradient" gradient={{ from: 'cyan', to: 'teal' }}>
            [Your Name]
          </Text>
        </Title>
        
        <Text size="xl" mt="md" mb="xl" style={{ maxWidth: '600px', margin: '20px auto' }}>
          Bioinformatics PhD Student & Developer.<br/>
          Building the next generation of <b>Drug Discovery</b> tools.
        </Text>
        
        {/* 4. The Realistic Molecule Navigation */}
        <MoleculeNav />

      </Container>
    </div>
  )
}

export default App
