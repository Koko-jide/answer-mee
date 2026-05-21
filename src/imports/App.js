import { useEffect, useMemo, useState } from 'react';
import './App.css';

const SESSION_KEY = 'scholar_session';
const USERS_KEY = 'scholar_users';
const QUESTIONS_KEY = 'scholar_questions';
const DATA_VERSION_KEY = 'scholar_data_version';
const DATA_VERSION = 'academia-ui-v2';

const starterUsers = [
  {
    id: 'u-1',
    name: 'Sarah Johnson',
    email: 'sarah@academia.test',
    password: 'learn123',
    field: 'Mathematics',
    school: 'Stanford University',
    points: 66,
    answerCount: 12,
  },
  {
    id: 'u-2',
    name: 'Alex Chen',
    email: 'alex@academia.test',
    password: 'learn123',
    field: 'Physics',
    school: 'MIT',
    points: 51,
    answerCount: 9,
  },
  {
    id: 'u-3',
    name: 'David Kim',
    email: 'david@academia.test',
    password: 'learn123',
    field: 'Computer Science',
    school: 'Harvard University',
    points: 24,
    answerCount: 5,
  },
  {
    id: 'u-4',
    name: 'Emma Wilson',
    email: 'emma@academia.test',
    password: 'learn123',
    field: 'Mathematics',
    school: 'Harvard University',
    points: 18,
    answerCount: 3,
  },
];

const starterQuestions = [
  {
    id: 'q-1',
    title: 'How do derivatives work in calculus?',
    body: "I understand the concept of limits, but I'm struggling to grasp how derivatives relate to the rate of change. Can someone explain with an example?",
    authorId: 'u-4',
    authorName: 'Emma Wilson',
    authorSchool: 'Harvard University',
    subject: 'Mathematics',
    createdAt: '5/10/2026',
    answers: [
      {
        id: 'a-1',
        body: "Great question! Imagine you're driving and looking at your speedometer - that shows your derivative. The derivative tells you how fast something is changing RIGHT NOW.",
        authorId: 'u-1',
        authorName: 'Sarah Johnson',
        authorSchool: 'Stanford University',
        createdAt: '5/10/2026',
        likes: 23,
        likedBy: [],
      },
      {
        id: 'a-2',
        body: "Think of a derivative as the instantaneous rate of change. For example, if you have a position function s(t), the derivative s'(t) gives you velocity at any moment. It's like finding the slope of a curve at a specific point.",
        authorId: 'u-2',
        authorName: 'Alex Chen',
        authorSchool: 'MIT',
        createdAt: '5/10/2026',
        likes: 15,
        likedBy: [],
      },
    ],
  },
  {
    id: 'q-2',
    title: 'What makes recursion different from iteration?',
    body: 'I can solve simple loops, but recursive solutions still feel hard to trace. How should I think about the call stack?',
    authorId: 'u-3',
    authorName: 'Michael Brown',
    authorSchool: 'Yale University',
    subject: 'Computer Science',
    createdAt: '5/9/2026',
    answers: [
      {
        id: 'a-3',
        body: 'Recursion breaks a problem into smaller versions of itself. The call stack keeps track of every unfinished version until the base case lets everything resolve.',
        authorId: 'u-3',
        authorName: 'David Kim',
        authorSchool: 'Harvard University',
        createdAt: '5/9/2026',
        likes: 11,
        likedBy: [],
      },
    ],
  },
  {
    id: 'q-3',
    title: 'How should I compare primary and secondary historical sources?',
    body: 'I am writing a paper about post-war education reforms and want to avoid treating all sources as equally direct evidence.',
    authorId: 'u-1',
    authorName: 'Sarah Johnson',
    authorSchool: 'Stanford University',
    subject: 'History',
    createdAt: '5/8/2026',
    answers: [],
  },
];

const subjects = [
  'All Subjects',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'History',
  'Literature',
  'Economics',
];

function readStorage(key, fallback) {
  try {
    if (localStorage.getItem(DATA_VERSION_KEY) !== DATA_VERSION) {
      return fallback;
    }

    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 1)
    .toUpperCase();
}

function Icon({ name }) {
  const paths = {
    logo: (
      <>
        <path d="M3 9.5 12 5l9 4.5-9 4.5L3 9.5Z" />
        <path d="M6 12v4.4L12 20l6-3.6V12" />
      </>
    ),
    questions: (
      <>
        <path d="M4 5h16v10H8l-4 4V5Z" />
        <path d="M8 9h8" />
      </>
    ),
    trophy: (
      <>
        <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
        <path d="M7 6H4a4 4 0 0 0 4 4" />
        <path d="M17 6h3a4 4 0 0 1-4 4" />
        <path d="M12 13v4" />
        <path d="M8 20h8" />
      </>
    ),
    profile: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    thumbs: (
      <>
        <path d="M8 21H4V10h4v11Z" />
        <path d="M8 10 12 3l1.5 1.2L13 10h6a2 2 0 0 1 1.9 2.6l-2 6A3 3 0 0 1 16 21H8" />
      </>
    ),
    book: (
      <>
        <path d="M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3V4Z" />
        <path d="M17 7h2v13" />
      </>
    ),
    star: (
      <path d="m12 3 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7L6.8 19l1-5.8L3.6 9.1l5.8-.8L12 3Z" />
    ),
  };

  return (
    <svg aria-hidden="true" className="icon" viewBox="0 0 24 24">
      {paths[name]}
    </svg>
  );
}

function SplashScreen() {
  return (
    <main className="splash-screen">
      <div className="splash-mark">
        <Icon name="logo" />
      </div>
      <p className="eyebrow">Academic Q&A</p>
      <h1>Academia</h1>
      <p>Scholarly discourse & collaboration</p>
    </main>
  );
}

function AuthPage({ mode, onLogin, onResetPassword, onSignup, onSwitch }) {
  const isSignup = mode === 'signup';
  const isReset = mode === 'forgot';
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    field: '',
    school: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    const result = isSignup
      ? onSignup(form)
      : isReset
        ? onResetPassword(form.email, form.password)
        : onLogin(form.email, form.password);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    if (isReset) {
      setSuccess(result.message);
      setForm({ name: '', email: '', password: '', field: '', school: '' });
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div className="auth-logo">
          <span>
            <Icon name="logo" />
          </span>
          <strong>Academia</strong>
        </div>
        <div>
          <p className="eyebrow">
            {isSignup ? 'Create account' : isReset ? 'Password reset' : 'Welcome back'}
          </p>
          <h1>{isSignup ? 'Join Academia' : isReset ? 'Reset your password' : 'Sign in to Academia'}</h1>
          <p className="muted">
            {isSignup
              ? 'Create a local profile and begin contributing to scholarly discussions.'
              : isReset
                ? 'Enter the email on your local account and choose a new password.'
                : 'Sample login: sarah@academia.test with password learn123.'}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <label>
                Full name
                <input
                  name="name"
                  onChange={updateField}
                  placeholder="Grace Mensah"
                  required
                  type="text"
                  value={form.name}
                />
              </label>
              <label>
                School
                <input
                  name="school"
                  onChange={updateField}
                  placeholder="University of Lagos"
                  required
                  type="text"
                  value={form.school}
                />
              </label>
              <label>
                Academic field
                <input
                  name="field"
                  onChange={updateField}
                  placeholder="Public Health"
                  required
                  type="text"
                  value={form.field}
                />
              </label>
            </>
          )}

          <label>
            Email
            <input
              name="email"
              onChange={updateField}
              placeholder="you@example.com"
              required
              type="email"
              value={form.email}
            />
          </label>
          <label>
            Password
            <input
              name="password"
              minLength="6"
              onChange={updateField}
              placeholder="At least 6 characters"
              required
              type="password"
              value={form.password}
            />
          </label>

          {error && <p className="form-error">{error}</p>}
          {success && <p className="form-success">{success}</p>}

          <button className="primary-button" type="submit">
            {isSignup ? 'Create account' : isReset ? 'Reset password' : 'Login'}
          </button>
        </form>

        <div className="auth-links">
          {!isReset && (
            <p className="auth-switch">
              {isSignup ? 'Already have an account?' : 'New to Academia?'}
              <button type="button" onClick={() => onSwitch(isSignup ? 'login' : 'signup')}>
                {isSignup ? 'Login' : 'Sign up'}
              </button>
            </p>
          )}

          {!isSignup && !isReset && (
            <button className="text-button" type="button" onClick={() => onSwitch('forgot')}>
              Forgot password?
            </button>
          )}

          {isReset && (
            <button className="text-button" type="button" onClick={() => onSwitch('login')}>
              Back to login
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

function Navbar({ activePage, onNavigate, onLogout, user }) {
  const links = [
    { id: 'feed', label: 'Questions', icon: 'questions' },
    { id: 'leaderboard', label: 'Leaderboard', icon: 'trophy' },
    { id: 'profile', label: 'Profile', icon: 'profile' },
  ];

  return (
    <header className="site-header">
      <div className="brand-row">
        <div className="brand">
          <span className="brand-mark">
            <Icon name="logo" />
          </span>
          <strong>Academia</strong>
          <span>Scholarly discourse & collaboration</span>
        </div>
        <div className="session-actions">
          <span>{user.points} points</span>
          <button onClick={onLogout} type="button">
            Logout
          </button>
        </div>
      </div>

      <nav aria-label="Main navigation" className="tab-nav">
        {links.map((link) => (
          <button
            className={activePage === link.id ? 'active' : ''}
            key={link.id}
            onClick={() => onNavigate(link.id)}
            type="button"
          >
            <Icon name={link.icon} />
            {link.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

function FilterChips({ selectedSchool, selectedSubject, onSchoolChange, onSubjectChange }) {
  return (
    <div className="filters">
      <div className="chip-row">
        {['All Schools', 'Harvard University Only'].map((school) => (
          <button
            className={selectedSchool === school ? 'chip active school-chip' : 'chip school-chip'}
            key={school}
            onClick={() => onSchoolChange(school)}
            type="button"
          >
            {school}
          </button>
        ))}
      </div>
      <div className="chip-row subject-row">
        {subjects.map((subject) => (
          <button
            className={selectedSubject === subject ? 'chip active' : 'chip'}
            key={subject}
            onClick={() => onSubjectChange(subject)}
            type="button"
          >
            {subject}
          </button>
        ))}
      </div>
    </div>
  );
}

function QuestionCard({ currentUser, onAnswer, onLikeAnswer, question }) {
  const [isAnswering, setIsAnswering] = useState(false);
  const [draft, setDraft] = useState('');

  function submitAnswer(event) {
    event.preventDefault();
    onAnswer(question.id, draft);
    setDraft('');
    setIsAnswering(false);
  }

  return (
    <article className="question-card">
      <div className="question-topline">
        <div className="author-lockup">
          <div className="avatar">{initials(question.authorName)}</div>
          <div>
            <div className="author-name">
              <strong>{question.authorName}</strong>
              <span>{question.authorSchool}</span>
            </div>
            <p>{question.createdAt} • {question.subject}</p>
          </div>
        </div>
        <span className="subject-badge">{question.subject}</span>
      </div>

      <h2>{question.title}</h2>
      <p className="question-body">{question.body}</p>

      <section className="responses-panel">
        <h3>{question.answers.length} Responses</h3>
        {question.answers.length === 0 && <p className="muted">No responses yet. Bring the first useful explanation.</p>}

        {question.answers.map((answer) => {
          const liked = answer.likedBy?.includes(currentUser.id);

          return (
            <article className="response-card" key={answer.id}>
              <div className="response-copy">
                <div className="avatar small">{initials(answer.authorName)}</div>
                <div>
                  <div className="author-name">
                    <strong>{answer.authorName}</strong>
                    <span>{answer.authorSchool}</span>
                  </div>
                  <p>{answer.body}</p>
                </div>
              </div>
              <div className="response-footer">
                <span>{answer.createdAt}</span>
                <button
                  className={liked ? 'like-button liked' : 'like-button'}
                  onClick={() => onLikeAnswer(question.id, answer.id)}
                  type="button"
                >
                  <Icon name="thumbs" />
                  {answer.likes}
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {isAnswering ? (
        <form className="answer-form" onSubmit={submitAnswer}>
          <textarea
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Contribute a thoughtful academic response..."
            required
            rows="3"
            value={draft}
          />
          <div className="form-actions">
            <button className="outline-button" onClick={() => setIsAnswering(false)} type="button">
              Cancel
            </button>
            <button className="primary-button compact" type="submit">
              Post Answer (+10)
            </button>
          </div>
        </form>
      ) : (
        <button className="outline-button contribute-button" onClick={() => setIsAnswering(true)} type="button">
          Contribute an Answer
        </button>
      )}
    </article>
  );
}

function FeedPage({ currentUser, onAnswer, onAskQuestion, onLikeAnswer, questions }) {
  const [showAskForm, setShowAskForm] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState('All Schools');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [questionForm, setQuestionForm] = useState({ title: '', body: '', subject: 'Mathematics' });

  const filteredQuestions = questions.filter((question) => {
    const schoolMatches = selectedSchool === 'All Schools' || question.authorSchool === 'Harvard University';
    const subjectMatches = selectedSubject === 'All Subjects' || question.subject === selectedSubject;
    return schoolMatches && subjectMatches;
  });

  function submitQuestion(event) {
    event.preventDefault();
    onAskQuestion(questionForm);
    setQuestionForm({ title: '', body: '', subject: 'Mathematics' });
    setShowAskForm(false);
  }

  return (
    <section className="feed-page">
      <div className="page-intro">
        <h1>Scholarly Discussions</h1>
        <p>Engage in academic discourse with peers from leading institutions</p>
      </div>

      <FilterChips
        onSchoolChange={setSelectedSchool}
        onSubjectChange={setSelectedSubject}
        selectedSchool={selectedSchool}
        selectedSubject={selectedSubject}
      />

      {showAskForm && (
        <form className="ask-panel" onSubmit={submitQuestion}>
          <label>
            Question title
            <input
              onChange={(event) => setQuestionForm({ ...questionForm, title: event.target.value })}
              placeholder="What do you want to understand?"
              required
              value={questionForm.title}
            />
          </label>
          <label>
            Subject
            <select
              onChange={(event) => setQuestionForm({ ...questionForm, subject: event.target.value })}
              value={questionForm.subject}
            >
              {subjects.slice(1).map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </label>
          <label>
            Context
            <textarea
              onChange={(event) => setQuestionForm({ ...questionForm, body: event.target.value })}
              placeholder="Add details, course context, or what you have already tried."
              required
              rows="4"
              value={questionForm.body}
            />
          </label>
          <div className="form-actions">
            <button className="outline-button" onClick={() => setShowAskForm(false)} type="button">
              Cancel
            </button>
            <button className="primary-button compact" type="submit">
              Post Question (+5)
            </button>
          </div>
        </form>
      )}

      <div className="questions-list">
        {filteredQuestions.map((question) => (
          <QuestionCard
            currentUser={currentUser}
            key={question.id}
            onAnswer={onAnswer}
            onLikeAnswer={onLikeAnswer}
            question={question}
          />
        ))}
      </div>

      <button className="floating-add" onClick={() => setShowAskForm(!showAskForm)} type="button">
        +
      </button>
    </section>
  );
}

function LeaderboardPage({ users }) {
  const rankedUsers = [...users].sort((a, b) => b.points - a.points);
  const podium = [rankedUsers[0], rankedUsers[1], rankedUsers[2]].filter(Boolean);

  return (
    <section className="leaderboard-page">
      <div className="leader-hero">
        <Icon name="trophy" />
        <h1>Leaderboard</h1>
      </div>

      <div className="podium">
        {podium.map((user, index) => (
          <article className={`podium-card rank-${index + 1}`} key={user.id}>
            <div className="avatar podium-avatar">{initials(user.name)}</div>
            <div className="podium-block">
              <strong>{index + 1}</strong>
              <span>{user.name.split(' ')[0]}</span>
            </div>
            <p>{user.points}</p>
            <span>Points</span>
          </article>
        ))}
      </div>

      <div className="leaderboard-list">
        {rankedUsers.map((user, index) => (
          <article className={`leader-row medal-${index + 1}`} key={user.id}>
            <div className="rank-circle">{index + 1}</div>
            <div className="avatar">{initials(user.name)}</div>
            <div className="leader-person">
              <h2>{user.name}</h2>
              <p>
                {user.school} <span>•</span> <Icon name="book" /> {user.answerCount || 0} answers
              </p>
            </div>
            <div className="leader-points">
              <Icon name="star" />
              <strong>{user.points}</strong>
              <span>Points</span>
            </div>
          </article>
        ))}
      </div>

      <button className="floating-add" type="button">
        +
      </button>
    </section>
  );
}

function ProfilePage({ questions, user }) {
  const userQuestions = questions.filter((question) => question.authorId === user.id);
  const userAnswers = questions.flatMap((question) =>
    question.answers.filter((answer) => answer.authorId === user.id)
  );

  return (
    <section className="profile-page">
      <div className="profile-card">
        <div className="avatar profile-avatar">{initials(user.name)}</div>
        <div>
          <p className="eyebrow">Academic Profile</p>
          <h1>{user.name}</h1>
          <p>{user.school || 'Independent Scholar'} • {user.field || 'Academic contributor'}</p>
          <p className="muted">{user.email}</p>
        </div>
      </div>

      <div className="stats-grid">
        <article>
          <span>Points</span>
          <strong>{user.points}</strong>
        </article>
        <article>
          <span>Questions</span>
          <strong>{userQuestions.length}</strong>
        </article>
        <article>
          <span>Answers</span>
          <strong>{userAnswers.length}</strong>
        </article>
      </div>

      <div className="profile-columns">
        <article>
          <h2>Your questions</h2>
          {userQuestions.length === 0 && <p className="muted">You have not asked a question yet.</p>}
          {userQuestions.map((question) => (
            <p key={question.id}>{question.title}</p>
          ))}
        </article>
        <article>
          <h2>Your answers</h2>
          {userAnswers.length === 0 && <p className="muted">You have not answered a question yet.</p>}
          {userAnswers.map((answer) => (
            <p key={answer.id}>{answer.body}</p>
          ))}
        </article>
      </div>
    </section>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [authMode, setAuthMode] = useState('login');
  const [activePage, setActivePage] = useState('feed');
  const [users, setUsers] = useState(() => readStorage(USERS_KEY, starterUsers));
  const [questions, setQuestions] = useState(() => readStorage(QUESTIONS_KEY, starterQuestions));
  const [session, setSession] = useState(() => readStorage(SESSION_KEY, null));

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION), []);
  useEffect(() => writeStorage(USERS_KEY, users), [users]);
  useEffect(() => writeStorage(QUESTIONS_KEY, questions), [questions]);
  useEffect(() => {
    if (session) {
      writeStorage(SESSION_KEY, session);
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [session]);

  const currentUser = useMemo(
    () => users.find((user) => user.id === session?.userId),
    [session, users]
  );

  function addPoints(userId, points) {
    setUsers((existingUsers) =>
      existingUsers.map((user) =>
        user.id === userId ? { ...user, points: user.points + points } : user
      )
    );
  }

  function addAnswerCount(userId) {
    setUsers((existingUsers) =>
      existingUsers.map((user) =>
        user.id === userId ? { ...user, answerCount: (user.answerCount || 0) + 1 } : user
      )
    );
  }

  function handleLogin(email, password) {
    const user = users.find(
      (candidate) => candidate.email.toLowerCase() === email.toLowerCase() && candidate.password === password
    );

    if (!user) {
      return { ok: false, message: 'Email or password is incorrect.' };
    }

    setSession({ userId: user.id });
    setActivePage('feed');
    return { ok: true };
  }

  function handleSignup(form) {
    const emailExists = users.some((user) => user.email.toLowerCase() === form.email.toLowerCase());

    if (emailExists) {
      return { ok: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      id: makeId('u'),
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      field: form.field.trim(),
      school: form.school.trim(),
      points: 0,
      answerCount: 0,
    };

    setUsers([...users, newUser]);
    setSession({ userId: newUser.id });
    setActivePage('feed');
    return { ok: true };
  }

  function handleResetPassword(email, password) {
    const matchingUser = users.find((user) => user.email.toLowerCase() === email.toLowerCase());

    if (!matchingUser) {
      return { ok: false, message: 'No local account was found with that email.' };
    }

    setUsers(
      users.map((user) =>
        user.id === matchingUser.id ? { ...user, password } : user
      )
    );

    return { ok: true, message: 'Password reset. You can log in with the new password now.' };
  }

  function handleLogout() {
    setSession(null);
    setAuthMode('login');
  }

  function handleAskQuestion(form) {
    const newQuestion = {
      id: makeId('q'),
      title: form.title.trim(),
      body: form.body.trim(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorSchool: currentUser.school || 'Independent Scholar',
      subject: form.subject,
      createdAt: new Date().toLocaleDateString('en-US'),
      answers: [],
    };

    setQuestions([newQuestion, ...questions]);
    addPoints(currentUser.id, 5);
  }

  function handleAnswer(questionId, body) {
    const newAnswer = {
      id: makeId('a'),
      body: body.trim(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorSchool: currentUser.school || 'Independent Scholar',
      createdAt: new Date().toLocaleDateString('en-US'),
      likes: 0,
      likedBy: [],
    };

    setQuestions(
      questions.map((question) =>
        question.id === questionId
          ? { ...question, answers: [...question.answers, newAnswer] }
          : question
      )
    );
    addPoints(currentUser.id, 10);
    addAnswerCount(currentUser.id);
  }

  function handleLikeAnswer(questionId, answerId) {
    setQuestions(
      questions.map((question) => {
        if (question.id !== questionId) {
          return question;
        }

        return {
          ...question,
          answers: question.answers.map((answer) => {
            if (answer.id !== answerId) {
              return answer;
            }

            const likedBy = answer.likedBy || [];
            const alreadyLiked = likedBy.includes(currentUser.id);

            return {
              ...answer,
              likes: alreadyLiked ? answer.likes - 1 : answer.likes + 1,
              likedBy: alreadyLiked
                ? likedBy.filter((userId) => userId !== currentUser.id)
                : [...likedBy, currentUser.id],
            };
          }),
        };
      })
    );
  }

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!currentUser) {
    return (
      <AuthPage
        mode={authMode}
        onLogin={handleLogin}
        onResetPassword={handleResetPassword}
        onSignup={handleSignup}
        onSwitch={setAuthMode}
      />
    );
  }

  return (
    <div className="app-shell">
      <Navbar
        activePage={activePage}
        onLogout={handleLogout}
        onNavigate={setActivePage}
        user={currentUser}
      />
      <main className="main-content">
        {activePage === 'feed' && (
          <FeedPage
            currentUser={currentUser}
            onAnswer={handleAnswer}
            onAskQuestion={handleAskQuestion}
            onLikeAnswer={handleLikeAnswer}
            questions={questions}
          />
        )}
        {activePage === 'leaderboard' && <LeaderboardPage users={users} />}
        {activePage === 'profile' && <ProfilePage questions={questions} user={currentUser} />}
      </main>
    </div>
  );
}

export default App;
