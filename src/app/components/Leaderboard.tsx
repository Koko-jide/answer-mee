import { Box, Typography, Avatar } from '@mui/material';
import { EmojiEvents, MenuBook, Star } from '@mui/icons-material';
import { motion } from 'motion/react';
import type { User } from '../types';

interface LeaderboardProps {
  users: User[];
}

function initials(name: string) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

function getMedalColor(rank: number) {
  if (rank === 1) return '#FFD700';
  if (rank === 2) return '#C0C0C0';
  if (rank === 3) return '#CD7F32';
  return '#c4b998';
}

export function Leaderboard({ users }: LeaderboardProps) {
  const ranked = [...users].sort((a, b) => b.points - a.points).slice(0, 10);

  return (
    <Box>
      {/* Header */}
      <Box
        display="flex" alignItems="center" justifyContent="center"
        mb={4} p={4}
        sx={{
          bgcolor: '#0d2818', borderRadius: 2,
          border: '3px solid #ffd600',
          boxShadow: '6px 6px 0px #c4b998',
        }}
      >
        <EmojiEvents sx={{ color: '#ffd600', fontSize: 48, mr: 2 }} />
        <Typography variant="h3" fontWeight={700} sx={{ color: '#FFF8E7', fontFamily: '"Playfair Display", serif' }}>
          Leaderboard
        </Typography>
      </Box>

      {/* Podium */}
      {ranked.length >= 3 && (
        <Box display="flex" justifyContent="center" alignItems="flex-end" gap={3} mb={5}>
          {[ranked[1], ranked[0], ranked[2]].map((student, i) => {
            const rank = i === 0 ? 2 : i === 1 ? 1 : 3;
            const heights = [150, 200, 130];
            return (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: 'easeOut' }}
              >
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Avatar
                    sx={{
                      width: rank === 1 ? 90 : 70,
                      height: rank === 1 ? 90 : 70,
                      bgcolor: '#0d2818', color: '#FFF8E7',
                      fontSize: rank === 1 ? 32 : 24,
                      fontWeight: 700,
                      fontFamily: '"Playfair Display", serif',
                      border: `4px solid ${getMedalColor(rank)}`,
                      boxShadow: `0 4px 15px ${getMedalColor(rank)}60`,
                      mb: 1.5,
                    }}
                  >
                    {initials(student.name)}
                  </Avatar>
                  <Box
                    sx={{
                      width: 100,
                      height: heights[i],
                      bgcolor: getMedalColor(rank),
                      borderRadius: '10px 10px 0 0',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'flex-start',
                      pt: 2,
                      border: '3px solid #0d2818',
                      borderBottom: 'none',
                    }}
                  >
                    <Typography variant="h3" fontWeight={700} sx={{ color: '#0d2818', fontFamily: '"Playfair Display", serif' }}>
                      {rank}
                    </Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ color: '#0d2818', fontFamily: '"Crimson Text", serif', textAlign: 'center', px: 1 }}>
                      {student.name.split(' ')[0]}
                    </Typography>
                    <Typography variant="h5" fontWeight={700} sx={{ color: '#0d2818', mt: 1, fontFamily: '"Playfair Display", serif' }}>
                      {student.points}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#2d3e2d', fontFamily: '"Crimson Text", serif', textTransform: 'uppercase', letterSpacing: 1 }}>
                      pts
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            );
          })}
        </Box>
      )}

      {/* Full list */}
      <Box>
        {ranked.map((student, index) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
          >
            <Box
              display="flex" alignItems="center" p={2.5} mb={2}
              sx={{
                bgcolor: '#FFF8E7',
                borderRadius: 2,
                border: index < 3 ? `3px solid ${getMedalColor(index + 1)}` : '2px solid #c4b998',
                boxShadow: index < 3 ? `4px 4px 0px ${getMedalColor(index + 1)}50` : '3px 3px 0px #c4b998',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translate(-2px, -2px)',
                  boxShadow: index < 3 ? `6px 6px 0px ${getMedalColor(index + 1)}50` : '5px 5px 0px #c4b998',
                },
              }}
            >
              <Box
                sx={{
                  minWidth: 52, height: 52, borderRadius: '50%',
                  bgcolor: index < 3 ? getMedalColor(index + 1) : '#0d2818',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  mr: 2, border: '3px solid #0d2818',
                }}
              >
                <Typography variant="h5" fontWeight={700} sx={{ color: index < 3 ? '#0d2818' : '#FFF8E7', fontFamily: '"Playfair Display", serif' }}>
                  {index + 1}
                </Typography>
              </Box>
              <Avatar
                sx={{
                  width: 52, height: 52, mr: 2,
                  bgcolor: '#0d2818', color: '#FFF8E7',
                  fontSize: 18, fontWeight: 700,
                  fontFamily: '"Crimson Text", serif',
                  border: '3px solid #c4b998',
                }}
              >
                {initials(student.name)}
              </Avatar>
              <Box flex={1}>
                <Typography variant="h6" fontWeight={700} sx={{ color: '#0d2818', fontFamily: '"Playfair Display", serif' }}>
                  {student.name}
                </Typography>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Typography variant="caption" sx={{ color: '#5a6b5a', fontStyle: 'italic' }}>
                    {student.school || 'Independent Scholar'}
                  </Typography>
                  {student.field && (
                    <>
                      <Typography variant="caption" sx={{ color: '#8a9b8a' }}>&bull;</Typography>
                      <Typography variant="caption" sx={{ color: '#5a6b5a' }}>{student.field}</Typography>
                    </>
                  )}
                  <Typography variant="caption" sx={{ color: '#8a9b8a' }}>&bull;</Typography>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <MenuBook sx={{ fontSize: 14, color: '#5a6b5a' }} />
                    <Typography variant="caption" sx={{ color: '#5a6b5a' }}>
                      {student.answerCount} answers
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box textAlign="right">
                <Box display="flex" alignItems="center" gap={0.5} justifyContent="flex-end">
                  <Star sx={{ color: '#ffd600', fontSize: 24 }} />
                  <Typography variant="h4" fontWeight={700} sx={{ color: '#0d2818', fontFamily: '"Playfair Display", serif' }}>
                    {student.points}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#5a6b5a', fontFamily: '"Crimson Text", serif', textTransform: 'uppercase', letterSpacing: 1 }}>
                  points
                </Typography>
              </Box>
            </Box>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
}
