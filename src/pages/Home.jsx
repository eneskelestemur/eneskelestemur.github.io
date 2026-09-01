import React, { Suspense, lazy } from 'react'
import { Container, Title, Text, Box } from '@mantine/core'
import { MoleculeNav } from '../components/MoleculeNav'
import { TypewriterHero } from '../components/TypewriterHero'
import { CurrentFocus } from '../components/CurrentFocus'
import { usePageTitle } from '../hooks/usePageTitle'
import styles from './Home.module.css'

// Purely decorative and the heaviest dependency on the page, so it is
// deferred until after the hero has rendered.
const ParticleBackground = lazy(() => import('../components/ParticleBackground'))

export function Home() {
  usePageTitle();

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <Suspense fallback={null}>
        <ParticleBackground />
      </Suspense>

      <Container size="md" className={styles.hero}>
        <Title order={1} size="clamp(2rem, 8vw, 3.5rem)" className={styles.name}>
          <Text component="span" inherit variant="gradient" gradient={{ from: 'cyan', to: 'teal' }}>
            Enes Kelestemur
          </Text>
        </Title>

        <TypewriterHero />

        <Box className={styles.focusWrap}>
          <CurrentFocus />
        </Box>

        <MoleculeNav />
      </Container>
    </div>
  )
}

export default Home
