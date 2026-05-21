import {
  Box, Typography, Avatar, Card, CardContent, Grid, Chip, Button, LinearProgress
} from '@mui/material';
import { EmojiEvents, MenuBook, QuestionAnswer, VerifiedUser, CheckCircle } from '@mui/icons-material';
import { ACHIEVEMENTS } from '../data/achievements';
import type { User, Question, UserStats } from '../types';

interface ProfileProps {
  user: User;
  questions: Question[];
  stats: UserStats;
  onNavigate: (page: string) => void;
}

function initials(name: string) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

const cardSx = {
  bgcolor: '#FFF8E7',
  border: '3px solid #0d2818',
  borderRadius: 2,
  boxShadow: '6px 6px 0px #c4b998',
  mb: 3,
};

export function Profile({ user, questions, stats, onNavigate }: ProfileProps) {
  const userQuestions = questions.filter((q) => q.authorId === user.id);
  const userAnswers = questions.flatMap((q) => q.answers.filter((a) => a.authorId === user.id));

  const earnedAchievements = ACHIEVEMENTS.filter((a) => a.check(stats));
  const previewAchievements = earnedAchievements.slice(0, 6);
  const lockedCount = ACHIEVEMENTS.length - earnedAchievements.length;
  const progressPct = (earnedAchievements.length / ACHIEVEMENTS.length) * 100;

  const isVerified = !!(user.school && user.field);

  return (
    <Box>
      {/* Profile card */}
      <Card sx={cardSx}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="flex-start" gap={3} flexWrap="wrap">
            <Avatar
              sx={{
                width: 110, height: 110,
                bgcolor: '#0d2818', color: '#FFF8E7',
                fontSize: 40, fontWeight: 700,
                fontFamily: '"Playfair Display", serif',
                border: '4px solid #ffd600',
                boxShadow: '0 4px 12px rgba(13, 40, 24, 0.2)',
                flexShrink: 0,
              }}
            >
              {initials(user.name)}
            </Avatar>

            <Box flex={1} minWidth={200}>
              <Box display="flex" alignItems="center" gap={1} mb={0.5} flexWrap="wrap">
                <Typography variant="h3" fontWeight={700} sx={{ color: '#0d2818', fontFamily: '"Playfair Display", serif' }}>
                  {user.name}
                </Typography>
                {isVerified && (
                  <VerifiedUser sx={{ color: '#2d8a2d', fontSize: 24 }} titleAccess="Verified Scholar" />
                )}
              </Box>

              {(user.school || user.field) && (
                <Typography variant="h6" sx={{ color: '#5a6b5a', fontFamily: '"Crimson Text", serif', fontStyle: 'italic', mb: 1 }}>
                  {[user.school, user.field].filter(Boolean).join(' · ')}
                </Typography>
              )}

              <Typography variant="caption" sx={{ color: '#8a9b8a', fontFamily: '"Crimson Text", serif' }}>
                {user.email}
              </Typography>

              {user.bio && (
                <Typography variant="body1" sx={{ color: '#2d3e2d', fontFamily: '"Crimson Text", serif', lineHeight: 1.7, mt: 2 }}>
                  {user.bio}
                </Typography>
              )}

              <Box display="flex" gap={1} mt={2} flexWrap="wrap">
                {isVerified && (
                  <Chip
                    icon={<CheckCircle sx={{ fontSize: 16 }} />}
                    label="Verified Scholar"
                    size="small"
                    sx={{ bgcolor: '#2d8a2d', color: '#fff', fontFamily: '"Crimson Text", serif', fontWeight: 600 }}
                  />
                )}
                {user.isFounder && (
                  <Chip
                    label="🔑 Founding Member"
                    size="small"
                    sx={{ bgcolor: '#0d2818', color: '#ffd600', fontFamily: '"Crimson Text", serif', fontWeight: 600, border: '2px solid #ffd600' }}
                  />
                )}
              </Box>
            </Box>
          </Box>

          {/* Stats grid */}
          <Grid container spacing={2} mt={2}>
            {[
              { label: 'Points', value: user.points, icon: <EmojiEvents sx={{ color: '#ffd600', fontSize: 26 }} /> },
              { label: 'Questions', value: userQuestions.length, icon: <QuestionAnswer sx={{ color: '#0d2818', fontSize: 26 }} /> },
              { label: 'Answers', value: userAnswers.length, icon: <MenuBook sx={{ color: '#0d2818', fontSize: 26 }} /> },
              { label: 'Achievements', value: earnedAchievements.length, icon: <EmojiEvents sx={{ color: '#0d2818', fontSize: 26 }} /> },
            ].map(({ label, value, icon }) => (
              <Grid item xs={6} sm={3} key={label}>
                <Box textAlign="center" p={2} bgcolor="#f5eed9" borderRadius={1} border="2px solid #c4b998">
                  <Box display="flex" alignItems="center" justifyContent="center" gap={0.5} mb={0.5}>
                    {icon}
                    <Typography variant="h4" fontWeight={700} sx={{ color: '#0d2818', fontFamily: '"Playfair Display", serif' }}>
                      {value}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#5a6b5a', fontFamily: '"Crimson Text", serif', textTransform: 'uppercase', letterSpacing: 1 }}>
                    {label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Achievements preview */}
      <Card sx={cardSx}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <EmojiEvents sx={{ color: '#ffd600', fontSize: 30 }} />
              <Typography variant="h5" fontWeight={700} sx={{ color: '#0d2818', fontFamily: '"Playfair Display", serif' }}>
                Achievements
              </Typography>
            </Box>
            <Button
              size="small"
              onClick={() => onNavigate('achievements')}
              sx={{
                color: '#0d2818', fontFamily: '"Crimson Text", serif', fontWeight: 600,
                border: '2px solid #0d2818',
                '&:hover': { bgcolor: '#f5eed9' },
              }}
            >
              View all →
            </Button>
          </Box>

          {/* Progress bar */}
          <Box mb={3}>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="caption" sx={{ color: '#5a6b5a', fontFamily: '"Crimson Text", serif' }}>
                {earnedAchievements.length} earned · {lockedCount} remaining
              </Typography>
              <Typography variant="caption" fontWeight={700} sx={{ color: '#0d2818', fontFamily: '"Crimson Text", serif' }}>
                {Math.round(progressPct)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressPct}
              sx={{
                height: 8, borderRadius: 4,
                bgcolor: '#d8d0bc',
                '& .MuiLinearProgress-bar': { bgcolor: '#ffd600', borderRadius: 4 },
              }}
            />
          </Box>

          {earnedAchievements.length === 0 ? (
            <Box textAlign="center" py={3}>
              <Typography sx={{ color: '#5a6b5a', fontFamily: '"Crimson Text", serif', fontStyle: 'italic' }}>
                No achievements yet. Start asking questions and contributing answers!
              </Typography>
            </Box>
          ) : (
            <Box display="flex" flexWrap="wrap" gap={1.5}>
              {previewAchievements.map((a) => (
                <Box
                  key={a.id}
                  title={`${a.name} — ${a.description}`}
                  sx={{
                    width: 56, height: 56,
                    borderRadius: '50%',
                    bgcolor: '#ffd600',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 26,
                    border: '3px solid #0d2818',
                    boxShadow: '2px 2px 0px #c4b998',
                    cursor: 'default',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.1)' },
                  }}
                >
                  {a.icon}
                </Box>
              ))}
              {earnedAchievements.length > 6 && (
                <Box
                  onClick={() => onNavigate('achievements')}
                  sx={{
                    width: 56, height: 56, borderRadius: '50%',
                    bgcolor: '#0d2818',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '3px solid #ffd600',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#1b4d1b' },
                  }}
                >
                  <Typography variant="caption" fontWeight={700} sx={{ color: '#ffd600', fontFamily: '"Crimson Text", serif', fontSize: '0.75rem' }}>
                    +{earnedAchievements.length - 6}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Activity columns */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ ...cardSx, mb: 0 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" fontWeight={700} mb={2} sx={{ color: '#0d2818', fontFamily: '"Playfair Display", serif' }}>
                Your Questions
              </Typography>
              {userQuestions.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#8a9b8a', fontStyle: 'italic', fontFamily: '"Crimson Text", serif' }}>
                  You have not asked a question yet.
                </Typography>
              ) : (
                userQuestions.slice(0, 5).map((q) => (
                  <Box key={q.id} mb={1.5} p={1.5} bgcolor="#f5eed9" borderRadius={1} border="1px solid #c4b998">
                    <Typography variant="body2" fontWeight={600} sx={{ color: '#0d2818', fontFamily: '"Crimson Text", serif' }}>
                      {q.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#5a6b5a' }}>
                      {q.subject} · {q.createdAt}
                    </Typography>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ ...cardSx, mb: 0 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" fontWeight={700} mb={2} sx={{ color: '#0d2818', fontFamily: '"Playfair Display", serif' }}>
                Your Answers
              </Typography>
              {userAnswers.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#8a9b8a', fontStyle: 'italic', fontFamily: '"Crimson Text", serif' }}>
                  You have not answered a question yet.
                </Typography>
              ) : (
                userAnswers.slice(0, 5).map((a) => (
                  <Box key={a.id} mb={1.5} p={1.5} bgcolor="#f5eed9" borderRadius={1} border="1px solid #c4b998">
                    <Typography variant="body2" sx={{ color: '#2d3e2d', fontFamily: '"Crimson Text", serif', lineHeight: 1.5 }}>
                      {a.body.length > 100 ? `${a.body.slice(0, 100)}…` : a.body}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#5a6b5a' }}>
                      {a.likes} likes · {a.createdAt}
                    </Typography>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
