# OLI Blog Content Creation Guide

Welcome to the Open Labels Initiative Blog! This guide will walk you through everything you need to know about creating, structuring, and publishing blog articles on our platform.

## 📖 Table of Contents

1. [Quick Start](#quick-start)
2. [Content Structure](#content-structure)
3. [Frontmatter Reference](#frontmatter-reference)
4. [Writing Guidelines](#writing-guidelines)
5. [Markdown Features](#markdown-features)
6. [Images and Media](#images-and-media)
7. [GitHub Workflow](#github-workflow)
8. [SEO Best Practices](#seo-best-practices)
9. [Content Categories](#content-categories)
10. [Publication Process](#publication-process)

---

## 🚀 Quick Start

### Step 1: Create Your Article File
1. Navigate to the `content/blog/` directory
2. Create a new file named `your-article-title.md` (use kebab-case)
3. Start with the frontmatter template below
4. Write your content in Markdown
5. Submit via GitHub pull request

### Step 2: Basic File Structure
```
content/blog/your-article-title.md
```

**Example filename patterns:**
- ✅ `introducing-new-features.md`
- ✅ `technical-deep-dive-eas.md`
- ✅ `community-spotlight-march-2024.md`
- ❌ `My Article Title.md` (avoid spaces)
- ❌ `article_with_underscores.md` (prefer hyphens)

---

## 📝 Content Structure

Every blog article must follow this structure:

```markdown
---
# Frontmatter (metadata) - REQUIRED
title: "Your Article Title"
excerpt: "Brief description of your article"
date: "2024-01-15"
author: "Your Name"
tags: ["tag1", "tag2", "tag3"]
featured: false
seo:
  title: "SEO-optimized title"
  description: "SEO description"
  keywords: ["keyword1", "keyword2"]
---

# Your Article Title

Your article content goes here...

## Section Headings

Content organized with proper headings...

### Subsections

More detailed content...

---

*Call-to-action or conclusion*
```

---

## 🏷️ Frontmatter Reference

The frontmatter is the metadata section at the top of each article, enclosed in `---`. Here are all available options:

### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `title` | String | Article title (used in navigation) | `"Understanding EAS Attestations"` |
| `excerpt` | String | Brief summary (2-3 sentences) | `"Learn how EAS attestations work..."` |
| `date` | String | Publication date (YYYY-MM-DD) | `"2024-01-15"` |
| `author` | String | Author name | `"Technical Team"` |
| `tags` | Array | Content categories | `["technical", "eas", "blockchain"]` |

### Optional Fields

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `featured` | Boolean | Show in featured section | `false` |
| `readingTime` | Number | Override calculated reading time | Auto-calculated |
| `seo.title` | String | SEO page title | Uses `title` |
| `seo.description` | String | Meta description | Uses `excerpt` |
| `seo.keywords` | Array | SEO keywords | Uses `tags` |

### Complete Example

```yaml
---
title: "Building Trust in Decentralized Systems"
excerpt: "Explore how trust algorithms and reputation systems create reliable decentralized networks without central authorities."
date: "2024-01-25"
author: "Research Team"
tags: ["research", "trust", "algorithms", "decentralization"]
featured: true
readingTime: 12
seo:
  title: "Trust Algorithms in Decentralized Systems - OLI Research"
  description: "Deep dive into trust algorithms, reputation systems, and consensus mechanisms that power reliable decentralized networks."
  keywords: ["trust algorithms", "decentralized systems", "reputation", "consensus", "blockchain"]
---
```

---

## ✍️ Writing Guidelines

### Content Types Welcome

1. **Technical Deep Dives**
   - Implementation guides
   - Architecture explanations
   - Code tutorials
   - Protocol analysis

2. **Research Articles**
   - Academic insights
   - Data analysis
   - Industry trends
   - Comparative studies

3. **Community Updates**
   - Project announcements
   - Partnership news
   - Community highlights
   - Event recaps

4. **Educational Content**
   - Beginner guides
   - Concept explanations
   - Best practices
   - FAQ articles

### Writing Style

- **Clear and Concise**: Use simple, direct language
- **Technical Accuracy**: Ensure all technical information is correct
- **Community Focused**: Write for the OLI community and broader blockchain audience
- **Professional Tone**: Maintain a professional but approachable voice
- **Actionable Content**: Include practical takeaways when possible

### Article Length Guidelines

| Type | Word Count | Reading Time |
|------|------------|--------------|
| Quick Updates | 300-500 | 2-3 min |
| Standard Articles | 800-1,500 | 4-8 min |
| Deep Dives | 1,500-3,000 | 8-15 min |
| Comprehensive Guides | 3,000+ | 15+ min |

---

## 📖 Markdown Features

Our blog system supports GitHub Flavored Markdown with additional features:

### Basic Formatting

```markdown
**Bold text**
*Italic text*
`Inline code`
[Link text](https://example.com)
```

### Headings

```markdown
# H1 - Article Title (use once)
## H2 - Main Sections
### H3 - Subsections
#### H4 - Minor Subsections
```

### Lists

```markdown
- Unordered list item
- Another item
  - Nested item

1. Ordered list item
2. Second item
   1. Nested numbered item
```

### Code Blocks

````markdown
```javascript
// Code with syntax highlighting
const example = "hello world";
console.log(example);
```

```typescript
interface BlogPost {
  title: string;
  content: string;
}
```

```bash
# Terminal commands
npm install package-name
```
````

### Blockquotes

```markdown
> Important quote or callout
> 
> Multi-line blockquote
```

### Tables

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |
```

### Horizontal Rules

```markdown
---
```

---

## 🖼️ Images and Media

### Image Guidelines

1. **File Location**: Store images in `public/blog-images/`
2. **Naming Convention**: Use descriptive, kebab-case names
3. **Formats**: Prefer `.png` or `.jpg`, optimize for web
4. **Size**: Maximum width 1200px, optimize file size

### Adding Images

```markdown
![Alt text description](/blog-images/your-image-name.png)
```

### Image Examples

```markdown
![OLI Architecture Diagram](/blog-images/oli-architecture-2024.png)

![Code Example Screenshot](/blog-images/eas-attestation-example.png)

![Community Event Photo](/blog-images/oli-meetup-january.jpg)
```

### Image Best Practices

- **Alt Text**: Always include descriptive alt text
- **Relevant**: Images should support your content
- **High Quality**: Use crisp, clear images
- **Consistent Style**: Maintain visual consistency
- **File Size**: Optimize for fast loading (< 500KB per image)

---

## 🔄 GitHub Workflow

### For Community Contributors

#### Step 1: Fork the Repository
1. Go to [OLI Frontend Repository](https://github.com/openlabelsinitiative/OLI-frontend)
2. Click "Fork" button
3. Clone your fork locally

```bash
git clone https://github.com/YOUR_USERNAME/oli-frontend.git
cd oli-frontend
```

#### Step 2: Create a New Branch
```bash
git checkout -b blog/your-article-title
```

#### Step 3: Add Your Article
1. Create your article file in `content/blog/`
2. Add any images to `public/blog-images/`
3. Follow the content structure guidelines

#### Step 4: Test Locally (Optional)
```bash
npm install
npm run dev
# Visit http://localhost:3000/blog to see your article
```

#### Step 5: Commit and Push
```bash
git add .
git commit -m "Add blog post: Your Article Title"
git push origin blog/your-article-title
```

#### Step 6: Create Pull Request
1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Fill out the PR template
4. Submit for review

### For Team Members

#### Direct Repository Access
```bash
git clone https://github.com/openlabelsinitiative/OLI-frontend.git
cd oli-frontend
git checkout -b blog/your-article-title
# Create your content
git add .
git commit -m "Add blog post: Your Article Title"
git push origin blog/your-article-title
# Create PR for review
```

### Pull Request Template

When creating a PR, include:

```markdown
## Blog Article Submission

### Article Details
- **Title**: Your Article Title
- **Type**: [Technical/Research/Community/Educational]
- **Reading Time**: ~X minutes

### Checklist
- [ ] Frontmatter properly formatted
- [ ] Content follows writing guidelines
- [ ] Images optimized and properly referenced
- [ ] Links tested and working
- [ ] Spelling and grammar checked
- [ ] SEO metadata included

### Preview
Brief description of what this article covers...

### Related Issues
Fixes #123 (if applicable)
```

---

## 🔍 SEO Best Practices

### Title Optimization
- **Length**: 50-60 characters
- **Keywords**: Include target keywords naturally
- **Clarity**: Clear and descriptive
- **Uniqueness**: Unique from other articles

```yaml
# Good examples
title: "EAS Attestations: Complete Developer Guide"
title: "Building Trust in Decentralized Networks"
title: "OLI Q1 2024: Community Growth Report"

# Avoid
title: "Article" # Too vague
title: "The Ultimate Complete Comprehensive Guide to Everything About EAS Attestations" # Too long
```

### Meta Descriptions
- **Length**: 150-160 characters
- **Compelling**: Encourage clicks
- **Keywords**: Include relevant keywords
- **Accurate**: Reflect article content

```yaml
seo:
  description: "Learn how EAS attestations enable decentralized trust in blockchain applications. Complete guide with code examples and best practices."
```

### Keywords Strategy
- **Primary Keywords**: 1-2 main topics
- **Secondary Keywords**: 3-5 related terms
- **Long-tail Keywords**: Specific phrases
- **Natural Usage**: Don't keyword stuff

```yaml
seo:
  keywords: ["eas attestations", "blockchain trust", "decentralized identity", "ethereum attestation service", "smart contracts"]
```

### URL Structure
URLs are automatically generated from filenames:
- **File**: `understanding-eas-attestations.md`
- **URL**: `https://openlabelsinitiative.org/blog/understanding-eas-attestations`

---

## 📂 Content Categories

Use these standardized tags for consistency:

### Primary Categories
- `technical` - Technical tutorials, guides, deep dives
- `research` - Research findings, analysis, studies
- `community` - Community updates, events, highlights
- `announcement` - Official announcements, releases
- `educational` - Learning resources, explanations

### Technology Tags
- `eas` - Ethereum Attestation Service
- `blockchain` - General blockchain content
- `ethereum` - Ethereum-specific content
- `attestations` - Attestation-related content
- `smart-contracts` - Smart contract topics

### Topic Tags
- `trust` - Trust algorithms, reputation systems
- `governance` - Governance mechanisms
- `security` - Security topics
- `analytics` - Data analysis, metrics
- `partnerships` - Partnership announcements

### Audience Tags
- `developers` - Developer-focused content
- `researchers` - Academic/research audience
- `beginners` - Beginner-friendly content
- `advanced` - Advanced technical content

### Example Tag Combinations
```yaml
# Technical tutorial
tags: ["technical", "eas", "developers", "smart-contracts"]

# Research article
tags: ["research", "trust", "algorithms", "advanced"]

# Community update
tags: ["community", "announcement", "partnerships"]

# Educational content
tags: ["educational", "beginners", "blockchain", "attestations"]
```

---

## 📋 Publication Process

### 1. Content Review Checklist

Before submitting, ensure:

- [ ] **Content Quality**
  - [ ] Clear, well-structured writing
  - [ ] Technical accuracy verified
  - [ ] Proper grammar and spelling
  - [ ] Appropriate length for topic

- [ ] **Formatting**
  - [ ] Frontmatter complete and correct
  - [ ] Proper Markdown formatting
  - [ ] Headings properly structured (H1, H2, H3)
  - [ ] Code blocks with syntax highlighting

- [ ] **SEO & Metadata**
  - [ ] SEO title optimized
  - [ ] Meta description compelling
  - [ ] Relevant keywords included
  - [ ] Tags appropriately chosen

- [ ] **Media**
  - [ ] Images optimized and properly referenced
  - [ ] Alt text included for accessibility
  - [ ] All links working correctly

### 2. Review Process

1. **Community Submissions**: All external contributions reviewed by OLI team
2. **Team Submissions**: Peer review within team
3. **Technical Content**: Additional technical review required
4. **Timeline**: Reviews typically completed within 3-5 business days

### 3. Publication Timeline

- **Immediate**: Critical announcements, time-sensitive content
- **Next Release**: Regular content published with weekly releases
- **Scheduled**: Feature articles may be scheduled for optimal timing

### 4. Post-Publication

After publication:
- Article automatically appears on blog listing
- RSS feed updated
- Social media sharing enabled
- Analytics tracking begins
- Community can engage via GitHub discussions

---

## 🎯 Examples and Templates

### Technical Tutorial Template

```markdown
---
title: "How to [Accomplish Specific Task]"
excerpt: "Step-by-step guide to [brief description of what readers will learn]."
date: "2024-01-15"
author: "Technical Team"
tags: ["technical", "tutorial", "relevant-technology"]
featured: false
seo:
  title: "[Task] Tutorial - OLI Developer Guide"
  description: "Complete guide to [task] with code examples and best practices for OLI developers."
  keywords: ["main keyword", "related terms", "technical terms"]
---

# How to [Accomplish Specific Task]

Brief introduction explaining what this tutorial covers and why it's useful.

## Prerequisites

- Required knowledge or tools
- Links to relevant background information

## Step 1: [First Major Step]

Detailed explanation with code examples.

```language
// Code example
```

## Step 2: [Second Major Step]

Continue with clear instructions.

## Troubleshooting

Common issues and solutions.

## Conclusion

Summary of what was accomplished and next steps.

---

*Ready to implement this in your project? Check out our [related resources](/docs) or join the discussion in our [Telegram group](https://t.me/olilabels).*
```

### Research Article Template

```markdown
---
title: "[Research Topic]: [Key Finding or Question]"
excerpt: "Research findings on [topic] reveal [key insight] with implications for [relevant area]."
date: "2024-01-15"
author: "Research Team"
tags: ["research", "relevant-topics"]
featured: true
seo:
  title: "[Topic] Research - [Key Finding] | OLI Research"
  description: "New research on [topic] shows [finding]. Analysis of [data/methods] with [implications]."
  keywords: ["research keywords", "academic terms", "technical terms"]
---

# [Research Topic]: [Key Finding or Question]

## Executive Summary

Brief overview of research findings and implications.

## Background

Context and motivation for the research.

## Methodology

How the research was conducted.

## Findings

### Key Finding 1

Detailed explanation with supporting data.

### Key Finding 2

Additional insights discovered.

## Implications

What these findings mean for the OLI ecosystem and broader community.

## Future Research

Areas for continued investigation.

## Conclusion

Summary and call for community input.

---

*This research was conducted by [team/collaborators]. Data and methodology details are available upon request.*
```

### Community Update Template

```markdown
---
title: "[Time Period] Community Update: [Key Highlights]"
excerpt: "Latest updates from the OLI community including [major highlights]."
date: "2024-01-15"
author: "Community Team"
tags: ["community", "announcement", "updates"]
featured: false
seo:
  title: "OLI [Time Period] Update - Community Growth and Developments"
  description: "Latest OLI community updates: [key points]. Learn about new partnerships, features, and community milestones."
  keywords: ["community updates", "oli developments", "blockchain labeling"]
---

# [Time Period] Community Update

Welcome to our [frequency] community update! Here's what's been happening in the OLI ecosystem.

## 🎯 Key Highlights

- **Highlight 1**: Brief description
- **Highlight 2**: Brief description
- **Highlight 3**: Brief description

## 📊 Community Growth

Statistics and metrics about community growth.

## 🤝 New Partnerships

Information about new collaborations.

## 🛠 Technical Updates

Development progress and new features.

## 📅 Upcoming Events

What's coming next.

## 🙏 Community Appreciation

Recognition of community contributors.

---

*Want to get involved? Join our [Telegram](https://t.me/olilabels) or contribute to our [GitHub](https://github.com/openlabelsinitiative/OLI).*
```

---

## 📞 Support and Questions

### Getting Help

- **GitHub Issues**: Technical questions about the blog system
- **Telegram**: Community discussion and quick questions
- **Email**: Direct contact for sensitive or detailed inquiries

### Content Ideas

Looking for inspiration? Consider writing about:

- **Technical Tutorials**: Implementation guides, code walkthroughs
- **Use Case Studies**: Real-world applications of OLI
- **Research Insights**: Data analysis, trend observations
- **Community Spotlights**: Highlighting community members and projects
- **Industry Analysis**: Blockchain labeling landscape, competitive analysis
- **Educational Content**: Explaining complex concepts simply

### Style Guide

- **Code**: Use \`backticks\` for inline code, \`\`\`blocks\`\`\` for multi-line
- **Links**: Use descriptive text, not "click here"
- **Emphasis**: **Bold** for important terms, *italic* for emphasis
- **Lists**: Use bullets for unordered, numbers for sequential steps
- **Headers**: Use sentence case, not Title Case

---

*This guide is actively maintained. For updates or suggestions, please create an issue or submit a pull request.*
