const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' && window.location.origin ? `${window.location.origin}/api` : 'http://localhost:3000/api');

class ApiClient {
  private isRefreshing = false;
  private refreshPromise: Promise<boolean> | null = null;

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  private async refreshTokenIfNeeded(): Promise<boolean> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performTokenRefresh();
    
    const result = await this.refreshPromise;
    this.isRefreshing = false;
    this.refreshPromise = null;
    
    return result;
  }

  private async performTokenRefresh(): Promise<boolean> {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
    if (!refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', data.data.accessToken);
          if (data.data.refreshToken) {
            localStorage.setItem('refreshToken', data.data.refreshToken);
          }
        }
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryOnAuthError: boolean = true
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // Handle 401 Unauthorized - token expired
      if (response.status === 401 && retryOnAuthError) {
        // Try to refresh token
        const refreshed = await this.refreshTokenIfNeeded();
        
        if (refreshed) {
          // Retry request with new token
          const retryConfig: RequestInit = {
            ...config,
            headers: this.getHeaders(),
          };
          const retryResponse = await fetch(url, retryConfig);
          const retryData = await retryResponse.json();
          
          if (!retryResponse.ok) {
            throw new Error(retryData.message || 'Request failed after token refresh');
          }
          
          return retryData;
        } else {
          // Refresh failed, redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
          throw new Error('Authentication failed. Please login again.');
        }
      }

      if (!response.ok) {
        // Handle network errors
        if (!response.status) {
          throw new Error('Network error. Please check your connection.');
        }
        
        // Handle rate limiting
        if (response.status === 429) {
          throw new Error(data.message || 'Too many requests. Please try again later.');
        }
        
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/user/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string) {
    return this.request('/user/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  // Project endpoints
  async getProjects() {
    return this.request('/project');
  }

  async getProject(id: string) {
    return this.request(`/project/${id}`);
  }

  async createProject(formData: FormData) {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/project`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create project');
    }

    return response.json();
  }

  async updateProject(id: string, formData: FormData) {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/project/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update project');
    }

    return response.json();
  }

  async deleteProject(id: string) {
    return this.request(`/project/${id}`, {
      method: 'DELETE',
    });
  }

  // Contact endpoints
  async sendContact(data: { name: string; email: string; message: string }) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getContactMessages(params?: { status?: string; page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    return this.request(`/contact?${searchParams}`);
  }

  async getContactMessage(id: string) {
    return this.request(`/contact/${id}`);
  }

  async updateContactMessage(id: string, data: { status?: string; adminNotes?: string }) {
    return this.request(`/contact/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteContactMessage(id: string) {
    return this.request(`/contact/${id}`, {
      method: 'DELETE',
    });
  }

  // Image upload
  async uploadImage(formData: FormData) {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/image/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload image');
    }

    return response.json();
  }

  // Snippet endpoints
  async getSnippets() {
    return this.request('/snippet');
  }

  async createSnippet(data: { title: string; content: string; language: string }) {
    return this.request('/snippet', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSnippet(id: string, data: { title: string; content: string; language: string }) {
    return this.request(`/snippet/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSnippet(id: string) {
    return this.request(`/snippet/${id}`, {
      method: 'DELETE',
    });
  }

  // Appointment endpoints
  async getAppointments(params?: { status?: string; page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    searchParams.append('admin', 'true');
    if (params?.status) searchParams.append('status', params.status);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    return this.request(`/appointments?${searchParams}`);
  }

  async getAppointment(id: string) {
    return this.request(`/appointments/${id}`);
  }

  async updateAppointment(id: string, data: { status?: string; adminNotes?: string }) {
    return this.request(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAppointment(id: string) {
    return this.request(`/appointments/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(); 