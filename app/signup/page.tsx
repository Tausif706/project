// app/signup/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LightBulbIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ChevronLeftIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { signUp } from '@/lib/supabase';

export default function Signup() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    expertise: '',
    skills: [],
    ideaDescription: '',
    experience: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  const roles = [
    {
      id: 'pitcher',
      title: 'Idea Pitcher',
      icon: LightBulbIcon,
      description: 'You have an idea and need help to execute it',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'collaborator',
      title: 'Collaborator',
      icon: UserGroupIcon,
      description: 'You want to join projects and contribute your skills',
      color: 'bg-indigo-100 text-indigo-700'
    },
    {
      id: 'professional',
      title: 'Expert/Guide',
      icon: AcademicCapIcon,
      description: 'You provide mentorship and professional guidance',
      color: 'bg-blue-100 text-blue-700'
    }
  ];

  const validateStep1 = () => {
    if (!selectedRole) {
      setErrors({ role: 'Please select a role' });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.name) newErrors.name = 'Name is required';
    
    if (selectedRole === 'pitcher' && !formData.ideaDescription) {
      newErrors.ideaDescription = 'Idea description is required';
    }
    
    if (selectedRole === 'collaborator' && formData.skills.length === 0) {
      newErrors.skills = 'Please select at least one skill';
    }
    
    if (selectedRole === 'professional' && !formData.expertise) {
      newErrors.expertise = 'Expertise field is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsSubmitting(true);
    setAuthError('');

    try {
      await signUp(formData.email, formData.password, {
        name: formData.name,
        role: selectedRole,
        skills: formData.skills,
        expertise: formData.expertise,
      });

      // Redirect to the appropriate dashboard based on role
      router.push(`/dashboard/${selectedRole}`);
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-indigo-700">
      <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
      <div className="relative py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600">IdeaCraft</h1>
            <p className="text-gray-600 mt-2">Join our community of innovators and collaborators</p>
          </div>
          
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2].map((num) => (
                <div key={num} className="flex items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center 
                    ${step >= num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {num}
                  </div>
                  {num < 2 && <div className={`h-1 w-16 ${step > 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>}
                </div>
              ))}
            </div>
            <p className="text-center mt-4 text-gray-600">
              Step {step} of 2 - {step === 1 ? 'Select Role' : 'Complete Profile'}
            </p>
          </div>

          {authError && (
            <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-lg">
              {authError}
            </div>
          )}

          {step === 1 ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center text-gray-900">
                Join as...
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => {
                      setSelectedRole(role.id);
                      setErrors({});
                    }}
                    className={`p-6 text-left rounded-xl border-2 transition-all hover:shadow-lg
                      ${selectedRole === role.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}
                      ${errors.role ? 'border-red-500' : ''}`}
                  >
                    <role.icon className={`h-8 w-8 mb-4 ${role.color}`} />
                    <h3 className="text-lg font-semibold mb-2">{role.title}</h3>
                    <p className="text-gray-600 text-sm">{role.description}</p>
                  </button>
                ))}
              </div>
              {errors.role && (
                <p className="text-red-500 text-sm mt-2">{errors.role}</p>
              )}
              <button
                onClick={() => validateStep1() && setStep(2)}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Continue
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-blue-600 hover:text-blue-700 flex items-center"
              >
                <ChevronLeftIcon className="h-5 w-5 mr-1" />
                Back to role selection
              </button>

              <div className="space-y-4">
                {/* Common Fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Role-Specific Fields */}
                {selectedRole === 'pitcher' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Idea Description
                    </label>
                    <textarea
                      value={formData.ideaDescription}
                      onChange={(e) => setFormData({ ...formData, ideaDescription: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.ideaDescription ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-blue-500 focus:border-blue-500`}
                      rows="4"
                      placeholder="Describe your idea (at least 100 characters)"
                    />
                    {errors.ideaDescription && (
                      <p className="text-red-500 text-sm mt-1">{errors.ideaDescription}</p>
                    )}
                  </div>
                )}

                {selectedRole === 'collaborator' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Skills
                    </label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {['Development', 'Design', 'Marketing', 'Finance', 'Writing', 'Research'].map((skill) => (
                        <button
                          type="button"
                          key={skill}
                          onClick={() => {
                            const newSkills = formData.skills.includes(skill)
                              ? formData.skills.filter(s => s !== skill)
                              : [...formData.skills, skill];
                            setFormData({ ...formData, skills: newSkills });
                          }}
                          className={`py-2 px-3 rounded-full text-sm ${
                            formData.skills.includes(skill)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                    {errors.skills && (
                      <p className="text-red-500 text-sm mt-1">{errors.skills}</p>
                    )}
                  </div>
                )}

                {selectedRole === 'professional' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Area of Expertise
                    </label>
                    <input
                      type="text"
                      value={formData.expertise}
                      onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.expertise ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="e.g., Venture Capital, Software Architecture, Product Management"
                    />
                    {errors.expertise && (
                      <p className="text-red-500 text-sm mt-1">{errors.expertise}</p>
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl disabled:bg-blue-400"
              >
                {isSubmitting ? 'Creating Account...' : 'Complete Sign Up'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}