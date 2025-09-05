# OLI Blog System - Quick Reference

The Open Labels Initiative blog is a powerful content management system built on Next.js that allows the community to contribute articles about blockchain address labeling, technical tutorials, research findings, and ecosystem updates.

## 🔗 Quick Links

- **[🤝 Contributing Guidelines](CONTRIBUTING.md)** - How to submit content to the blog
- **[📝 Article Template](content/blog/_TEMPLATE.md)** - Ready-to-use template for new articles

## 🚀 Quick Start

### For Community Members

1. **Fork** the [OLI Frontend Repository](https://github.com/openlabelsinitiative/OLI-frontend)
2. **Create** a new file in `content/blog/your-article-title.md`
3. **Copy** the template from `content/blog/_TEMPLATE.md`
4. **Write** your content following the guidelines
5. **Submit** a Pull Request for review

### For Team Members

```bash
git checkout -b blog/your-article-title
# Create your article in content/blog/
git add . && git commit -m "Add blog post: Your Title"
git push origin blog/your-article-title
# Create PR for review
```

## 📝 Article Structure

Every article needs:

```yaml
---
title: "Your Article Title"
excerpt: "Brief 2-3 sentence description"
date: "2024-01-15" 
author: "Your Name"
tags: ["category", "technology", "audience"]
featured: false
seo:
  title: "SEO Title"
  description: "Meta description"
  keywords: ["keyword1", "keyword2"]
---

# Your Article Content Here...
```

## 🏷️ Tag Categories

### Primary Categories (choose 1-2)
- `technical` - Tutorials, guides, implementation
- `research` - Studies, analysis, findings  
- `community` - Updates, events, spotlights
- `announcement` - Official announcements
- `educational` - Learning resources

### Technology Tags
- `eas` - Ethereum Attestation Service
- `blockchain` - General blockchain topics
- `ethereum` - Ethereum-specific content
- `attestations` - Attestation mechanisms
- `smart-contracts` - Smart contract development

### Audience Tags
- `developers` - Technical audience
- `researchers` - Academic audience
- `beginners` - Newcomers
- `advanced` - Experienced practitioners

## 📁 File Organization

```
oli-frontend/
├── content/blog/              # ← Your articles go here
│   ├── _TEMPLATE.md          # Article template
│   ├── article-one.md        # Published articles
│   └── article-two.md        
├── public/blog-images/        # ← Article images go here
├── BLOG_CONTENT_GUIDE.md     # Detailed documentation
├── CONTRIBUTING.md           # Contribution guidelines
└── README-BLOG.md           # This file
```

## 🖼️ Adding Images

1. Save images in `public/blog-images/`
2. Use descriptive filenames: `eas-architecture-diagram.png`
3. Reference in articles: `![Alt text](/blog-images/filename.png)`
4. Optimize for web (< 500KB per image)

## ✅ Pre-Submission Checklist

- [ ] Frontmatter complete and properly formatted
- [ ] Content follows writing guidelines
- [ ] Tags chosen from approved categories
- [ ] Images optimized and properly referenced
- [ ] All links tested and working
- [ ] Grammar and spelling checked
- [ ] SEO metadata included

## 📊 Content Types We Want

| Type | Examples | Length |
|------|----------|---------|
| **Technical Tutorials** | "Building with EAS", "Smart Contract Integration" | 1,500-3,000 words |
| **Research Articles** | "Trust Algorithm Analysis", "Labeling Accuracy Study" | 2,000-4,000 words |
| **Community Updates** | "Monthly Progress", "Partnership Announcements" | 800-1,500 words |
| **Educational Content** | "Blockchain Basics", "What is Address Labeling?" | 1,000-2,000 words |

## 🔄 Publication Workflow

1. **Submit** PR with article
2. **Review** by OLI team (3-5 days)
3. **Revisions** if needed
4. **Approval** and merge
5. **Publication** in next release
6. **Promotion** via social media

## 🎯 SEO Best Practices

- **Title**: 50-60 characters, include keywords
- **Description**: 150-160 characters, compelling
- **Keywords**: 3-7 relevant terms
- **Headings**: Use proper H1, H2, H3 structure
- **Links**: Include internal OLI links
- **Images**: Add descriptive alt text

## 📞 Getting Help

- **Content Questions**: [Blog Content Guide](BLOG_CONTENT_GUIDE.md)
- **Technical Issues**: GitHub Issues
- **Quick Questions**: [Telegram](https://t.me/olilabels)
- **Community Discussion**: GitHub Discussions

## 🌟 Example Articles

Check out these examples for inspiration:
- `content/blog/introducing-oli-blog.md` - Announcement style
- `content/blog/understanding-eas-attestations.md` - Technical deep dive
- `content/blog/building-trust-in-decentralized-labeling.md` - Research article

## ⚡ Local Development (Optional)

To preview your article locally:

```bash
git clone https://github.com/YOUR_USERNAME/oli-frontend.git
cd oli-frontend
npm install
npm run dev
# Visit http://localhost:3000/blog
```

---

**Ready to contribute?** Start with the [Complete Content Guide](BLOG_CONTENT_GUIDE.md) or jump right in with the [Article Template](content/blog/_TEMPLATE.md)!
