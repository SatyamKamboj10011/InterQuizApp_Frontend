const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
  {
    name: 'quiz-hero.jpg',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&q=80',
    description: 'Hero image showing students studying'
  },
  {
    name: 'dynamic-quiz.jpg',
    url: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80',
    description: 'Dynamic quiz image showing learning'
  },
  {
    name: 'compete.jpg',
    url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    description: 'Competition and achievement image'
  },
  {
    name: 'progress.jpg',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    description: 'Progress tracking and analytics image'
  },
  {
    name: 'admin-bg.jpg',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80',
    description: 'Admin background showing modern architecture'
  }
];

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else {
        res.resume();
        reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
      }
    });
  });
};

async function downloadAllImages() {
  const publicPath = path.join(process.cwd(), 'public', 'images');
  
  // Create images directory if it doesn't exist
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath, { recursive: true });
  }

  console.log('Downloading images...');
  
  for (const image of images) {
    const filepath = path.join(publicPath, image.name);
    try {
      await downloadImage(image.url, filepath);
      console.log(`✓ Downloaded ${image.name}`);
    } catch (err) {
      console.error(`✗ Error downloading ${image.name}:`, err.message);
    }
  }
  
  console.log('All downloads completed!');
}

downloadAllImages(); 