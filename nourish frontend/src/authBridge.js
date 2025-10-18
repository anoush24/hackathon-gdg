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
      // Only attempt logout call if we have a valid token format
      if (token.startsWith('Bearer ')) {
        await fetch('http://localhost:5000/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
        });
      }
    }
  } catch (error) {
    // Silently handle logout errors - still clear local storage
    console.warn('⚠️ Logout request failed, but clearing local storage:', error);
  } finally {
    // Always clear local storage regardless of server response
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
},

  // Fixed token validation method
  isTokenValid: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      // Remove Bearer prefix for JWT validation
      const jwtToken = token.startsWith('Bearer ') ? token.slice(7) : token;
      
      // Check if it's a valid JWT format
      const parts = jwtToken.split('.');
      if (parts.length !== 3) return false;
      
      // Extract JWT payload
      const base64Url = parts[1];
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
    
    if (!hasToken || !hasUser) {
      return false;
    }
    
    const tokenValid = authService.isTokenValid();
    
    if (!tokenValid) {
      // Token expired, clear storage
      console.log('🔓 Token expired, clearing storage');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }
    
    return true;
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
  },

  // Add method to clear expired auth
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  updateStoredUser: (userData) => {
    try {
      const currentUser = authService.getStoredUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      return null;
    } catch (error) {
      console.error('Error updating stored user:', error);
      return null;
    }
  }
};