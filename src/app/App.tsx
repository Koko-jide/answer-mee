import { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Fab,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { Add, School, EmojiEvents, QuestionAnswer, Person } from '@mui/icons-material';
import { QuestionCard } from './components/QuestionCard';
import { Leaderboard } from './components/Leaderboard';
import { AskQuestionDialog } from './components/AskQuestionDialog';
import { Profile } from './components/Profile';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0d2818',
      light: '#1b4d1b',
      dark: '#051509',
    },
    secondary: {
      main: '#ffd600',
      light: '#ffff52',
      dark: '#c7a500',
    },
    background: {
      default: '#0a1f14',
      paper: '#FFF8E7',
    },
    text: {
      primary: '#2d3e2d',
      secondary: '#5a6b5a',
    },
  },
  typography: {
    fontFamily: '"Crimson Text", "Georgia", serif',
    h1: { fontFamily: '"Playfair Display", "Georgia", serif' },
    h2: { fontFamily: '"Playfair Display", "Georgia", serif' },
    h3: { fontFamily: '"Playfair Display", "Georgia", serif' },
    h4: { fontFamily: '"Playfair Display", "Georgia", serif' },
    h5: { fontFamily: '"Playfair Display", "Georgia", serif' },
    h6: { fontFamily: '"Playfair Display", "Georgia", serif' },
  },
});

interface Answer {
  id: string;
  author: string;
  authorAvatar: string;
  authorSchool: string;
  authorSchoolLogo: string;
  content: string;
  likes: number;
  timestamp: Date;
  likedByUser: boolean;
}

interface Question {
  id: string;
  author: string;
  authorAvatar: string;
  authorSchool: string;
  authorSchoolLogo: string;
  title: string;
  content: string;
  subject: string;
  timestamp: Date;
  answers: Answer[];
}

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

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'History', 'Literature', 'Economics'];

export default function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [currentView, setCurrentView] = useState<'feed' | 'leaderboard' | 'profile'>('feed');
  const [schoolFilter, setSchoolFilter] = useState<'all' | 'mySchool'>('all');
  const [currentUser] = useState<Student>({
    id: 'current',
    name: 'You',
    avatar: '',
    school: 'Harvard University',
    schoolLogo: '🎓',
    points: 45,
    answersCount: 8,
    major: 'Computer Science',
    year: 'Junior',
    bio: 'Passionate about helping fellow students understand complex topics. Love mathematics and physics!',
    followers: 124,
    following: 89,
  });

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      author: 'Emma Wilson',
      authorAvatar: '',
      authorSchool: 'Harvard University',
      authorSchoolLogo: '🎓',
      title: 'How do derivatives work in calculus?',
      content: 'I understand the concept of limits, but I\'m struggling to grasp how derivatives relate to the rate of change. Can someone explain with an example?',
      subject: 'Mathematics',
      timestamp: new Date('2026-05-10'),
      answers: [
        {
          id: 'a1',
          author: 'Alex Chen',
          authorAvatar: '',
          authorSchool: 'MIT',
          authorSchoolLogo: '🔬',
          content: 'Think of a derivative as the instantaneous rate of change. For example, if you have a position function s(t), the derivative s\'(t) gives you velocity at any moment. It\'s like finding the slope of a curve at a specific point.',
          likes: 15,
          timestamp: new Date('2026-05-10'),
          likedByUser: false
        },
        {
          id: 'a2',
          author: 'Sarah Johnson',
          authorAvatar: '',
          authorSchool: 'Stanford University',
          authorSchoolLogo: '🌲',
          content: 'Great question! Imagine you\'re driving and looking at your speedometer - that shows your derivative (speed = rate of change of position). The derivative tells you how fast something is changing RIGHT NOW.',
          likes: 23,
          timestamp: new Date('2026-05-10'),
          likedByUser: true
        }
      ]
    },
    {
      id: '2',
      author: 'Michael Brown',
      authorAvatar: '',
      authorSchool: 'Yale University',
      authorSchoolLogo: '📚',
      title: 'What is the difference between recursion and iteration?',
      content: 'I keep seeing both approaches in my CS class. When should I use recursion vs a loop?',
      subject: 'Computer Science',
      timestamp: new Date('2026-05-09'),
      answers: [
        {
          id: 'a3',
          author: 'Alex Chen',
          authorAvatar: '',
          authorSchool: 'MIT',
          authorSchoolLogo: '🔬',
          content: 'Recursion is when a function calls itself, great for tree structures or problems that naturally break down (like factorial). Iteration uses loops. Recursion is elegant but can use more memory. For most simple counting tasks, use iteration.',
          likes: 18,
          timestamp: new Date('2026-05-09'),
          likedByUser: false
        }
      ]
    },
    {
      id: '3',
      author: 'Lisa Anderson',
      authorAvatar: '',
      authorSchool: 'Princeton University',
      authorSchoolLogo: '🦁',
      title: 'Can someone explain Newton\'s Third Law?',
      content: 'I know it says "for every action there\'s an equal and opposite reaction" but I don\'t understand why we don\'t see objects canceling each other out.',
      subject: 'Physics',
      timestamp: new Date('2026-05-08'),
      answers: [
        {
          id: 'a4',
          author: 'Sarah Johnson',
          authorAvatar: '',
          authorSchool: 'Stanford University',
          authorSchoolLogo: '🌲',
          content: 'The forces act on DIFFERENT objects! When you push a wall, you feel the wall pushing back with equal force. The forces don\'t cancel because they\'re acting on you and the wall separately, not on the same object.',
          likes: 31,
          timestamp: new Date('2026-05-08'),
          likedByUser: false
        },
        {
          id: 'a5',
          author: 'David Kim',
          authorAvatar: '',
          authorSchool: 'Harvard University',
          authorSchoolLogo: '🎓',
          content: 'Think about jumping - you push down on the ground, and the ground pushes you up with equal force. That\'s why you go up! The forces are on different objects (you and Earth).',
          likes: 12,
          timestamp: new Date('2026-05-09'),
          likedByUser: false
        }
      ]
    }
  ]);

  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'Sarah Johnson', avatar: '', school: 'Stanford University', schoolLogo: '🌲', points: 66, answersCount: 12, major: 'Physics', year: 'Senior' },
    { id: '2', name: 'Alex Chen', avatar: '', school: 'MIT', schoolLogo: '🔬', points: 51, answersCount: 9, major: 'Computer Science', year: 'Junior' },
    { id: '3', name: 'David Kim', avatar: '', school: 'Harvard University', schoolLogo: '🎓', points: 24, answersCount: 5, major: 'Mathematics', year: 'Sophomore' },
    { id: '4', name: 'Emma Wilson', avatar: '', school: 'Harvard University', schoolLogo: '🎓', points: 18, answersCount: 4, major: 'Engineering', year: 'Junior' },
    { id: '5', name: 'Michael Brown', avatar: '', school: 'Yale University', schoolLogo: '📚', points: 15, answersCount: 3, major: 'Computer Science', year: 'Freshman' },
    { id: '6', name: 'Lisa Anderson', avatar: '', school: 'Princeton University', schoolLogo: '🦁', points: 12, answersCount: 2, major: 'Physics', year: 'Sophomore' },
    { id: '7', name: 'James Taylor', avatar: '', school: 'Columbia University', schoolLogo: '🗽', points: 8, answersCount: 2, major: 'Biology', year: 'Freshman' },
    { id: '8', name: 'Sophia Martinez', avatar: '', school: 'Harvard University', schoolLogo: '🎓', points: 5, answersCount: 1, major: 'Chemistry', year: 'Freshman' }
  ]);

  const handleLikeAnswer = (questionId: string, answerId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          answers: q.answers.map(a => {
            if (a.id === answerId) {
              const newLikedState = !a.likedByUser;
              const likeDelta = newLikedState ? 1 : -1;

              // Update student points
              setStudents(students.map(s => {
                if (s.name === a.author) {
                  return { ...s, points: Math.max(0, s.points + (likeDelta * 2)) };
                }
                return s;
              }));

              return {
                ...a,
                likes: Math.max(0, a.likes + likeDelta),
                likedByUser: newLikedState
              };
            }
            return a;
          })
        };
      }
      return q;
    }));
  };

  const handleSubmitAnswer = (questionId: string, content: string) => {
    const newAnswer: Answer = {
      id: `a${Date.now()}`,
      author: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorSchool: currentUser.school,
      authorSchoolLogo: currentUser.schoolLogo,
      content,
      likes: 0,
      timestamp: new Date(),
      likedByUser: false
    };

    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          answers: [...q.answers, newAnswer]
        };
      }
      return q;
    }));

    // Update current user in students
    setStudents(students => {
      const existingStudent = students.find(s => s.id === currentUser.id);
      if (existingStudent) {
        return students.map(s =>
          s.id === currentUser.id
            ? { ...s, answersCount: s.answersCount + 1 }
            : s
        );
      } else {
        return [...students, { ...currentUser, answersCount: 1 }];
      }
    });
  };

  const handleSubmitQuestion = (title: string, content: string, subject: string) => {
    const newQuestion: Question = {
      id: `q${Date.now()}`,
      author: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorSchool: currentUser.school,
      authorSchoolLogo: currentUser.schoolLogo,
      title,
      content,
      subject,
      timestamp: new Date(),
      answers: []
    };
    setQuestions([newQuestion, ...questions]);
  };

  const filteredBySchool = schoolFilter === 'mySchool'
    ? questions.filter(q => q.authorSchool === currentUser.school || q.answers.some(a => a.authorSchool === currentUser.school))
    : questions;

  const filteredQuestions = selectedSubject === 'all'
    ? filteredBySchool
    : filteredBySchool.filter(q => q.subject === selectedSubject);

  return (
    <ThemeProvider theme={theme}>
      <div className="size-full" style={{ backgroundColor: '#FFF8E7', minHeight: '100vh' }}>
        <AppBar position="static" sx={{ bgcolor: '#0d2818', boxShadow: '0 4px 20px rgba(13, 40, 24, 0.3)' }}>
          <Toolbar>
            <School sx={{ mr: 2, color: '#ffd600', fontSize: 32 }} />
            <Typography variant="h5" fontWeight={700} sx={{ color: '#FFF8E7', fontFamily: '"Playfair Display", serif' }}>
              Academia
            </Typography>
            <Typography variant="body2" sx={{ ml: 2, color: '#c4b998', fontStyle: 'italic' }}>
              Scholarly discourse & collaboration
            </Typography>
          </Toolbar>
          <Tabs
            value={currentView}
            onChange={(_, newValue) => setCurrentView(newValue)}
            sx={{
              bgcolor: '#0d2818',
              borderTop: '1px solid rgba(196, 185, 152, 0.3)',
              '& .MuiTab-root': {
                color: '#a89968',
                fontFamily: '"Crimson Text", serif',
                fontSize: '1rem',
                '&.Mui-selected': {
                  color: '#ffd600',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#ffd600',
                height: 3,
              },
            }}
          >
            <Tab
              value="feed"
              label="Questions"
              icon={<QuestionAnswer />}
              iconPosition="start"
            />
            <Tab
              value="leaderboard"
              label="Leaderboard"
              icon={<EmojiEvents />}
              iconPosition="start"
            />
            <Tab
              value="profile"
              label="Profile"
              icon={<Person />}
              iconPosition="start"
            />
          </Tabs>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          {currentView === 'feed' ? (
            <Box>
              <Box mb={3}>
                <Typography variant="h4" fontWeight={700} mb={1} sx={{ color: '#0d2818', fontFamily: '"Playfair Display", serif' }}>
                  Scholarly Discussions
                </Typography>
                <Typography variant="body1" sx={{ color: '#5a6b5a', mb: 3, fontStyle: 'italic' }}>
                  Engage in academic discourse with peers from leading institutions
                </Typography>

                <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                  <Chip
                    label="All Schools"
                    onClick={() => setSchoolFilter('all')}
                    sx={{
                      bgcolor: schoolFilter === 'all' ? '#0d2818' : '#FFF8E7',
                      color: schoolFilter === 'all' ? '#FFF8E7' : '#5a6b5a',
                      border: '2px solid #0d2818',
                      fontFamily: '"Crimson Text", serif',
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: schoolFilter === 'all' ? '#1b4d1b' : '#f5eed9',
                      },
                    }}
                  />
                  <Chip
                    label={`${currentUser.school} Only`}
                    onClick={() => setSchoolFilter('mySchool')}
                    sx={{
                      bgcolor: schoolFilter === 'mySchool' ? '#0d2818' : '#FFF8E7',
                      color: schoolFilter === 'mySchool' ? '#FFF8E7' : '#5a6b5a',
                      border: '2px solid #0d2818',
                      fontFamily: '"Crimson Text", serif',
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: schoolFilter === 'mySchool' ? '#1b4d1b' : '#f5eed9',
                      },
                    }}
                  />
                </Box>

                <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                  <Chip
                    label="All Subjects"
                    onClick={() => setSelectedSubject('all')}
                    sx={{
                      bgcolor: selectedSubject === 'all' ? '#ffd600' : '#FFF8E7',
                      color: selectedSubject === 'all' ? '#0d2818' : '#5a6b5a',
                      border: '1px solid #c4b998',
                      fontFamily: '"Crimson Text", serif',
                      '&:hover': {
                        bgcolor: selectedSubject === 'all' ? '#ffed4e' : '#f5eed9',
                      },
                    }}
                  />
                  {SUBJECTS.map(subject => (
                    <Chip
                      key={subject}
                      label={subject}
                      onClick={() => setSelectedSubject(subject)}
                      sx={{
                        bgcolor: selectedSubject === subject ? '#ffd600' : '#FFF8E7',
                        color: selectedSubject === subject ? '#0d2818' : '#5a6b5a',
                        border: '1px solid #c4b998',
                        fontFamily: '"Crimson Text", serif',
                        '&:hover': {
                          bgcolor: selectedSubject === subject ? '#ffed4e' : '#f5eed9',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {filteredQuestions.length === 0 ? (
                <Box textAlign="center" py={6}>
                  <Typography sx={{ color: '#5a6b5a', fontStyle: 'italic' }}>
                    No questions found for this selection.
                  </Typography>
                </Box>
              ) : (
                filteredQuestions.map(question => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    onLikeAnswer={handleLikeAnswer}
                    onSubmitAnswer={handleSubmitAnswer}
                  />
                ))
              )}
            </Box>
          ) : currentView === 'leaderboard' ? (
            <Leaderboard students={students} />
          ) : (
            <Profile student={currentUser} allStudents={students} />
          )}
        </Container>

        <Fab
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            bgcolor: '#ffd600',
            color: '#0d2818',
            boxShadow: '0 8px 20px rgba(255, 214, 0, 0.4)',
            '&:hover': {
              bgcolor: '#ffed4e',
              boxShadow: '0 12px 30px rgba(255, 214, 0, 0.5)',
            },
          }}
          aria-label="ask question"
          onClick={() => setDialogOpen(true)}
        >
          <Add />
        </Fab>

        <AskQuestionDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleSubmitQuestion}
          subjects={SUBJECTS}
        />
      </div>
    </ThemeProvider>
  );
}