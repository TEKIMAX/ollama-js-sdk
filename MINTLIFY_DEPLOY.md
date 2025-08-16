# Mintlify Documentation Deployment

## ✅ Fixed Issues

1. **Fixed mint.json configuration**
   - Added proper schema reference
   - Fixed navigation paths (removed `/docs` prefix)
   - Added proper tabs and anchors
   - Fixed redirect loop issues

2. **Created MDX Documentation Files**
   - `introduction.mdx` - Main landing page
   - `quickstart.mdx` - Quick start guide
   - `installation.mdx` - Complete installation guide

## 🚀 Deploy to Mintlify

### Step 1: Initialize Mintlify (if not done)
```bash
npx mintlify dev
```

### Step 2: Test Locally
```bash
# Run local development server
mintlify dev

# Should open at http://localhost:3000
```

### Step 3: Deploy to Production

#### Option A: Auto-deploy with GitHub
1. Push to GitHub:
```bash
git add .
git commit -m "Fix Mintlify documentation structure"
git push origin main
```

2. Connect GitHub to Mintlify:
   - Go to [dash.mintlify.com](https://dash.mintlify.com)
   - Connect your GitHub repo
   - Mintlify will auto-deploy on push

#### Option B: Manual Deploy
```bash
# Deploy directly
mintlify deploy
```

## 📁 Required File Structure

Your repository should have:
```
tekimax-sdk/
├── mint.json                 # ✅ Fixed configuration
├── introduction.mdx          # ✅ Created
├── quickstart.mdx           # ✅ Created  
├── installation.mdx         # ✅ Created
├── logo.png                 # Logo file
├── academy/                 # AI Academy docs
│   ├── overview.mdx
│   ├── chapter-1-fundamentals.mdx
│   ├── chapter-2-parameters.mdx
│   ├── chapter-3-embeddings.mdx
│   ├── chapter-4-finetuning.mdx
│   └── chapter-5-prompting.mdx
├── api-reference/           # API docs
│   ├── overview.mdx
│   ├── client.mdx
│   ├── models.mdx
│   ├── embeddings.mdx
│   └── tools.mdx
├── cli/                     # CLI command docs
│   ├── learn.mdx
│   ├── setup.mdx
│   ├── generate.mdx
│   ├── embed.mdx
│   └── list.mdx
├── concepts/                # Core concepts
│   ├── models.mdx
│   ├── tokens.mdx
│   ├── temperature.mdx
│   └── embeddings.mdx
└── examples/                # Examples
    ├── basic-generation.mdx
    ├── streaming.mdx
    ├── embeddings.mdx
    └── tool-calling.mdx
```

## 🔧 Fix the Redirect Issue

The "too many redirects" error was likely caused by:
1. ❌ Incorrect paths in navigation (using `/docs` prefix)
2. ❌ Missing landing page
3. ❌ Circular references in anchors

All these have been fixed in the new `mint.json`.

## 📝 Create Missing Documentation Files

You still need to create the following MDX files:

### Academy Pages
```bash
# Create academy directory
mkdir -p academy

# Create chapter files
touch academy/overview.mdx
touch academy/chapter-1-fundamentals.mdx
touch academy/chapter-2-parameters.mdx
touch academy/chapter-3-embeddings.mdx
touch academy/chapter-4-finetuning.mdx
touch academy/chapter-5-prompting.mdx
```

### API Reference Pages
```bash
# Create api-reference directory
mkdir -p api-reference

# Create API files
touch api-reference/overview.mdx
touch api-reference/client.mdx
touch api-reference/models.mdx
touch api-reference/embeddings.mdx
touch api-reference/tools.mdx
```

### CLI Pages
```bash
# Create cli directory
mkdir -p cli

# Create CLI command files
touch cli/learn.mdx
touch cli/setup.mdx
touch cli/generate.mdx
touch cli/embed.mdx
touch cli/list.mdx
```

### Concepts Pages
```bash
# Create concepts directory
mkdir -p concepts

# Create concept files
touch concepts/models.mdx
touch concepts/tokens.mdx
touch concepts/temperature.mdx
touch concepts/embeddings.mdx
```

### Examples Pages
```bash
# Create examples directory
mkdir -p examples

# Create example files
touch examples/basic-generation.mdx
touch examples/streaming.mdx
touch examples/embeddings.mdx
touch examples/tool-calling.mdx
```

## 🎨 Mintlify Features Used

The updated configuration includes:
- **Dark mode toggle** with default dark theme
- **Search functionality** with custom prompt
- **Feedback system** (thumbs rating, edit suggestions)
- **Social links** (GitHub, Twitter)
- **Version selector** (v2, v1)
- **Custom colors** matching your brand
- **Metadata** for SEO and social sharing

## 🚨 Important Notes

1. **URL Structure**: Mintlify uses file-based routing. The file `quickstart.mdx` becomes `/quickstart`

2. **MDX Components**: Use Mintlify's built-in components:
   - `<Card>` - Feature cards
   - `<CardGroup>` - Card layouts
   - `<Tabs>` - Tabbed content
   - `<Steps>` - Step-by-step guides
   - `<Accordion>` - Collapsible content
   - `<Note>`, `<Tip>`, `<Warning>` - Callouts

3. **Images**: Store images in `/images` directory

4. **Icons**: Use icons from [Heroicons](https://heroicons.com/) or [Font Awesome](https://fontawesome.com/)

## ✅ Verification

After deployment, verify:
1. No redirect loops
2. All navigation links work
3. Search functionality works
4. Dark mode toggle works
5. All MDX components render correctly

## 🔗 Support

If issues persist:
1. Check Mintlify logs: `mintlify logs`
2. Validate mint.json: `mintlify validate`
3. Contact Mintlify support: support@mintlify.com
4. Check [Mintlify docs](https://mintlify.com/docs)