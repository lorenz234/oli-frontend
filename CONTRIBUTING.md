# Contributing to the OLI Blog

Thank you for your interest in contributing to the Open Labels Initiative blog! This document provides guidelines for community members and team members who want to share content.

## 🚀 Quick Start for Contributors

### 1. **Choose Your Contribution Method**

#### Option A: GitHub Web Interface (Easiest)
Perfect for simple articles and community members new to Git.

1. Go to the [OLI Frontend Repository](https://github.com/openlabelsinitiative/OLI-frontend)
2. Click "Fork" to create your copy
3. Navigate to `content/blog/` in your fork
4. Click "Add file" > "Create new file"
5. Name your file: `your-article-title.md`
6. Write your content using the [Blog Content Guide](BLOG_CONTENT_GUIDE.md)
7. Commit and create a Pull Request

#### Option B: Local Development (Recommended)
Best for longer articles and technical contributors.

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/oli-frontend.git
cd oli-frontend

# Create a new branch
git checkout -b blog/your-article-title

# Install dependencies and start local server
npm install
npm run dev

# Create your article in content/blog/
# Visit http://localhost:3000/blog to preview

# Commit and push
git add .
git commit -m "Add blog post: Your Article Title"
git push origin blog/your-article-title

# Create Pull Request on GitHub
```

### 2. **Article Requirements**

Every article must include:

- ✅ **Proper frontmatter** with all required fields
- ✅ **Relevant content** to the OLI ecosystem
- ✅ **Clear writing** with proper grammar
- ✅ **Appropriate tags** from our standardized list
- ✅ **SEO optimization** (title, description, keywords)

### 3. **Content We're Looking For**

- **Technical tutorials** and implementation guides
- **Research findings** and data analysis
- **Community projects** and success stories
- **Educational content** about blockchain labeling
- **Industry insights** and trend analysis

---

## 📝 Content Guidelines

### Writing Standards

- **Audience**: Write for blockchain developers, researchers, and the OLI community
- **Tone**: Professional but approachable
- **Length**: 800-3000 words (depending on topic complexity)
- **Accuracy**: Ensure all technical information is correct
- **Attribution**: Credit sources and collaborators

### Content Types We Accept

| Type | Description | Example Topics |
|------|-------------|----------------|
| **Technical** | Tutorials, guides, implementation details | "Building with EAS", "Smart Contract Integration" |
| **Research** | Analysis, findings, academic insights | "Trust Algorithm Performance", "Labeling Accuracy Study" |
| **Community** | Updates, spotlights, event coverage | "Community Spotlight: Project X", "OLI Meetup Recap" |
| **Educational** | Explainers, beginner guides | "What is Address Labeling?", "Blockchain Basics" |

### Content We Don't Accept

- ❌ **Promotional content** without educational value
- ❌ **Off-topic articles** unrelated to OLI or blockchain labeling
- ❌ **Plagiarized content** or content published elsewhere
- ❌ **Low-quality content** with poor grammar or structure
- ❌ **Misleading information** or unverified claims

---

## 🔄 Submission Process

### Step 1: Preparation
1. Read the [Blog Content Guide](BLOG_CONTENT_GUIDE.md)
2. Check existing articles to avoid duplication
3. Outline your article structure
4. Gather any necessary images or resources

### Step 2: Writing
1. Create your markdown file in `content/blog/`
2. Follow the frontmatter template exactly
3. Write clear, engaging content
4. Add relevant images to `public/blog-images/`
5. Test locally if possible

### Step 3: Review
Before submitting, check:
- [ ] Frontmatter is complete and correct
- [ ] Content follows our guidelines
- [ ] Grammar and spelling are correct
- [ ] Links work and images display properly
- [ ] Tags are from our approved list
- [ ] SEO fields are optimized

### Step 4: Submission
1. Create a Pull Request with a clear title
2. Fill out the PR template completely
3. Respond to review feedback promptly
4. Make requested changes if needed

### Step 5: Publication
- Articles are typically reviewed within 3-5 business days
- Approved articles are published in the next release cycle
- You'll be notified when your article goes live

---

## 🏷️ Tag Guidelines

Use these standardized tags to categorize your content:

### Primary Categories (choose 1-2)
- `technical` - Implementation guides, tutorials
- `research` - Studies, analysis, findings
- `community` - Community updates, events
- `announcement` - Official announcements
- `educational` - Learning resources

### Technology Tags (choose relevant ones)
- `eas` - Ethereum Attestation Service
- `blockchain` - General blockchain topics
- `ethereum` - Ethereum-specific content
- `attestations` - Attestation mechanisms
- `smart-contracts` - Smart contract development

### Audience Tags (choose 1)
- `developers` - Technical audience
- `researchers` - Academic audience  
- `beginners` - Newcomers to the space
- `advanced` - Experienced practitioners

### Topic Tags (choose relevant ones)
- `trust` - Trust algorithms, reputation
- `governance` - Governance mechanisms
- `security` - Security topics
- `analytics` - Data and metrics
- `partnerships` - Collaborations

---

## 🖼️ Image Guidelines

### File Management
- **Location**: Store in `public/blog-images/`
- **Naming**: Use descriptive, kebab-case names
- **Format**: PNG or JPG preferred
- **Size**: Optimize for web (< 500KB per image)

### Usage in Articles
```markdown
![Descriptive Alt Text](/blog-images/your-image-name.png)
```

### Best Practices
- Include alt text for accessibility
- Use high-quality, relevant images
- Maintain consistent visual style
- Ensure you have rights to use the image

---

## 📋 Pull Request Template

When creating a PR, use this template:

```markdown
## Blog Article Submission

### Article Information
- **Title**: [Your Article Title]
- **Type**: [Technical/Research/Community/Educational]
- **Estimated Reading Time**: [X minutes]
- **Target Audience**: [Developers/Researchers/General Community]

### Content Summary
[2-3 sentences describing what your article covers]

### Submission Checklist
- [ ] Read the Blog Content Guide
- [ ] Frontmatter properly formatted
- [ ] Content follows writing guidelines
- [ ] Images optimized and properly referenced
- [ ] All links tested and working
- [ ] Spelling and grammar checked
- [ ] SEO metadata included
- [ ] Tags from approved list used

### Additional Notes
[Any additional context, special considerations, or questions for reviewers]

### Author Information
- **Name**: [Your Name]
- **GitHub**: [Your GitHub username]
- **Affiliation**: [Optional: Organization/Project]
- **Contact**: [Optional: Email or other contact method]
```

---

## 👥 Community Recognition

### Contributor Benefits
- **Byline attribution** on published articles
- **Community recognition** in our contributor list
- **GitHub contributor badge** on the repository
- **Social media promotion** of your content
- **Networking opportunities** within the OLI ecosystem

### Contributor Hall of Fame
Outstanding contributors may be featured in:
- Monthly community updates
- Special contributor spotlights
- Speaking opportunities at events
- Early access to new features

---

## 🛠️ Technical Setup (Optional)

For contributors who want to test locally:

### Prerequisites
- Node.js 18+ installed
- Git installed
- Text editor (VS Code recommended)

### Local Development
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/oli-frontend.git
cd oli-frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Visit http://localhost:3000/blog
```

### Project Structure
```
oli-frontend/
├── content/blog/          # Your articles go here
├── public/blog-images/    # Article images
├── src/components/blog/   # Blog components (don't modify)
├── src/lib/blog.ts       # Blog utilities (don't modify)
└── src/app/blog/         # Blog pages (don't modify)
```

---

## 📞 Getting Help

### Questions About Contributing?
- **GitHub Issues**: Technical questions
- **Telegram**: [@olilabels](https://t.me/olilabels) - Quick questions
- **Email**: [contact email] - Detailed inquiries

### Content Ideas and Brainstorming
Join our community discussions:
- GitHub Discussions for content planning
- Telegram for real-time brainstorming
- Community calls (announced in Telegram)

### Review Process Questions
- Check PR status and comments on GitHub
- Ping reviewers in Telegram if no response after 5 days
- Email for urgent or sensitive matters

---

## 📈 Content Strategy

### What Performs Well
Based on our analytics, these types of content get the most engagement:
1. **Step-by-step tutorials** with code examples
2. **Research insights** with data visualizations
3. **Community success stories** and case studies
4. **"Behind the scenes"** technical explanations
5. **Industry analysis** and trend predictions

### Content Calendar
We aim to publish:
- **2-3 articles per week** during active periods
- **1 featured article per month** (in-depth content)
- **Seasonal content** around conferences and events
- **Breaking news** as needed for announcements

### SEO Targets
Help us rank for these important terms:
- "blockchain address labeling"
- "ethereum attestation service"
- "decentralized identity"
- "smart contract verification"
- "blockchain analytics"

---

## 🎯 Content Quality Standards

### Excellent Content Includes
- **Clear value proposition** - What will readers learn?
- **Actionable insights** - What can readers do with this information?
- **Supporting evidence** - Data, examples, or references
- **Proper structure** - Logical flow with clear headings
- **Engaging writing** - Accessible but not overly casual

### Review Criteria
Articles are evaluated on:
1. **Relevance** to OLI and blockchain labeling (25%)
2. **Quality** of writing and structure (25%)
3. **Technical accuracy** and detail (25%)
4. **Community value** and engagement potential (25%)

### Improvement Suggestions
Common feedback includes:
- Add more code examples or technical details
- Improve introduction to hook readers
- Strengthen conclusion with clear takeaways
- Optimize for SEO with better keywords
- Add visual elements to break up text

---

*Thank you for contributing to the OLI blog! Your insights help build our community and advance the field of blockchain address labeling.*
