import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { 
  ArrowLeft, ArrowRight, Check, Upload, Camera, 
  Sparkles, Star, Award, Users, Link as LinkIcon,
  Instagram, Youtube, Twitter, Globe, Mail,
  MapPin, Calendar, Target, Zap, Crown
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface StationData {
  stationName: string;
  stationUsername: string;
  bio: string;
  description: string;
  location: string;
  coverImage: string;
  avatarImage: string;
  specialties: string[];
  theme: string;
  socialLinks: {
    instagram: string;
    youtube: string;
    twitter: string;
    website: string;
    email: string;
  };
  certifications: string[];
  experience: string;
  contentFrequency: string;
}

interface CreateStationProps {
  onBack: () => void;
  onComplete: (stationData: StationData) => void;
}

export default function CreateStation({ onBack, onComplete }: CreateStationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Form data
  const [stationName, setStationName] = useState('');
  const [stationUsername, setStationUsername] = useState('');
  const [bio, setBio] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  
  const [coverImage, setCoverImage] = useState('');
  const [avatarImage, setAvatarImage] = useState('');
  
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState('');
  
  const [socialLinks, setSocialLinks] = useState({
    instagram: '',
    youtube: '',
    twitter: '',
    website: '',
    email: ''
  });

  const [certifications, setCertifications] = useState<string[]>([]);
  const [experience, setExperience] = useState('');
  const [contentFrequency, setContentFrequency] = useState('');
  
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [verifyInfo, setVerifyInfo] = useState(false);

  const specialties = [
    'Anti-Aging', 'Acne Treatment', 'Sensitive Skin', 'Dry Skin',
    'Oily Skin', 'Combination Skin', 'Natural Skincare', 'K-Beauty',
    'Medical Skincare', 'Makeup', 'Routine Building', 'Product Reviews',
    'Ingredient Analysis', 'Budget Skincare', 'Luxury Skincare', 'DIY Skincare'
  ];

  const themes = [
    { id: 'educational', name: 'Educational', icon: '📚', desc: 'Teach and inform about skincare' },
    { id: 'routine', name: 'Routine Focused', icon: '🗓️', desc: 'Share daily routines and tips' },
    { id: 'reviews', name: 'Product Reviews', icon: '⭐', desc: 'Review and recommend products' },
    { id: 'transformation', name: 'Transformations', icon: '✨', desc: 'Show before/after results' },
    { id: 'lifestyle', name: 'Lifestyle', icon: '💫', desc: 'Holistic beauty and wellness' },
    { id: 'professional', name: 'Professional', icon: '👨‍⚕️', desc: 'Expert medical advice' }
  ];

  const certificationOptions = [
    'Licensed Esthetician',
    'Dermatologist',
    'Cosmetologist',
    'Skincare Specialist',
    'Beauty Therapist',
    'Makeup Artist',
    'None - Self-taught enthusiast'
  ];

  const contentFrequencyOptions = [
    { value: 'daily', label: 'Daily', desc: 'Post every day' },
    { value: '3-5', label: '3-5 times/week', desc: 'Regular posting' },
    { value: '1-2', label: '1-2 times/week', desc: 'Weekly updates' },
    { value: 'occasional', label: 'Occasional', desc: 'When inspired' }
  ];

  const toggleSpecialty = (specialty: string) => {
    if (selectedSpecialties.includes(specialty)) {
      setSelectedSpecialties(prev => prev.filter(s => s !== specialty));
    } else {
      if (selectedSpecialties.length < 5) {
        setSelectedSpecialties(prev => [...prev, specialty]);
      } else {
        toast.error('Maximum 5 specialties allowed');
      }
    }
  };

  const toggleCertification = (cert: string) => {
    if (certifications.includes(cert)) {
      setCertifications(prev => prev.filter(c => c !== cert));
    } else {
      setCertifications(prev => [...prev, cert]);
    }
  };

  const handleImageUpload = (type: 'cover' | 'avatar') => {
    // Simulate image upload
    const mockImage = type === 'cover' 
      ? 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=300&fit=crop'
      : 'https://images.unsplash.com/photo-1494790108755-2616b612b7a1?w=150&h=150&fit=crop';
    
    if (type === 'cover') {
      setCoverImage(mockImage);
    } else {
      setAvatarImage(mockImage);
    }
    toast.success(`${type === 'cover' ? 'Cover' : 'Profile'} image uploaded!`);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return stationName.trim().length >= 3 && 
               stationUsername.trim().length >= 3 && 
               bio.trim().length >= 10;
      case 2:
        return coverImage && avatarImage;
      case 3:
        return selectedSpecialties.length > 0 && selectedTheme;
      case 4:
        return certifications.length > 0 && contentFrequency;
      case 5:
        return acceptTerms && verifyInfo;
      default:
        return false;
    }
  };

  const handleNext = () => {
    // Check if current step is completed
    if (!isStepCompleted(currentStep)) {
      // Show specific error messages based on step
      switch (currentStep) {
        case 1:
          if (stationName.length < 3) {
            toast.error('Station name must be at least 3 characters');
          } else if (stationUsername.length < 3) {
            toast.error('Username must be at least 3 characters');
          } else if (bio.length < 10) {
            toast.error('Bio must be at least 10 characters');
          } else {
            toast.error('Please complete all required fields');
          }
          break;
        case 2:
          if (!coverImage) {
            toast.error('Please upload a cover image');
          } else if (!avatarImage) {
            toast.error('Please upload a profile picture');
          }
          break;
        case 3:
          if (selectedSpecialties.length === 0) {
            toast.error('Please select at least one specialty');
          } else if (!selectedTheme) {
            toast.error('Please select a station theme');
          }
          break;
        case 4:
          if (certifications.length === 0) {
            toast.error('Please select at least one certification');
          } else if (!contentFrequency) {
            toast.error('Please select your posting frequency');
          }
          break;
        case 5:
          if (!acceptTerms) {
            toast.error('Please accept the Creator Terms & Conditions');
          } else if (!verifyInfo) {
            toast.error('Please verify your information');
          }
          break;
        default:
          toast.error('Please complete all required fields');
      }
      return;
    }
    
    // Proceed to next step
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!isStepCompleted(5)) {
      toast.error('Please accept the terms and verify your information');
      return;
    }

    const stationData: StationData = {
      stationName,
      stationUsername,
      bio,
      description,
      location,
      coverImage,
      avatarImage,
      specialties: selectedSpecialties,
      theme: selectedTheme,
      socialLinks,
      certifications,
      experience,
      contentFrequency
    };

    console.log('Creating station:', stationData);
    setTimeout(() => {
      onComplete(stationData);
    }, 1500);
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Allow Enter to proceed to next step (if valid)
      if (e.key === 'Enter' && e.ctrlKey && isStepCompleted(currentStep)) {
        if (currentStep < totalSteps) {
          handleNext();
        } else {
          handleSubmit();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStep, stationName, stationUsername, bio, coverImage, avatarImage, selectedSpecialties, selectedTheme, certifications, contentFrequency, acceptTerms, verifyInfo]);

  const progressPercentage = (currentStep / totalSteps) * 100;

  // Step definitions
  const steps = [
    {
      number: 1,
      title: 'Basic Info',
      description: 'Station details',
      icon: Sparkles,
    },
    {
      number: 2,
      title: 'Visual Identity',
      description: 'Images & branding',
      icon: Camera,
    },
    {
      number: 3,
      title: 'Expertise',
      description: 'Focus & specialties',
      icon: Star,
    },
    {
      number: 4,
      title: 'Credentials',
      description: 'Experience & links',
      icon: Award,
    },
    {
      number: 5,
      title: 'Review',
      description: 'Launch station',
      icon: Check,
    },
  ];

  // Check if a specific step can be accessed (all previous steps are completed)
  const canAccessStep = (stepNumber: number) => {
    if (stepNumber === 1) return true;
    
    // Check all previous steps are completed
    for (let i = 1; i < stepNumber; i++) {
      const prevStepCompleted = isStepCompleted(i);
      if (!prevStepCompleted) return false;
    }
    return true;
  };

  // Check if a step is completed (has all required fields filled)
  const isStepCompleted = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return stationName.trim().length >= 3 && 
               stationUsername.trim().length >= 3 && 
               bio.trim().length >= 10;
      case 2:
        return coverImage && avatarImage;
      case 3:
        return selectedSpecialties.length > 0 && selectedTheme;
      case 4:
        return certifications.length > 0 && contentFrequency;
      case 5:
        return acceptTerms && verifyInfo;
      default:
        return false;
    }
  };

  const handleStepClick = (stepNumber: number) => {
    // Can navigate to any step that is accessible (previous steps completed)
    if (canAccessStep(stepNumber)) {
      setCurrentStep(stepNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="sticky top-16 bg-background border-b border-border z-10">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Create Your Station</h1>
              <p className="text-sm text-muted-foreground">Step {currentStep} of {totalSteps}</p>
            </div>
            <Crown className="w-6 h-6 text-primary" />
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Step Navigator */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-5 gap-1 sm:gap-2">
            {steps.map((step) => {
              const isActive = currentStep === step.number;
              const isCompleted = isStepCompleted(step.number);
              const isAccessible = canAccessStep(step.number);
              const isPast = step.number < currentStep;
              const StepIcon = step.icon;

              return (
                <button
                  key={step.number}
                  onClick={() => handleStepClick(step.number)}
                  disabled={!isAccessible}
                  className={`p-2 rounded-lg border-2 transition-all ${
                    isActive
                      ? 'border-primary bg-primary/10 shadow-sm'
                      : isCompleted
                      ? 'border-green-500/50 bg-green-500/5 cursor-pointer hover:bg-green-500/10 hover:border-green-500'
                      : isAccessible
                      ? 'border-accent-foreground/30 bg-accent-foreground/5 cursor-pointer hover:border-accent-foreground hover:bg-accent-foreground/10'
                      : 'border-border bg-secondary/10 opacity-50 cursor-not-allowed'
                  }`}
                  title={`${step.title} - ${step.description}${!isAccessible ? ' (Complete previous steps first)' : ''}`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : isCompleted
                          ? 'bg-green-500 text-white'
                          : isAccessible
                          ? 'bg-accent-foreground text-white'
                          : 'bg-muted/50 text-muted-foreground/50'
                      }`}
                    >
                      {isCompleted && !isActive ? (
                        <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                      ) : (
                        <StepIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                    </div>
                    <div className="text-center w-full">
                      <div className={`text-[10px] sm:text-xs font-medium truncate ${
                        isActive ? 'text-primary' : isCompleted ? 'text-green-600' : isAccessible ? 'text-accent-foreground' : ''
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-[8px] sm:text-[10px] text-muted-foreground hidden sm:block truncate">
                        {step.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Progress indicator */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-green-500 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {currentStep}/{totalSteps}
            </span>
          </div>
          
          {/* Step status helper text */}
          <div className="mt-2 text-center">
            {!isStepCompleted(currentStep) && (
              <p className="text-xs text-muted-foreground">
                Complete required fields to unlock next step
              </p>
            )}
            {isStepCompleted(currentStep) && currentStep < totalSteps && (
              <p className="text-xs text-green-600">
                ✓ Step complete! Click next step to continue
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Welcome, Creator! ✨</h3>
                    <p className="text-sm text-muted-foreground">
                      Let's set up your station where you'll share your skincare expertise with the SkinPAI community.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Station Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="stationName">Station Name *</Label>
                  <div className="relative">
                    <Input
                      id="stationName"
                      placeholder="e.g., Sarah's Skincare Studio"
                      value={stationName}
                      onChange={(e) => setStationName(e.target.value)}
                      maxLength={50}
                      className="mt-1"
                    />
                    {stationName.length >= 3 && (
                      <Check className="w-5 h-5 text-green-500 absolute right-3 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stationName.length < 3 
                      ? 'This is your station\'s public name (minimum 3 characters)'
                      : '✓ Great name!'}
                  </p>
                </div>

                <div>
                  <Label htmlFor="username">Username *</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-muted-foreground">@</span>
                    <Input
                      id="username"
                      placeholder="sarahskincare"
                      value={stationUsername}
                      onChange={(e) => setStationUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      className="flex-1"
                    />
                    {stationUsername.length >= 3 && (
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stationUsername.length < 3 
                      ? 'Username must be at least 3 characters (letters, numbers, underscore only)'
                      : '✓ Username looks good!'}
                  </p>
                </div>

                <div>
                  <Label htmlFor="bio">Short Bio *</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell your community about yourself in one sentence..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={150}
                    rows={2}
                    className="mt-1"
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-muted-foreground">
                      {bio.length < 10 
                        ? `At least ${10 - bio.length} more characters needed`
                        : '✓ Bio looks good!'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {bio.length}/150
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Full Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Share more about your expertise, journey, and what followers can expect..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="e.g., Los Angeles, CA"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="border-accent-foreground/20 bg-accent-foreground/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <Target className="w-5 h-5 text-accent-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium mb-2 text-sm">Pro Tips:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Choose a memorable station name that reflects your niche</li>
                      <li>• Keep your bio concise and highlight what makes you unique</li>
                      <li>• Your username cannot be changed later, choose wisely!</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Visual Identity */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <Card>
              <CardHeader>
                <CardTitle>Visual Identity</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Make your station stand out with great visuals
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Cover Image */}
                <div>
                  <Label>Cover Image *</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Recommended: 800x300px, max 5MB
                  </p>
                  {coverImage ? (
                    <div className="relative">
                      <ImageWithFallback
                        src={coverImage}
                        alt="Cover"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute top-2 right-2"
                        onClick={() => handleImageUpload('cover')}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Change
                      </Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleImageUpload('cover')}
                      className="w-full h-40 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      <span className="text-sm font-medium">Upload Cover Image</span>
                      <span className="text-xs text-muted-foreground">Click to browse</span>
                    </button>
                  )}
                </div>

                {/* Profile Image */}
                <div>
                  <Label>Profile Picture *</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Recommended: 400x400px, max 2MB
                  </p>
                  <div className="flex items-center gap-4">
                    {avatarImage ? (
                      <div className="relative">
                        <ImageWithFallback
                          src={avatarImage}
                          alt="Avatar"
                          className="w-24 h-24 rounded-full object-cover border-4 border-background shadow-lg"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full border-2 border-dashed border-border flex items-center justify-center">
                        <Camera className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <Button onClick={() => handleImageUpload('avatar')}>
                      <Upload className="w-4 h-4 mr-2" />
                      {avatarImage ? 'Change Photo' : 'Upload Photo'}
                    </Button>
                  </div>
                </div>

                {/* Preview */}
                {coverImage && avatarImage && (
                  <div className="border-2 border-border rounded-lg overflow-hidden">
                    <p className="text-sm font-medium p-3 bg-secondary/20">Preview</p>
                    <div className="relative">
                      <ImageWithFallback
                        src={coverImage}
                        alt="Preview Cover"
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute -bottom-10 left-4">
                        <ImageWithFallback
                          src={avatarImage}
                          alt="Preview Avatar"
                          className="w-20 h-20 rounded-full object-cover border-4 border-background"
                        />
                      </div>
                    </div>
                    <div className="pt-12 p-4">
                      <h3 className="font-bold text-lg">{stationName || 'Station Name'}</h3>
                      <p className="text-sm text-muted-foreground">@{stationUsername || 'username'}</p>
                      <p className="text-sm mt-2">{bio || 'Your bio will appear here...'}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="border-accent-foreground/20 bg-accent-foreground/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <Camera className="w-5 h-5 text-accent-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium mb-2 text-sm">Image Tips:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Use high-quality, well-lit images</li>
                      <li>• Cover image should represent your station's vibe</li>
                      <li>• Profile picture should clearly show your face</li>
                      <li>• Avoid overly busy or cluttered backgrounds</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Expertise & Focus */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <Card>
              <CardHeader>
                <CardTitle>Your Expertise</CardTitle>
                <p className="text-sm text-muted-foreground">
                  What skincare topics will you focus on?
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Specialties */}
                <div>
                  <Label>Specialties * (Select up to 5)</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {specialties.map((specialty) => (
                      <Badge
                        key={specialty}
                        variant={selectedSpecialties.includes(specialty) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleSpecialty(specialty)}
                      >
                        {selectedSpecialties.includes(specialty) && (
                          <Check className="w-3 h-3 mr-1" />
                        )}
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Selected: {selectedSpecialties.length}/5
                  </p>
                </div>

                {/* Station Theme */}
                <div>
                  <Label>Station Theme *</Label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Choose the primary focus of your content
                  </p>
                  <div className="grid gap-3">
                    {themes.map((theme) => (
                      <div
                        key={theme.id}
                        onClick={() => setSelectedTheme(theme.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedTheme === theme.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{theme.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{theme.name}</h4>
                              {selectedTheme === theme.id && (
                                <Check className="w-4 h-4 text-primary" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{theme.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="border-accent-foreground/20 bg-accent-foreground/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <Star className="w-5 h-5 text-accent-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium mb-2 text-sm">Focus Tips:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Choose specialties you're genuinely passionate about</li>
                      <li>• Your theme will help users find relevant content</li>
                      <li>• You can adjust these later as your station evolves</li>
                      <li>• Niche expertise often builds stronger communities</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Credentials & Commitment */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <Card>
              <CardHeader>
                <CardTitle>Credentials & Experience</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Help your audience trust your expertise
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Certifications */}
                <div>
                  <Label>Certifications & Qualifications *</Label>
                  <div className="space-y-2 mt-2">
                    {certificationOptions.map((cert) => (
                      <div key={cert} className="flex items-center space-x-2">
                        <Checkbox
                          id={cert}
                          checked={certifications.includes(cert)}
                          onCheckedChange={() => toggleCertification(cert)}
                        />
                        <label
                          htmlFor={cert}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {cert}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Textarea
                    id="experience"
                    placeholder="Tell us about your skincare journey and experience..."
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    rows={3}
                    className="mt-1"
                  />
                </div>

                {/* Content Frequency */}
                <div>
                  <Label>Content Posting Frequency *</Label>
                  <p className="text-xs text-muted-foreground mb-3">
                    How often do you plan to post?
                  </p>
                  <div className="grid gap-3">
                    {contentFrequencyOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => setContentFrequency(option.value)}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          contentFrequency === option.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{option.label}</h4>
                            <p className="text-sm text-muted-foreground">{option.desc}</p>
                          </div>
                          {contentFrequency === option.value && (
                            <Check className="w-5 h-5 text-primary" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <Label>Social Media Links (Optional)</Label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Connect your other platforms
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Instagram className="w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Instagram username"
                        value={socialLinks.instagram}
                        onChange={(e) => setSocialLinks({...socialLinks, instagram: e.target.value})}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Youtube className="w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="YouTube channel URL"
                        value={socialLinks.youtube}
                        onChange={(e) => setSocialLinks({...socialLinks, youtube: e.target.value})}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Twitter className="w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Twitter/X username"
                        value={socialLinks.twitter}
                        onChange={(e) => setSocialLinks({...socialLinks, twitter: e.target.value})}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Website URL"
                        value={socialLinks.website}
                        onChange={(e) => setSocialLinks({...socialLinks, website: e.target.value})}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Contact email"
                        type="email"
                        value={socialLinks.email}
                        onChange={(e) => setSocialLinks({...socialLinks, email: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="border-accent-foreground/20 bg-accent-foreground/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <Users className="w-5 h-5 text-accent-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium mb-2 text-sm">Building Trust:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Transparency builds credibility with your audience</li>
                      <li>• Posting consistently helps grow your following</li>
                      <li>• Connect social media to expand your reach</li>
                      <li>• Verified credentials increase follower confidence</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 5: Review & Launch */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Almost there! 🎉</h3>
                    <p className="text-sm text-muted-foreground">
                      Review your station details and agree to our creator guidelines to launch.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Station Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Station Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-border rounded-lg overflow-hidden">
                  <div className="relative">
                    <ImageWithFallback
                      src={coverImage}
                      alt="Cover"
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute -bottom-10 left-4">
                      <ImageWithFallback
                        src={avatarImage}
                        alt="Avatar"
                        className="w-20 h-20 rounded-full object-cover border-4 border-background"
                      />
                    </div>
                  </div>
                  <div className="pt-12 p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-lg">{stationName}</h3>
                      <p className="text-sm text-muted-foreground">@{stationUsername}</p>
                    </div>
                    <p className="text-sm">{bio}</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedSpecialties.slice(0, 3).map((spec, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                      {selectedSpecialties.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{selectedSpecialties.length - 3} more
                        </Badge>
                      )}
                    </div>
                    {location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {location}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Station Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-secondary/20 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Theme</div>
                    <div className="font-medium text-sm">
                      {themes.find(t => t.id === selectedTheme)?.icon} {themes.find(t => t.id === selectedTheme)?.name}
                    </div>
                  </div>
                  <div className="p-3 bg-secondary/20 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Specialties</div>
                    <div className="font-medium text-sm">{selectedSpecialties.length} selected</div>
                  </div>
                  <div className="p-3 bg-secondary/20 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Post Frequency</div>
                    <div className="font-medium text-sm">
                      {contentFrequencyOptions.find(o => o.value === contentFrequency)?.label}
                    </div>
                  </div>
                  <div className="p-3 bg-secondary/20 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Credentials</div>
                    <div className="font-medium text-sm">{certifications.length} selected</div>
                  </div>
                </div>
                {Object.values(socialLinks).some(link => link.trim()) && (
                  <div className="p-3 bg-secondary/20 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-2">Connected Platforms</div>
                    <div className="flex gap-2">
                      {socialLinks.instagram && <Instagram className="w-4 h-4" />}
                      {socialLinks.youtube && <Youtube className="w-4 h-4" />}
                      {socialLinks.twitter && <Twitter className="w-4 h-4" />}
                      {socialLinks.website && <Globe className="w-4 h-4" />}
                      {socialLinks.email && <Mail className="w-4 h-4" />}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Terms */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                    I agree to the SkinPAI Creator Terms & Conditions, including community guidelines and content policies. *
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="verify"
                    checked={verifyInfo}
                    onCheckedChange={(checked) => setVerifyInfo(checked as boolean)}
                  />
                  <label htmlFor="verify" className="text-sm leading-relaxed cursor-pointer">
                    I confirm that all information provided is accurate and I have the right to use the uploaded images. *
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  What You'll Get
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Dedicated station page with custom branding</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Analytics dashboard to track your impact</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Priority visibility in community feed</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Ability to join brand campaigns & collaborations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Monetization opportunities through partnerships</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Verified creator badge for credibility</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Access to creator-only features and tools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>Direct messaging with your followers</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="border-green-500/20 bg-green-500/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">After Launching Your Station:</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>1. Create your first post to introduce yourself</li>
                      <li>2. Join relevant brand campaigns to grow your audience</li>
                      <li>3. Engage with other creators and build connections</li>
                      <li>4. Post consistently to build your following</li>
                      <li>5. Monitor your analytics to understand your audience</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Floating Side Navigation Arrows (Desktop) */}
      {currentStep > 1 && (
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevious}
          className="hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full shadow-lg border-2 hover:scale-110 transition-transform"
          title={`Go back to ${steps[currentStep - 2].title}`}
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
      )}
      
      {currentStep < totalSteps && isStepCompleted(currentStep) && (
        <Button
          size="icon"
          onClick={handleNext}
          className="hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full shadow-lg hover:scale-110 transition-transform"
          title={`Continue to ${steps[currentStep].title}`}
        >
          <ArrowRight className="w-6 h-6" />
        </Button>
      )}

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t-2 border-border p-4 shadow-2xl z-30">
        <div className="max-w-2xl mx-auto">
          <div className="space-y-3">
            {/* Current step name for mobile */}
            <div className="text-center mb-1 sm:hidden">
              <p className="text-sm font-medium">
                {steps[currentStep - 1].title}
              </p>
              <p className="text-xs text-muted-foreground">
                {steps[currentStep - 1].description}
              </p>
            </div>

            <div className="flex gap-3">
              {currentStep > 1 ? (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="flex-1 h-12 border-2"
                  size="lg"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-muted-foreground">Back to</span>
                    <span className="font-medium">{steps[currentStep - 2].title}</span>
                  </div>
                </Button>
              ) : (
                <div className="flex-1" />
              )}
              
              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={!isStepCompleted(currentStep)}
                  className="flex-1 h-12 shadow-md"
                  size="lg"
                >
                  <div className="flex flex-col items-start mr-2">
                    <span className="text-xs opacity-90">
                      {isStepCompleted(currentStep) ? 'Continue to' : 'Complete this step'}
                    </span>
                    <span className="font-medium">
                      {isStepCompleted(currentStep) ? steps[currentStep].title : 'to proceed'}
                    </span>
                  </div>
                  <ArrowRight className="w-5 h-5 ml-auto" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepCompleted(5)}
                  className="flex-1 h-12 bg-green-600 hover:bg-green-700 shadow-lg"
                  size="lg"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs opacity-90">Ready to</span>
                    <span className="font-medium">Launch Your Station</span>
                  </div>
                </Button>
              )}
            </div>
            
            {/* Progress indicator and helper text */}
            <div className="flex items-center justify-between gap-3 px-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {isStepCompleted(currentStep) && currentStep < totalSteps && (
                  <span className="flex items-center gap-1 text-green-600">
                    <Check className="w-3 h-3" />
                    Ready
                  </span>
                )}
                {!isStepCompleted(currentStep) && (
                  <span className="text-accent-foreground">
                    Complete required fields
                  </span>
                )}
              </div>
              
              <div className="text-xs text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </div>
            </div>

            {isStepCompleted(currentStep) && (
              <p className="text-xs text-center text-muted-foreground pb-1">
                💡 Press <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px]">Enter</kbd> to {currentStep < totalSteps ? 'continue' : 'launch'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}