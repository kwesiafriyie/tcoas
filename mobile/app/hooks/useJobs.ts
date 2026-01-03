// src/hooks/useJobs.ts

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { jobsApi } from '../services/api/jobs';
import { JobsQueryParams, Opportunity, PaginatedResponse } from '../types';

export const useJobs = (
  params: JobsQueryParams = {}
): UseQueryResult<PaginatedResponse<Opportunity>> => {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: () => jobsApi.getJobs(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useJobById = (id: number): UseQueryResult<Opportunity> => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => jobsApi.getJobById(id),
    enabled: !!id,
  });
};

export const useCriticalJobs = (): UseQueryResult<PaginatedResponse<Opportunity>> => {
  return useQuery({
    queryKey: ['jobs', 'critical'],
    queryFn: () => jobsApi.getCriticalJobs(),
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent for critical)
  });
};