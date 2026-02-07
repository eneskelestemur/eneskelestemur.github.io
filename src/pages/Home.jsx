import React from 'react'
import { Container, Title, Text, Box } from '@mantine/core'
import ParticleBackground from '../components/ParticleBackground'
import { ThemeToggle } from '../components/ThemeToggle'
import { MoleculeNav } from '../components/MoleculeNav'
import { TypewriterHero } from '../components/TypewriterHero'
import { CurrentFocus } from '../components/CurrentFocus'

export function Home() {
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
            Enes Kelestemur
          </Text>
        </Title>
        
        {/* Dynamic Typewriter Description */}
        <TypewriterHero />
        
        {/* Current Research Focus Card */}
        <Box style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <CurrentFocus />
        </Box>
        
        {/* 4. The Realistic Molecule Navigation */}
        <MoleculeNav />

      </Container>
    </div>
  )
}

export default Home
