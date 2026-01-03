// src/services/api/jobs.ts

import { JobsQueryParams, Opportunity, PaginatedResponse } from '../../types';
import { API_CONFIG } from '../../utils/constants';
import apiClient from './client';
import { mockApi } from './mock';

export const jobsApi = {
  async getJobs(params: JobsQueryParams = {}): Promise<PaginatedResponse<Opportunity>> {
    if (API_CONFIG.MOCK_MODE) {
      return mockApi.getJobs(params);
    }

    const response = await apiClient.get<PaginatedResponse<Opportunity>>('/opportunities', { params });
    return response.data;
  },

  async getJobById(id: number): Promise<Opportunity> {
    if (API_CONFIG.MOCK_MODE) {
      const job = await mockApi.getJobById(id);
      if (!job) throw new Error('Job not found');
      return job;
    }

    const response = await apiClient.get<Opportunity>(`/jobs/${id}`);
    return response.data;
  },

  async getCriticalJobs(): Promise<PaginatedResponse<Opportunity>> {
    return this.getJobs({
      status: 'Critical',
      sort_by: 'deadline_asc',
      limit: 20,
    });
  },

  async searchJobs(query: string): Promise<PaginatedResponse<Opportunity>> {
    return this.getJobs({
      search: query,
      limit: 20,
    });
  },
};