const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' && window.location.origin ? `${window.location.origin}/api` : 'http://localhost:3000/api');

class ApiClient {
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

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getHeaders(),
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
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
}

export const apiClient = new ApiClient(); 