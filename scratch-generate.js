const fs = require('fs');
const path = require('path');
const { ArPatternFile } = require('@ar-js-org/marker-creator');

try {
  const imagePath = path.join(__dirname, 'assets', 'logo.png');
  const imageData = fs.readFileSync(imagePath);
  const base64Image = imageData.toString('base64');
  const dataUrl = `data:image/png;base64,${base64Image}`;

  ArPatternFile.encodeImageURL(dataUrl, (patternFileString) => {
    fs.writeFileSync(path.join(__dirname, 'assets', 'pattern-marker.patt'), patternFileString);
    console.log('Success! Pattern saved.');
  });
} catch (err) {
  console.error('Error details:', err);
}
