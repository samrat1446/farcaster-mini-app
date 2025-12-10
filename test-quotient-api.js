// Test script for Quotient API
const TEST_FIDS = [3, 2, 1]; // dwr, v, farcaster

async function testQuotientAPI() {
  console.log('Testing Quotient API...\n');
  
  try {
    const response = await fetch('https://api.quotient.social/v1/user-reputation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        fids: TEST_FIDS,
        api_key: 'demo_key' // Using demo key for testing
      }),
    });

    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, response.statusText);
      console.error('Error details:', errorText);
      return;
    }

    const data = await response.json();
    console.log('✅ API Response received!\n');
    
    console.log('=== QUOTIENT SCORES ===');
    data.data.forEach(user => {
      const tier = getQualityTier(user.quotientScore);
      console.log(`\nFID ${user.fid} (${user.username}):`);
      console.log(`  Score: ${user.quotientScore} (${Math.round(user.quotientScore * 100)}/100)`);
      console.log(`  Rank: #${user.quotientRank.toLocaleString()}`);
      console.log(`  Tier: ${tier.tier} - ${tier.description}`);
      console.log(`  Profile: ${user.quotientProfileUrl}`);
    });

    console.log('\n=== FULL RESPONSE ===');
    console.log(JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

function getQualityTier(score) {
  if (score < 0.5) {
    return { tier: 'Inactive', description: 'Bot accounts, farmers, inactive users' };
  } else if (score < 0.6) {
    return { tier: 'Casual', description: 'Occasional users, low engagement. Potentially spam or bot accounts.' };
  } else if (score < 0.75) {
    return { tier: 'Active', description: 'Regular contributors, solid engagement' };
  } else if (score < 0.8) {
    return { tier: 'Influential', description: 'High-quality content, strong network' };
  } else if (score < 0.89) {
    return { tier: 'Elite', description: 'Top-tier creators, community leaders' };
  } else {
    return { tier: 'Exceptional', description: 'Platform superstars, maximum influence' };
  }
}

testQuotientAPI();