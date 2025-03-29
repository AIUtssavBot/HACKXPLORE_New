"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  TextField,
  LinearProgress,
} from "@mui/material";
import {
  LightbulbOutlined as LightbulbIcon,
  RefreshOutlined as RefreshIcon,
  CheckCircleOutline as CheckCircleIcon,
  EmojiEvents as TrophyIcon,
  Extension as PuzzleIcon,
  Timer as TimerIcon,
  Quiz as QuizIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { UserRole } from "@/models/User";

// Mock quiz data structure (normally would be fetched from API)
interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  timeLimit: number; // in seconds
  questions: QuizQuestion[];
  theme: string;
}

// Sample quiz data for demonstration
const SAMPLE_QUIZZES: Quiz[] = [
  {
    id: "q1",
    title: "Tech Trivia Challenge",
    description: "Test your knowledge of technology and computer science fundamentals.",
    difficulty: "medium",
    timeLimit: 300,
    theme: "Technology",
    questions: [
      {
        id: "q1_1",
        question: "What does CPU stand for?",
        options: [
          "Central Processing Unit",
          "Computer Personal Unit",
          "Central Process Utility",
          "Central Processor Undertaking",
        ],
        correctAnswer: "Central Processing Unit",
        explanation: "CPU stands for Central Processing Unit, which is the primary component of a computer that performs most of the processing.",
      },
      {
        id: "q1_2",
        question: "Which company developed the first commercially available smartphone with a touchscreen?",
        options: ["Apple", "Samsung", "IBM", "Nokia"],
        correctAnswer: "IBM",
        explanation: "IBM released the Simon Personal Communicator in 1994, which is considered the first smartphone with a touchscreen.",
      },
      {
        id: "q1_3",
        question: "What programming language was initially designed for web development and created by Brendan Eich?",
        options: ["Python", "JavaScript", "Java", "C++"],
        correctAnswer: "JavaScript",
        explanation: "JavaScript was created by Brendan Eich in 1995 and was originally designed for web development to add interactivity to webpages.",
      },
      {
        id: "q1_4",
        question: "What does HTTP stand for?",
        options: [
          "Hypertext Transfer Protocol",
          "Hypertext Transit Process",
          "Hypertext Transfer Process",
          "Hypertext Transit Protocol",
        ],
        correctAnswer: "Hypertext Transfer Protocol",
        explanation: "HTTP stands for Hypertext Transfer Protocol, which is the foundation of data communication on the World Wide Web.",
      },
      {
        id: "q1_5",
        question: "Which of these is NOT a programming paradigm?",
        options: [
          "Object-Oriented Programming",
          "Functional Programming",
          "Procedural Programming",
          "Methodical Programming",
        ],
        correctAnswer: "Methodical Programming",
        explanation: "Methodical Programming is not a recognized programming paradigm. The standard paradigms include Object-Oriented, Functional, Procedural, and others like Logic Programming.",
      },
    ],
  },
  {
    id: "q2",
    title: "Cultural Knowledge Quiz",
    description: "Explore diverse cultures and traditions from around the world.",
    difficulty: "easy",
    timeLimit: 240,
    theme: "Culture",
    questions: [
      {
        id: "q2_1",
        question: "Which country is known as the Land of the Rising Sun?",
        options: ["China", "Thailand", "Japan", "South Korea"],
        correctAnswer: "Japan",
        explanation: "Japan is known as the Land of the Rising Sun (Nihon or Nippon) because from China, Japan appears to be in the direction where the sun rises.",
      },
      {
        id: "q2_2",
        question: "Which festival is known as the 'Festival of Lights'?",
        options: ["Holi", "Diwali", "Eid", "Christmas"],
        correctAnswer: "Diwali",
        explanation: "Diwali is known as the Festival of Lights and is celebrated by Hindus, Jains, and Sikhs. It symbolizes the spiritual victory of light over darkness and good over evil.",
      },
      {
        id: "q2_3",
        question: "What is the traditional Japanese tea ceremony called?",
        options: ["Chanoyu", "Ikebana", "Origami", "Bonsai"],
        correctAnswer: "Chanoyu",
        explanation: "Chanoyu, also known as Sado or the Way of Tea, is the Japanese tea ceremony that involves the ceremonial preparation and presentation of matcha, powdered green tea.",
      },
      {
        id: "q2_4",
        question: "What is the most widely spoken language in the world by number of native speakers?",
        options: ["English", "Spanish", "Hindi", "Mandarin Chinese"],
        correctAnswer: "Mandarin Chinese",
        explanation: "Mandarin Chinese is the most widely spoken language in the world by number of native speakers, with over 900 million people.",
      },
      {
        id: "q2_5",
        question: "Which musical instrument is central to traditional Scottish culture?",
        options: ["Violin", "Bagpipes", "Flute", "Harp"],
        correctAnswer: "Bagpipes",
        explanation: "Bagpipes are central to traditional Scottish culture and heritage, particularly the Great Highland Bagpipe.",
      },
    ],
  },
];

export default function PuzzlesPage() {
  const { data: session } = useSession();
  const isAttendee = session?.user?.role === UserRole.ATTENDEE;
  
  const [tabValue, setTabValue] = useState(0);
  const [availableQuizzes, setAvailableQuizzes] = useState<Quiz[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [hintDialogOpen, setHintDialogOpen] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [quizPreference, setQuizPreference] = useState({
    theme: "Technology",
    difficulty: "medium",
  });

  // Load initial quizzes
  useEffect(() => {
    // In a real app, you would fetch quizzes from an API
    setTimeout(() => {
      setAvailableQuizzes(SAMPLE_QUIZZES);
      setIsLoading(false);
    }, 1200);
  }, []);

  // Set up timer when quiz is active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            handleQuizEnd();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Format time from seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start quiz
  const handleStartQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSelectedAnswer("");
    setShowResults(false);
    setScore(0);
    setTimeLeft(quiz.timeLimit);
    setTimerActive(true);
  };

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  // Go to next question
  const handleNextQuestion = () => {
    if (!currentQuiz) return;
    
    // Save the answer
    setAnswers((prev) => ({
      ...prev,
      [currentQuiz.questions[currentQuestionIndex].id]: selectedAnswer,
    }));
    
    // Move to next question or end quiz
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer("");
    } else {
      handleQuizEnd();
    }
  };

  // Handle quiz end
  const handleQuizEnd = () => {
    if (!currentQuiz) return;
    
    // Save the last answer if not saved
    if (currentQuestionIndex === currentQuiz.questions.length - 1 && selectedAnswer) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuiz.questions[currentQuestionIndex].id]: selectedAnswer,
      }));
    }
    
    // Calculate score
    let totalScore = 0;
    currentQuiz.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer || 
         (currentQuestionIndex === currentQuiz.questions.length - 1 && 
          question.id === currentQuiz.questions[currentQuestionIndex].id && 
          selectedAnswer === question.correctAnswer)) {
        totalScore++;
      }
    });
    
    setScore(totalScore);
    setShowResults(true);
    setTimerActive(false);
    
    // In a real app, you would send the score to an API
    // saveScore(currentQuiz.id, totalScore);
  };

  // Exit quiz
  const handleExitQuiz = () => {
    setCurrentQuiz(null);
    setTimerActive(false);
  };

  // Restart quiz
  const handleRestartQuiz = () => {
    if (currentQuiz) {
      handleStartQuiz(currentQuiz);
    }
  };

  // Get progress percentage
  const getProgressPercentage = () => {
    if (!currentQuiz) return 0;
    return ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
  };

  // Get time progress percentage
  const getTimeProgressPercentage = () => {
    if (!currentQuiz || currentQuiz.timeLimit === 0) return 0;
    return (timeLeft / currentQuiz.timeLimit) * 100;
  };

  // Open hint dialog
  const handleOpenHint = () => {
    setHintDialogOpen(true);
  };

  // Close hint dialog
  const handleCloseHint = () => {
    setHintDialogOpen(false);
  };

  // Generate a new quiz using AI
  const handleGenerateQuiz = async () => {
    setIsGeneratingQuiz(true);
    
    try {
      // In a real app, you would call an API that uses AI to generate a quiz
      // const response = await fetch('/api/ai/generate-quiz', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(quizPreference),
      // });
      // const data = await response.json();
      // setAvailableQuizzes(prev => [...prev, data]);
      
      // Simulate API call with a delay
      setTimeout(() => {
        const newQuiz: Quiz = {
          id: `generated_${Date.now()}`,
          title: `AI-Generated ${quizPreference.theme} Quiz`,
          description: `A custom quiz about ${quizPreference.theme} generated just for you with ${quizPreference.difficulty} difficulty.`,
          difficulty: quizPreference.difficulty as "easy" | "medium" | "hard",
          timeLimit: quizPreference.difficulty === "easy" ? 180 : quizPreference.difficulty === "medium" ? 240 : 300,
          theme: quizPreference.theme,
          questions: [
            {
              id: `gen_1_${Date.now()}`,
              question: "This is a generated question about " + quizPreference.theme,
              options: [
                "Option A",
                "Option B",
                "Option C",
                "Option D",
              ],
              correctAnswer: "Option B",
              explanation: "This is an explanation for the correct answer.",
            },
            {
              id: `gen_2_${Date.now()}`,
              question: "This is another generated question about " + quizPreference.theme,
              options: [
                "First Choice",
                "Second Choice",
                "Third Choice",
                "Fourth Choice",
              ],
              correctAnswer: "Third Choice",
              explanation: "This explains why the third choice is correct.",
            },
            {
              id: `gen_3_${Date.now()}`,
              question: "Here's a third generated question about " + quizPreference.theme,
              options: [
                "Answer 1",
                "Answer 2",
                "Answer 3",
                "Answer 4",
              ],
              correctAnswer: "Answer 4",
              explanation: "This is why Answer 4 is the correct choice.",
            },
            {
              id: `gen_4_${Date.now()}`,
              question: "A fourth question about " + quizPreference.theme,
              options: [
                "Selection A",
                "Selection B",
                "Selection C",
                "Selection D",
              ],
              correctAnswer: "Selection A",
              explanation: "Selection A is correct because of this reason.",
            },
            {
              id: `gen_5_${Date.now()}`,
              question: "Final question about " + quizPreference.theme,
              options: [
                "Choice 1",
                "Choice 2",
                "Choice 3",
                "Choice 4",
              ],
              correctAnswer: "Choice 3",
              explanation: "This explains why Choice 3 is the right answer.",
            },
          ],
        };
        
        setAvailableQuizzes(prev => [...prev, newQuiz]);
        setIsGeneratingQuiz(false);
        setSuccessMessage("New quiz generated successfully!");
      }, 3000);
      
    } catch (error) {
      console.error("Error generating quiz:", error);
      setErrorMessage("Failed to generate quiz. Please try again.");
      setIsGeneratingQuiz(false);
    }
  };

  // Handle quiz preference change
  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setQuizPreference({
      ...quizPreference,
      [name]: value,
    });
  };

  // Handle success/error message close
  const handleCloseMessage = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  // If user is not an attendee, show access denied
  if (!isAttendee) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Access denied. Only Attendees can access this page.
        </Alert>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  // If a quiz is active, show the quiz interface
  if (currentQuiz) {
    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    
    if (showResults) {
      // Show quiz results
      return (
        <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <TrophyIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h4" gutterBottom>
                Quiz Completed!
              </Typography>
              <Typography variant="h5" color={score >= currentQuiz.questions.length / 2 ? "success.main" : "error.main"}>
                Your Score: {score} / {currentQuiz.questions.length}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                {score === currentQuiz.questions.length
                  ? "Perfect score! Excellent job!"
                  : score >= currentQuiz.questions.length * 0.8
                  ? "Great job! You've got a strong understanding of this topic."
                  : score >= currentQuiz.questions.length * 0.6
                  ? "Good work! You're on the right track."
                  : "Keep practicing to improve your score."}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Review Your Answers:
            </Typography>
            
            {currentQuiz.questions.map((question, index) => {
              const isCorrect = answers[question.id] === question.correctAnswer;
              
              return (
                <Box key={question.id} sx={{ mb: 3, p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
                  <Typography variant="subtitle1" fontWeight={500}>
                    {index + 1}. {question.question}
                  </Typography>
                  
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2">
                      Your answer: {" "}
                      <Box component="span" sx={{ 
                        color: isCorrect ? "success.main" : "error.main",
                        fontWeight: "bold",
                      }}>
                        {answers[question.id] || "No answer"}
                        {isCorrect ? " ✓" : " ✗"}
                      </Box>
                    </Typography>
                    
                    {!isCorrect && (
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        Correct answer: <Box component="span" sx={{ color: "success.main", fontWeight: "bold" }}>
                          {question.correctAnswer}
                        </Box>
                      </Typography>
                    )}
                    
                    <Typography variant="body2" sx={{ mt: 1, fontSize: "0.9rem", fontStyle: "italic", color: "text.secondary" }}>
                      {question.explanation}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
            
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
              <Button 
                variant="outlined" 
                onClick={handleExitQuiz}
              >
                Exit
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleRestartQuiz}
                startIcon={<RefreshIcon />}
              >
                Try Again
              </Button>
            </Box>
          </Paper>
        </Box>
      );
    }
    
    // Show active quiz
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
        <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
          {/* Quiz Header */}
          <Box sx={{ 
            p: 2, 
            bgcolor: "primary.main", 
            color: "primary.contrastText",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <Typography variant="h6">{currentQuiz.title}</Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TimerIcon sx={{ mr: 1 }} />
              <Typography variant="body1" fontWeight="bold">
                {formatTime(timeLeft)}
              </Typography>
            </Box>
          </Box>
          
          {/* Progress Bar */}
          <LinearProgress 
            variant="determinate" 
            value={getProgressPercentage()} 
            sx={{ height: 8 }}
          />
          <LinearProgress 
            variant="determinate" 
            value={getTimeProgressPercentage()} 
            color="secondary"
            sx={{ height: 4 }}
          />
          
          {/* Question Content */}
          <Box sx={{ p: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Chip 
                label={`Question ${currentQuestionIndex + 1} of ${currentQuiz.questions.length}`}
                color="primary"
                variant="outlined"
              />
              <Chip 
                label={`Difficulty: ${currentQuiz.difficulty}`}
                color={
                  currentQuiz.difficulty === "easy" 
                    ? "success" 
                    : currentQuiz.difficulty === "medium" 
                    ? "warning" 
                    : "error"
                }
                size="small"
              />
            </Box>
            
            <Typography variant="h6" gutterBottom>
              {currentQuestion.question}
            </Typography>
            
            <RadioGroup
              value={selectedAnswer}
              onChange={(e) => handleAnswerSelect(e.target.value)}
              sx={{ mt: 3 }}
            >
              {currentQuestion.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                  sx={{
                    py: 1,
                    px: 2,
                    borderRadius: 1,
                    mb: 1,
                    width: "100%",
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                    ...(selectedAnswer === option && {
                      bgcolor: "primary.light",
                      color: "primary.contrastText",
                    }),
                  }}
                />
              ))}
            </RadioGroup>
          </Box>
          
          {/* Actions */}
          <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", borderTop: 1, borderColor: "divider" }}>
            <Button 
              variant="outlined" 
              onClick={handleOpenHint}
              startIcon={<LightbulbIcon />}
            >
              Hint
            </Button>
            
            <Box>
              <Button 
                variant="outlined" 
                onClick={handleExitQuiz}
                sx={{ mr: 2 }}
              >
                Exit
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleNextQuestion}
                disabled={!selectedAnswer}
                endIcon={currentQuestionIndex === currentQuiz.questions.length - 1 ? <CheckCircleIcon /> : undefined}
              >
                {currentQuestionIndex === currentQuiz.questions.length - 1 ? "Finish" : "Next"}
              </Button>
            </Box>
          </Box>
        </Paper>
        
        {/* Hint Dialog */}
        <Dialog
          open={hintDialogOpen}
          onClose={handleCloseHint}
          aria-labelledby="hint-dialog-title"
        >
          <DialogTitle id="hint-dialog-title">
            Hint
            <IconButton
              aria-label="close"
              onClick={handleCloseHint}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {/* In a real app, this would be a real hint, perhaps generated by AI */}
              Try to think about the core concepts related to this topic. 
              Sometimes the most obvious answer isn't the correct one.
              Look for specific terminology that might give a clue to the correct answer.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseHint} color="primary">
              Got it
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  // Main puzzle & quiz selection screen
  return (
    <Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Puzzles & Quizzes
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Test your knowledge and have fun with these interactive challenges
      </Typography>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tab 
            icon={<QuizIcon />} 
            label="Quizzes" 
            iconPosition="start"
          />
          <Tab 
            icon={<PuzzleIcon />} 
            label="Brain Teasers" 
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {tabValue === 0 ? (
        <>
          {/* Generate Quiz Section */}
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Generate a Custom Quiz
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Use AI to create a personalized quiz based on your preferences.
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Topic/Theme"
                  name="theme"
                  value={quizPreference.theme}
                  onChange={handlePreferenceChange}
                  fullWidth
                  helperText="E.g., Technology, Science, History, Arts, Sports"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Difficulty"
                  name="difficulty"
                  value={quizPreference.difficulty}
                  onChange={handlePreferenceChange}
                  fullWidth
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleGenerateQuiz}
                  disabled={isGeneratingQuiz}
                  startIcon={isGeneratingQuiz ? <CircularProgress size={20} /> : undefined}
                >
                  {isGeneratingQuiz ? "Generating Quiz..." : "Generate Custom Quiz"}
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Available Quizzes */}
          <Grid container spacing={3}>
            {availableQuizzes.map((quiz) => (
              <Grid item xs={12} sm={6} md={4} key={quiz.id}>
                <Card elevation={3} sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                  },
                }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {quiz.title}
                      </Typography>
                      <Chip
                        label={quiz.difficulty}
                        size="small"
                        color={
                          quiz.difficulty === "easy"
                            ? "success"
                            : quiz.difficulty === "medium"
                            ? "warning"
                            : "error"
                        }
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {quiz.description}
                    </Typography>
                    
                    <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                      <TimerIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatTime(quiz.timeLimit)} • {quiz.questions.length} questions
                      </Typography>
                    </Box>
                    
                    <Chip
                      label={quiz.theme}
                      size="small"
                      variant="outlined"
                      sx={{ mt: 2 }}
                    />
                  </CardContent>
                  
                  <CardActions>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleStartQuiz(quiz)}
                      sx={{ py: 1 }}
                    >
                      Start Quiz
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
            
            {availableQuizzes.length === 0 && (
              <Grid item xs={12}>
                <Paper sx={{ p: 4, textAlign: "center" }}>
                  <Typography variant="h6" color="text.secondary">
                    No quizzes available yet.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try generating a custom quiz above!
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </>
      ) : (
        // Brain Teasers tab content - In a real app, this would contain puzzles
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <PuzzleIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Brain Teasers Coming Soon
          </Typography>
          <Typography variant="body2" color="text.secondary">
            We're working on some exciting brain teasers for you.
            Check back later for puzzles, riddles, and more challenges!
          </Typography>
        </Paper>
      )}

      {/* Success/Error Messages */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseMessage} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseMessage} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
} 