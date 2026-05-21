import { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Chip, LinearProgress, Tabs, Tab, Grid
} from '@mui/material';
import { EmojiEvents, Lock, CheckCircle } from '@mui/icons-material';
import { motion } from 'motion/react';
import { ACHIEVEMENTS, type Achievement } from '../data/achievements';
import type { UserStats } from '../types';

interface AchievementsPageProps {
  stats: UserStats;
  onNavigate?: (page: string) => void;
}

type FilterTab = 'All' | 'Earned' | 'Not Yet';
type CategoryTab = 'All' | Achievement['category'];

const CATEGORY_TABS: CategoryTab[] = ['All', 'Contributions', 'Points', 'Recognition', 'Breadth', 'Special'];

const categoryColors: Record<string, string> = {
  Contributions: '#1b4d1b',
  Points: '#8a6900',
  Recognition: '#6b3a8a',
  Breadth: '#1a5c7a',
  Special: '#8a2020',
};

function AchievementCard({ achievement, earned, stats }: { achievement: Achievement; earned: boolean; stats: UserStats }) {
  const progressData = achievement.progress ? achievement.progress(stats) : null;
  const progressPct = progressData ? (progressData.current / progressData.max) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{ height: '100%' }}
    >
      <Card
        sx={{
          height: '100%',
          bgcolor: earned ? '#FFF8E7' : '#f2ede0',
          border: earned ? '3px solid #ffd600' : '2px solid #c4b998',
          borderRadius: 2,
          boxShadow: earned ? '4px 4px 0px rgba(255,214,0,0.4)' : '3px 3px 0px #d8cfa8',
          opacity: earned ? 1 : 0.75,
          transition: 'all 0.25s ease',
          position: 'relative',
          overflow: 'visible',
          '&:hover': {
            transform: 'translate(-2px,-2px)',
            boxShadow: earned ? '6px 6px 0px rgba(255,214,0,0.4)' : '5px 5px 0px #d8cfa8',
            opacity: 1,
          },
        }}
      >
        {/* Earned badge */}
        {earned && (
          <Box sx={{ position: 'absolute', top: -10, right: -10, zIndex: 1 }}>
            <CheckCircle sx={{ color: '#2d8a2d', fontSize: 28, bgcolor: '#FFF8E7', borderRadius: '50%' }} />
          </Box>
        )}

        <CardContent sx={{ p: 2.5 }}>
          {/* Icon + category */}
          <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={1.5}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                bgcolor: earned ? '#ffd600' : '#d8d0bc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `3px solid ${earned ? '#0d2818' : '#b0a890'}`,
                fontSize: 26,
                filter: earned ? 'none' : 'grayscale(60%)',
                flexShrink: 0,
              }}
            >
              {earned ? achievement.icon : <Lock sx={{ color: '#8a9b8a', fontSize: 22 }} />}
            </Box>
            <Chip
              label={achievement.category}
              size="small"
              sx={{
                bgcolor: earned ? categoryColors[achievement.category] : '#c4b998',
                color: '#fff',
                fontFamily: '"Crimson Text", serif',
                fontSize: '0.7rem',
                fontWeight: 700,
                height: 20,
              }}
            />
          </Box>

          {/* Name */}
          <Typography
            variant="h6"
            fontWeight={700}
            mb={0.5}
            sx={{
              color: earned ? '#0d2818' : '#6b7c6b',
              fontFamily: '"Playfair Display", serif',
              fontSize: '1rem',
              lineHeight: 1.3,
            }}
          >
            {achievement.name}
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            mb={1.5}
            sx={{
              color: earned ? '#2d3e2d' : '#8a9b8a',
              fontFamily: '"Crimson Text", serif',
              lineHeight: 1.5,
              fontSize: '0.9rem',
            }}
          >
            {earned ? achievement.description : achievement.howToEarn}
          </Typography>

          {/* Progress bar (only when not yet earned and has progress) */}
          {!earned && progressData && (
            <Box mt="auto">
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="caption" sx={{ color: '#5a6b5a', fontFamily: '"Crimson Text", serif' }}>
                  Progress
                </Typography>
                <Typography variant="caption" sx={{ color: '#5a6b5a', fontFamily: '"Crimson Text", serif', fontWeight: 700 }}>
                  {progressData.current} / {progressData.max}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progressPct}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: '#d8d0bc',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#8a9b8a',
                    borderRadius: 3,
                  },
                }}
              />
            </Box>
          )}

          {/* Earned progress indicator */}
          {earned && progressData && (
            <Box mt="auto">
              <LinearProgress
                variant="determinate"
                value={100}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: 'rgba(255,214,0,0.2)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#ffd600',
                    borderRadius: 3,
                  },
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function AchievementsPage({ stats }: AchievementsPageProps) {
  const [filterTab, setFilterTab] = useState<FilterTab>('All');
  const [categoryTab, setCategoryTab] = useState<CategoryTab>('All');

  const earnedIds = new Set(ACHIEVEMENTS.filter((a) => a.check(stats)).map((a) => a.id));
  const earnedCount = earnedIds.size;
  const totalCount = ACHIEVEMENTS.length;
  const progressPct = (earnedCount / totalCount) * 100;

  const visible = ACHIEVEMENTS.filter((a) => {
    const earned = earnedIds.has(a.id);
    const passFilter =
      filterTab === 'All' || (filterTab === 'Earned' && earned) || (filterTab === 'Not Yet' && !earned);
    const passCategory = categoryTab === 'All' || a.category === categoryTab;
    return passFilter && passCategory;
  });

  const tabSx = {
    fontFamily: '"Crimson Text", serif',
    fontWeight: 600,
    fontSize: '0.95rem',
    color: '#5a6b5a',
    '&.Mui-selected': { color: '#0d2818' },
    minHeight: 40,
    py: 0.5,
  };

  return (
    <Box>
      {/* Hero header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={2}
        p={4}
        mb={4}
        sx={{
          bgcolor: '#0d2818',
          borderRadius: 2,
          border: '3px solid #ffd600',
          boxShadow: '6px 6px 0px #c4b998',
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <EmojiEvents sx={{ color: '#ffd600', fontSize: 48 }} />
          <Box>
            <Typography variant="h3" fontWeight={700} sx={{ color: '#FFF8E7', fontFamily: '"Playfair Display", serif' }}>
              Achievements
            </Typography>
            <Typography variant="body2" sx={{ color: '#a89968', fontFamily: '"Crimson Text", serif', fontStyle: 'italic' }}>
              A record of your scholarly accomplishments
            </Typography>
          </Box>
        </Box>

        {/* Overall progress */}
        <Box sx={{ minWidth: 200 }}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2" sx={{ color: '#c4b998', fontFamily: '"Crimson Text", serif' }}>
              Total earned
            </Typography>
            <Typography variant="body2" fontWeight={700} sx={{ color: '#ffd600', fontFamily: '"Playfair Display", serif' }}>
              {earnedCount} / {totalCount}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPct}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: 'rgba(255,255,255,0.15)',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#ffd600',
                borderRadius: 5,
              },
            }}
          />
        </Box>
      </Box>

      {/* Stats chips */}
      <Box display="flex" gap={1.5} flexWrap="wrap" mb={3}>
        {(['Contributions', 'Points', 'Recognition', 'Breadth', 'Special'] as Achievement['category'][]).map((cat) => {
          const catAchievements = ACHIEVEMENTS.filter((a) => a.category === cat);
          const catEarned = catAchievements.filter((a) => earnedIds.has(a.id)).length;
          return (
            <Chip
              key={cat}
              label={`${cat}: ${catEarned}/${catAchievements.length}`}
              sx={{
                bgcolor: catEarned === catAchievements.length ? categoryColors[cat] : '#f5eed9',
                color: catEarned === catAchievements.length ? '#fff' : '#5a6b5a',
                border: '2px solid #c4b998',
                fontFamily: '"Crimson Text", serif',
                fontWeight: 600,
              }}
            />
          );
        })}
      </Box>

      {/* Filter tabs (Earned / Not Yet / All) */}
      <Box mb={2}>
        <Tabs
          value={filterTab}
          onChange={(_, v) => setFilterTab(v)}
          sx={{
            borderBottom: '2px solid #c4b998',
            '& .MuiTabs-indicator': { bgcolor: '#ffd600', height: 3 },
          }}
        >
          {(['All', 'Earned', 'Not Yet'] as FilterTab[]).map((tab) => (
            <Tab key={tab} value={tab} label={tab} sx={tabSx} />
          ))}
        </Tabs>
      </Box>

      {/* Category tabs */}
      <Box mb={3} sx={{ overflowX: 'auto' }}>
        <Tabs
          value={categoryTab}
          onChange={(_, v) => setCategoryTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-indicator': { bgcolor: '#0d2818', height: 2 },
          }}
        >
          {CATEGORY_TABS.map((cat) => (
            <Tab key={cat} value={cat} label={cat} sx={{ ...tabSx, fontSize: '0.85rem' }} />
          ))}
        </Tabs>
      </Box>

      {/* Achievement grid */}
      {visible.length === 0 ? (
        <Box textAlign="center" py={6}>
          <Typography sx={{ color: '#5a6b5a', fontFamily: '"Crimson Text", serif', fontStyle: 'italic' }}>
            No achievements match this filter.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {visible.map((achievement) => (
            <Grid item xs={12} sm={6} md={4} key={achievement.id}>
              <AchievementCard
                achievement={achievement}
                earned={earnedIds.has(achievement.id)}
                stats={stats}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
