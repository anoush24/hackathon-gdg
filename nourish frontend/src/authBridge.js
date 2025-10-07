export const authService = {
  register: async (userData) => {
    try {
      console.log('🔗 AuthBridge: Making registration request to backend...');
      
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('✅ Registration successful');
        // Store token with Bearer prefix
        localStorage.setItem('token', `Bearer ${data.token}`);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, ...data };
      } else {
        throw {
          success: false,
          message: data.message || 'Registration failed',
          errors: data.errors || []
        };
      }
    } catch (error) {
      console.error('❌ AuthBridge registration error:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw {
          success: false,
          message: 'Cannot connect to server. Make sure your backend is running on http://localhost:5000'
        };
      }

      if (error.success === false) {
        throw error;
      }

      throw {
        success: false,
        message: error.message || 'Registration failed'
      };
    }
  },

  login: async (credentials) => {
    try {
      console.log('🔗 AuthBridge: Making login request');
      
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Store token with Bearer prefix
        localStorage.setItem('token', `Bearer ${data.token}`);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, ...data };
      } else {
        throw {
          success: false,
          message: data.message || 'Login failed'
        };
      }
    } catch (error) {
      console.error('❌ AuthBridge login error:', error);
      if (error.success === false) {
        throw error;
      }
      throw {
        success: false,
        message: error.message || 'Login failed'
      };
    }
  },

  logout: async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch('http://localhost:5000/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token // Already has Bearer prefix
          },
        });
      }
    } catch (error) {
      console.error('❌ Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Add token validation method
  isTokenValid: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      // Extract JWT payload
      const base64Url = token.split('.')[1];
      if (!base64Url) return false;
      
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const { exp } = JSON.parse(jsonPayload);
      const currentTime = Date.now() / 1000;
      
      return exp > currentTime;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  },

  isAuthenticated: () => {
    const hasToken = !!localStorage.getItem('token');
    const hasUser = !!localStorage.getItem('user');
    const tokenValid = authService.isTokenValid();
    
    if (hasToken && hasUser && !tokenValid) {
      // Token expired, clear storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }
    
    return hasToken && hasUser && tokenValid;
  },

  getStoredUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  },

  // Add method to get valid token
  getValidToken: () => {
    if (authService.isAuthenticated()) {
      return localStorage.getItem('token');
    }
    return null;
  }
};