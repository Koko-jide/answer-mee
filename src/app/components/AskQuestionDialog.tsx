import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';

interface AskQuestionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string, content: string, subject: string) => void;
  subjects: string[];
}

export function AskQuestionDialog({ open, onClose, onSubmit, subjects }: AskQuestionDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('');

  const handleSubmit = () => {
    if (title.trim() && content.trim() && subject) {
      onSubmit(title, content, subject);
      setTitle('');
      setContent('');
      setSubject('');
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#FFF8E7',
          border: '3px solid #0d2818',
          borderRadius: 2,
          boxShadow: '8px 8px 0px #c4b998',
        },
      }}
    >
      <DialogTitle sx={{ color: '#0d2818', fontWeight: 700, fontFamily: '"Playfair Display", serif', fontSize: 28, borderBottom: '2px solid #c4b998', pb: 2 }}>
        Pose a Scholarly Question
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="body2" sx={{ color: '#5a6b5a', fontFamily: '"Crimson Text", serif', fontStyle: 'italic', mb: 3 }}>
          Share your academic inquiry with the community
        </Typography>
        <TextField
          fullWidth
          label="Question Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          placeholder="e.g., How does one approach quadratic equations?"
          sx={{
            '& .MuiInputLabel-root': {
              color: '#5a6b5a',
              fontFamily: '"Crimson Text", serif',
              '&.Mui-focused': {
                color: '#0d2818',
              },
            },
            '& .MuiOutlinedInput-root': {
              bgcolor: '#FFF8E7',
              color: '#2d3e2d',
              fontFamily: '"Crimson Text", serif',
              '& fieldset': {
                borderColor: '#c4b998',
                borderWidth: 2,
              },
              '&:hover fieldset': {
                borderColor: '#0d2818',
                borderWidth: 2,
              },
              '&.Mui-focused fieldset': {
                borderColor: '#0d2818',
                borderWidth: 2,
              },
            },
            '& .MuiInputBase-input::placeholder': {
              color: '#8a9b8a',
              opacity: 1,
              fontStyle: 'italic',
            },
          }}
        />
        <TextField
          fullWidth
          select
          label="Academic Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          margin="normal"
          sx={{
            '& .MuiInputLabel-root': {
              color: '#5a6b5a',
              fontFamily: '"Crimson Text", serif',
              '&.Mui-focused': {
                color: '#0d2818',
              },
            },
            '& .MuiOutlinedInput-root': {
              bgcolor: '#FFF8E7',
              color: '#2d3e2d',
              fontFamily: '"Crimson Text", serif',
              '& fieldset': {
                borderColor: '#c4b998',
                borderWidth: 2,
              },
              '&:hover fieldset': {
                borderColor: '#0d2818',
                borderWidth: 2,
              },
              '&.Mui-focused fieldset': {
                borderColor: '#0d2818',
                borderWidth: 2,
              },
            },
          }}
        >
          {subjects.map((subj) => (
            <MenuItem
              key={subj}
              value={subj}
              sx={{
                bgcolor: '#FFF8E7',
                color: '#2d3e2d',
                fontFamily: '"Crimson Text", serif',
                '&:hover': {
                  bgcolor: '#f5eed9',
                },
                '&.Mui-selected': {
                  bgcolor: '#f5eed9',
                  '&:hover': {
                    bgcolor: '#ebe2c6',
                  },
                },
              }}
            >
              {subj}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          multiline
          rows={5}
          label="Detailed Inquiry"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          margin="normal"
          placeholder="Elaborate on the specifics of your question..."
          sx={{
            '& .MuiInputLabel-root': {
              color: '#5a6b5a',
              fontFamily: '"Crimson Text", serif',
              '&.Mui-focused': {
                color: '#0d2818',
              },
            },
            '& .MuiOutlinedInput-root': {
              bgcolor: '#FFF8E7',
              color: '#2d3e2d',
              fontFamily: '"Crimson Text", serif',
              '& fieldset': {
                borderColor: '#c4b998',
                borderWidth: 2,
              },
              '&:hover fieldset': {
                borderColor: '#0d2818',
                borderWidth: 2,
              },
              '&.Mui-focused fieldset': {
                borderColor: '#0d2818',
                borderWidth: 2,
              },
            },
            '& .MuiInputBase-input::placeholder': {
              color: '#8a9b8a',
              opacity: 1,
              fontStyle: 'italic',
            },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: '2px solid #c4b998' }}>
        <Button
          onClick={onClose}
          sx={{
            color: '#5a6b5a',
            fontFamily: '"Crimson Text", serif',
            fontWeight: 600,
            '&:hover': {
              bgcolor: '#f5eed9',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!title.trim() || !content.trim() || !subject}
          sx={{
            bgcolor: '#0d2818',
            color: '#FFF8E7',
            fontWeight: 700,
            fontFamily: '"Crimson Text", serif',
            px: 3,
            border: '2px solid #0d2818',
            '&:hover': {
              bgcolor: '#1b4d1b',
              border: '2px solid #1b4d1b',
            },
            '&.Mui-disabled': {
              bgcolor: '#c4b998',
              color: '#8a9b8a',
              border: '2px solid #c4b998',
            },
          }}
        >
          Submit Question
        </Button>
      </DialogActions>
    </Dialog>
  );
}
