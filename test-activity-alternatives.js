// Test alternative ways to get real activity data
const API_KEY = '934B4756-79EB-4300-8C6B-54F5D34C3076';
const TEST_FID = 3; // dwr

async function testActivityAlternatives() {
  console.log('Testing Alternative Activity Data Sources...\n');
  
  // 1. Try user bulk API to see if it has activity data
  try {
    console.log('1. Testing Neynar User Bulk API...');
    const userResponse = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${TEST_FID}`, {
      headers: {
        'accept': 'application/json',
        'api_key': API_KEY,
      },
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      const user = userData.users[0];
      
      console.log('✅ User data available');
      console.log('Available fields:', Object.keys(user));
      
      // Check if there's any activity data
      if (user.experimental) {
        console.log('Experimental fields:', Object.keys(user.experimental));
      }
      
      console.log('\nUser stats:');
      console.log(`  Follower Count: ${user.follower_count}`);
      console.log(`  Following Count: ${user.following_count}`);
      console.log(`  Neynar Score: ${user.score || user.experimental?.neynar_user_score}`);
      
    } else {
      console.log('❌ User API failed:', userResponse.status);
    }
  } catch (error) {
    console.log('❌ User API error:', error.message);
  }

  // 2. Try Warpcast API (public)
  try {
    console.log('\n2. Testing Warpcast Public API...');
    const warpcastResponse = await fetch(`https://api.warpcast.com/v2/user?fid=${TEST_FID}`, {
      headers: {
        'accept': 'application/json',
      },
    });

    if (warpcastResponse.ok) {
      const warpcastData = await warpcastResponse.json();
      console.log('✅ Warpcast API Success!');
      console.log('Available data:', JSON.stringify(warpcastData, null, 2));
    } else {
      console.log('❌ Warpcast API failed:', warpcastResponse.status);
    }
  } catch (error) {
    console.log('❌ Warpcast API error:', error.message);
  }

  // 3. Try Farcaster Hub API (public)
  try {
    console.log('\n3. Testing Farcaster Hub API...');
    const hubResponse = await fetch(`https://hub.farcaster.xyz/v1/userDataByFid?fid=${TEST_FID}`, {
      headers: {
        'accept': 'application/json',
      },
    });

    if (hubResponse.ok) {
      const hubData = await hubResponse.json();
      console.log('✅ Hub API Success!');
      console.log('Available data:', JSON.stringify(hubData, null, 2));
    } else {
      console.log('❌ Hub API failed:', hubResponse.status);
    }
  } catch (error) {
    console.log('❌ Hub API error:', error.message);
  }

  // 4. Try alternative endpoints
  console.log('\n4. Testing other Neynar endpoints...');
  
  const endpoints = [
    `/v2/farcaster/user/search?q=dwr`,
    `/v1/farcaster/user?fid=${TEST_FID}`,
    `/v2/farcaster/user?fid=${TEST_FID}`,
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`https://api.neynar.com${endpoint}`, {
        headers: {
          'accept': 'application/json',
          'api_key': API_KEY,
        },
      });

      console.log(`  ${endpoint}: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`    ✅ Success! Keys: ${Object.keys(data).join(', ')}`);
      }
    } catch (error) {
      console.log(`    ❌ Error: ${error.message}`);
    }
  }
}

testActivityAlternatives();