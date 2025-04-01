'use client';
import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, AcademicCapIcon, StarIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabase';

interface Professional {
  id: string;
  name: string;
  expertise: string;
  rating: number;
  projects_completed: number;
  hourly_rate: number;
  availability: string;
  skills: string[];
}

interface FindProfessionalTabProps {
  currentProjectId: string | null;
  handleRequestProfessional: (professionalId: string) => Promise<void>;
}

export default function FindProfessionalTab({
  currentProjectId,
  handleRequestProfessional
}: FindProfessionalTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestedProfessionals, setRequestedProfessionals] = useState<string[]>([]);

  // Fetch professionals and existing requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch professionals
        const { data: professionalData, error: profError } = await supabase
          .from('professional_profiles')
          .select(`
            id,
            expertise,
            hourly_rate,
            availability,
            projects_completed,
            rating,
            skills,
            user:users(name)
          `);

        if (profError) throw profError;

        // If there's a current project, fetch existing requests
        if (currentProjectId) {
          const { data: requestData, error: reqError } = await supabase
            .from('professional_requests')
            .select('professional_id')
            .eq('project_id', currentProjectId);

          if (reqError) throw reqError;

          setRequestedProfessionals(requestData?.map(r => r.professional_id) || []);
        }

        // Transform data to match Professional interface
        const formattedProfessionals = professionalData?.map(profile => ({
          id: profile.id,
          name: profile.user?.name || 'Unknown Professional',
          expertise: profile.expertise,
          rating: profile.rating,
          projects_completed: profile.projects_completed,
          hourly_rate: profile.hourly_rate,
          availability: profile.availability,
          skills: profile.skills || []
        })) || [];

        setProfessionals(formattedProfessionals);
      } catch (err) {
        console.error('Error fetching professionals:', err);
        setError('Failed to load professionals. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentProjectId]);

  // Filter professionals based on search criteria
  const filteredProfessionals = professionals.filter(professional => {
    const matchesSearch = professional.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         professional.expertise.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesExpertise = selectedExpertise.length === 0 || selectedExpertise.includes(professional.expertise);
    const matchesPrice = professional.hourly_rate >= priceRange[0] && professional.hourly_rate <= priceRange[1];
    return matchesSearch && matchesExpertise && matchesPrice;
  });

  // Get unique expertise categories
  const expertiseCategories = Array.from(
    new Set(professionals.map(p => p.expertise))
  ).filter(Boolean);

  const handleRequest = async (professionalId: string) => {
    try {
      setError(null);
      await handleRequestProfessional(professionalId);
      setRequestedProfessionals(prev => [...prev, professionalId]);
    } catch (err) {
      console.error('Error requesting professional:', err);
      setError('Failed to send request. Please try again.');
    }
  };

  return (
    <div className="p-4">
      <div className="mb-8">
        <h2 className="text-xl text-blue-500 font-semibold mb-4">Find a Professional</h2>
        
        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or expertise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {expertiseCategories.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {expertiseCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedExpertise(prev =>
                        prev.includes(category)
                          ? prev.filter(c => c !== category)
                          : [...prev, category]
                      );
                    }}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedExpertise.includes(category)
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Hourly Rate Range</h3>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="500"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
              <span className="text-sm text-gray-600">
                Up to ${priceRange[1]}/hr
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Professionals List */}
      {!loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProfessionals.map(professional => (
              <div
                key={professional.id}
                className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{professional.name}</h3>
                    <p className="text-blue-600 font-medium">{professional.expertise}</p>
                    
                    <div className="flex items-center mt-2">
                      <StarIcon className="h-5 w-5 text-yellow-400" />
                      <span className="ml-1 text-gray-700">{professional.rating}</span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-gray-700">{professional.projects_completed} projects</span>
                    </div>

                    <div className="mt-3">
                      <div className="flex flex-wrap gap-2">
                        {professional.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">${professional.hourly_rate}/hr</p>
                    <p className="text-sm text-green-600 mt-1">{professional.availability}</p>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleRequest(professional.id)}
                    disabled={!currentProjectId || requestedProfessionals.includes(professional.id)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      !currentProjectId
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : requestedProfessionals.includes(professional.id)
                        ? 'bg-green-100 text-green-700 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800'
                    }`}
                  >
                    {requestedProfessionals.includes(professional.id)
                      ? 'Request Sent'
                      : 'Request Guidance'
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProfessionals.length === 0 && !loading && (
            <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
              <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No professionals found matching your criteria</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}