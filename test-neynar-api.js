// Test script to check Neynar API response for spam_label
const API_KEY = '934B4756-79EB-4300-8C6B-54F5D34C3076';
// Test with multiple FIDs
const TEST_FIDS = [
  { fid: 3, name: 'dwr.eth - Farcaster founder' },
  { fid: 2, name: 'v - Varun Srinivasan' },
  { fid: 1, name: 'farcaster - Official account' },
];

async function testSingleUser(fid, name) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing FID ${fid}: ${name}`);
  console.log('='.repeat(60));
  
  try {
    // Test both endpoints as per guide
    const bulkUrl = `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}&viewer_fid=${fid}`;
    const fidUrl = `https://api.neynar.com/v2/farcaster/user?fid=${fid}`;
    
    console.log('Bulk URL:', bulkUrl);
    console.log('FID URL:', fidUrl);
    
    // Try bulk endpoint first
    let response = await fetch(bulkUrl, {
      headers: {
        'accept': 'application/json',
        'api_key': API_KEY,
      },
    });
    
    if (!response.ok) {
      console.log('Bulk endpoint failed, trying FID endpoint...');
      response = await fetch(fidUrl, {
        headers: {
          'accept': 'application/json',
          'api_key': API_KEY,
        },
      });
    }
    
    const response = await fetch(url, {
      headers: {
        'accept': 'application/json',
        'api_key': API_KEY,
      },
    });

    if (!response.ok) {
      console.error('❌ API Error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      return;
    }

    const data = await response.json();
    const user = data.users[0];

    console.log('✅ API Response received!\n');
    console.log('=== USER INFO ===');
    console.log('FID:', user.fid);
    console.log('Username:', user.username);
    console.log('Display Name:', user.display_name);
    console.log('Followers:', user.follower_count);
    console.log('Following:', user.following_count);
    console.log('Power Badge:', user.power_badge);
    
    console.log('\n=== NEYNAR SCORE ===');
    console.log('experimental.neynar_user_score:', user.experimental?.neynar_user_score);
    console.log('neynar_score:', user.neynar_score);
    
    console.log('\n=== SPAM LABEL ===');
    console.log('viewer_context.spam_label:', user.viewer_context?.spam_label);
    console.log('viewer_context.spam_label_by:', user.viewer_context?.spam_label_by);
    console.log('viewer_context.spam_report_reason:', user.viewer_context?.spam_report_reason);
    console.log('Full viewer_context:', JSON.stringify(user.viewer_context, null, 2));
    
    console.log('\n=== AVAILABLE FIELDS ===');
    console.log('Top-level keys:', Object.keys(user).join(', '));
    
    if (user.experimental) {
      console.log('Experimental keys:', Object.keys(user.experimental).join(', '));
    }
    
    console.log('\n=== FULL USER OBJECT ===');
    console.log(JSON.stringify(user, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

async function testNeynarAPI() {
  console.log('Testing Neynar API with multiple users...');
  console.log('API Key:', API_KEY.substring(0, 8) + '...\n');
  
  for (const { fid, name } of TEST_FIDS) {
    await testSingleUser(fid, name);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between requests
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('All tests completed!');
  console.log('='.repeat(60));
}

testNeynarAPI();
