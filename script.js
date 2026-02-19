const promptInput = document.querySelector('#prompt');
const styleSelect = document.querySelector('#style');
const ratioSelect = document.querySelector('#ratio');
const generateButton = document.querySelector('#generate');
const downloadButton = document.querySelector('#download');
const previewImage = document.querySelector('#thumbnail');

const ratioMap = {
  '16:9': [1280, 720],
  '1:1': [1024, 1024],
  '4:5': [1080, 1350],
};

const stylePalettes = {
  modern: ['#5468ff', '#88a2ff', '#151b33', '#dbe4ff'],
  neon: ['#ff00f7', '#00f0ff', '#140025', '#f6edff'],
  minimal: ['#d6dde8', '#f2f6ff', '#5a6787', '#1c2236'],
  gaming: ['#ff7a18', '#ffb547', '#18131f', '#fff2df'],
};

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';

  for (let i = 0; i < words.length; i += 1) {
    const testLine = `${line}${words[i]} `;
    const width = ctx.measureText(testLine).width;
    if (width > maxWidth && i > 0) {
      ctx.fillText(line.trim(), x, y);
      line = `${words[i]} `;
      y += lineHeight;
    } else {
      line = testLine;
    }
  }

  ctx.fillText(line.trim(), x, y);
}

function generateThumbnail() {
  const prompt = promptInput.value.trim() || 'Your amazing video title';
  const style = styleSelect.value;
  const [width, height] = ratioMap[ratioSelect.value] ?? ratioMap['16:9'];
  const [primary, secondary, dark, light] = stylePalettes[style] ?? stylePalettes.modern;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, primary);
  gradient.addColorStop(1, dark);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.globalAlpha = 0.25;
  ctx.fillStyle = secondary;
  ctx.beginPath();
  ctx.arc(width * 0.8, height * 0.25, width * 0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(width * 0.15, height * 0.9, width * 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(width * 0.06, height * 0.6, width * 0.88, height * 0.3);

  ctx.fillStyle = light;
  ctx.font = `700 ${Math.round(height * 0.09)}px Inter, Arial, sans-serif`;
  wrapText(ctx, prompt.toUpperCase(), width * 0.09, height * 0.72, width * 0.82, height * 0.11);

  ctx.fillStyle = secondary;
  ctx.font = `600 ${Math.round(height * 0.045)}px Inter, Arial, sans-serif`;
  ctx.fillText('AI GENERATED THUMBNAIL', width * 0.09, height * 0.17);

  const imageData = canvas.toDataURL('image/png');
  previewImage.src = imageData;
  downloadButton.disabled = false;
  downloadButton.dataset.image = imageData;
}

function downloadThumbnail() {
  const link = document.createElement('a');
  link.href = downloadButton.dataset.image;
  link.download = 'thumbnail.png';
  link.click();
}

generateButton.addEventListener('click', generateThumbnail);
downloadButton.addEventListener('click', downloadThumbnail);
