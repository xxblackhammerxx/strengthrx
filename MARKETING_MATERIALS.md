# Partner Marketing Materials

## Overview

The Marketing Materials page provides partners with professional, ready-to-use promotional content to help them effectively refer clients to StrengthRX.

## Page Location

**URL:** `/partner-portal/marketing`

The page is accessible from:

1. Partner Portal navigation menu (Marketing link)
2. Quick action card on Partner Dashboard

## Features

### 1. Social Media Posts

Pre-designed graphics and captions for various social platforms:

- **Instagram Posts** - Square format images with engaging captions
- **Facebook Posts** - Service overviews and educational content
- **Instagram Stories** - Vertical format for story sharing

**Functionality:**

- Preview images
- Download high-resolution graphics
- Copy pre-written captions
- Platform-specific optimizations

### 2. Downloadable Assets

Professional materials partners can share with clients:

**Brochures:**

- TRT Information Brochure (PDF)
- Peptide Therapy Overview (PDF)
- Getting Started Guide (PDF)

**Brand Assets:**

- Logo Pack (PNG, SVG, various sizes)
- Brand Style Guide (colors, fonts, usage)

**Video Content:**

- 60-second Explainer Video (MP4)
- Patient Testimonial Compilation (MP4)

**Features:**

- File format and size displayed
- One-click download buttons
- Organized by category

### 3. Email Templates

Pre-written email templates for different scenarios:

1. **Initial Outreach** - First contact with potential clients
2. **Educational Follow-up** - FAQ and information sharing
3. **Promotional Campaign** - Special offers and consultations

**Features:**

- Subject lines included
- Use case descriptions
- Copy entire template with one click

### 4. Text/SMS Templates

Quick messages for direct communication:

1. **Quick Introduction** - Initial conversation starter
2. **Follow-up After Gym** - Casual gym context
3. **Response to Health Questions** - Answering inquiries

**Features:**

- Short, conversational tone
- Include referral link reminder
- Mobile-optimized

### 5. Best Practices Section

Guidelines for effective marketing:

**Do's:**

- Always include unique referral link
- Share authentic testimonials
- Focus on benefits and transformation
- Engage with comments/questions
- Post consistently

**Don'ts:**

- Make medical claims without disclaimers
- Share client info without consent
- Use aggressive language
- Guarantee specific results
- Spam or over-post

## Technical Implementation

### Component Structure

```
/partner-portal/marketing/
└── page.tsx (Marketing Materials Page)
```

### State Management

Uses React hooks for:

- Copy feedback (`copiedId` state)
- Shows "Copied!" confirmation after copying text
- Auto-resets after 2 seconds

### Mock Data

Currently uses mock data arrays:

- `socialMediaPosts[]`
- `downloadableAssets[]`
- `emailTemplates[]`
- `textTemplates[]`

### Future Integration

Replace mock data with:

- Payload CMS collection for marketing materials
- Real file storage (S3, etc.)
- Analytics tracking for downloads
- Dynamic content based on partner performance

## Usage Flow

1. Partner navigates to Marketing Materials page
2. Browse available resources by category
3. Preview content (images, captions, templates)
4. Download assets or copy text
5. Customize with their referral link
6. Share on chosen platform

## Content Management

### Adding New Materials (Future)

Create a Payload collection:

```typescript
{
  slug: 'marketing-materials',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'category', type: 'select', options: [...] },
    { name: 'platform', type: 'select', options: [...] },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'caption', type: 'textarea' },
    { name: 'downloadUrl', type: 'text' },
    { name: 'fileSize', type: 'text' },
    { name: 'active', type: 'checkbox' },
  ]
}
```

### Content Guidelines

**Images:**

- High resolution (minimum 1080x1080 for Instagram)
- Brand colors (#1e40af, #10b981, etc.)
- Include logo watermark
- Square format for versatility

**Copy:**

- Clear call-to-action
- Include benefits, not just features
- HIPAA compliant (no specific medical claims)
- Include disclaimer when needed
- Professional but approachable tone

**Templates:**

- Placeholder fields for personalization [Name], [Code]
- Various tones (casual, professional, educational)
- Keep under 160 characters for SMS
- Subject lines under 50 characters for email

## Analytics Opportunities

Track partner engagement:

- Most downloaded materials
- Copy vs. download ratio
- Time spent on page
- Materials that lead to conversions

## Mobile Optimization

- Responsive grid layouts
- Touch-friendly buttons
- Optimized image sizes
- Copy functionality on mobile browsers

## Compliance

All materials must:

- Follow FDA guidelines for health claims
- Include necessary disclaimers
- Respect HIPAA privacy rules
- Comply with FTC endorsement guidelines
- Follow platform-specific ad policies

## Future Enhancements

1. **Customization Tools**
   - Add partner name to graphics
   - Auto-insert referral code
   - Color scheme options

2. **Analytics Dashboard**
   - Track which materials perform best
   - See download/share statistics
   - Correlation with referral conversions

3. **Social Media Integration**
   - Direct posting to platforms
   - Schedule posts
   - Auto-include referral tracking

4. **A/B Testing**
   - Multiple versions of materials
   - Performance comparison
   - Optimize based on data

5. **Partner-Generated Content**
   - Submit testimonials
   - Share success stories
   - Community best practices
