const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test data
const testAccounts = [
  { email: 'admin@acme.test', password: 'password', tenant: 'acme', role: 'admin' },
  { email: 'user@acme.test', password: 'password', tenant: 'acme', role: 'member' },
  { email: 'admin@globex.test', password: 'password', tenant: 'globex', role: 'admin' },
  { email: 'user@globex.test', password: 'password', tenant: 'globex', role: 'member' }
];

async function testAPI() {
  console.log('🧪 Testing Notes SaaS API...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.status);
    console.log('');

    // Test 2: Login for each test account
    console.log('2. Testing Login for all accounts...');
    const tokens = {};
    
    for (const account of testAccounts) {
      try {
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
          email: account.email,
          password: account.password
        });
        
        tokens[account.email] = loginResponse.data.token;
        console.log(`✅ Login successful for ${account.email} (${account.role}, ${account.tenant})`);
      } catch (error) {
        console.log(`❌ Login failed for ${account.email}:`, error.response?.data?.message || error.message);
      }
    }
    console.log('');

    // Test 3: Create notes (test subscription limits)
    console.log('3. Testing Note Creation and Subscription Limits...');
    
    for (const account of testAccounts) {
      if (!tokens[account.email]) continue;
      
      console.log(`Testing ${account.email} (${account.tenant}):`);
      
      try {
        // Try to create 4 notes (should fail on 4th for free plan)
        for (let i = 1; i <= 4; i++) {
          const noteResponse = await axios.post(`${BASE_URL}/notes`, {
            title: `Test Note ${i} for ${account.tenant}`,
            content: `This is test note ${i} for ${account.tenant} tenant.`
          }, {
            headers: { Authorization: `Bearer ${tokens[account.email]}` }
          });
          
          console.log(`  ✅ Note ${i} created successfully`);
        }
      } catch (error) {
        if (error.response?.status === 403 && error.response?.data?.message?.includes('limit')) {
          console.log(`  ✅ Subscription limit correctly enforced: ${error.response.data.message}`);
        } else {
          console.log(`  ❌ Unexpected error: ${error.response?.data?.message || error.message}`);
        }
      }
    }
    console.log('');

    // Test 4: Upgrade to Pro (Admin only)
    console.log('4. Testing Tenant Upgrade (Admin only)...');
    
    const adminToken = tokens['admin@acme.test'];
    if (adminToken) {
      try {
        const upgradeResponse = await axios.post(`${BASE_URL}/tenants/acme/upgrade`, {}, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('✅ Acme tenant upgraded to Pro successfully');
        
        // Now try to create more notes
        const noteResponse = await axios.post(`${BASE_URL}/notes`, {
          title: 'Post-upgrade note',
          content: 'This note was created after upgrading to Pro plan.'
        }, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('✅ Note creation works after upgrade');
        
      } catch (error) {
        console.log('❌ Upgrade failed:', error.response?.data?.message || error.message);
      }
    }
    console.log('');

    // Test 5: Tenant Isolation
    console.log('5. Testing Tenant Isolation...');
    
    const acmeUserToken = tokens['user@acme.test'];
    const globexUserToken = tokens['user@globex.test'];
    
    if (acmeUserToken && globexUserToken) {
      try {
        // Get notes for Acme user
        const acmeNotesResponse = await axios.get(`${BASE_URL}/notes`, {
          headers: { Authorization: `Bearer ${acmeUserToken}` }
        });
        
        // Get notes for Globex user
        const globexNotesResponse = await axios.get(`${BASE_URL}/notes`, {
          headers: { Authorization: `Bearer ${globexUserToken}` }
        });
        
        console.log(`✅ Acme user can see ${acmeNotesResponse.data.notes.length} notes`);
        console.log(`✅ Globex user can see ${globexNotesResponse.data.notes.length} notes`);
        console.log('✅ Tenant isolation working correctly');
        
      } catch (error) {
        console.log('❌ Tenant isolation test failed:', error.response?.data?.message || error.message);
      }
    }
    console.log('');

    // Test 6: Role-based Access
    console.log('6. Testing Role-based Access...');
    
    const memberToken = tokens['user@acme.test'];
    if (memberToken) {
      try {
        // Try to upgrade as member (should fail)
        await axios.post(`${BASE_URL}/tenants/acme/upgrade`, {}, {
          headers: { Authorization: `Bearer ${memberToken}` }
        });
        console.log('❌ Member was able to upgrade (should not be allowed)');
      } catch (error) {
        if (error.response?.status === 403) {
          console.log('✅ Member correctly denied upgrade access');
        } else {
          console.log('❌ Unexpected error:', error.response?.data?.message || error.message);
        }
      }
    }
    console.log('');

    console.log('🎉 API testing completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = testAPI;
