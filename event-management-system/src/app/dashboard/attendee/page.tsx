'use client';

import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  LinearProgress,
} from '@mui/material';
import {
  Event,
  EmojiEvents,
  QuestionAnswer,
  Close,
  AccessTime,
  LocationOn,
  Groups,
} from '@mui/icons-material';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function AttendeeDashboard() {
  const [openQuizDialog, setOpenQuizDialog] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Sample data - replace with actual data from your API
  const stats = {
    registeredEvents: 3,
    completedQuizzes: 2,
    earnedPoints: 150,
    upcomingEvents: [
      {
        id: 1,
        title: 'Tech Innovation Summit',
        date: '2024-04-15',
        time: '10:00 AM',
        location: 'Main Auditorium',
        image: '/images/event1.jpg',
        status: 'registered',
        attendees: 120,
      },
      {
        id: 2,
        title: 'Startup Networking Event',
        date: '2024-04-20',
        time: '2:00 PM',
        location: 'Conference Hall B',
        image: '/images/event2.jpg',
        status: 'open',
        attendees: 75,
      },
    ],
    quizzes: [
      {
        id: 1,
        title: 'Tech Innovation Quiz',
        questions: [
          {
            question: 'What is the main advantage of quantum computing?',
            options: [
              'Faster processing speed',
              'Lower power consumption',
              'Better graphics',
              'Larger storage capacity',
            ],
            correctAnswer: 0,
          },
          {
            question: 'Which technology is primarily used in blockchain?',
            options: [
              'Virtual Reality',
              'Cryptography',
              'Machine Learning',
              'Cloud Computing',
            ],
            correctAnswer: 1,
          },
        ],
      },
    ],
  };

  const handleQuizStart = () => {
    setOpenQuizDialog(true);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setQuizSubmitted(false);
    setScore(0);
  };

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answer;
    setSelectedAnswers(newAnswers);
  };

  const handleQuizSubmit = () => {
    const quiz = stats.quizzes[0];
    let correctAnswers = 0;
    selectedAnswers.forEach((answer, index) => {
      if (parseInt(answer) === quiz.questions[index].correctAnswer) {
        correctAnswers++;
      }
    });
    setScore((correctAnswers / quiz.questions.length) * 100);
    setQuizSubmitted(true);
  };

  const StatCard = ({ title, value, icon, color }: any) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              {title}
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </Box>
          <IconButton sx={{ backgroundColor: color, color: 'white' }}>
            {icon}
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Attendee Dashboard</Typography>
          <Button
            variant="contained"
            startIcon={<QuestionAnswer />}
            onClick={handleQuizStart}
          >
            Take Quiz
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Registered Events"
              value={stats.registeredEvents}
              icon={<Event />}
              color="#1976d2"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Completed Quizzes"
              value={stats.completedQuizzes}
              icon={<QuestionAnswer />}
              color="#2e7d32"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              title="Points Earned"
              value={stats.earnedPoints}
              icon={<EmojiEvents />}
              color="#ed6c02"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Upcoming Events
            </Typography>
            <Grid container spacing={3}>
              {stats.upcomingEvents.map((event) => (
                <Grid item xs={12} md={6} key={event.id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={event.image}
                      alt={event.title}
                    />
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {event.title}
                      </Typography>
                      <Box display="flex" gap={2} mb={2}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <AccessTime color="action" fontSize="small" />
                          <Typography variant="body2" color="text.secondary">
                            {event.date} at {event.time}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <LocationOn color="action" fontSize="small" />
                          <Typography variant="body2" color="text.secondary">
                            {event.location}
                          </Typography>
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <Groups color="action" fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                          {event.attendees} attendees
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Chip
                          label={event.status}
                          color={event.status === 'registered' ? 'success' : 'primary'}
                        />
                        <Button
                          variant={event.status === 'registered' ? 'outlined' : 'contained'}
                        >
                          {event.status === 'registered' ? 'View Details' : 'Register Now'}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        <Dialog
          open={openQuizDialog}
          onClose={() => setOpenQuizDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              {quizSubmitted ? 'Quiz Results' : stats.quizzes[0].title}
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => setOpenQuizDialog(false)}
                aria-label="close"
              >
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            {!quizSubmitted ? (
              <Box mt={2}>
                <LinearProgress
                  variant="determinate"
                  value={((currentQuestion + 1) / stats.quizzes[0].questions.length) * 100}
                  sx={{ mb: 3 }}
                />
                <FormControl component="fieldset">
                  <FormLabel component="legend">
                    {stats.quizzes[0].questions[currentQuestion].question}
                  </FormLabel>
                  <RadioGroup
                    value={selectedAnswers[currentQuestion] || ''}
                    onChange={(e) => handleAnswerSelect(e.target.value)}
                  >
                    {stats.quizzes[0].questions[currentQuestion].options.map(
                      (option, index) => (
                        <FormControlLabel
                          key={index}
                          value={index.toString()}
                          control={<Radio />}
                          label={option}
                        />
                      )
                    )}
                  </RadioGroup>
                </FormControl>
              </Box>
            ) : (
              <Box mt={2} textAlign="center">
                <Typography variant="h4" gutterBottom>
                  Your Score: {score}%
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  You answered {selectedAnswers.filter((answer, index) => 
                    parseInt(answer) === stats.quizzes[0].questions[index].correctAnswer
                  ).length} out of {stats.quizzes[0].questions.length} questions correctly.
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            {!quizSubmitted ? (
              <>
                {currentQuestion > 0 && (
                  <Button onClick={() => setCurrentQuestion(currentQuestion - 1)}>
                    Previous
                  </Button>
                )}
                {currentQuestion < stats.quizzes[0].questions.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                    disabled={!selectedAnswers[currentQuestion]}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleQuizSubmit}
                    disabled={!selectedAnswers[currentQuestion]}
                  >
                    Submit
                  </Button>
                )}
              </>
            ) : (
              <Button onClick={() => setOpenQuizDialog(false)} variant="contained">
                Close
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
} 