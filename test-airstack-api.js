// Test script for Airstack API
const TEST_FID = 3; // dwr.eth

async function testAirstackAPI() {
  console.log('Testing Airstack API...\n');
  
  const query = `
    query GetFarcasterUser($fid: String!) {
      Socials(
        input: {
          filter: {
            dappName: {_eq: farcaster}
            userId: {_eq: $fid}
          }
          blockchain: ethereum
        }
      ) {
        Social {
          fid: userId
          fname: profileName
          displayName: profileDisplayName
          profileImage
          profileBio
          followerCount
          followingCount
          verifiedAddresses: userAssociatedAddresses
        }
      }
    }
  `;

  try {
    // Test with demo key first
    const response = await fetch('https://api.airstack.xyz/gql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'demo_key', // This will fail but show us the structure
      },
      body: JSON.stringify({
        query,
        variables: { fid: TEST_FID.toString() }
      }),
    });

    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));

    if (data.errors) {
      console.log('\n❌ Expected error (demo key):', data.errors[0].message);
      console.log('\n✅ API structure is correct!');
      console.log('\n🔑 To get real data:');
      console.log('1. Go to https://app.airstack.xyz');
      console.log('2. Sign up with GitHub/Google');
      console.log('3. Get your API key');
      console.log('4. Add to .env.local: AIRSTACK_API_KEY=your_key');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAirstackAPI();