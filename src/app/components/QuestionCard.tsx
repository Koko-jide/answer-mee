import { Card, CardContent, Typography, Chip, Avatar, Box, IconButton, TextField, Button } from '@mui/material';
import { ThumbUp, ThumbUpOutlined, Send } from '@mui/icons-material';
import { useState } from 'react';

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

interface QuestionCardProps {
  question: Question;
  onLikeAnswer: (questionId: string, answerId: string) => void;
  onSubmitAnswer: (questionId: string, content: string) => void;
}

export function QuestionCard({ question, onLikeAnswer, onSubmitAnswer }: QuestionCardProps) {
  const [answerText, setAnswerText] = useState('');
  const [showAnswerInput, setShowAnswerInput] = useState(false);

  const handleSubmitAnswer = () => {
    if (answerText.trim()) {
      onSubmitAnswer(question.id, answerText);
      setAnswerText('');
      setShowAnswerInput(false);
    }
  };

  const sortedAnswers = [...question.answers].sort((a, b) => b.likes - a.likes);

  return (
    <Card sx={{
      mb: 3,
      bgcolor: '#FFF8E7',
      border: '3px solid #0d2818',
      borderRadius: 2,
      boxShadow: '4px 4px 0px #c4b998',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '8px 8px 0px #c4b998',
        transform: 'translate(-2px, -2px)',
      },
    }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar src={question.authorAvatar} sx={{ width: 44, height: 44, mr: 2, bgcolor: '#0d2818', color: '#FFF8E7', fontFamily: '"Crimson Text", serif', fontSize: 18, fontWeight: 600 }}>
            {question.author[0]}
          </Avatar>
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Typography variant="body1" fontWeight={600} sx={{ color: '#2d3e2d', fontFamily: '"Crimson Text", serif' }}>
                {question.author}
              </Typography>
              <Typography sx={{ fontSize: 18 }}>{question.authorSchoolLogo}</Typography>
              <Typography variant="caption" sx={{ color: '#5a6b5a', fontStyle: 'italic' }}>
                {question.authorSchool}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#8a9b8a' }}>
              {question.timestamp.toLocaleDateString()} • {question.subject}
            </Typography>
          </Box>
          <Chip
            label={question.subject}
            size="small"
            sx={{
              bgcolor: '#ffd600',
              color: '#0d2818',
              fontFamily: '"Crimson Text", serif',
              fontWeight: 700,
              border: '2px solid #0d2818',
            }}
          />
        </Box>

        <Typography variant="h6" fontWeight={700} mb={1} sx={{ color: '#0d2818', fontFamily: '"Playfair Display", serif' }}>
          {question.title}
        </Typography>
        <Typography variant="body1" sx={{ color: '#5a6b5a', fontFamily: '"Crimson Text", serif', lineHeight: 1.7 }} mb={3}>
          {question.content}
        </Typography>

        <Box sx={{ pl: 3, borderLeft: '4px solid #ffd600', bgcolor: '#f5eed9', p: 2, borderRadius: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2} sx={{ color: '#0d2818', fontFamily: '"Playfair Display", serif' }}>
            {question.answers.length} {question.answers.length === 1 ? 'Response' : 'Responses'}
          </Typography>

          {sortedAnswers.map((answer) => (
            <Box key={answer.id} mb={2} p={2} bgcolor="#FFF8E7" borderRadius={1} border="2px solid #c4b998">
              <Box display="flex" alignItems="flex-start" mb={1}>
                <Avatar src={answer.authorAvatar} sx={{ width: 36, height: 36, mr: 1.5, bgcolor: '#0d2818', color: '#FFF8E7', fontFamily: '"Crimson Text", serif', fontSize: 16 }}>
                  {answer.author[0]}
                </Avatar>
                <Box flex={1}>
                  <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                    <Typography variant="body2" fontWeight={600} sx={{ color: '#2d3e2d', fontFamily: '"Crimson Text", serif' }}>
                      {answer.author}
                    </Typography>
                    <Typography sx={{ fontSize: 14 }}>{answer.authorSchoolLogo}</Typography>
                    <Typography variant="caption" sx={{ color: '#5a6b5a', fontStyle: 'italic' }}>
                      {answer.authorSchool}
                    </Typography>
                  </Box>
                  <Typography variant="body2" mt={0.5} sx={{ color: '#2d3e2d', fontFamily: '"Crimson Text", serif', lineHeight: 1.6 }}>
                    {answer.content}
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
                <Typography variant="caption" sx={{ color: '#8a9b8a', fontStyle: 'italic' }}>
                  {answer.timestamp.toLocaleDateString()}
                </Typography>
                <Box display="flex" alignItems="center">
                  <IconButton
                    size="small"
                    onClick={() => onLikeAnswer(question.id, answer.id)}
                    sx={{
                      color: answer.likedByUser ? '#ffd600' : '#5a6b5a',
                      '&:hover': {
                        bgcolor: 'rgba(255, 214, 0, 0.2)',
                      },
                    }}
                  >
                    {answer.likedByUser ? <ThumbUp fontSize="small" /> : <ThumbUpOutlined fontSize="small" />}
                  </IconButton>
                  <Typography variant="body2" fontWeight={700} ml={0.5} sx={{ color: '#0d2818', fontFamily: '"Crimson Text", serif' }}>
                    {answer.likes}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        {!showAnswerInput ? (
          <Button
            variant="outlined"
            size="small"
            sx={{
              mt: 2,
              borderColor: '#0d2818',
              borderWidth: 2,
              color: '#0d2818',
              fontFamily: '"Crimson Text", serif',
              fontWeight: 600,
              '&:hover': {
                borderWidth: 2,
                borderColor: '#0d2818',
                bgcolor: '#f5eed9',
              },
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
                  bgcolor: '#FFF8E7',
                  color: '#2d3e2d',
                  fontFamily: '"Crimson Text", serif',
                  '& fieldset': {
                    borderColor: '#0d2818',
                    borderWidth: 2,
                  },
                  '&:hover fieldset': {
                    borderColor: '#0d2818',
                    borderWidth: 2,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#ffd600',
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
            <IconButton
              onClick={handleSubmitAnswer}
              disabled={!answerText.trim()}
              sx={{
                color: '#ffd600',
                bgcolor: '#0d2818',
                '&:hover': {
                  bgcolor: '#1b4d1b',
                },
                '&.Mui-disabled': {
                  bgcolor: '#c4b998',
                  color: '#8a9b8a',
                },
              }}
            >
              <Send />
            </IconButton>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
