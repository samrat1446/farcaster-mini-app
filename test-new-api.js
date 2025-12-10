// Quick test for new Neynar API key
const API_KEY = '934B4756-79EB-4300-8C6B-54F5D34C3076';
const TEST_FID = 3;

async function testNewAPI() {
  console.log('Testing new Neynar API key...');
  console.log('API Key:', API_KEY.substring(0, 8) + '...');
  console.log('Testing FID:', TEST_FID);
  
  try {
    const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${TEST_FID}`, {
      headers: {
        'accept': 'application/json',
        'api_key': API_KEY,
      },
    });

    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);

    if (response.ok) {
      const data = await response.json();
      const user = data.users[0];
      console.log('✅ SUCCESS! API key is working');
      console.log('User data:', {
        fid: user.fid,
        username: user.username,
        displayName: user.display_name,
        followers: user.follower_count
      });
      
      console.log('\n=== SPAM LABEL CHECK ===');
      console.log('spam_label:', user.spam_label);
      console.log('viewer_context:', user.viewer_context);
      
      console.log('\n=== NEYNAR SCORE CHECK ===');
      console.log('score:', user.score);
      console.log('experimental.neynar_user_score:', user.experimental?.neynar_user_score);
      
      console.log('\n=== ALL AVAILABLE FIELDS ===');
      console.log('Top-level keys:', Object.keys(user));
      
      if (user.experimental) {
        console.log('Experimental keys:', Object.keys(user.experimental));
      }
    } else {
      const errorText = await response.text();
      console.log('❌ FAILED:', response.status, response.statusText);
      console.log('Error:', errorText);
    }
  } catch (error) {
    console.error('❌ ERROR:', error.message);
  }
}

testNewAPI();