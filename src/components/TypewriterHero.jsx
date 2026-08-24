import { useState, useEffect } from 'react';
import { Title, Text, Box } from '@mantine/core';

// The Narrative Sequence.
// One half changes at a time, so every right-hand phrase has to read correctly
// with the two left-hand phrases that sit either side of it. The cycle closes
// back on the first entry.
const SEQUENCE = [
  { left: "Generative models",  right: "for small-molecule design." },
  { left: "Molecular docking",  right: "for small-molecule design." },   // Left changes
  { left: "Molecular docking",  right: "in the protein pocket." },       // Right changes
  { left: "Molecular dynamics", right: "in the protein pocket." },
  { left: "Molecular dynamics", right: "for hit-to-lead optimization." },
  { left: "Analog generation",  right: "for hit-to-lead optimization." },
  { left: "Analog generation",  right: "for therapeutic discovery." },
  { left: "Generative models",  right: "for therapeutic discovery." }    // Loops back to the top
];

const TYPING_SPEED = 80;
const DELETING_SPEED = 40;
const PAUSE_DURATION = 3000; // Wait 3 seconds before moving to next sentence

export function TypewriterHero() {
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentLeft, setCurrentLeft] = useState(SEQUENCE[0].left);
  const [currentRight, setCurrentRight] = useState(SEQUENCE[0].right);
  
  // We track which side is currently active (null = waiting, 'left' = animating left, 'right' = animating right)
  const [activeSide, setActiveSide] = useState(null); 

  useEffect(() => {
    // Current Target Phrase
    const targetLeft = SEQUENCE[index].left;
    const targetRight = SEQUENCE[index].right;

    // Previous Phrase (to check what changed)
    const prevIndex = index === 0 ? SEQUENCE.length - 1 : index - 1;
    const prevLeft = SEQUENCE[prevIndex].left;
    const prevRight = SEQUENCE[prevIndex].right;

    const handleTyping = () => {
      // 1. Determine what needs to change
      const leftChanged = targetLeft !== prevLeft;
      const rightChanged = targetRight !== prevRight;

      // Initial Start (Wait before starting loop)
      if (activeSide === null) {
        // If we just finished a cycle, pause.
        const timer = setTimeout(() => {
            if (leftChanged) setActiveSide('left');
            else if (rightChanged) setActiveSide('right');
            else {
                // If nothing changed (rare), just skip
                setIndex((prev) => (prev + 1) % SEQUENCE.length);
            }
            setIsDeleting(true); // Start by deleting old text
        }, PAUSE_DURATION);
        return () => clearTimeout(timer);
      }

      // 2. Logic for Left Side Animation
      if (activeSide === 'left') {
        if (isDeleting) {
           // Delete until empty
           if (currentLeft.length > 0) {
              const timer = setTimeout(() => setCurrentLeft(currentLeft.slice(0, -1)), DELETING_SPEED);
              return () => clearTimeout(timer);
           } else {
              // Done deleting, switch to typing
              setIsDeleting(false);
           }
        } else {
           // Type new string
           if (currentLeft.length < targetLeft.length) {
              const timer = setTimeout(() => setCurrentLeft(targetLeft.slice(0, currentLeft.length + 1)), TYPING_SPEED);
              return () => clearTimeout(timer);
           } else {
              // Done typing Left. 
              // If Right also needs to change, switch to Right. Otherwise, finish step.
              if (rightChanged) {
                  setActiveSide('right');
                  setIsDeleting(true);
              } else {
                  // End of step
                  setActiveSide(null);
                  setIndex((prev) => (prev + 1) % SEQUENCE.length);
              }
           }
        }
      }

      // 3. Logic for Right Side Animation
      if (activeSide === 'right') {
         if (isDeleting) {
            if (currentRight.length > 0) {
               const timer = setTimeout(() => setCurrentRight(currentRight.slice(0, -1)), DELETING_SPEED);
               return () => clearTimeout(timer);
            } else {
               setIsDeleting(false);
            }
         } else {
            if (currentRight.length < targetRight.length) {
               const timer = setTimeout(() => setCurrentRight(targetRight.slice(0, currentRight.length + 1)), TYPING_SPEED);
               return () => clearTimeout(timer);
            } else {
               // Done typing Right. Finish step.
               setActiveSide(null);
               setIndex((prev) => (prev + 1) % SEQUENCE.length);
            }
         }
      }
    };

    const cleanup = handleTyping();
    return cleanup;

  }, [currentLeft, currentRight, isDeleting, activeSide, index]);


  return (
    <Box style={{ minHeight: '80px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Title
        order={2}
        style={{
            fontSize: 'clamp(1rem, 4vw, 2rem)',
            fontWeight: 300,
            letterSpacing: '0.5px',
            lineHeight: 1.4,
            textAlign: 'center',
            textWrap: 'balance',
            color: 'var(--hero-subtitle)'
        }}
      >
        <span style={{ color: activeSide === 'left' ? '#22b8cf' : 'inherit', transition: 'color 0.3s' }}>
            {currentLeft}
        </span>
        {/* The Blinking Cursor for Left */}
        {activeSide === 'left' && <span className="cursor">|</span>}
        
        <span style={{ margin: '0 8px', opacity: 0.3 }}>//</span>

        <span style={{ color: activeSide === 'right' ? '#20c997' : 'inherit', transition: 'color 0.3s' }}>
            {currentRight}
        </span>
        {/* The Blinking Cursor for Right */}
        {activeSide === 'right' && <span className="cursor">|</span>}
      </Title>

      {/* Add simple CSS for the cursor blink */}
      <style>{`
        .cursor {
          display: inline-block;
          animation: blink 1s step-end infinite;
          color: white;
          margin-left: 2px;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </Box>
  );
}
