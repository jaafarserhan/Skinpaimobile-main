import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ChevronRight, ChevronLeft, Check, 
  Sun, Moon, Coffee, Droplets, AlertCircle, Heart 
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Question {
  id: string;
  question: string;
  icon: React.ReactNode;
  options: {
    id: string;
    label: string;
    value: string;
    description?: string;
  }[];
}

interface SkinQuestionnaireProps {
  onComplete: (answers: Record<string, string>) => void;
  userName?: string;
}

export default function SkinQuestionnaire({ onComplete, userName }: SkinQuestionnaireProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string>('');

  const questions: Question[] = [
    {
      id: 'skinType',
      question: 'What is your skin type?',
      icon: <Sparkles className="w-6 h-6 text-primary" />,
      options: [
        { 
          id: 'oily', 
          label: 'Oily', 
          value: 'oily',
          description: 'Shiny, large pores, prone to breakouts'
        },
        { 
          id: 'dry', 
          label: 'Dry', 
          value: 'dry',
          description: 'Flaky, tight feeling, rough texture'
        },
        { 
          id: 'combination', 
          label: 'Combination', 
          value: 'combination',
          description: 'Oily T-zone, dry cheeks'
        },
        { 
          id: 'normal', 
          label: 'Normal', 
          value: 'normal',
          description: 'Well-balanced, not too oily or dry'
        },
        { 
          id: 'sensitive', 
          label: 'Sensitive', 
          value: 'sensitive',
          description: 'Easily irritated, prone to redness'
        }
      ]
    },
    {
      id: 'skinConcerns',
      question: 'What is your primary skin concern?',
      icon: <AlertCircle className="w-6 h-6 text-accent" />,
      options: [
        { 
          id: 'acne', 
          label: 'Acne & Breakouts', 
          value: 'acne',
          description: 'Pimples, blackheads, blemishes'
        },
        { 
          id: 'aging', 
          label: 'Aging Signs', 
          value: 'aging',
          description: 'Fine lines, wrinkles, loss of firmness'
        },
        { 
          id: 'pigmentation', 
          label: 'Dark Spots', 
          value: 'pigmentation',
          description: 'Hyperpigmentation, uneven tone'
        },
        { 
          id: 'dryness', 
          label: 'Dehydration', 
          value: 'dryness',
          description: 'Dull, tight, lacking moisture'
        },
        { 
          id: 'redness', 
          label: 'Redness & Sensitivity', 
          value: 'redness',
          description: 'Irritation, inflammation'
        }
      ]
    },
    {
      id: 'currentRoutine',
      question: 'How many steps is your current skincare routine?',
      icon: <Droplets className="w-6 h-6 text-primary" />,
      options: [
        { 
          id: 'minimal', 
          label: 'Minimal (1-2 steps)', 
          value: 'minimal',
          description: 'Just cleanser or moisturizer'
        },
        { 
          id: 'basic', 
          label: 'Basic (3-4 steps)', 
          value: 'basic',
          description: 'Cleanser, toner, moisturizer, SPF'
        },
        { 
          id: 'moderate', 
          label: 'Moderate (5-7 steps)', 
          value: 'moderate',
          description: 'Includes serums and treatments'
        },
        { 
          id: 'extensive', 
          label: 'Extensive (8+ steps)', 
          value: 'extensive',
          description: 'Full multi-step routine'
        },
        { 
          id: 'none', 
          label: 'No routine yet', 
          value: 'none',
          description: 'Just starting my journey'
        }
      ]
    },
    {
      id: 'sunExposure',
      question: 'How much sun exposure do you typically get?',
      icon: <Sun className="w-6 h-6 text-yellow-500" />,
      options: [
        { 
          id: 'minimal', 
          label: 'Minimal', 
          value: 'minimal',
          description: 'Mostly indoors, limited outdoor time'
        },
        { 
          id: 'moderate', 
          label: 'Moderate', 
          value: 'moderate',
          description: '1-2 hours daily outdoor exposure'
        },
        { 
          id: 'high', 
          label: 'High', 
          value: 'high',
          description: '3+ hours daily, work outdoors'
        },
        { 
          id: 'variable', 
          label: 'Variable', 
          value: 'variable',
          description: 'Depends on the day/season'
        }
      ]
    },
    {
      id: 'lifestyle',
      question: 'Which lifestyle factor affects your skin most?',
      icon: <Heart className="w-6 h-6 text-red-500" />,
      options: [
        { 
          id: 'sleep', 
          label: 'Sleep Quality', 
          value: 'sleep',
          description: 'Irregular sleep or lack of rest'
        },
        { 
          id: 'stress', 
          label: 'Stress Levels', 
          value: 'stress',
          description: 'High stress affecting skin'
        },
        { 
          id: 'diet', 
          label: 'Diet & Nutrition', 
          value: 'diet',
          description: 'Food sensitivities or poor diet'
        },
        { 
          id: 'hydration', 
          label: 'Water Intake', 
          value: 'hydration',
          description: 'Not drinking enough water'
        },
        { 
          id: 'exercise', 
          label: 'Physical Activity', 
          value: 'exercise',
          description: 'Sweat and exercise impact'
        }
      ]
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleSelectOption = (optionValue: string) => {
    setSelectedOption(optionValue);
  };

  const handleNext = () => {
    if (!selectedOption) {
      toast.error('Please select an option to continue');
      return;
    }

    // Save answer
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: selectedOption
    }));

    if (isLastQuestion) {
      // Complete questionnaire
      const finalAnswers = {
        ...answers,
        [currentQuestion.id]: selectedOption
      };
      toast.success('Profile complete! Ready to scan');
      setTimeout(() => onComplete(finalAnswers), 300);
    } else {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption('');
    }
  };

  const handleBack = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(prev => prev - 1);
      // Restore previous answer
      const previousQuestion = questions[currentQuestionIndex - 1];
      setSelectedOption(answers[previousQuestion.id] || '');
    }
  };

  const handleSkip = () => {
    // Skip all and complete with empty answers
    toast.success('Questionnaire skipped');
    onComplete({});
  };

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-semibold">
              Welcome{userName ? `, ${userName}` : ''}! 👋
            </h1>
            <p className="text-muted-foreground">
              Help us personalize your skin journey
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleSkip}
            className="text-muted-foreground"
          >
            Skip
          </Button>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="font-medium text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col"
        >
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {currentQuestion.icon}
                </div>
                <Badge variant="outline">
                  {currentQuestionIndex + 1}/{questions.length}
                </Badge>
              </div>
              <CardTitle className="text-xl">
                {currentQuestion.question}
              </CardTitle>
              <CardDescription>
                Select the option that best describes you
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 space-y-3">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSelectOption(option.value)}
                  className={`
                    w-full p-4 rounded-lg border-2 text-left transition-all
                    ${selectedOption === option.value 
                      ? 'border-primary bg-primary/5 shadow-md' 
                      : 'border-border hover:border-primary/50 hover:bg-accent/50'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                      ${selectedOption === option.value 
                        ? 'border-primary bg-primary' 
                        : 'border-muted-foreground'
                      }
                    `}>
                      {selectedOption === option.value && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium mb-1">{option.label}</div>
                      {option.description && (
                        <div className="text-sm text-muted-foreground">
                          {option.description}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={isFirstQuestion}
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!selectedOption}
              className="flex-1"
            >
              {isLastQuestion ? (
                <>
                  Complete
                  <Check className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Info Footer */}
      <div className="mt-6 p-3 bg-primary/5 rounded-lg border border-primary/20">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Your answers help us provide personalized product recommendations and track your progress more accurately
          </p>
        </div>
      </div>
    </div>
  );
}
