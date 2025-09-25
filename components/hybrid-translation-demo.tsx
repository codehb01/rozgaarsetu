'use client';

import React from 'react';
import { useLanguage } from '@/contexts/language-context';
import { useReviewTranslation, useBioTranslation, useJobTranslation } from '@/hooks/use-dynamic-translation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

// Component demonstrating review translation
function ReviewCard({ review }: { review: typeof mockReviews[0] }) {
  const { translatedText, isLoading, error } = useReviewTranslation(review.text, review.id);

  return (
    <Card className="p-4 mb-3">
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
      <div className="text-gray-700">
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-500">Translating...</span>
          </div>
        ) : (
          <>
            <p>{translatedText}</p>
            {error && (
              <p className="text-xs text-red-500 mt-1">Translation error: {error}</p>
            )}
          </>
        )}
      </div>
      <Badge variant="secondary" className="mt-2 text-xs">
        🤖 Azure AI Translation {isLoading ? '(Loading...)' : error ? '(Error - Showing Original)' : '(Cached)'}
      </Badge>
    </Card>
  );
}

// Component demonstrating job translation  
function JobCard({ job }: { job: typeof mockJob }) {
  const { translatedText: translatedDescription, isLoading: isDescriptionLoading, error: descriptionError } = useJobTranslation(job.description, job.id);
  const { t } = useLanguage(); // Static JSON translations for UI elements

  return (
    <Card className="p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{job.title}</h3>
        <Badge variant="default">₹{job.charge}</Badge>
      </div>
      
      <div className="mb-3">
        <h4 className="text-sm font-medium text-gray-600 mb-1">
          {t('jobDescription') || 'Job Description'}: {/* 📄 JSON Translation */}
        </h4>
        {isDescriptionLoading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-500">Translating description...</span>
          </div>
        ) : (
          <>
            <p className="text-gray-700">{translatedDescription}</p>
            {descriptionError && (
              <p className="text-xs text-red-500 mt-1">Translation error: {descriptionError}</p>
            )}
          </>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          📍 {job.location}
        </span>
        <div className="flex space-x-2">
          <Badge variant="outline" className="text-xs">
            📄 JSON: {t('location') || 'UI Elements'}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            🤖 Azure: {isDescriptionLoading ? 'Loading...' : descriptionError ? 'Error - Original' : 'Cached'}
          </Badge>
        </div>
      </div>
    </Card>
  );
}

// Component demonstrating worker bio translation
function WorkerCard({ worker }: { worker: typeof mockWorker }) {
  const { translatedText: translatedBio, isLoading: isBioLoading, error: bioError } = useBioTranslation(worker.bio, worker.id);
  const { t } = useLanguage(); // Static JSON translations for UI elements

  return (
    <Card className="p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{worker.name}</h3>
        <Badge variant="default">
          {t('verified') || 'Verified'}  {/* 📄 JSON Translation */}
        </Badge>
      </div>
      
      <div className="mb-3">
        <h4 className="text-sm font-medium text-gray-600 mb-1">
          {t('about') || 'About'}: {/* 📄 JSON Translation */}
        </h4>
        {isBioLoading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-500">Translating bio...</span>
          </div>
        ) : (
          <>
            <p className="text-gray-700">{translatedBio}</p>
            {bioError && (
              <p className="text-xs text-red-500 mt-1">Translation error: {bioError}</p>
            )}
          </>
        )}
      </div>
      
      <div className="mb-3">
        <h4 className="text-sm font-medium text-gray-600 mb-1">
          {t('skills') || 'Skills'}: {/* 📄 JSON Translation */}
        </h4>
        <div className="flex flex-wrap gap-2">
          {worker.skills.map((skill, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between">
        <Badge variant="outline" className="text-xs">
          📄 JSON: UI Labels
        </Badge>
        <Badge variant="secondary" className="text-xs">
          🤖 Azure: {isBioLoading ? 'Loading...' : bioError ? 'Error - Original' : 'Cached'}
        </Badge>
      </div>
    </Card>
  );
}

// Main demo component
export default function HybridTranslationDemo() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      <div className="container mx-auto px-6 py-20">
        {/* Header - Static JSON Translation */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light text-gray-900 dark:text-white mb-4">
            {t('hybridTranslationDemo') || 'Hybrid Translation System Demo'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6">
            {t('hybridDemoDescription') || 'Experience our intelligent translation system: JSON for UI elements, Azure AI for dynamic content with database caching'}
          </p>
          <Badge variant="default" className="mb-8">
            Current Language: {language.toUpperCase()}
          </Badge>
        </div>

        {/* Translation Method Legend */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              📄 JSON Translation
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Static UI elements and labels</li>
              <li>• Fast, pre-translated content</li>
              <li>• Perfect for consistent interface text</li>
              <li>• Used in: Headers, buttons, navigation</li>
            </ul>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              🤖 Azure AI Translation
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Dynamic user-generated content</li>
              <li>• Real-time translation with caching</li>
              <li>• Perfect for reviews, jobs, bios</li>
              <li>• Used in: Reviews, descriptions, comments</li>
            </ul>
          </Card>
        </div>

        {/* Demo Sections */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Reviews Section - Azure Translation */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <span className="mr-2">⭐</span>
              {t('customerReviews') || 'Customer Reviews'}
            </h2>
            <div className="space-y-4">
              {mockReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>

          {/* Jobs & Worker Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <span className="mr-2">💼</span>
              {t('jobsAndWorkers') || 'Jobs & Workers'}
            </h2>
            
            <div className="space-y-4">
              <JobCard job={mockJob} />
              <WorkerCard worker={mockWorker} />
            </div>
          </div>
        </div>

        {/* System Status */}
        <Card className="p-6 mt-12">
          <h3 className="text-lg font-semibold mb-4">🔧 System Status</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl text-green-600">✅</div>
              <div className="font-medium">JSON Translation</div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl text-blue-600">🚀</div>
              <div className="font-medium">Azure AI Translation</div>
              <div className="text-sm text-gray-600">With Database Caching</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl text-purple-600">💾</div>
              <div className="font-medium">Smart Caching</div>
              <div className="text-sm text-gray-600">Instant Reloads</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}