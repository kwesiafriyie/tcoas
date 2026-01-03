// // src/services/api/jobs.ts

// import { JobsQueryParams, Opportunity, PaginatedResponse } from '../../types';
// import { API_CONFIG } from '../../utils/constants';
// import apiClient from './client';
// import { mockApi } from './mock.ts.bak';

// export const jobsApi = {
//   async getJobs(params: JobsQueryParams = {}): Promise<PaginatedResponse<Opportunity>> {
//     if (API_CONFIG.MOCK_MODE) {
//       return mockApi.getJobs(params);
//     }

//     const response = await apiClient.get<PaginatedResponse<Opportunity>>('/opportunities', { params });
//     return response.data;
//   },

//   async getJobById(id: number): Promise<Opportunity> {
//     if (API_CONFIG.MOCK_MODE) {
//       const job = await mockApi.getJobById(id);
//       if (!job) throw new Error('Job not found');
//       return job;
//     }

//     const response = await apiClient.get<Opportunity>(`/jobs/${id}`);
//     return response.data;
//   },

//   async getCriticalJobs(): Promise<PaginatedResponse<Opportunity>> {
//     return this.getJobs({
//       status: 'Critical',
//       sort_by: 'deadline_asc',
//       limit: 20,
//     });
//   },

//   async searchJobs(query: string): Promise<PaginatedResponse<Opportunity>> {
//     return this.getJobs({
//       search: query,
//       limit: 20,
//     });
//   },
// };










// src/services/api/jobs.ts

import { JobsQueryParams, Opportunity, PaginatedResponse } from '../../types';
import { API_CONFIG } from '../../utils/constants';
import apiClient from './client';
// Import only if you actually need the backup logic, otherwise you can remove this
// import { mockApi } from './mock.ts.bak'; 

export const jobsApi = {
  async getJobs(params: JobsQueryParams = {}): Promise<PaginatedResponse<Opportunity>> {
    // 1. Check if we are in mock mode (Optional: you can remove this if you're fully on DB now)
    if (API_CONFIG.MOCK_MODE) {
       // Since you renamed it to .bak, this might fail unless you fix the import.
       // For now, let's assume we want to hit the real DB.
    }

    // 2. Fetch raw array from FastAPI. 
    // IMPORTANT: Note the trailing slash '/' to match your backend logs and avoid 307 redirects.
    const response = await apiClient.get<Opportunity[]>('/opportunities/');
    

    // 3. TRANSFORM the raw array into the object format HomeScreen expects
    // This turns [{}, {}] into { items: [{}, {}], total: 2, ... }
    const rawData = response.data;
    
    return {
      items: Array.isArray(rawData) ? rawData : [], // Map the array to 'items'
      total: rawData.length || 0,
      page: 1,
      size: rawData.length || 0,
      pages: 1
    };
  },

  // async getJobById(id: number): Promise<Opportunity> {
  //   // Ensure trailing slash here too
  //   const response = await apiClient.get<Opportunity>(`/opportunities/${id}/`);
  //   return response.data;
  // },

  async getJobById(id: number): Promise<Opportunity> {
    // FIX: Change '/jobs/' to '/opportunities/' to match your backend
    // Also adding the trailing slash to match FastAPI patterns
    const response = await apiClient.get<Opportunity>(`/opportunities/${id}`);
    
    console.log('Detail Data Received:', response.data);
    return response.data;
  },

  async getCriticalJobs(): Promise<PaginatedResponse<Opportunity>> {
    // Re-uses the getJobs logic above
    return this.getJobs({
      status: 'Urgent', 
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