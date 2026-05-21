import { useState } from 'react';
import {
  Box, Typography, TextField, Button, Card, CardContent,
  Alert, Divider, Chip
} from '@mui/material';
import { CheckCircle, Settings, Lock, VerifiedUser } from '@mui/icons-material';
import type { User } from '../types';

interface SettingsPageProps {
  user: User;
  onUpdateProfile: (updates: Partial<Pick<User, 'name' | 'bio' | 'school' | 'field'>>) => void;
  onChangeEmail: (newEmail: string, password: string) => { ok: boolean; message: string };
  onChangePassword: (current: string, next: string) => { ok: boolean; message: string };
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
};

const cardSx = {
  bgcolor: '#FFF8E7',
  border: '3px solid #0d2818',
  borderRadius: 2,
  boxShadow: '6px 6px 0px #c4b998',
  mb: 3,
};

function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <Box display="flex" alignItems="flex-start" gap={1.5} mb={3}>
      <Box sx={{ color: '#ffd600', mt: 0.3 }}>{icon}</Box>
      <Box>
        <Typography variant="h5" fontWeight={700} sx={{ color: '#0d2818', fontFamily: '"Playfair Display", serif' }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: '#5a6b5a', fontFamily: '"Crimson Text", serif', fontStyle: 'italic' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

function SaveButton({ loading, label = 'Save changes' }: { loading?: boolean; label?: string }) {
  return (
    <Button
      type="submit"
      variant="contained"
      disabled={loading}
      sx={{
        bgcolor: '#0d2818',
        color: '#FFF8E7',
        fontWeight: 700,
        fontFamily: '"Crimson Text", serif',
        border: '2px solid #0d2818',
        px: 4,
        '&:hover': { bgcolor: '#1b4d1b' },
        '&.Mui-disabled': { bgcolor: '#c4b998', color: '#8a9b8a', border: '2px solid #c4b998' },
      }}
    >
      {label}
    </Button>
  );
}

export function SettingsPage({ user, onUpdateProfile, onChangeEmail, onChangePassword }: SettingsPageProps) {
  // Profile form
  const [profile, setProfile] = useState({ name: user.name, bio: user.bio || '', school: user.school || '', field: user.field || '' });
  const [profileMsg, setProfileMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Email form
  const [emailForm, setEmailForm] = useState({ newEmail: '', password: '' });
  const [emailMsg, setEmailMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Password form
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const isVerified = !!(user.school && user.field);

  function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile.name.trim()) {
      setProfileMsg({ ok: false, text: 'Name cannot be empty.' });
      return;
    }
    onUpdateProfile({ name: profile.name.trim(), bio: profile.bio.trim(), school: profile.school.trim(), field: profile.field.trim() });
    setProfileMsg({ ok: true, text: 'Profile updated successfully.' });
    setTimeout(() => setProfileMsg(null), 3000);
  }

  function handleEmailSave(e: React.FormEvent) {
    e.preventDefault();
    const result = onChangeEmail(emailForm.newEmail, emailForm.password);
    setEmailMsg({ ok: result.ok, text: result.message });
    if (result.ok) {
      setEmailForm({ newEmail: '', password: '' });
      setTimeout(() => setEmailMsg(null), 3000);
    }
  }

  function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) {
      setPwMsg({ ok: false, text: 'New passwords do not match.' });
      return;
    }
    if (pwForm.next.length < 6) {
      setPwMsg({ ok: false, text: 'New password must be at least 6 characters.' });
      return;
    }
    const result = onChangePassword(pwForm.current, pwForm.next);
    setPwMsg({ ok: result.ok, text: result.ok ? 'Password changed successfully.' : result.message });
    if (result.ok) {
      setPwForm({ current: '', next: '', confirm: '' });
      setTimeout(() => setPwMsg(null), 3000);
    }
  }

  return (
    <Box>
      {/* Page header */}
      <Box mb={4}>
        <Box display="flex" alignItems="center" gap={1.5} mb={1}>
          <Settings sx={{ color: '#ffd600', fontSize: 32 }} />
          <Typography variant="h4" fontWeight={700} sx={{ color: '#0d2818', fontFamily: '"Playfair Display", serif' }}>
            Settings
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: '#5a6b5a', fontFamily: '"Crimson Text", serif', fontStyle: 'italic' }}>
          Manage your profile, account credentials, and verification status.
        </Typography>
      </Box>

      {/* ── Verification status banner ── */}
      <Card sx={{ ...cardSx, border: `3px solid ${isVerified ? '#2d8a2d' : '#c4b998'}`, bgcolor: isVerified ? '#f0f9f0' : '#FFF8E7' }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <VerifiedUser sx={{ color: isVerified ? '#2d8a2d' : '#8a9b8a', fontSize: 40 }} />
            <Box flex={1}>
              <Typography variant="h6" fontWeight={700} sx={{ color: '#0d2818', fontFamily: '"Playfair Display", serif' }}>
                Scholar Verification
              </Typography>
              <Typography variant="body2" sx={{ color: '#5a6b5a', fontFamily: '"Crimson Text", serif' }}>
                {isVerified
                  ? `Verified — ${user.school} · ${user.field}`
                  : 'Fill in your school and academic field below to earn the Verified Scholar achievement.'}
              </Typography>
            </Box>
            <Chip
              icon={isVerified ? <CheckCircle /> : undefined}
              label={isVerified ? 'Verified' : 'Unverified'}
              sx={{
                bgcolor: isVerified ? '#2d8a2d' : '#c4b998',
                color: isVerified ? '#fff' : '#0d2818',
                fontWeight: 700,
                fontFamily: '"Crimson Text", serif',
                border: '2px solid #0d2818',
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* ── Profile Settings ── */}
      <Card sx={cardSx}>
        <CardContent sx={{ p: 3 }}>
          <SectionHeader
            icon={<Settings fontSize="large" />}
            title="Profile Settings"
            subtitle="Update your public-facing name, institutional affiliation, and academic field."
          />
          <Box component="form" onSubmit={handleProfileSave} display="flex" flexDirection="column" gap={2.5}>
            <TextField
              label="Full name"
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              required
              fullWidth
              sx={fieldSx}
            />
            <TextField
              label="School / University"
              placeholder="e.g. Harvard University"
              value={profile.school}
              onChange={(e) => setProfile((p) => ({ ...p, school: e.target.value }))}
              fullWidth
              helperText="Adding your school unlocks the Verified Scholar achievement."
              sx={fieldSx}
            />
            <TextField
              label="Academic field"
              placeholder="e.g. Computer Science"
              value={profile.field}
              onChange={(e) => setProfile((p) => ({ ...p, field: e.target.value }))}
              fullWidth
              sx={fieldSx}
            />
            <TextField
              label="Bio"
              placeholder="Tell the community a little about yourself and your academic interests..."
              value={profile.bio}
              onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
              multiline
              rows={3}
              fullWidth
              sx={fieldSx}
            />
            {profileMsg && (
              <Alert severity={profileMsg.ok ? 'success' : 'error'} sx={{ fontFamily: '"Crimson Text", serif' }}>
                {profileMsg.text}
              </Alert>
            )}
            <Box>
              <SaveButton />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* ── Account Settings ── */}
      <Card sx={cardSx}>
        <CardContent sx={{ p: 3 }}>
          <SectionHeader
            icon={<Lock fontSize="large" />}
            title="Account Settings"
            subtitle="Change your email address or password. Your current password is required for both."
          />

          {/* Current email display */}
          <Box p={2} mb={3} bgcolor="#f5eed9" borderRadius={1} border="2px solid #c4b998">
            <Typography variant="caption" sx={{ color: '#5a6b5a', fontFamily: '"Crimson Text", serif', textTransform: 'uppercase', letterSpacing: 1 }}>
              Current email
            </Typography>
            <Typography variant="body1" fontWeight={600} sx={{ color: '#0d2818', fontFamily: '"Crimson Text", serif' }}>
              {user.email}
            </Typography>
          </Box>

          {/* Change email */}
          <Typography variant="h6" fontWeight={700} mb={2} sx={{ color: '#0d2818', fontFamily: '"Playfair Display", serif' }}>
            Change Email
          </Typography>
          <Box component="form" onSubmit={handleEmailSave} display="flex" flexDirection="column" gap={2} mb={3}>
            <TextField
              label="New email address"
              type="email"
              value={emailForm.newEmail}
              onChange={(e) => setEmailForm((f) => ({ ...f, newEmail: e.target.value }))}
              required
              fullWidth
              sx={fieldSx}
            />
            <TextField
              label="Current password (to confirm)"
              type="password"
              value={emailForm.password}
              onChange={(e) => setEmailForm((f) => ({ ...f, password: e.target.value }))}
              required
              fullWidth
              sx={fieldSx}
            />
            {emailMsg && (
              <Alert severity={emailMsg.ok ? 'success' : 'error'} sx={{ fontFamily: '"Crimson Text", serif' }}>
                {emailMsg.text}
              </Alert>
            )}
            <Box>
              <SaveButton label="Update email" />
            </Box>
          </Box>

          <Divider sx={{ my: 3, borderColor: '#c4b998' }} />

          {/* Change password */}
          <Typography variant="h6" fontWeight={700} mb={2} sx={{ color: '#0d2818', fontFamily: '"Playfair Display", serif' }}>
            Change Password
          </Typography>
          <Box component="form" onSubmit={handlePasswordSave} display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Current password"
              type="password"
              value={pwForm.current}
              onChange={(e) => setPwForm((f) => ({ ...f, current: e.target.value }))}
              required
              fullWidth
              sx={fieldSx}
            />
            <TextField
              label="New password"
              type="password"
              placeholder="At least 6 characters"
              value={pwForm.next}
              onChange={(e) => setPwForm((f) => ({ ...f, next: e.target.value }))}
              required
              inputProps={{ minLength: 6 }}
              fullWidth
              sx={fieldSx}
            />
            <TextField
              label="Confirm new password"
              type="password"
              value={pwForm.confirm}
              onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
              required
              fullWidth
              sx={fieldSx}
            />
            {pwMsg && (
              <Alert severity={pwMsg.ok ? 'success' : 'error'} sx={{ fontFamily: '"Crimson Text", serif' }}>
                {pwMsg.text}
              </Alert>
            )}
            <Box>
              <SaveButton label="Change password" />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
