---
name: generate-image
description: Nano Banana Pro (nano-banana-pro) image generation skill. Use this skill when the user asks to "generate an image", "generate images", "create an image", "make an image", uses "nano banana", or requests multiple images like "generate 5 images". Generates images using Google's Gemini 2.5 Flash for any purpose - frontend designs, web projects, illustrations, graphics, hero images, icons, backgrounds, or standalone artwork. Invoke this skill for ANY image generation request.
---

# Nano Banana Pro - Gemini Image Generation

Generate custom images using Google's Gemini models.

## Prerequisites

Requires a `GEMINI_API_KEY`. The script automatically loads environment variables from `.env.local` and `.env` in the working directory, so no manual export is needed if the key is defined there.

## Available Models

| Model     | ID                           | Best For                             | Max Resolution |
| --------- | ---------------------------- | ------------------------------------ | -------------- |
| **Flash** | `gemini-2.5-flash-image`     | Speed, high-volume tasks             | 1024px         |
| **Pro**   | `gemini-3-pro-image-preview` | Professional quality, complex scenes | Up to 4K       |

## Image Generation Workflow

Run `scripts/generate-image.py` (relative to this skill's directory) with uv:

```bash
# PNG (graphics, icons, illustrations)
uv run scripts/generate-image.py \
  --prompt "Your image description" \
  --output "/path/to/output.png"

# JPG (photos, hero images, backgrounds)
uv run scripts/generate-image.py \
  --prompt "Your image description" \
  --output "/path/to/output.jpg"
```

Options:

- `--prompt` (required): Detailed description of the image to generate
- `--output` (required): Output file path (`.png` or `.jpg` -- see format selection guide below)
- `--aspect` (optional): Aspect ratio - "square", "landscape", "portrait" (default: square)
- `--reference` (optional): Path to a reference image for style, composition, or content guidance
- `--model` (optional): Model to use - "flash" (fast) or "pro" (high-quality) (default: flash)
- `--size` (optional): Image resolution for pro model - "1K", "2K", "4K" (default: 1K, ignored for flash)

### Using Different Models

**Flash model (default)** - Fast generation, good for iterations:

```bash
uv run scripts/generate-image.py \
  --prompt "A minimalist logo design" \
  --output "/path/to/logo.png" \
  --model flash
```

**Pro model** - Higher quality for final assets:

```bash
uv run scripts/generate-image.py \
  --prompt "A detailed hero illustration for a tech landing page" \
  --output "/path/to/hero.jpg" \
  --model pro \
  --size 2K
```

### Using a Reference Image

To generate an image based on an existing reference:

```bash
uv run scripts/generate-image.py \
  --prompt "Create a similar abstract pattern with warmer colors" \
  --output "/path/to/output.png" \
  --reference "/path/to/reference.png"
```

The reference image helps Gemini understand the desired style, composition, or visual elements you want in the generated image.

## Output Format Selection

Choose the output format based on image content:

| Use `.png`                     | Use `.jpg`                                |
| ------------------------------ | ----------------------------------------- |
| Logos, icons, UI elements      | Photographs, photorealistic scenes        |
| Illustrations with flat colors | Hero images with photographic content     |
| Graphics needing transparency  | Landscapes, interiors, food, portraits    |
| Text overlays, diagrams        | Background images with gradients/textures |

**Quick rules:**

- **Transparency needed?** → `.png`
- **Photographic content?** → `.jpg`
- **When in doubt:** `.png` for graphics, `.jpg` for photographic

## Crafting Effective Prompts

Write detailed, specific prompts for best results:

**Good prompt:**

> A minimalist geometric pattern with overlapping translucent circles in coral, teal, and gold on a deep navy background, suitable for a modern fintech landing page hero section

**Avoid vague prompts:**

> A nice background image

Include these elements: **subject** (what it depicts), **style** (minimalist, photorealistic, illustrated), **colors** (specific palette), **mood** (professional, elegant, bold), **context** (hero image, icon, texture), and **technical** needs (aspect ratio, transparency).