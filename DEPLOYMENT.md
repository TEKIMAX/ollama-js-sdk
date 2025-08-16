# Deployment Instructions for Tekimax SDK

## Prerequisites
1. npm account (create at https://www.npmjs.com/)
2. GitHub repository access
3. Node.js and npm installed

## Step 1: GitHub Deployment

### Initialize Git (if not already done)
```bash
git init
git remote add origin https://github.com/TEKIMAX/tekimax-sdk.git
```

### Commit and Push
```bash
# Add all files
git add .

# Commit with message
git commit -m "Release v2.0.0 - AI Academy Edition 🎓

- Added AI Academy interactive learning platform
- 5 comprehensive chapters with quizzes
- Optimized for GPT-OSS 20 and 120 models
- Complete rebranding to Tekimax SDK
- New CLI commands: learn, setup
- Enhanced documentation and examples"

# Push to GitHub
git push -u origin main
```

## Step 2: NPM Publishing

### 1. Login to npm
```bash
npm login
# Enter your username, password, and email
```

### 2. Verify Package Details
```bash
# Check package.json is correct
npm pack --dry-run

# This will show what files will be included
```

### 3. Publish to npm
```bash
# For first-time publishing
npm publish

# If updating existing package
npm publish
```

### 4. Verify Publication
```bash
# Check if package is available
npm view tekimax-sdk

# Test installation
npm install -g tekimax-sdk
tekimax-sdk help
```

## Step 3: Post-Deployment

### Create GitHub Release
1. Go to https://github.com/TEKIMAX/tekimax-sdk/releases
2. Click "Create a new release"
3. Tag: v2.0.0
4. Title: "v2.0.0 - AI Academy Edition"
5. Description:
```markdown
## 🎉 Major Release - AI Academy Edition

### Highlights
- 🎓 **AI Academy**: Interactive learning platform built into the SDK
- 📚 **5 Chapters**: Comprehensive AI and LLM education
- 🚀 **GPT-OSS Focus**: Optimized for GPT-OSS 20 and 120 models
- 🛠️ **New Commands**: `tekimax-sdk learn` and `tekimax-sdk setup`

### Installation
```bash
npm install -g tekimax-sdk
```

### Quick Start
```bash
# Start learning AI
tekimax-sdk learn

# Check your setup
tekimax-sdk setup

# Generate text
tekimax-sdk generate -m gpt-oss-20 -p "Hello, world!"
```

See README for full documentation.
```

### Update npm README
The README.md will automatically be displayed on npm.

### Announce the Release
Share on:
- Twitter/X
- LinkedIn
- Dev.to
- Reddit (r/javascript, r/typescript, r/MachineLearning)

## Troubleshooting

### If npm publish fails:
1. Check npm login: `npm whoami`
2. Verify package name availability: `npm view tekimax-sdk`
3. Check version hasn't been published: `npm view tekimax-sdk versions`
4. If name taken, update package.json with scoped name: `@tekimax/sdk`

### If GitHub push fails:
1. Check remote: `git remote -v`
2. Check branch: `git branch`
3. Force push if needed: `git push -f origin main` (use carefully)

## Version Management

For future updates:
1. Update version in package.json
2. Update CHANGELOG.md
3. Commit changes
4. Create git tag: `git tag v2.0.1`
5. Push with tags: `git push origin main --tags`
6. Publish to npm: `npm publish`

## Monitoring

After deployment:
- Check npm downloads: https://www.npmjs.com/package/tekimax-sdk
- Monitor GitHub issues: https://github.com/TEKIMAX/tekimax-sdk/issues
- Track stars and forks on GitHub
- Respond to user feedback

## Security Notes

- Never commit `.env` files
- Keep API keys and secrets out of code
- Use npm 2FA for publishing
- Regularly update dependencies
- Run `npm audit` before publishing