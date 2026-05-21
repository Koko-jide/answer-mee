import { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, Link } from '@mui/material';
import { School } from '@mui/icons-material';

export type AuthMode = 'login' | 'signup' | 'forgot';

interface AuthPageProps {
  mode: AuthMode;
  onLogin: (email: string, password: string) => { ok: boolean; message: string };
  onSignup: (form: { name: string; email: string; password: string; school: string; field: string }) => { ok: boolean; message: string };
  onResetPassword: (email: string, newPassword: string) => { ok: boolean; message: string };
  onSwitch: (mode: AuthMode) => void;
}

const fieldSx = {
  '& .MuiInputLabel-root': {
    color: '#5a6b5a',
    fontFamily: '"Crimson Text", serif',
    '&.Mui-focused': { color: '#0d2818' },
  },
  '& .MuiOutlinedInput-root': {
    bgcolor: '#FFF8E7',
    color: '#2d3e2d',
    fontFamily: '"Crimson Text", serif',
    '& fieldset': { borderColor: '#c4b998', borderWidth: 2 },
    '&:hover fieldset': { borderColor: '#0d2818', borderWidth: 2 },
    '&.Mui-focused fieldset': { borderColor: '#0d2818', borderWidth: 2 },
  },
  '& .MuiInputBase-input::placeholder': {
    color: '#8a9b8a',
    opacity: 1,
    fontStyle: 'italic',
  },
};

export function AuthPage({ mode, onLogin, onSignup, onResetPassword, onSwitch }: AuthPageProps) {
  const isSignup = mode === 'signup';
  const isForgot = mode === 'forgot';

  const [form, setForm] = useState({ name: '', email: '', password: '', school: '', field: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function update(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
    };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    let result: { ok: boolean; message: string };

    if (isSignup) {
      result = onSignup(form);
    } else if (isForgot) {
      result = onResetPassword(form.email, form.password);
    } else {
      result = onLogin(form.email, form.password);
    }

    if (!result.ok) {
      setError(result.message);
    } else if (isForgot) {
      setSuccess(result.message);
      setForm({ name: '', email: '', password: '', school: '', field: '' });
    }
  }

  const headings = {
    login: { eyebrow: 'Welcome back', title: 'Sign in to Academia', hint: 'Sample login: sarah@academia.test · password: learn123' },
    signup: { eyebrow: 'Create account', title: 'Join Academia', hint: 'Create a local profile and begin contributing to scholarly discussions.' },
    forgot: { eyebrow: 'Password reset', title: 'Reset your password', hint: 'Enter the email on your account and choose a new password.' },
  };
  const { eyebrow, title, hint } = headings[mode];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#0a1f14',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 480,
          bgcolor: '#FFF8E7',
          border: '3px solid #0d2818',
          borderRadius: 2,
          boxShadow: '8px 8px 0px #c4b998',
          p: { xs: 3, sm: 5 },
        }}
      >
        {/* Brand */}
        <Box display="flex" alignItems="center" gap={1.5} mb={4}>
          <Box
            sx={{
              width: 48,
              height: 48,
              bgcolor: '#ffd600',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #0d2818',
            }}
          >
            <School sx={{ color: '#0d2818', fontSize: 26 }} />
          </Box>
          <Typography variant="h5" fontWeight={700} sx={{ color: '#0d2818', fontFamily: '"Playfair Display", serif' }}>
            Academia
          </Typography>
        </Box>

        {/* Heading */}
        <Typography variant="overline" sx={{ color: '#8a9b8a', letterSpacing: 2, fontFamily: '"Crimson Text", serif' }}>
          {eyebrow}
        </Typography>
        <Typography variant="h4" fontWeight={700} mb={1} sx={{ color: '#0d2818', fontFamily: '"Playfair Display", serif', lineHeight: 1.2 }}>
          {title}
        </Typography>
        <Typography variant="body2" mb={3} sx={{ color: '#5a6b5a', fontFamily: '"Crimson Text", serif', fontStyle: 'italic' }}>
          {hint}
        </Typography>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
          {isSignup && (
            <>
              <TextField
                label="Full name"
                placeholder="Grace Mensah"
                value={form.name}
                onChange={update('name')}
                required
                fullWidth
                sx={fieldSx}
              />
              <TextField
                label="School / University"
                placeholder="University of Lagos"
                value={form.school}
                onChange={update('school')}
                required
                fullWidth
                sx={fieldSx}
              />
              <TextField
                label="Academic field"
                placeholder="Public Health"
                value={form.field}
                onChange={update('field')}
                required
                fullWidth
                sx={fieldSx}
              />
            </>
          )}

          <TextField
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={update('email')}
            required
            fullWidth
            sx={fieldSx}
          />
          <TextField
            label={isForgot ? 'New password' : 'Password'}
            type="password"
            placeholder="At least 6 characters"
            value={form.password}
            onChange={update('password')}
            required
            inputProps={{ minLength: 6 }}
            fullWidth
            sx={fieldSx}
          />

          {error && <Alert severity="error" sx={{ fontFamily: '"Crimson Text", serif' }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ fontFamily: '"Crimson Text", serif' }}>{success}</Alert>}

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{
              mt: 1,
              bgcolor: '#0d2818',
              color: '#FFF8E7',
              fontWeight: 700,
              fontFamily: '"Crimson Text", serif',
              fontSize: '1.05rem',
              border: '2px solid #0d2818',
              py: 1.5,
              '&:hover': { bgcolor: '#1b4d1b' },
            }}
          >
            {isSignup ? 'Create account' : isForgot ? 'Reset password' : 'Sign in'}
          </Button>
        </Box>

        {/* Footer links */}
        <Box mt={3} display="flex" flexDirection="column" alignItems="center" gap={1}>
          {!isForgot && (
            <Typography variant="body2" sx={{ color: '#5a6b5a', fontFamily: '"Crimson Text", serif' }}>
              {isSignup ? 'Already have an account?' : 'New to Academia?'}{' '}
              <Link
                component="button"
                type="button"
                onClick={() => onSwitch(isSignup ? 'login' : 'signup')}
                sx={{ color: '#0d2818', fontWeight: 700, fontFamily: '"Crimson Text", serif', cursor: 'pointer' }}
              >
                {isSignup ? 'Sign in' : 'Sign up'}
              </Link>
            </Typography>
          )}
          {!isSignup && !isForgot && (
            <Link
              component="button"
              type="button"
              onClick={() => onSwitch('forgot')}
              sx={{ color: '#5a6b5a', fontFamily: '"Crimson Text", serif', fontSize: '0.9rem', cursor: 'pointer' }}
            >
              Forgot password?
            </Link>
          )}
          {isForgot && (
            <Link
              component="button"
              type="button"
              onClick={() => onSwitch('login')}
              sx={{ color: '#5a6b5a', fontFamily: '"Crimson Text", serif', fontSize: '0.9rem', cursor: 'pointer' }}
            >
              ← Back to sign in
            </Link>
          )}
        </Box>
      </Box>
    </Box>
  );
}
