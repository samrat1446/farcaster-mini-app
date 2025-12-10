// Test Warpcast API for real activity metrics
const TEST_FID = 3; // dwr

async function testWarpcastActivity() {
  console.log('Testing Warpcast API for Real Activity Data...\n');
  
  try {
    // 1. Get user profile with activity stats
    console.log('1. Getting user profile...');
    const userResponse = await fetch(`https://api.warpcast.com/v2/user?fid=${TEST_FID}`);
    
    if (userResponse.ok) {
      const userData = await userResponse.json();
      const user = userData.result.user;
      
      console.log('✅ User Profile Data:');
      console.log(`  Display Name: ${user.displayName}`);
      console.log(`  Username: ${user.username}`);
      console.log(`  Followers: ${user.followerCount.toLocaleString()}`);
      console.log(`  Following: ${user.followingCount.toLocaleString()}`);
      console.log(`  Spam Label: ${userData.result.extras.publicSpamLabel}`);
    }

    // 2. Try to get user's casts/activity
    console.log('\n2. Testing casts endpoints...');
    
    const castEndpoints = [
      `https://api.warpcast.com/v2/casts?fid=${TEST_FID}&limit=10`,
      `https://api.warpcast.com/v2/recent-casts?fid=${TEST_FID}&limit=10`,
      `https://api.warpcast.com/v2/user-casts?fid=${TEST_FID}&limit=10`,
      `https://api.warpcast.com/v1/casts?fid=${TEST_FID}&limit=10`,
    ];

    for (const endpoint of castEndpoints) {
      try {
        const response = await fetch(endpoint);
        console.log(`  ${endpoint.split('?')[0]}: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`    ✅ Success! Structure:`, Object.keys(data));
          
          if (data.result && data.result.casts) {
            const casts = data.result.casts;
            console.log(`    📊 Found ${casts.length} casts`);
            
            // Calculate activity metrics from real casts
            let totalLikes = 0;
            let totalRecasts = 0;
            let totalReplies = 0;
            
            casts.forEach(cast => {
              totalLikes += cast.reactions?.likes || 0;
              totalRecasts += cast.reactions?.recasts || 0;
              totalReplies += cast.replies?.count || 0;
            });
            
            console.log(`    📈 Activity from ${casts.length} recent casts:`);
            console.log(`      Likes Received: ${totalLikes}`);
            console.log(`      Recasts Received: ${totalRecasts}`);
            console.log(`      Replies Received: ${totalReplies}`);
            
            // Show sample cast structure
            if (casts[0]) {
              console.log(`    📝 Sample cast structure:`, Object.keys(casts[0]));
            }
            break;
          }
        }
      } catch (error) {
        console.log(`    ❌ Error: ${error.message}`);
      }
    }

    // 3. Try activity/stats endpoints
    console.log('\n3. Testing activity/stats endpoints...');
    
    const activityEndpoints = [
      `https://api.warpcast.com/v2/user-stats?fid=${TEST_FID}`,
      `https://api.warpcast.com/v2/user-activity?fid=${TEST_FID}`,
      `https://api.warpcast.com/v2/stats?fid=${TEST_FID}`,
      `https://api.warpcast.com/v1/user-stats?fid=${TEST_FID}`,
    ];

    for (const endpoint of activityEndpoints) {
      try {
        const response = await fetch(endpoint);
        console.log(`  ${endpoint}: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`    ✅ Success!`, JSON.stringify(data, null, 2));
        }
      } catch (error) {
        console.log(`    ❌ Error: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Main Error:', error.message);
  }
}

testWarpcastActivity();