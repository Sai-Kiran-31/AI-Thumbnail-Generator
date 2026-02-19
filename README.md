# AI Thumbnail Generator

A browser-based AI thumbnail web app that generates real images from prompt inputs.

## What it does

- Generates thumbnail images using the Pollinations image API
- Lets you control topic, headline text, style preset, model, aspect ratio, and seed
- Supports optional negative prompting to reduce common artifacts
- Shows a recent history strip so you can quickly reuse previous generations
- Downloads generated output as PNG

## Run locally

```bash
python3 -m http.server 8000
```

Then open:

- `http://localhost:8000/index.html`

## Notes

- This app makes outbound network requests to `image.pollinations.ai` for image generation.
