import { useState } from 'react';
import { Card, CardContent, Typography, Chip, Avatar, Box, IconButton, TextField, Button } from '@mui/material';
import { ThumbUp, ThumbUpOutlined, Send } from '@mui/icons-material';
import type { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  currentUserId: string;
  onLikeAnswer: (questionId: string, answerId: string) => void;
  onSubmitAnswer: (questionId: string, body: string) => void;
}

function initials(name: string) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

export function QuestionCard({ question, currentUserId, onLikeAnswer, onSubmitAnswer }: QuestionCardProps) {
  const [answerText, setAnswerText] = useState('');
  const [showAnswerInput, setShowAnswerInput] = useState(false);

  function handleSubmit() {
    if (answerText.trim()) {
      onSubmitAnswer(question.id, answerText.trim());
      setAnswerText('');
      setShowAnswerInput(false);
    }
  }

  const sortedAnswers = [...question.answers].sort((a, b) => b.likes - a.likes);

  return (
    <Card
      sx={{
        mb: 3,
        bgcolor: '#FFF8E7',
        border: '3px solid #0d2818',
        borderRadius: 2,
        boxShadow: '4px 4px 0px #c4b998',
        transition: 'all 0.3s ease',
        '&:hover': { boxShadow: '8px 8px 0px #c4b998', transform: 'translate(-2px, -2px)' },
      }}
    >
      <CardContent>
        {/* Author row */}
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            sx={{
              width: 44, height: 44, mr: 2,
              bgcolor: '#0d2818', color: '#FFF8E7',
              fontFamily: '"Crimson Text", serif', fontSize: 15, fontWeight: 700,
            }}
          >
            {initials(question.authorName)}
          </Avatar>
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body1" fontWeight={600} sx={{ color: '#2d3e2d', fontFamily: '"Crimson Text", serif' }}>
                {question.authorName}
              </Typography>
              <Typography variant="caption" sx={{ color: '#5a6b5a', fontStyle: 'italic' }}>
                {question.authorSchool}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#8a9b8a' }}>
              {question.createdAt} &bull; {question.subject}
            </Typography>
          </Box>
          <Chip
            label={question.subject}
            size="small"
            sx={{
              bgcolor: '#ffd600', color: '#0d2818',
              fontFamily: '"Crimson Text", serif', fontWeight: 700,
              border: '2px solid #0d2818',
            }}
          />
        </Box>

        {/* Title + body */}
        <Typography variant="h6" fontWeight={700} mb={1} sx={{ color: '#0d2818', fontFamily: '"Playfair Display", serif' }}>
          {question.title}
        </Typography>
        <Typography variant="body1" sx={{ color: '#5a6b5a', fontFamily: '"Crimson Text", serif', lineHeight: 1.7 }} mb={3}>
          {question.body}
        </Typography>

        {/* Responses */}
        <Box sx={{ pl: 0, borderLeft: '4px solid #ffd600', bgcolor: '#f5eed9', p: 2, borderRadius: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2} sx={{ color: '#0d2818', fontFamily: '"Playfair Display", serif' }}>
            {question.answers.length} {question.answers.length === 1 ? 'Response' : 'Responses'}
          </Typography>

          {question.answers.length === 0 && (
            <Typography variant="body2" sx={{ color: '#8a9b8a', fontStyle: 'italic', fontFamily: '"Crimson Text", serif' }}>
              No responses yet. Bring the first useful explanation.
            </Typography>
          )}

          {sortedAnswers.map((answer) => {
            const liked = answer.likedBy?.includes(currentUserId);
            return (
              <Box key={answer.id} mb={2} p={2} bgcolor="#FFF8E7" borderRadius={1} border="2px solid #c4b998">
                <Box display="flex" alignItems="flex-start" mb={1}>
                  <Avatar
                    sx={{
                      width: 36, height: 36, mr: 1.5,
                      bgcolor: '#0d2818', color: '#FFF8E7',
                      fontFamily: '"Crimson Text", serif', fontSize: 13, fontWeight: 700,
                    }}
                  >
                    {initials(answer.authorName)}
                  </Avatar>
                  <Box flex={1}>
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      <Typography variant="body2" fontWeight={600} sx={{ color: '#2d3e2d', fontFamily: '"Crimson Text", serif' }}>
                        {answer.authorName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#5a6b5a', fontStyle: 'italic' }}>
                        {answer.authorSchool}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#2d3e2d', fontFamily: '"Crimson Text", serif', lineHeight: 1.6 }}>
                      {answer.body}
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
                  <Typography variant="caption" sx={{ color: '#8a9b8a', fontStyle: 'italic' }}>
                    {answer.createdAt}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <IconButton
                      size="small"
                      onClick={() => onLikeAnswer(question.id, answer.id)}
                      sx={{
                        color: liked ? '#ffd600' : '#5a6b5a',
                        '&:hover': { bgcolor: 'rgba(255,214,0,0.2)' },
                      }}
                    >
                      {liked ? <ThumbUp fontSize="small" /> : <ThumbUpOutlined fontSize="small" />}
                    </IconButton>
                    <Typography variant="body2" fontWeight={700} ml={0.5} sx={{ color: '#0d2818', fontFamily: '"Crimson Text", serif' }}>
                      {answer.likes}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Answer form */}
        {!showAnswerInput ? (
          <Button
            variant="outlined"
            size="small"
            sx={{
              mt: 2,
              borderColor: '#0d2818', borderWidth: 2,
              color: '#0d2818',
              fontFamily: '"Crimson Text", serif', fontWeight: 600,
              '&:hover': { borderWidth: 2, borderColor: '#0d2818', bgcolor: '#f5eed9' },
            }}
            onClick={() => setShowAnswerInput(true)}
          >
            Contribute an Answer
          </Button>
        ) : (
          <Box mt={2} display="flex" gap={1}>
            <TextField
              fullWidth
              size="small"
              placeholder="Share your scholarly insight..."
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              multiline
              rows={3}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#FFF8E7', color: '#2d3e2d',
                  fontFamily: '"Crimson Text", serif',
                  '& fieldset': { borderColor: '#0d2818', borderWidth: 2 },
                  '&:hover fieldset': { borderColor: '#0d2818', borderWidth: 2 },
                  '&.Mui-focused fieldset': { borderColor: '#ffd600', borderWidth: 2 },
                },
                '& .MuiInputBase-input::placeholder': { color: '#8a9b8a', opacity: 1, fontStyle: 'italic' },
              }}
            />
            <Box display="flex" flexDirection="column" gap={1}>
              <IconButton
                onClick={handleSubmit}
                disabled={!answerText.trim()}
                sx={{
                  color: '#ffd600', bgcolor: '#0d2818',
                  '&:hover': { bgcolor: '#1b4d1b' },
                  '&.Mui-disabled': { bgcolor: '#c4b998', color: '#8a9b8a' },
                }}
              >
                <Send />
              </IconButton>
              <Button
                size="small"
                onClick={() => { setShowAnswerInput(false); setAnswerText(''); }}
                sx={{ color: '#5a6b5a', fontFamily: '"Crimson Text", serif', fontSize: '0.75rem' }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
