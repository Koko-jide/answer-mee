import { Box, Typography } from '@mui/material';
import { motion } from 'motion/react';

export function SplashScreen() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#0d2818',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Box
          sx={{
            width: 96,
            height: 96,
            bgcolor: '#ffd600',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '4px solid #FFF8E7',
            boxShadow: '0 0 40px rgba(255,214,0,0.4)',
            mb: 2,
          }}
        >
          <svg viewBox="0 0 24 24" width="52" height="52" fill="none" stroke="#0d2818" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9.5 12 5l9 4.5-9 4.5L3 9.5Z" />
            <path d="M6 12v4.4L12 20l6-3.6V12" />
          </svg>
        </Box>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Typography
          variant="h2"
          fontWeight={700}
          sx={{ color: '#FFF8E7', fontFamily: '"Playfair Display", serif', textAlign: 'center' }}
        >
          Academia
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: '#a89968', fontFamily: '"Crimson Text", serif', fontStyle: 'italic', textAlign: 'center', mt: 0.5 }}
        >
          Scholarly discourse &amp; collaboration
        </Typography>
      </motion.div>
    </Box>
  );
}
