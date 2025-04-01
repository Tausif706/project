// components/ProfileSection.tsx
'use client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

interface ProfileData {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: 'pitcher' | 'professional' | 'collaborator';
  expertise?: string;
  projects_completed?: number;
  rating?: number;
}

export default function ProfileSection() {
  const { user } = useSupabaseAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Base user data
        const baseProfile = {
          id: user.id,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          avatar_url: user.user_metadata?.avatar_url,
        };

        // Check professional profile
        const { data: professionalData } = await supabase
          .from('professional_profiles')
          .select('expertise, projects_completed, rating')
          .eq('id', user.id)
          .single();

        if (professionalData) {
          setProfile({
            ...baseProfile,
            ...professionalData,
            role: 'professional'
          });
          return;
        }

        // Check collaborator status
        const { count: collaboratorCount } = await supabase
          .from('collaborator_requests')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'accepted');

        if (collaboratorCount && collaboratorCount > 0) {
          setProfile({
            ...baseProfile,
            role: 'collaborator'
          });
          return;
        }

        // Default to pitcher
        setProfile({
          ...baseProfile,
          role: 'pitcher'
        });

      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading || !profile) {
    return (
      <div className="p-4 animate-pulse">
        <div className="h-12 w-12 rounded-full bg-gray-200 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-gray-200 mt-auto">
      <div className="flex items-center space-x-3 mb-2">
        <div className="relative">
          <img 
            src={profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random`}
            alt={profile.name}
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
            profile.role === 'professional' ? 'bg-blue-500' : 
            profile.role === 'collaborator' ? 'bg-green-500' : 'bg-purple-500'
          }`}></span>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{profile.name}</h3>
          <p className="text-xs text-gray-500">{profile.email}</p>
        </div>
      </div>

      {profile.role === 'professional' && (
        <div className="mt-2 text-sm">
          <div className="flex items-center text-gray-700">
            <span className="font-medium mr-1">Expertise:</span>
            <span>{profile.expertise}</span>
          </div>
          <div className="flex items-center mt-1">
            <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-gray-700">{profile.rating?.toFixed(1) || 'New'}</span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-700">{profile.projects_completed || 0} projects</span>
          </div>
        </div>
      )}

      {profile.role === 'collaborator' && (
        <div className="mt-2 text-sm text-gray-700">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Collaborator
          </span>
        </div>
      )}

      {profile.role === 'pitcher' && (
        <div className="mt-2 text-sm text-gray-700">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Project Owner
          </span>
        </div>
      )}
    </div>
  );
}

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}