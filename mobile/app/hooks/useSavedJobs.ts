// src/hooks/useSavedJobs.ts

import { useCallback, useEffect, useState } from 'react';
import { storage } from '../services/api/storage';
import { SavedOpportunity } from '../types';

export const useSavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState<SavedOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSavedJobs = useCallback(async () => {
    try {
      const saved = await storage.getSavedJobs();
      setSavedJobs(saved);
    } catch (error) {
      console.error('Error loading saved jobs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSavedJobs();
  }, [loadSavedJobs]);

  const saveJob = async (id: number) => {
    try {
      await storage.saveJob(id);
      await loadSavedJobs();
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  };

  const unsaveJob = async (id: number) => {
    try {
      await storage.unsaveJob(id);
      await loadSavedJobs();
    } catch (error) {
      console.error('Error unsaving job:', error);
      throw error;
    }
  };

  const isJobSaved = (id: number): boolean => {
    return savedJobs.some(job => job.id === id);
  };

  const toggleSave = async (id: number) => {
    if (isJobSaved(id)) {
      await unsaveJob(id);
    } else {
      await saveJob(id);
    }
  };

  return {
    savedJobs,
    loading,
    saveJob,
    unsaveJob,
    isJobSaved,
    toggleSave,
    refresh: loadSavedJobs,
  };
};