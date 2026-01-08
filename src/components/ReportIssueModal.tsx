import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, ChevronRight, ChevronLeft, Camera, AlertTriangle, Lightbulb, Trash2, Zap, HelpCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { useIssues } from '../context/IssueContext';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'category' | 'photo' | 'location' | 'details' | 'success';

const CATEGORIES = [
  { id: 'pothole', label: 'Road Damage', icon: AlertTriangle, color: 'bg-orange-100 text-orange-600' },
  { id: 'streetlight', label: 'Streetlight', icon: Lightbulb, color: 'bg-yellow-100 text-yellow-600' },
  { id: 'garbage', label: 'Garbage', icon: Trash2, color: 'bg-green-100 text-green-600' },
  { id: 'utility', label: 'Utility', icon: Zap, color: 'bg-blue-100 text-blue-600' },
  { id: 'other', label: 'Other', icon: HelpCircle, color: 'bg-gray-100 text-gray-600' },
] as const;

export function ReportIssueModal({ isOpen, onClose }: ReportIssueModalProps) {
  const { addIssue } = useIssues();
  const [currentStep, setCurrentStep] = useState<Step>('category');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: 'pothole' as const,
    image: '',
    imageFile: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (currentStep === 'category') setCurrentStep('photo');
    else if (currentStep === 'photo') setCurrentStep('location');
    else if (currentStep === 'location') setCurrentStep('details');
  };

  const handleBack = () => {
    if (currentStep === 'photo') setCurrentStep('category');
    else if (currentStep === 'location') setCurrentStep('photo');
    else if (currentStep === 'details') setCurrentStep('location');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await addIssue({
      ...formData,
      title: formData.title || `${formData.category.charAt(0).toUpperCase() + formData.category.slice(1)} Issue`,
      image: formData.image || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400'
    });
    
    setIsSubmitting(false);
    setCurrentStep('success');
  };

  const resetAndClose = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      category: 'pothole',
      image: '',
      imageFile: null as File | null,
    });
    setCurrentStep('category');
    onClose();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'category':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-main text-center mb-6">What kind of issue is it?</h3>
            <div className="grid grid-cols-2 gap-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setFormData({ ...formData, category: cat.id as any });
                    handleNext();
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-3 hover:scale-105 ${
                    formData.category === cat.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-transparent bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${cat.color}`}>
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <span className="font-medium text-text-main">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'photo':
        return (
          <div className="space-y-6 text-center">
            <h3 className="text-lg font-semibold text-text-main">Add a Photo</h3>
            <p className="text-text-muted text-sm">A picture helps us locate and fix the issue faster.</p>
            
            <label htmlFor="issue-photo" className="border-2 border-dashed border-primary/30 rounded-3xl p-10 flex flex-col items-center justify-center bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors group">
              <div className="w-16 h-16 bg-white rounded-full shadow-soft flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              <span className="font-semibold text-primary mb-1">Tap to Upload</span>
              <span className="text-xs text-text-muted">or drag and drop here</span>
              <input 
                id="issue-photo" 
                type="file" 
                accept="image/*" 
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file) {
                    setFormData({ 
                      ...formData, 
                      imageFile: file, 
                      image: URL.createObjectURL(file) 
                    });
                  }
                }}
              />
            </label>
            
            {formData.image && (
              <div className="overflow-hidden rounded-2xl border border-gray-200">
                <img src={formData.image} alt="Issue preview" className="w-full h-48 object-cover" />
              </div>
            )}
            
            <Button variant="ghost" onClick={handleNext} className="w-full">
              Skip for now
            </Button>
          </div>
        );

      case 'location':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-text-main">Where is it?</h3>
              <p className="text-text-muted text-sm">Enter the location manually.</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-400">📍</span>
                <input
                  type="text"
                  placeholder="Type address manually..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>
          </div>
        );

      case 'details':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-text-main">Almost done!</h3>
              <p className="text-text-muted text-sm">Add a few details to help the team.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Title (Short & Sweet)</label>
                <input
                  type="text"
                  placeholder="e.g. Deep Pothole"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Any extra details? e.g. 'Near the school entrance'"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8 space-y-6">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-text-main mb-2">Thank You! 🌿</h3>
              <p className="text-text-muted max-w-xs mx-auto">
                Thanks for contributing to a better city. We've received your report and will look into it.
              </p>
            </div>
            <Button size="lg" onClick={resetAndClose} className="w-full">
              Back to Dashboard
            </Button>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
          >
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]">
              {/* Header */}
              {currentStep !== 'success' && (
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                  {currentStep !== 'category' ? (
                    <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <ChevronLeft className="w-5 h-5 text-text-main" />
                    </button>
                  ) : (
                    <div className="w-9" /> 
                  )}
                  <span className="font-semibold text-text-muted text-sm">
                    Step {
                      currentStep === 'category' ? 1 :
                      currentStep === 'photo' ? 2 :
                      currentStep === 'location' ? 3 : 4
                    } of 4
                  </span>
                  <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-5 h-5 text-text-main" />
                  </button>
                </div>
              )}
              
              {/* Content */}
              <div className="p-6 overflow-y-auto custom-scrollbar">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStep()}
                </motion.div>
              </div>

              {/* Footer Actions */}
              {currentStep !== 'category' && currentStep !== 'success' && (
                <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                  <Button 
                    onClick={currentStep === 'details' ? handleSubmit : handleNext}
                    className="w-full"
                    disabled={isSubmitting || (currentStep === 'location' && !formData.location.trim())}
                  >
                    {isSubmitting ? 'Submitting...' : currentStep === 'details' ? 'Submit Report' : 'Continue'}
                    {!isSubmitting && <ChevronRight className="w-4 h-4 ml-1" />}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
