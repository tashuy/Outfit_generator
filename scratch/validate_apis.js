const fs = require('fs');
const path = require('path');

async function runValidation() {
  const BASE_URL = 'http://localhost:8080';
  const email = `tester_${Date.now()}@outfit.com`;
  const password = 'password123';
  const name = 'Automation Tester';

  console.log('--- 1. Testing Registration ---');
  const registerRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  if (!registerRes.ok) {
    throw new Error(`Registration failed: ${await registerRes.text()}`);
  }
  const registerData = await registerRes.json();
  console.log('Registration success. JWT Token received:', registerData.token ? 'YES' : 'NO');
  const token = registerData.token;

  console.log('\n--- 2. Testing Outfit Recommendation Generation with Scores ---');
  const genPayload = {
    occasion: 'College',
    budget: 'Under ₹999',
    style: 'Vintage',
    gender: 'Male',
    location: 'Indore',
    age: 22,
    bodyType: 'Athletic',
    favoriteColors: ['Black', 'White'],
    avoidColors: ['Neon'],
    height: 175,
    weight: 70
  };

  const genRes = await fetch(`${BASE_URL}/api/recommendations/generate`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(genPayload)
  });
  if (!genRes.ok) {
    throw new Error(`Generation failed: ${await genRes.text()}`);
  }
  const genData = await genRes.json();
  console.log('Recommendation generated successfully.');
  console.log('Overall Match Score:', genData.overallScore);
  console.log('Weather Score:', genData.weatherScore);
  console.log('Number of Looks:', genData.looks ? genData.looks.length : 0);
  if (genData.looks && genData.looks.length > 0) {
    const firstLook = genData.looks[0];
    console.log('First Look Name:', firstLook.lookName);
    console.log('Look Score:', firstLook.lookScore);
    console.log('Fashion Score:', firstLook.fashionScore);
    console.log('Color Score:', firstLook.colorScore);
    console.log('Fabric Score:', firstLook.fabricScore);
    console.log('Budget Score:', firstLook.budgetScore);
    console.log('Occasion Score:', firstLook.occasionScore);
  }

  console.log('\n--- 3. Testing Video Upload API ---');
  const videoFilePath = path.join(__dirname, 'mock_video.mp4');
  const fileBuffer = fs.readFileSync(videoFilePath);
  const fileBlob = new Blob([fileBuffer], { type: 'video/mp4' });

  const formData = new FormData();
  formData.append('file', fileBlob, 'mock_video.mp4');
  formData.append('title', 'Testing Indore Vintage College Fit');
  formData.append('description', 'Cool linen textures for warm weather');
  formData.append('location', 'Indore');
  formData.append('occasion', 'College');
  formData.append('style', 'Vintage');

  const uploadRes = await fetch(`${BASE_URL}/api/videos/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (!uploadRes.ok) {
    throw new Error(`Video Upload failed: ${await uploadRes.text()}`);
  }
  const uploadData = await uploadRes.json();
  console.log('Video uploaded successfully:', uploadData);

  console.log('\n--- 4. Testing Video Location Search API ---');
  const searchRes = await fetch(`${BASE_URL}/api/public/videos/search?location=Indore`);
  if (!searchRes.ok) {
    throw new Error(`Search failed: ${await searchRes.text()}`);
  }
  const searchData = await searchRes.json();
  console.log(`Found ${searchData.length} style videos for location: Indore`);
  const matchingVideo = searchData.find(v => v.title === 'Testing Indore Vintage College Fit');
  if (matchingVideo) {
    console.log('SUCCESS: Uploaded video details verified in query search results!');
  } else {
    throw new Error('FAILED: Uploaded video not found in location search results.');
  }

  console.log('\n--- ALL API VALIDATIONS PASSED SUCCESSFULLY ---');
}

runValidation().catch(err => {
  console.error('Validation failed with error:', err);
  process.exit(1);
});
