import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { jobsApi } from '../services/api/jobs';
import { Opportunity, OpportunityFilters, OpportunityList, OpportunityQueryParams } from '../types';

export const useJobs = (
  params: OpportunityQueryParams = {}
): UseQueryResult<OpportunityList> => {
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

// Backs the filter UI's option lists/counts (source, country, opportunity
// type, sector) -- see OpportunityFilters. Changes slowly relative to the
// opportunity list itself, so it gets a longer staleTime.
export const useFilters = (): UseQueryResult<OpportunityFilters> => {
  return useQuery({
    queryKey: ['filters'],
    queryFn: () => jobsApi.getFilters(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
