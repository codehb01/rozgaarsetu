'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { useTranslationComparison } from '@/hooks/use-translation-comparison';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/input';

// Mock data for demonstration
const mockReviews = [
  {
    id: 'review-1',
    text: 'Excellent work! Very professional and completed the job on time.',
    customerName: 'Rajesh Kumar',
    rating: 5,
  },
  {
    id: 'review-2', 
    text: 'Good plumber, fixed the pipe leak quickly. Reasonable pricing.',
    customerName: 'Priya Sharma',
    rating: 4,
  }
];

const mockJob = {
  id: 'job-1',
  title: 'Kitchen Sink Repair',
  description: 'Need to fix leaking kitchen sink and replace the faucet. The water is dripping constantly and creating puddles.',
  location: 'Mumbai, Maharashtra',
  charge: 800,
};

const mockWorker = {
  id: 'worker-1',
  name: 'Amit Patel',
  bio: 'I am an experienced plumber with 8 years of expertise in residential and commercial plumbing. Specialized in pipe repairs, installation of new fixtures, and emergency plumbing services.',
  skills: ['Plumber', 'Pipe Fitting', 'Bathroom Renovation'],
};

// Component for performance comparison display
function PerformanceComparisonCard({ 
  text, 
  contentId, 
  contentType, 
  googleApiKey 
}: { 
  text: string; 
  contentId: string; 
  contentType: 'review' | 'job' | 'bio';
  googleApiKey?: string; // Make optional since we have env variable
}) {
  const { comparison, isLoading, error } = useTranslationComparison(text, contentId, googleApiKey || '', contentType);

  if (isLoading) {
    return (
      <Card className="p-4 border-blue-200 bg-blue-50">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="text-sm text-blue-700">Comparing Azure vs Google translation speeds...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 border-red-200 bg-red-50">
        <div className="text-center text-red-700">
          <p className="text-sm">❌ Comparison failed: {error}</p>
        </div>
      </Card>
    );
  }

  if (!comparison) {
    return null;
  }

  const { azure, google, winner, speedDifference } = comparison;
  
  return (
    <Card className="p-4 border-purple-200 bg-purple-50">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-purple-800">🏁 Performance Comparison</h4>
          <Badge variant={winner === 'azure' ? 'default' : 'secondary'} className="text-xs">
            🏆 {winner.toUpperCase()} wins by {speedDifference.toFixed(1)}%
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-3 rounded-lg ${winner === 'azure' ? 'bg-green-100 border-green-300' : 'bg-gray-100'}`}>
            <div className="text-sm font-medium text-gray-700">
              🔷 Azure Translation
            </div>
            <div className="text-xs text-gray-600 mt-1">
              ⚡ {azure.duration}ms {azure.fromCache ? '(cached)' : '(fresh)'}
            </div>
            {azure.error && (
              <div className="text-xs text-red-500 mt-1">❌ {azure.error}</div>
            )}
          </div>
          
          <div className={`p-3 rounded-lg ${winner === 'google' ? 'bg-green-100 border-green-300' : 'bg-gray-100'}`}>
            <div className="text-sm font-medium text-gray-700">
              🔸 Google Translate
            </div>
            <div className="text-xs text-gray-600 mt-1">
              ⚡ {google.duration}ms {google.fromCache ? '(cached)' : '(fresh)'}
            </div>
            {google.error && (
              <div className="text-xs text-red-500 mt-1">❌ {google.error}</div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <strong>Azure Result:</strong>
            <p className="text-gray-600 mt-1">{azure.translatedText}</p>
          </div>
          <div>
            <strong>Google Result:</strong>
            <p className="text-gray-600 mt-1">{google.translatedText}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Component demonstrating review translation with performance comparison
function ReviewComparisonCard({ review, googleApiKey }: { review: typeof mockReviews[0]; googleApiKey?: string }) {
  return (
    <div className="space-y-3">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">{review.customerName}</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < review.rating ? "text-yellow-500" : "text-gray-300"}>
                ⭐
              </span>
            ))}
          </div>
        </div>
        <p className="text-gray-700 mb-2">{review.text}</p>
        <Badge variant="outline" className="text-xs">
          Original Review
        </Badge>
      </Card>
      
      <PerformanceComparisonCard 
        text={review.text}
        contentId={review.id}
        contentType="review"
        googleApiKey={googleApiKey}
      />
    </div>
  );
}

// Component demonstrating job translation with performance comparison
function JobComparisonCard({ job, googleApiKey }: { job: typeof mockJob; googleApiKey?: string }) {
  return (
    <div className="space-y-3">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">{job.title}</h3>
          <Badge variant="default">₹{job.charge}</Badge>
        </div>
        <p className="text-gray-700 mb-3">{job.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">📍 {job.location}</span>
          <Badge variant="outline" className="text-xs">
            Original Job Description
          </Badge>
        </div>
      </Card>
      
      <PerformanceComparisonCard 
        text={job.description}
        contentId={job.id}
        contentType="job"
        googleApiKey={googleApiKey}
      />
    </div>
  );
}

// Component demonstrating worker bio translation with performance comparison
function WorkerComparisonCard({ worker, googleApiKey }: { worker: typeof mockWorker; googleApiKey?: string }) {
  return (
    <div className="space-y-3">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">{worker.name}</h3>
          <Badge variant="default">Verified</Badge>
        </div>
        <div className="mb-3">
          <p className="text-gray-700">{worker.bio}</p>
        </div>
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-600 mb-1">Skills:</h4>
          <div className="flex flex-wrap gap-2">
            {worker.skills.map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          Original Worker Bio
        </Badge>
      </Card>
      
      <PerformanceComparisonCard 
        text={worker.bio}
        contentId={worker.id}
        contentType="bio"
        googleApiKey={googleApiKey}
      />
    </div>
  );
}

// Main enhanced demo component
export default function EnhancedHybridTranslationDemo() {
  const { t, language } = useLanguage();
  const [googleApiKey, setGoogleApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light text-gray-900 dark:text-white mb-4">
            ⚡ Translation Speed Comparison
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6">
            Compare Azure Translator vs Google Translate performance side-by-side with real-time speed measurements
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge variant="default" className="mb-4">
              Current Language: {language.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="mb-4 bg-green-50 text-green-700">
              ✅ Google API Key Configured
            </Badge>
            <Button 
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              variant="outline"
              size="sm"
              className="mb-4"
            >
              {showApiKeyInput ? 'Hide' : 'Override'} API Key
            </Button>
          </div>
          
          {showApiKeyInput && (
            <Card className="max-w-md mx-auto p-4 mb-8">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Override Google API Key:</label>
                <Input
                  type="password"
                  value={googleApiKey}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGoogleApiKey(e.target.value)}
                  placeholder="Leave empty to use environment variable"
                  className="text-xs"
                />
                <p className="text-xs text-gray-500">
                  API key is configured in environment. Override only if needed for testing.
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Comparison Legend */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              🔷 Azure Translator
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Microsoft's translation service</li>
              <li>• Optimized for enterprise use</li>
              <li>• Database caching enabled</li>
              <li>• Regional deployment</li>
            </ul>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              🔸 Google Translate
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Google's translation service</li>
              <li>• High accuracy and speed</li>
              <li>• Global infrastructure</li>
              <li>• Neural machine translation</li>
            </ul>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              🏁 Performance Metrics
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Response time measurement</li>
              <li>• Cache hit detection</li>
              <li>• Error handling comparison</li>
              <li>• Translation quality assessment</li>
            </ul>
          </Card>
        </div>

        {/* Demo Sections */}
        <div className="space-y-12">
          {/* Reviews Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <span className="mr-2">⭐</span>
              Customer Review Translation Comparison
            </h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {mockReviews.map((review) => (
                <ReviewComparisonCard 
                  key={review.id} 
                  review={review} 
                  googleApiKey={googleApiKey}
                />
              ))}
            </div>
          </div>

          {/* Job Description Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <span className="mr-2">💼</span>
              Job Description Translation Comparison
            </h2>
            <div className="max-w-4xl mx-auto">
              <JobComparisonCard job={mockJob} googleApiKey={googleApiKey} />
            </div>
          </div>

          {/* Worker Bio Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <span className="mr-2">👤</span>
              Worker Bio Translation Comparison
            </h2>
            <div className="max-w-4xl mx-auto">
              <WorkerComparisonCard worker={mockWorker} googleApiKey={googleApiKey} />
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <Card className="p-6 mt-12 border-yellow-200 bg-yellow-50">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2 text-yellow-800">📊 Performance Analysis</h3>
            <p className="text-sm text-yellow-700">
              Translation speeds may vary based on network conditions, server load, and cache status. 
              First-time translations are typically slower than cached results.
              Switch to different languages to see fresh comparisons without cache.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}