import { Opportunity, OpportunityFilters, OpportunityList, OpportunityQueryParams } from '../../types';
import apiClient from './client';

export const jobsApi = {
  // The backend enforces open-only and does the actual filtering/sorting --
  // this just forwards whatever params the caller sets, unchanged, so
  // there's exactly one place (the API) that decides what "open" and
  // "matches these filters" mean.
  async getJobs(params: OpportunityQueryParams = {}): Promise<OpportunityList> {
    const response = await apiClient.get<Opportunity[]>('/api/opportunities/', { params });
    const totalHeader = response.headers['x-total-count'];
    return {
      items: response.data,
      total: totalHeader ? parseInt(totalHeader, 10) : response.data.length,
    };
  },

  async getJobById(id: number): Promise<Opportunity> {
    const response = await apiClient.get<Opportunity>(`/api/opportunities/${id}`);
    return response.data;
  },

  // Distinct filter values + counts across currently-open opportunities --
  // drives the filter UI so it never offers a source/country/type/sector
  // that has nothing open behind it, and never goes stale against a
  // hardcoded list.
  async getFilters(): Promise<OpportunityFilters> {
    const response = await apiClient.get<OpportunityFilters>('/api/opportunities/filters');
    return response.data;
  },

  async searchJobs(query: string): Promise<OpportunityList> {
    return this.getJobs({ search: query, limit: 50 });
  },
};
