// Simple connection test utility
export const testConnection = async () => {
  try {
    console.log('Testing connection to backend...');
    const response = await fetch('http://localhost:3000/api/health');
    const data = await response.json();
    console.log('Backend connection successful:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Backend connection failed:', error);
    return { success: false, error: error.message };
  }
};

// Test login endpoint specifically
export const testLogin = async () => {
  try {
    console.log('Testing login endpoint...');
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@acme.test',
        password: 'password'
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Login test successful:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Login test failed:', error);
    return { success: false, error: error.message };
  }
};
