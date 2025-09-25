'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardSection } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/language-context';
import { parseSkills } from '@/lib/json-helpers';
import Link from 'next/link';

interface Worker {
  id: string;
  name: string;
  role: string;
  workerProfile: {
    skilledIn: string; // JSON string format
    city: string;
    availableAreas: string; // JSON string format
    yearsExperience: number | null;
    qualification: string | null;
    profilePic: string | null;
    bio: string | null;
  } | null;
}

export default function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await fetch('/api/workers');
        if (response.ok) {
          const data = await response.json();
          // API returns { count, workers } object, we need just the workers array
          setWorkers(data.workers || []);
        } else {
          console.error('Failed to fetch workers');
        }
      } catch (error) {
        console.error('Error fetching workers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <div className="space-y-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-20" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-light text-gray-900 dark:text-white mb-4">
          Find Workers
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Browse skilled professionals in your area
        </p>
      </div>

      {workers.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No workers found. Check back later!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map((worker) => {
            const skills = parseSkills(worker.workerProfile?.skilledIn as unknown as string);
            const skillsText = skills.length > 0 ? skills.join(', ') : 'General Worker';
            
            return (
              <Card key={worker.id} className="hover:shadow-lg transition-shadow">
                <CardHeader 
                  title={worker.name || 'Unknown Worker'} 
                  subtitle={skillsText}
                />
                <CardSection>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Experience:</span>
                      <span className="font-semibold">{worker.workerProfile?.yearsExperience || 0} years</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Location:</span>
                      <span>{worker.workerProfile?.city || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Qualification:</span>
                      <span className="font-semibold">{worker.workerProfile?.qualification || 'Not specified'}</span>
                    </div>
                    <Link
                      href={`/workers/${worker.id}`}
                      className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-center block"
                    >
                      View Profile
                    </Link>
                  </div>
                </CardSection>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}