
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateUserTrustScore } from "@/services/authService";
import { Progress } from "@/components/ui/progress";

// Define question sections and their weights
const sections = {
  "Financial Behavior": { weight: 0.20, questions: [0, 1, 2, 3] },
  "Risk Tolerance": { weight: 0.20, questions: [4, 5, 6, 7] },
  "Responsibility & Integrity": { weight: 0.20, questions: [8, 9, 10, 11] },
  "Social Trust": { weight: 0.15, questions: [12, 13, 14, 15] },
  "Stress Management": { weight: 0.15, questions: [16, 17, 18, 19] },
  "Self-Assessment": { weight: 0.10, questions: [20, 21, 22] },
};

// All questions from the questionnaire
const questions = [
  // Financial Behavior
  { text: "I consistently pay my bills and debts on time.", reverse: false },
  { text: "I regularly save money for unexpected expenses.", reverse: false },
  { text: "I keep a detailed record of my financial transactions.", reverse: false },
  { text: "When facing financial difficulties, I actively seek solutions rather than avoid the problem.", reverse: false },
  
  // Risk Tolerance
  { text: "I am comfortable taking calculated risks when it comes to managing my finances.", reverse: false },
  { text: "Before making a major financial decision, I carefully weigh the pros and cons.", reverse: false },
  { text: "I prefer to avoid financial situations where outcomes are uncertain.", reverse: true },
  { text: "I often take advantage of financial opportunities, even if they involve some risk.", reverse: false },
  
  // Responsibility & Integrity
  { text: "I always tell the truth, even when it might be inconvenient for me.", reverse: false },
  { text: "Honesty is one of the most important traits a person can have.", reverse: false },
  { text: "I have a strong history of managing my money responsibly.", reverse: false },
  { text: "I always consider how my financial decisions might affect others around me.", reverse: false },
  
  // Social Trust
  { text: "I actively participate in community or social groups.", reverse: false },
  { text: "I trust that people in my community will act in honest and reliable ways.", reverse: false },
  { text: "I often recommend people based on their trustworthiness.", reverse: false },
  { text: "I rely on my social network for advice during financial challenges.", reverse: false },
  
  // Stress Management
  { text: "I remain calm and composed when facing financial stress.", reverse: false },
  { text: "I recover quickly from financial setbacks.", reverse: false },
  { text: "I have effective strategies in place to manage unexpected financial challenges.", reverse: false },
  { text: "I feel confident in managing my financial responsibilities under pressure.", reverse: false },
  
  // Self-Assessment
  { text: "I would rate my ability to manage credit as:", reverse: false, isSelfRating: true },
  { text: "I actively track and review my credit transactions.", reverse: false },
  { text: "I understand the long-term consequences of failing to meet my financial obligations.", reverse: false },
  
  // Validity checks - these are used internally but not shown to the user
  { text: "I believe that lying is never acceptable, even if it might benefit me.", reverse: false },
  { text: "I sometimes exaggerate my positive qualities to impress others.", reverse: true },
  { text: "I am willing to say things that might not be entirely true if it makes me seem more trustworthy.", reverse: true },
  { text: "I often consider how my actions impact those around me.", reverse: false },
  { text: "I am comfortable taking calculated risks in financial matters.", reverse: false },
  { text: "I believe that I am a perfect person who never makes mistakes.", reverse: true },
  { text: "I always perform at my best in every situation, no matter what.", reverse: true }
];

// Mapping for self-rating question
const selfRatingMap = {
  "Poor": 1,
  "Average": 2,
  "Good": 3,
  "Excellent": 4
};

// Pairs for consistency check (these are indices in the responses array)
const consistencyPairs = [
  [8, 23], // "I always tell the truth" vs "Lying is never acceptable"
  [11, 26], // "Consider how financial decisions affect others" vs "Consider how actions impact others"
  [4, 27]  // "Comfortable with calculated risks" vs "Comfortable with calculated risks in financial matters"
];

const CreditAssessment = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Only show first 23 questions to users (index 0-22)
  const visibleQuestions = questions.slice(0, 23);
  
  // Initialize responses array with nulls for all questions (including hidden validity checks)
  const [responses, setResponses] = useState<(number | string | null)[]>(Array(questions.length).fill(null));
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);
  
  const sectionNames = Object.keys(sections);
  
  const handleAnswerChange = (questionIndex: number, value: number | string) => {
    setResponses(prev => {
      const newResponses = [...prev];
      newResponses[questionIndex] = value;
      
      // For consistency checking questions, automatically fill the corresponding validity question
      if (questionIndex === 8) {
        // If answering Q9, copy to Q24
        newResponses[23] = value;
      } else if (questionIndex === 11) {
        // If answering Q12, copy to Q27
        newResponses[26] = value;
      } else if (questionIndex === 4) {
        // If answering Q5, copy to Q28
        newResponses[27] = value;
      }
      
      return newResponses;
    });
  };
  
  const isSectionComplete = (sectionIndex: number) => {
    const sectionName = sectionNames[sectionIndex];
    const sectionQuestions = sections[sectionName as keyof typeof sections].questions;
    
    return sectionQuestions.every(qIndex => responses[qIndex] !== null);
  };
  
  const handleNextSection = () => {
    if (currentSection < sectionNames.length - 1) {
      setCurrentSection(currentSection + 1);
      window.scrollTo(0, 0);
    } else {
      calculateScore();
    }
  };
  
  const handlePrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const applyReverse = (score: number, maxScore: number = 5) => {
    return (maxScore + 1) - score;
  };
  
  const scoreSection = (sectionName: string) => {
    const sectionData = sections[sectionName as keyof typeof sections];
    const sectionQuestions = sectionData.questions;
    
    let total = 0;
    let count = 0;
    
    for (const qIndex of sectionQuestions) {
      let response = responses[qIndex];
      
      if (qIndex === 20) { // Self-rating question
        const stringResponse = response as string;
        const numericValue = selfRatingMap[stringResponse as keyof typeof selfRatingMap] || 0;
        total += numericValue;
      } else {
        let numResponse = response as number;
        if (questions[qIndex].reverse) {
          numResponse = applyReverse(numResponse);
        }
        total += numResponse;
      }
      count += 1;
    }
    
    return { total, count };
  };
  
  const computeCompositeScore = () => {
    let totalWeighted = 0;
    let totalPossible = 0;
    
    for (const sectionName of sectionNames) {
      const sectionData = sections[sectionName as keyof typeof sections];
      const { total: sectionScore, count } = scoreSection(sectionName);
      
      let sectionMax;
      if (sectionName === "Self-Assessment") {
        let maxScore = 0;
        for (const qIndex of sectionData.questions) {
          if (qIndex === 20) {
            maxScore += 4; // Max value for self-rating is 4
          } else {
            maxScore += 5;
          }
        }
        sectionMax = maxScore;
      } else {
        sectionMax = count * 5;
      }
      
      const weightedSection = (sectionScore / sectionMax) * sectionData.weight;
      totalWeighted += weightedSection;
      totalPossible += sectionData.weight;
    }
    
    const compositeScore = (totalWeighted / totalPossible) * 100;
    return compositeScore;
  };
  
  const computeInconsistencyIndex = () => {
    let inconsistency = 0;
    
    for (const [q1, q2] of consistencyPairs) {
      // Make sure both responses exist and are numbers
      if (typeof responses[q1] === 'number' && typeof responses[q2] === 'number') {
        const diff = Math.abs((responses[q1] as number) - (responses[q2] as number));
        inconsistency += diff;
      }
    }
    
    return inconsistency;
  };
  
  const adjustedFinalScore = (compositeScore: number, inconsistencyIndex: number, penaltyFactor: number = 2) => {
    const penalty = penaltyFactor * inconsistencyIndex;
    return Math.max(compositeScore - penalty, 0);
  };
  
  const checkSocialDesirabilityBias = () => {
    let total = 0;
    let count = 0;
    
    // Calculate average for non-validity questions
    for (let i = 0; i < 23; i++) { // First 23 questions
      if (responses[i] !== null) {
        if (i === 20) { // Self-rating question
          const stringResponse = responses[i] as string;
          total += selfRatingMap[stringResponse as keyof typeof selfRatingMap] || 0;
        } else if (typeof responses[i] === 'number') {
          total += responses[i] as number;
        }
        count += 1;
      }
    }
    
    return count > 0 ? total / count : 0;
  };
  
  const mapScoreToTrustScore = (score: number) => {
    // Map the 0-100 score to a trust score between 0-100
    // We're simply using the score directly in this implementation
    return Math.round(score);
  };
  
  const calculateScore = async () => {
    setIsSubmitting(true);
    
    try {
      const compositeScore = computeCompositeScore();
      console.log("Composite score:", compositeScore);
      
      const inconsistencyIndex = computeInconsistencyIndex();
      console.log("Inconsistency index:", inconsistencyIndex);
      
      const avgNonValidity = checkSocialDesirabilityBias();
      console.log("Average non-validity:", avgNonValidity);
      
      let adjusted = adjustedFinalScore(compositeScore, inconsistencyIndex);
      console.log("Adjusted score before thresholds:", adjusted);
      
      // Define thresholds
      const inconsistencyThreshold = 3;
      const socialDesirabilityThreshold = 4.5;
      
      // If either threshold is exceeded, reduce the score
      if (inconsistencyIndex > inconsistencyThreshold || avgNonValidity > socialDesirabilityThreshold) {
        console.log("Thresholds exceeded, capping score at 50");
        adjusted = Math.min(adjusted, 50); // Cap at 50 instead of 2 for more reasonable trust score
      }
      
      const trustScore = mapScoreToTrustScore(adjusted);
      console.log("Final trust score:", trustScore);
      setFinalScore(trustScore);
      
      // Update user's trust score in the database
      if (user) {
        console.log("Updating user trust score for user ID:", user.id);
        await updateUserTrustScore(user.id, trustScore);
        
        // Update local user state
        updateUser({ 
          ...user,
          trustScore: trustScore 
        });
        
        toast({
          title: "Trust Score Updated",
          description: `Your new trust score is ${trustScore}.`,
        });
      } else {
        console.error("User is null, cannot update trust score");
        toast({
          title: "Error",
          description: "User not found. Please log in again.",
          variant: "destructive",
        });
      }
      
      setShowResults(true);
    } catch (error) {
      console.error("Error calculating score:", error);
      toast({
        title: "Error",
        description: "There was an error updating your trust score.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getCurrentSectionQuestions = () => {
    const sectionName = sectionNames[currentSection];
    const sectionQuestions = sections[sectionName as keyof typeof sections].questions;
    return sectionQuestions;
  };
  
  const renderQuestion = (questionIndex: number) => {
    const question = questions[questionIndex];
    
    if (question.isSelfRating) {
      return (
        <div key={questionIndex} className="space-y-3 mb-8">
          <Label className="text-base">{question.text}</Label>
          <Select
            value={responses[questionIndex] as string || ""}
            onValueChange={(value) => handleAnswerChange(questionIndex, value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(selfRatingMap).map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }
    
    return (
      <div key={questionIndex} className="space-y-3 mb-8">
        <Label className="text-base">{question.text}</Label>
        <RadioGroup
          value={responses[questionIndex] as string || ""}
          onValueChange={(value) => handleAnswerChange(questionIndex, parseInt(value))}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id={`q${questionIndex}_1`} />
            <Label htmlFor={`q${questionIndex}_1`}>Strongly Disagree</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="2" id={`q${questionIndex}_2`} />
            <Label htmlFor={`q${questionIndex}_2`}>Disagree</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="3" id={`q${questionIndex}_3`} />
            <Label htmlFor={`q${questionIndex}_3`}>Neutral</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="4" id={`q${questionIndex}_4`} />
            <Label htmlFor={`q${questionIndex}_4`}>Agree</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="5" id={`q${questionIndex}_5`} />
            <Label htmlFor={`q${questionIndex}_5`}>Strongly Agree</Label>
          </div>
        </RadioGroup>
      </div>
    );
  };
  
  const renderResults = () => (
    <div className="text-center py-8 space-y-6">
      <h2 className="text-2xl font-bold">Assessment Complete</h2>
      <div className="flex flex-col items-center gap-4">
        <div className="w-40 h-40 rounded-full border-4 border-primary flex items-center justify-center">
          <span className="text-4xl font-bold">{finalScore}</span>
        </div>
        <Progress value={finalScore} className="w-64 h-2" />
        <p className="text-lg">Your new trust score has been updated.</p>
        <Button onClick={() => navigate("/dashboard")} className="mt-4">
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar />
      
      <div className="flex-1 p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Credit Worthiness Assessment</h1>
          <p className="text-muted-foreground">
            Complete this assessment to update your trust score
          </p>
        </header>

        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>
                {showResults 
                  ? "Assessment Results" 
                  : `${sectionNames[currentSection]} (${currentSection + 1}/${sectionNames.length})`
                }
              </CardTitle>
              <CardDescription>
                {showResults 
                  ? "Thank you for completing the assessment" 
                  : "Please answer all questions honestly for an accurate assessment"
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {showResults ? (
                renderResults()
              ) : (
                <div className="space-y-4">
                  {getCurrentSectionQuestions().map(questionIndex => (
                    renderQuestion(questionIndex)
                  ))}
                </div>
              )}
            </CardContent>
            
            {!showResults && (
              <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevSection}
                  disabled={currentSection === 0 || isSubmitting}
                >
                  Previous Section
                </Button>
                <Button
                  onClick={handleNextSection}
                  disabled={!isSectionComplete(currentSection) || isSubmitting}
                >
                  {currentSection < sectionNames.length - 1 
                    ? "Next Section" 
                    : isSubmitting 
                      ? "Calculating..." 
                      : "Submit Assessment"
                  }
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreditAssessment;
