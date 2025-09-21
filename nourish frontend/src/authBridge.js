// authBridge.js
export const authService = {
  register: async (userData) => {
    try {
      console.log('🔗 AuthBridge: Making registration request to backend...');
      console.log('📦 Sending user data:', {
        ...userData,
        password: '[HIDDEN]'
      });

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      

      const data = await response.json();
      console.log('📦 Full Response data:', JSON.stringify(data, null, 2));

      if (response.ok && data.success) {
        console.log('✅ Registration successful');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, ...data };
      } else {
        console.error('❌ Registration failed with data:', JSON.stringify(data, null, 2));
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

      if (error.name === 'SyntaxError') {
        throw {
          success: false,
          message: 'Server returned invalid response. Check server logs.'
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
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        localStorage.setItem('token', data.token);
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
            'Authorization': `Bearer ${token.replace('Bearer ', '')}`
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

  isAuthenticated: () => {
    return !!(localStorage.getItem('token') && localStorage.getItem('user'));
  },

  getStoredUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  }
};
