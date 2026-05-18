import { Box, Typography, Avatar, Card, CardContent, Chip, Grid, Divider, Button } from '@mui/material';
import { School, TrendingUp, Groups, PersonAdd, EmojiEvents } from '@mui/icons-material';

interface Student {
  id: string;
  name: string;
  avatar: string;
  school: string;
  schoolLogo: string;
  points: number;
  answersCount: number;
  major?: string;
  year?: string;
  bio?: string;
  followers?: number;
  following?: number;
}

interface ProfileProps {
  student: Student;
  allStudents: Student[];
}

export function Profile({ student, allStudents }: ProfileProps) {
  const schoolmates = allStudents.filter(s => s.school === student.school && s.id !== student.id);
  const suggestedFriends = schoolmates.slice(0, 6);

  return (
    <Box>
      <Card sx={{
        mb: 4,
        bgcolor: '#FFF8E7',
        border: '3px solid #0d2818',
        borderRadius: 2,
        boxShadow: '6px 6px 0px #c4b998',
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="flex-start" gap={3}>
            <Avatar
              src={student.avatar}
              sx={{
                width: 120,
                height: 120,
                bgcolor: '#0d2818',
                color: '#FFF8E7',
                fontSize: 48,
                fontWeight: 700,
                fontFamily: '"Playfair Display", serif',
                border: '4px solid #ffd600',
                boxShadow: '0 4px 12px rgba(13, 40, 24, 0.2)',
              }}
            >
              {student.name[0]}
            </Avatar>
            <Box flex={1}>
              <Typography variant="h3" fontWeight={700} sx={{ color: '#0d2818', fontFamily: '"Playfair Display", serif', mb: 1 }}>
                {student.name}
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Typography sx={{ fontSize: 24 }}>{student.schoolLogo}</Typography>
                <Typography variant="h6" sx={{ color: '#5a6b5a', fontFamily: '"Crimson Text", serif', fontStyle: 'italic' }}>
                  {student.school}
                </Typography>
              </Box>
              <Box display="flex" gap={2} mb={2}>
                <Chip
                  label={student.major}
                  sx={{
                    bgcolor: '#0d2818',
                    color: '#FFF8E7',
                    fontFamily: '"Crimson Text", serif',
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label={student.year}
                  sx={{
                    bgcolor: '#ffd600',
                    color: '#0d2818',
                    fontFamily: '"Crimson Text", serif',
                    fontWeight: 600,
                    border: '2px solid #0d2818',
                  }}
                />
              </Box>
              <Typography variant="body1" sx={{ color: '#2d3e2d', fontFamily: '"Crimson Text", serif', lineHeight: 1.7, mb: 3 }}>
                {student.bio}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <Box textAlign="center" p={2} bgcolor="#f5eed9" borderRadius={1} border="2px solid #c4b998">
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={0.5}>
                      <EmojiEvents sx={{ color: '#ffd600', fontSize: 28 }} />
                      <Typography variant="h4" fontWeight={700} sx={{ color: '#0d2818', fontFamily: '"Playfair Display", serif' }}>
                        {student.points}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#5a6b5a', fontFamily: '"Crimson Text", serif', textTransform: 'uppercase', letterSpacing: 1 }}>
                      Points
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center" p={2} bgcolor="#f5eed9" borderRadius={1} border="2px solid #c4b998">
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={0.5}>
                      <Groups sx={{ color: '#0d2818', fontSize: 28 }} />
                      <Typography variant="h4" fontWeight={700} sx={{ color: '#0d2818', fontFamily: '"Playfair Display", serif' }}>
                        {student.followers}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#5a6b5a', fontFamily: '"Crimson Text", serif', textTransform: 'uppercase', letterSpacing: 1 }}>
                      Followers
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center" p={2} bgcolor="#f5eed9" borderRadius={1} border="2px solid #c4b998">
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={0.5}>
                      <TrendingUp sx={{ color: '#0d2818', fontSize: 28 }} />
                      <Typography variant="h4" fontWeight={700} sx={{ color: '#0d2818', fontFamily: '"Playfair Display", serif' }}>
                        {student.answersCount}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#5a6b5a', fontFamily: '"Crimson Text", serif', textTransform: 'uppercase', letterSpacing: 1 }}>
                      Answers
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{
        mb: 4,
        bgcolor: '#FFF8E7',
        border: '3px solid #0d2818',
        borderRadius: 2,
        boxShadow: '6px 6px 0px #c4b998',
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={1.5} mb={3}>
            <School sx={{ color: '#ffd600', fontSize: 32 }} />
            <Typography variant="h5" fontWeight={700} sx={{ color: '#0d2818', fontFamily: '"Playfair Display", serif' }}>
              Find Classmates
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#5a6b5a', fontFamily: '"Crimson Text", serif', fontStyle: 'italic', mb: 3 }}>
            Connect with fellow scholars from {student.school}
          </Typography>
          <Grid container spacing={2}>
            {suggestedFriends.map((friend) => (
              <Grid item xs={12} sm={6} md={4} key={friend.id}>
                <Card sx={{
                  bgcolor: '#f5eed9',
                  border: '2px solid #c4b998',
                  borderRadius: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    border: '2px solid #0d2818',
                    boxShadow: '3px 3px 0px #c4b998',
                    transform: 'translate(-1px, -1px)',
                  },
                }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar
                        src={friend.avatar}
                        sx={{
                          width: 48,
                          height: 48,
                          mr: 1.5,
                          bgcolor: '#0d2818',
                          color: '#FFF8E7',
                          fontFamily: '"Crimson Text", serif',
                          fontSize: 20,
                          fontWeight: 600,
                        }}
                      >
                        {friend.name[0]}
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="body1" fontWeight={600} sx={{ color: '#0d2818', fontFamily: '"Crimson Text", serif' }}>
                          {friend.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#5a6b5a' }}>
                          {friend.major} • {friend.year}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#5a6b5a', fontFamily: '"Crimson Text", serif' }}>
                          {friend.points} points
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#5a6b5a', fontFamily: '"Crimson Text", serif' }}>
                          {friend.answersCount} answers
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<PersonAdd />}
                      sx={{
                        borderColor: '#0d2818',
                        borderWidth: 2,
                        color: '#0d2818',
                        fontFamily: '"Crimson Text", serif',
                        fontWeight: 600,
                        '&:hover': {
                          borderWidth: 2,
                          borderColor: '#0d2818',
                          bgcolor: '#FFF8E7',
                        },
                      }}
                    >
                      Follow
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{
        bgcolor: '#FFF8E7',
        border: '3px solid #0d2818',
        borderRadius: 2,
        boxShadow: '6px 6px 0px #c4b998',
      }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight={700} sx={{ color: '#0d2818', fontFamily: '"Playfair Display", serif', mb: 3 }}>
            Academic Achievements
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <Box display="flex" alignItems="center" p={2} bgcolor="#f5eed9" borderRadius={1} border="2px solid #c4b998">
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  bgcolor: '#ffd600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  border: '3px solid #0d2818',
                }}
              >
                <Typography sx={{ fontSize: 24 }}>🏆</Typography>
              </Box>
              <Box>
                <Typography variant="body1" fontWeight={600} sx={{ color: '#0d2818', fontFamily: '"Crimson Text", serif' }}>
                  Top Contributor
                </Typography>
                <Typography variant="caption" sx={{ color: '#5a6b5a', fontStyle: 'italic' }}>
                  Awarded for exceptional contributions to the academic community
                </Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" p={2} bgcolor="#f5eed9" borderRadius={1} border="2px solid #c4b998">
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  bgcolor: '#c4b998',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  border: '3px solid #0d2818',
                }}
              >
                <Typography sx={{ fontSize: 24 }}>📖</Typography>
              </Box>
              <Box>
                <Typography variant="body1" fontWeight={600} sx={{ color: '#0d2818', fontFamily: '"Crimson Text", serif' }}>
                  Scholar
                </Typography>
                <Typography variant="caption" sx={{ color: '#5a6b5a', fontStyle: 'italic' }}>
                  Recognized for consistently helpful and insightful responses
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
