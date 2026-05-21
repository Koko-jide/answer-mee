import { useEffect, useMemo, useState } from 'react';
import {
  AppBar, Box, Chip, Container, Fab, MenuItem, Tab, Tabs,
  TextField, Toolbar, Typography,
  ThemeProvider, createTheme, Dialog, DialogTitle, DialogContent, DialogActions, Button,
} from '@mui/material';
import { Add, EmojiEvents, Person, QuestionAnswer, Settings, School, Logout, Star } from '@mui/icons-material';

import type { User, Question, UserStats } from './types';
import { ACHIEVEMENTS } from './data/achievements';
import { SplashScreen } from './components/SplashScreen';
import { AuthPage, type AuthMode } from './components/AuthPage';
import { QuestionCard } from './components/QuestionCard';
import { Leaderboard } from './components/Leaderboard';
import { Profile } from './components/Profile';
import { SettingsPage } from './components/SettingsPage';
import { AchievementsPage } from './components/AchievementsPage';

// ─── Theme ─────────────────────────────────────────────────────────────────
const muiTheme = createTheme({
  palette: {
    primary: { main: '#0d2818', light: '#1b4d1b', dark: '#051509' },
    secondary: { main: '#ffd600', light: '#ffff52', dark: '#c7a500' },
    background: { default: '#0a1f14', paper: '#FFF8E7' },
    text: { primary: '#2d3e2d', secondary: '#5a6b5a' },
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

// ─── Persistence keys ────────────────────────────────────────────────────────
const SESSION_KEY = 'academia_session';
const USERS_KEY = 'academia_users';
const QUESTIONS_KEY = 'academia_questions';
const DATA_VERSION_KEY = 'academia_data_version';
const DATA_VERSION = 'academia-v3';

const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'Computer Science', 'History', 'Literature', 'Economics',
];

// ─── Starter data ────────────────────────────────────────────────────────────
const STARTER_USERS: User[] = [
  { id: 'u-1', name: 'Sarah Johnson', email: 'sarah@academia.test', password: 'learn123', field: 'Mathematics', school: 'Stanford University', bio: 'Passionate about making mathematics approachable for everyone.', points: 66, answerCount: 12, joinedAt: '2026-01-01', isFounder: true },
  { id: 'u-2', name: 'Alex Chen', email: 'alex@academia.test', password: 'learn123', field: 'Physics', school: 'MIT', bio: 'Physics PhD candidate. I love explaining complex ideas simply.', points: 51, answerCount: 9, joinedAt: '2026-01-01', isFounder: true },
  { id: 'u-3', name: 'David Kim', email: 'david@academia.test', password: 'learn123', field: 'Computer Science', school: 'Harvard University', bio: 'Software engineer turned academic. Bridging theory and practice.', points: 24, answerCount: 5, joinedAt: '2026-01-01', isFounder: true },
  { id: 'u-4', name: 'Emma Wilson', email: 'emma@academia.test', password: 'learn123', field: 'Mathematics', school: 'Harvard University', bio: 'Undergraduate studying pure mathematics and economics.', points: 18, answerCount: 3, joinedAt: '2026-01-01', isFounder: true },
];

const STARTER_QUESTIONS: Question[] = [
  {
    id: 'q-1',
    title: 'How do derivatives work in calculus?',
    body: "I understand the concept of limits, but I'm struggling to grasp how derivatives relate to the rate of change. Can someone explain with an example?",
    authorId: 'u-4', authorName: 'Emma Wilson', authorSchool: 'Harvard University',
    subject: 'Mathematics', createdAt: '5/10/2026',
    answers: [
      { id: 'a-1', body: "Think of a derivative as the instantaneous rate of change. If you have a position function s(t), the derivative s'(t) gives you velocity at any moment — like finding the slope of a curve at one specific point.", authorId: 'u-2', authorName: 'Alex Chen', authorSchool: 'MIT', createdAt: '5/10/2026', likes: 15, likedBy: [] },
      { id: 'a-2', body: "Imagine you're driving and looking at your speedometer — that shows your derivative. Speed is the rate of change of position. The derivative tells you how fast something is changing RIGHT NOW.", authorId: 'u-1', authorName: 'Sarah Johnson', authorSchool: 'Stanford University', createdAt: '5/10/2026', likes: 23, likedBy: [] },
    ],
  },
  {
    id: 'q-2',
    title: 'What makes recursion different from iteration?',
    body: "I can solve simple loops, but recursive solutions still feel hard to trace. How should I think about the call stack?",
    authorId: 'u-3', authorName: 'David Kim', authorSchool: 'Harvard University',
    subject: 'Computer Science', createdAt: '5/9/2026',
    answers: [
      { id: 'a-3', body: "Recursion breaks a problem into smaller versions of itself. The call stack keeps track of every unfinished version until the base case lets everything resolve. Think of it like Russian nesting dolls opening one at a time.", authorId: 'u-3', authorName: 'David Kim', authorSchool: 'Harvard University', createdAt: '5/9/2026', likes: 11, likedBy: [] },
    ],
  },
  {
    id: 'q-3',
    title: "How should I compare primary and secondary historical sources?",
    body: "I'm writing a paper about post-war education reforms and want to avoid treating all sources as equally direct evidence.",
    authorId: 'u-1', authorName: 'Sarah Johnson', authorSchool: 'Stanford University',
    subject: 'History', createdAt: '5/8/2026',
    answers: [],
  },
];

// ─── Storage helpers ──────────────────────────────────────────────────────────
function readStorage<T>(key: string, fallback: T): T {
  try {
    if (localStorage.getItem(DATA_VERSION_KEY) !== DATA_VERSION) return fallback;
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// ─── Compute user stats ──────────────────────────────────────────────────────
function computeStats(user: User, questions: Question[]): UserStats {
  const userAnswers = questions.flatMap((q) => q.answers.filter((a) => a.authorId === user.id));
  const totalLikes = userAnswers.reduce((sum, a) => sum + a.likes, 0);
  const subjectSet = new Set(
    questions.filter((q) => q.answers.some((a) => a.authorId === user.id)).map((q) => q.subject)
  );
  return {
    questionCount: questions.filter((q) => q.authorId === user.id).length,
    answerCount: userAnswers.length,
    points: user.points,
    totalLikesReceived: totalLikes,
    subjectsAnswered: subjectSet.size,
    isVerified: !!(user.school && user.field),
    isFounder: !!user.isFounder,
  };
}

// ─── Ask Question Dialog ──────────────────────────────────────────────────────
interface AskDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string, body: string, subject: string) => void;
}

const fieldSx = {
  '& .MuiInputLabel-root': { color: '#5a6b5a', fontFamily: '"Crimson Text", serif', '&.Mui-focused': { color: '#0d2818' } },
  '& .MuiOutlinedInput-root': {
    bgcolor: '#FFF8E7', color: '#2d3e2d', fontFamily: '"Crimson Text", serif',
    '& fieldset': { borderColor: '#c4b998', borderWidth: 2 },
    '&:hover fieldset': { borderColor: '#0d2818', borderWidth: 2 },
    '&.Mui-focused fieldset': { borderColor: '#0d2818', borderWidth: 2 },
  },
  '& .MuiInputBase-input::placeholder': { color: '#8a9b8a', opacity: 1, fontStyle: 'italic' },
};

function AskQuestionDialog({ open, onClose, onSubmit }: AskDialogProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [subject, setSubject] = useState('');

  function handleSubmit() {
    if (title.trim() && body.trim() && subject) {
      onSubmit(title.trim(), body.trim(), subject);
      setTitle(''); setBody(''); setSubject('');
      onClose();
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
      PaperProps={{ sx: { bgcolor: '#FFF8E7', border: '3px solid #0d2818', borderRadius: 2, boxShadow: '8px 8px 0px #c4b998' } }}
    >
      <DialogTitle sx={{ color: '#0d2818', fontWeight: 700, fontFamily: '"Playfair Display", serif', fontSize: 28, borderBottom: '2px solid #c4b998', pb: 2 }}>
        Pose a Scholarly Question
      </DialogTitle>
      <DialogContent sx={{ pt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="body2" sx={{ color: '#5a6b5a', fontFamily: '"Crimson Text", serif', fontStyle: 'italic' }}>
          Share your academic inquiry with the community (+5 points)
        </Typography>
        <TextField fullWidth label="Question Title" value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., How does one approach quadratic equations?" sx={fieldSx} />
        <TextField fullWidth select label="Academic Subject" value={subject} onChange={(e) => setSubject(e.target.value)} sx={fieldSx}>
          {SUBJECTS.map((s) => (
            <MenuItem key={s} value={s} sx={{ bgcolor: '#FFF8E7', color: '#2d3e2d', fontFamily: '"Crimson Text", serif', '&:hover': { bgcolor: '#f5eed9' }, '&.Mui-selected': { bgcolor: '#f5eed9' } }}>
              {s}
            </MenuItem>
          ))}
        </TextField>
        <TextField fullWidth multiline rows={5} label="Detailed Inquiry" value={body} onChange={(e) => setBody(e.target.value)}
          placeholder="Elaborate on the specifics of your question..." sx={fieldSx} />
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: '2px solid #c4b998' }}>
        <Button onClick={onClose} sx={{ color: '#5a6b5a', fontFamily: '"Crimson Text", serif', fontWeight: 600, '&:hover': { bgcolor: '#f5eed9' } }}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!title.trim() || !body.trim() || !subject}
          sx={{ bgcolor: '#0d2818', color: '#FFF8E7', fontWeight: 700, fontFamily: '"Crimson Text", serif', px: 3, border: '2px solid #0d2818', '&:hover': { bgcolor: '#1b4d1b' }, '&.Mui-disabled': { bgcolor: '#c4b998', color: '#8a9b8a', border: '2px solid #c4b998' } }}>
          Submit Question (+5 pts)
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Feed page ───────────────────────────────────────────────────────────────
type Page = 'feed' | 'leaderboard' | 'achievements' | 'profile' | 'settings';

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [activePage, setActivePage] = useState<Page>('feed');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [schoolFilter, setSchoolFilter] = useState<'all' | 'mine'>('all');

  const [users, setUsers] = useState<User[]>(() => readStorage(USERS_KEY, STARTER_USERS));
  const [questions, setQuestions] = useState<Question[]>(() => readStorage(QUESTIONS_KEY, STARTER_QUESTIONS));
  const [session, setSession] = useState<{ userId: string } | null>(() => readStorage(SESSION_KEY, null));

  // Splash screen
  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 1400);
    return () => clearTimeout(t);
  }, []);

  // Persist data
  useEffect(() => localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION), []);
  useEffect(() => writeStorage(USERS_KEY, users), [users]);
  useEffect(() => writeStorage(QUESTIONS_KEY, questions), [questions]);
  useEffect(() => {
    if (session) writeStorage(SESSION_KEY, session);
    else localStorage.removeItem(SESSION_KEY);
  }, [session]);

  const currentUser = useMemo(
    () => users.find((u) => u.id === session?.userId) ?? null,
    [session, users]
  );

  const userStats = useMemo(
    () => (currentUser ? computeStats(currentUser, questions) : null),
    [currentUser, questions]
  );

  // ── Auth handlers ──────────────────────────────────────────────────────────
  function handleLogin(email: string, password: string): { ok: boolean; message: string } {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) return { ok: false, message: 'Email or password is incorrect.' };
    setSession({ userId: user.id });
    setActivePage('feed');
    return { ok: true, message: '' };
  }

  function handleSignup(form: { name: string; email: string; password: string; school: string; field: string }): { ok: boolean; message: string } {
    if (users.some((u) => u.email.toLowerCase() === form.email.toLowerCase()))
      return { ok: false, message: 'An account with this email already exists.' };
    const newUser: User = {
      id: makeId('u'),
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      field: form.field.trim(),
      school: form.school.trim(),
      bio: '',
      points: 0,
      answerCount: 0,
      joinedAt: new Date().toLocaleDateString('en-US'),
    };
    setUsers((prev) => [...prev, newUser]);
    setSession({ userId: newUser.id });
    setActivePage('feed');
    return { ok: true, message: '' };
  }

  function handleResetPassword(email: string, newPassword: string): { ok: boolean; message: string } {
    const match = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!match) return { ok: false, message: 'No account was found with that email.' };
    setUsers((prev) => prev.map((u) => (u.id === match.id ? { ...u, password: newPassword } : u)));
    return { ok: true, message: 'Password reset. You can now sign in with your new password.' };
  }

  function handleLogout() {
    setSession(null);
    setAuthMode('login');
    setActivePage('feed');
  }

  // ── Profile / Settings handlers ─────────────────────────────────────────────
  function handleUpdateProfile(updates: Partial<Pick<User, 'name' | 'bio' | 'school' | 'field'>>) {
    if (!currentUser) return;
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? { ...u, ...updates } : u)));
  }

  function handleChangeEmail(newEmail: string, password: string): { ok: boolean; message: string } {
    if (!currentUser) return { ok: false, message: 'Not logged in.' };
    if (currentUser.password !== password) return { ok: false, message: 'Current password is incorrect.' };
    if (users.some((u) => u.email.toLowerCase() === newEmail.toLowerCase() && u.id !== currentUser.id))
      return { ok: false, message: 'This email is already in use.' };
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? { ...u, email: newEmail.trim() } : u)));
    return { ok: true, message: 'Email updated.' };
  }

  function handleChangePassword(current: string, next: string): { ok: boolean; message: string } {
    if (!currentUser) return { ok: false, message: 'Not logged in.' };
    if (currentUser.password !== current) return { ok: false, message: 'Current password is incorrect.' };
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? { ...u, password: next } : u)));
    return { ok: true, message: 'Password changed.' };
  }

  // ── Content handlers ─────────────────────────────────────────────────────────
  function handleAskQuestion(title: string, body: string, subject: string) {
    if (!currentUser) return;
    const newQ: Question = {
      id: makeId('q'),
      title, body,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorSchool: currentUser.school || 'Independent Scholar',
      subject,
      createdAt: new Date().toLocaleDateString('en-US'),
      answers: [],
    };
    setQuestions((prev) => [newQ, ...prev]);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? { ...u, points: u.points + 5 } : u)));
  }

  function handleSubmitAnswer(questionId: string, body: string) {
    if (!currentUser) return;
    const newAnswer = {
      id: makeId('a'),
      body,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorSchool: currentUser.school || 'Independent Scholar',
      createdAt: new Date().toLocaleDateString('en-US'),
      likes: 0,
      likedBy: [] as string[],
    };
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, answers: [...q.answers, newAnswer] } : q
      )
    );
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id
          ? { ...u, points: u.points + 10, answerCount: u.answerCount + 1 }
          : u
      )
    );
  }

  function handleLikeAnswer(questionId: string, answerId: string) {
    if (!currentUser) return;
    const question = questions.find((q) => q.id === questionId);
    const answer = question?.answers.find((a) => a.id === answerId);
    if (!answer) return;

    const alreadyLiked = answer.likedBy.includes(currentUser.id);
    const delta = alreadyLiked ? -1 : 1;

    // Update answer author's points (+2 / -2 per like)
    setUsers((prev) =>
      prev.map((u) =>
        u.id === answer.authorId ? { ...u, points: Math.max(0, u.points + delta * 2) } : u
      )
    );

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        return {
          ...q,
          answers: q.answers.map((a) => {
            if (a.id !== answerId) return a;
            return {
              ...a,
              likes: Math.max(0, a.likes + delta),
              likedBy: alreadyLiked
                ? a.likedBy.filter((id) => id !== currentUser.id)
                : [...a.likedBy, currentUser.id],
            };
          }),
        };
      })
    );
  }

  // ── Render guards ────────────────────────────────────────────────────────────
  if (showSplash) return <SplashScreen />;

  if (!currentUser) {
    return (
      <div>
        <ThemeProvider theme={muiTheme}>
          <AuthPage
            mode={authMode}
            onLogin={handleLogin}
            onSignup={handleSignup}
            onResetPassword={handleResetPassword}
            onSwitch={setAuthMode}
          />
        </ThemeProvider>
      </div>
    );
  }

  // ── Compute filtered questions ────────────────────────────────────────────────
  const filteredQuestions = questions.filter((q) => {
    const schoolMatch =
      schoolFilter === 'all' ||
      q.authorSchool === currentUser.school ||
      q.answers.some((a) => a.authorSchool === currentUser.school);
    const subjectMatch = selectedSubject === 'All' || q.subject === selectedSubject;
    return schoolMatch && subjectMatch;
  });

  const navTabs: { id: Page; label: string; icon: React.ReactNode }[] = [
    { id: 'feed', label: 'Questions', icon: <QuestionAnswer /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <EmojiEvents /> },
    { id: 'achievements', label: 'Achievements', icon: <Star /> },
    { id: 'profile', label: 'Profile', icon: <Person /> },
    { id: 'settings', label: 'Settings', icon: <Settings /> },
  ];

  return (
    <div>
      <ThemeProvider theme={muiTheme}>
        <Box sx={{ bgcolor: '#FFF8E7', minHeight: '100vh' }}>
          {/* AppBar */}
          <AppBar position="static" sx={{ bgcolor: '#0d2818', boxShadow: '0 4px 20px rgba(13, 40, 24, 0.3)' }}>
            <Toolbar>
              <School sx={{ mr: 1.5, color: '#ffd600', fontSize: 30 }} />
              <Typography variant="h5" fontWeight={700} sx={{ color: '#FFF8E7', fontFamily: '"Playfair Display", serif', mr: 1.5 }}>
                Academia
              </Typography>
              <Typography variant="body2" sx={{ color: '#a89968', fontStyle: 'italic', flexGrow: 1 }}>
                Scholarly discourse &amp; collaboration
              </Typography>
              <Box display="flex" alignItems="center" gap={1.5}>
                <Chip
                  icon={<Star sx={{ color: '#0d2818 !important', fontSize: '16px !important' }} />}
                  label={`${currentUser.points} pts`}
                  size="small"
                  sx={{ bgcolor: '#ffd600', color: '#0d2818', fontWeight: 700, fontFamily: '"Crimson Text", serif', border: '2px solid #FFF8E7' }}
                />
                <Box
                  component="button"
                  onClick={handleLogout}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 0.5,
                    color: '#a89968', fontFamily: '"Crimson Text", serif',
                    fontSize: '0.9rem', cursor: 'pointer',
                    background: 'none', border: 'none', padding: 0,
                    '&:hover': { color: '#FFF8E7' },
                  }}
                >
                  <Logout sx={{ fontSize: 18 }} />
                  Logout
                </Box>
              </Box>
            </Toolbar>

            {/* Nav tabs */}
            <Tabs
              value={activePage}
              onChange={(_, v) => setActivePage(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                bgcolor: '#0d2818',
                borderTop: '1px solid rgba(196,185,152,0.3)',
                '& .MuiTab-root': {
                  color: '#a89968', fontFamily: '"Crimson Text", serif', fontSize: '0.95rem',
                  '&.Mui-selected': { color: '#ffd600' },
                  minHeight: 48,
                },
                '& .MuiTabs-indicator': { backgroundColor: '#ffd600', height: 3 },
              }}
            >
              {navTabs.map(({ id, label, icon }) => (
                <Tab key={id} value={id} label={label} icon={icon} iconPosition="start" />
              ))}
            </Tabs>
          </AppBar>

          {/* Page content */}
          <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* ── Feed ── */}
            {activePage === 'feed' && (
              <Box>
                <Box mb={3}>
                  <Typography variant="h4" fontWeight={700} mb={0.5} sx={{ color: '#0d2818', fontFamily: '"Playfair Display", serif' }}>
                    Scholarly Discussions
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#5a6b5a', fontStyle: 'italic', mb: 3 }}>
                    Engage in academic discourse with peers from leading institutions
                  </Typography>

                  {/* School filter */}
                  <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                    {(['all', 'mine'] as const).map((f) => (
                      <Chip
                        key={f}
                        label={f === 'all' ? 'All Schools' : `${currentUser.school || 'My School'} Only`}
                        onClick={() => setSchoolFilter(f)}
                        sx={{
                          bgcolor: schoolFilter === f ? '#0d2818' : '#FFF8E7',
                          color: schoolFilter === f ? '#FFF8E7' : '#5a6b5a',
                          border: '2px solid #0d2818',
                          fontFamily: '"Crimson Text", serif', fontWeight: 600,
                          cursor: 'pointer',
                          '&:hover': { bgcolor: schoolFilter === f ? '#1b4d1b' : '#f5eed9' },
                        }}
                      />
                    ))}
                  </Box>

                  {/* Subject filter */}
                  <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                    {['All', ...SUBJECTS].map((s) => (
                      <Chip
                        key={s}
                        label={s}
                        onClick={() => setSelectedSubject(s)}
                        sx={{
                          bgcolor: selectedSubject === s ? '#ffd600' : '#FFF8E7',
                          color: selectedSubject === s ? '#0d2818' : '#5a6b5a',
                          border: '1px solid #c4b998',
                          fontFamily: '"Crimson Text", serif',
                          cursor: 'pointer',
                          '&:hover': { bgcolor: selectedSubject === s ? '#ffed4e' : '#f5eed9' },
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {filteredQuestions.length === 0 ? (
                  <Box textAlign="center" py={6}>
                    <Typography sx={{ color: '#5a6b5a', fontStyle: 'italic', fontFamily: '"Crimson Text", serif' }}>
                      No questions found for this selection.
                    </Typography>
                  </Box>
                ) : (
                  filteredQuestions.map((q) => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      currentUserId={currentUser.id}
                      onLikeAnswer={handleLikeAnswer}
                      onSubmitAnswer={handleSubmitAnswer}
                    />
                  ))
                )}
              </Box>
            )}

            {/* ── Leaderboard ── */}
            {activePage === 'leaderboard' && <Leaderboard users={users} />}

            {/* ── Achievements ── */}
            {activePage === 'achievements' && userStats && (
              <AchievementsPage stats={userStats} onNavigate={(p) => setActivePage(p as Page)} />
            )}

            {/* ── Profile ── */}
            {activePage === 'profile' && userStats && (
              <Profile
                user={currentUser}
                questions={questions}
                stats={userStats}
                onNavigate={(p) => setActivePage(p as Page)}
              />
            )}

            {/* ── Settings ── */}
            {activePage === 'settings' && (
              <SettingsPage
                user={currentUser}
                onUpdateProfile={handleUpdateProfile}
                onChangeEmail={handleChangeEmail}
                onChangePassword={handleChangePassword}
              />
            )}
          </Container>

          {/* FAB — only on feed */}
          {activePage === 'feed' && (
            <Fab
              sx={{
                position: 'fixed', bottom: 24, right: 24,
                bgcolor: '#ffd600', color: '#0d2818',
                boxShadow: '0 8px 20px rgba(255,214,0,0.4)',
                '&:hover': { bgcolor: '#ffed4e', boxShadow: '0 12px 30px rgba(255,214,0,0.5)' },
              }}
              aria-label="ask question"
              onClick={() => setDialogOpen(true)}
            >
              <Add />
            </Fab>
          )}

          <AskQuestionDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onSubmit={handleAskQuestion}
          />
        </Box>
      </ThemeProvider>
    </div>
  );
}
