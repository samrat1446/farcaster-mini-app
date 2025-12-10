// Test OpenRank API for real Farcaster reputation data
const TEST_FID = 3; // dwr.eth

async function testOpenRankAPI() {
  console.log('Testing OpenRank API for real reputation data...\n');
  
  try {
    // OpenRank API endpoint for Farcaster users
    const response = await fetch(`https://graph.cast.k3l.io/scores/global/engagement/fids?fid=${TEST_FID}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const data = await response.json();
      console.log('✅ OpenRank API Success!');
      console.log('Reputation Data:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('❌ OpenRank API Error:', response.status, response.statusText);
      console.log('Error details:', errorText);
      
      // Try alternative endpoint
      console.log('\nTrying alternative endpoint...');
      const altResponse = await fetch(`https://api.openrank.com/v1/farcaster/users/${TEST_FID}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (altResponse.ok) {
        const altData = await altResponse.json();
        console.log('✅ Alternative API Success!');
        console.log('Data:', JSON.stringify(altData, null, 2));
      } else {
        console.log('❌ Alternative API also failed:', altResponse.status);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // Try Karma3Labs API (another reputation provider)
    console.log('\nTrying Karma3Labs API...');
    try {
      const karmaResponse = await fetch(`https://api.karma3labs.com/v1/farcaster/user/${TEST_FID}/reputation`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (karmaResponse.ok) {
        const karmaData = await karmaResponse.json();
        console.log('✅ Karma3Labs API Success!');
        console.log('Reputation Data:', JSON.stringify(karmaData, null, 2));
      } else {
        console.log('❌ Karma3Labs API failed:', karmaResponse.status);
      }
    } catch (karmaError) {
      console.log('❌ All APIs failed. Using enhanced estimation.');
    }
  }
}

testOpenRankAPI();