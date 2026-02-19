const topicInput = document.querySelector('#topic');
const headlineInput = document.querySelector('#headline');
const styleSelect = document.querySelector('#style');
const ratioSelect = document.querySelector('#ratio');
const seedInput = document.querySelector('#seed');
const modelSelect = document.querySelector('#model');
const negativeInput = document.querySelector('#negative');
const generateButton = document.querySelector('#generate');
const downloadButton = document.querySelector('#download');
const previewImage = document.querySelector('#thumbnail');
const statusText = document.querySelector('#status');
const historyList = document.querySelector('#history-list');
const clearHistoryButton = document.querySelector('#clear-history');

const historyItems = [];

function setStatus(message) {
  statusText.textContent = message;
}

function buildPrompt() {
  const topic = topicInput.value.trim() || 'How to grow on YouTube with AI';
  const headline = headlineInput.value.trim() || 'AI GROWTH HACKS';
  const style = styleSelect.value;
  return [
    `YouTube thumbnail composition about: ${topic}`,
    `Bold headline text: "${headline}"`,
    style,
    'clean and readable text, high detail, modern design, high contrast, no logo',
  ].join(', ');
}

function buildImageUrl() {
  const [width, height] = ratioSelect.value.split('x');
  const model = modelSelect.value;
  const seed = seedInput.value.trim() || Math.floor(Math.random() * 1_000_000);
  const prompt = encodeURIComponent(buildPrompt());
  const negative = encodeURIComponent(negativeInput.value.trim() || 'blurry, watermark, distorted text');

  return {
    seed,
    url: `https://image.pollinations.ai/prompt/${prompt}?width=${width}&height=${height}&seed=${seed}&model=${model}&negative=${negative}&nologo=true`,
  };
}

function addHistoryItem(src, label) {
  historyItems.unshift({ src, label });
  if (historyItems.length > 8) {
    historyItems.length = 8;
  }

  historyList.innerHTML = '';
  for (const item of historyItems) {
    const button = document.createElement('button');
    button.type = 'button';
    button.title = item.label;

    const image = document.createElement('img');
    image.src = item.src;
    image.alt = item.label;

    button.appendChild(image);
    button.addEventListener('click', () => {
      previewImage.src = item.src;
      downloadButton.dataset.image = item.src;
      downloadButton.disabled = false;
      setStatus('Loaded image from history.');
    });

    historyList.appendChild(button);
  }
}

async function generateThumbnail() {
  generateButton.disabled = true;
  downloadButton.disabled = true;
  setStatus('Generating thumbnail...');

  try {
    const { url, seed } = buildImageUrl();
    const fetchResponse = await fetch(url, { mode: 'cors' });

    if (!fetchResponse.ok) {
      throw new Error(`Image API failed with ${fetchResponse.status}`);
    }

    const blob = await fetchResponse.blob();
    const objectUrl = URL.createObjectURL(blob);

    previewImage.src = objectUrl;
    downloadButton.dataset.image = objectUrl;
    downloadButton.disabled = false;
    addHistoryItem(objectUrl, `Thumbnail seed ${seed}`);
    setStatus(`Done. Seed ${seed}. You can regenerate or download PNG.`);
  } catch (error) {
    setStatus(`Failed to generate: ${error.message}`);
  } finally {
    generateButton.disabled = false;
  }
}

async function downloadThumbnail() {
  const src = downloadButton.dataset.image;
  if (!src) {
    return;
  }

  const response = await fetch(src);
  const blob = await response.blob();
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'ai-thumbnail.png';
  link.click();
}

function clearHistory() {
  historyItems.length = 0;
  historyList.innerHTML = '';
  setStatus('History cleared.');
}

generateButton.addEventListener('click', generateThumbnail);
downloadButton.addEventListener('click', downloadThumbnail);
clearHistoryButton.addEventListener('click', clearHistory);
