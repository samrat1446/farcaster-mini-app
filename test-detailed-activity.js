// Test detailed activity data from Warpcast API
const TEST_FID = 3; // dwr

async function testDetailedActivity() {
  console.log('Testing Detailed Activity Data...\n');
  
  try {
    const response = await fetch(`https://api.warpcast.com/v2/casts?fid=${TEST_FID}&limit=25`);
    
    if (response.ok) {
      const data = await response.json();
      const casts = data.result.casts;
      
      console.log(`✅ Got ${casts.length} recent casts\n`);
      
      // Analyze each cast for real activity data
      let totalLikes = 0;
      let totalRecasts = 0;
      let totalReplies = 0;
      let totalViews = 0;
      let totalQuotes = 0;
      
      console.log('=== REAL ACTIVITY DATA ===');
      casts.slice(0, 5).forEach((cast, index) => {
        console.log(`\nCast ${index + 1}:`);
        console.log(`  Text: "${cast.text.substring(0, 50)}..."`);
        console.log(`  Timestamp: ${new Date(cast.timestamp).toLocaleDateString()}`);
        
        // Real activity numbers
        const likes = cast.reactions?.likes || 0;
        const recasts = cast.reactions?.recasts || 0;
        const replies = cast.replies?.count || 0;
        const views = cast.watches || 0;
        const quotes = cast.quoteCount || 0;
        const combinedRecasts = cast.combinedRecastCount || 0;
        
        console.log(`  📊 Real Activity:`);
        console.log(`    Likes: ${likes}`);
        console.log(`    Recasts: ${recasts}`);
        console.log(`    Combined Recasts: ${combinedRecasts}`);
        console.log(`    Replies: ${replies}`);
        console.log(`    Views: ${views}`);
        console.log(`    Quotes: ${quotes}`);
        
        // Add to totals
        totalLikes += likes;
        totalRecasts += Math.max(recasts, combinedRecasts);
        totalReplies += replies;
        totalViews += views;
        totalQuotes += quotes;
      });
      
      console.log('\n=== SUMMARY (Last 25 Casts) ===');
      console.log(`Total Likes Received: ${totalLikes}`);
      console.log(`Total Recasts Received: ${totalRecasts}`);
      console.log(`Total Replies Received: ${totalReplies}`);
      console.log(`Total Views Received: ${totalViews}`);
      console.log(`Total Quotes Received: ${totalQuotes}`);
      
      // Check if we're getting real data
      const hasRealLikes = totalLikes > 0;
      const hasRealRecasts = totalRecasts > 0;
      const hasRealReplies = totalReplies > 0;
      const hasRealViews = totalViews > 0;
      
      console.log('\n=== DATA QUALITY CHECK ===');
      console.log(`✅ Real Likes: ${hasRealLikes ? 'YES' : 'NO'} (${totalLikes})`);
      console.log(`✅ Real Recasts: ${hasRealRecasts ? 'YES' : 'NO'} (${totalRecasts})`);
      console.log(`✅ Real Replies: ${hasRealReplies ? 'YES' : 'NO'} (${totalReplies})`);
      console.log(`✅ Real Views: ${hasRealViews ? 'YES' : 'NO'} (${totalViews})`);
      
      // Show sample cast structure
      console.log('\n=== SAMPLE CAST STRUCTURE ===');
      const sampleCast = casts[0];
      console.log('Available fields:', Object.keys(sampleCast));
      
      if (sampleCast.reactions) {
        console.log('Reactions structure:', Object.keys(sampleCast.reactions));
      }
      
      if (sampleCast.replies) {
        console.log('Replies structure:', Object.keys(sampleCast.replies));
      }
      
    } else {
      console.log('❌ API failed:', response.status);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testDetailedActivity();