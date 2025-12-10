// Test real activity metrics from Neynar API
const API_KEY = '934B4756-79EB-4300-8C6B-54F5D34C3076';
const TEST_FID = 3; // dwr

async function testRealActivityMetrics() {
  console.log('Testing Real Activity Metrics from Neynar API...\n');
  
  try {
    // Get user's recent casts to calculate real activity
    const castsResponse = await fetch(`https://api.neynar.com/v2/farcaster/casts?fid=${TEST_FID}&limit=25`, {
      headers: {
        'accept': 'application/json',
        'api_key': API_KEY,
      },
    });

    if (!castsResponse.ok) {
      throw new Error(`Casts API Error: ${castsResponse.status}`);
    }

    const castsData = await castsResponse.json();
    console.log('✅ Got recent casts data');

    // Calculate real activity metrics
    let totalLikesReceived = 0;
    let totalRecastsReceived = 0;
    let totalCommentsReceived = 0;
    let totalLikesGiven = 0; // This would need separate API call
    let totalCommentsPosted = 0;
    let totalRecastsShared = 0;

    castsData.casts.forEach(cast => {
      // Incoming metrics (what user received)
      totalLikesReceived += cast.reactions?.likes_count || 0;
      totalRecastsReceived += cast.reactions?.recasts_count || 0;
      totalCommentsReceived += cast.replies?.count || 0;

      // Outgoing metrics (what user did)
      if (cast.parent_hash) {
        totalCommentsPosted++; // This is a reply/comment
      }
      // Recasts would be identified differently in the API
    });

    console.log('=== REAL ACTIVITY METRICS ===');
    console.log(`FID ${TEST_FID} - Last 25 casts:`);
    console.log('\nIncoming (Received):');
    console.log(`  Likes Received: ${totalLikesReceived.toLocaleString()}`);
    console.log(`  Comments Received: ${totalCommentsReceived.toLocaleString()}`);
    console.log(`  Recasts Received: ${totalRecastsReceived.toLocaleString()}`);
    
    console.log('\nOutgoing (Posted):');
    console.log(`  Comments Posted: ${totalCommentsPosted.toLocaleString()}`);
    console.log(`  Original Casts: ${castsData.casts.length - totalCommentsPosted}`);

    // Get user's reactions (likes given) - separate API call
    console.log('\nTesting reactions API for likes given...');
    const reactionsResponse = await fetch(`https://api.neynar.com/v2/farcaster/reactions/user?fid=${TEST_FID}&type=likes&limit=25`, {
      headers: {
        'accept': 'application/json',
        'api_key': API_KEY,
      },
    });

    if (reactionsResponse.ok) {
      const reactionsData = await reactionsResponse.json();
      console.log(`  Likes Given (last 25): ${reactionsData.reactions?.length || 0}`);
    } else {
      console.log('  Likes Given: API call failed');
    }

    console.log('\n=== SAMPLE CAST DATA ===');
    console.log(JSON.stringify(castsData.casts[0], null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testRealActivityMetrics();