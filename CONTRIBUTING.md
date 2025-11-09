# Contributing to MoveOn

Thank you for considering contributing to MoveOn! 🎉

## 📋 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## 🤝 Code of Conduct

Please be respectful and constructive in all interactions.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/MoveOn.git
cd MoveOn
```

3. Add upstream remote:
```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/MoveOn.git
```

4. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

## 💻 Development Workflow

### Backend Development
```bash
cd Backend
npm install
npm run dev
```

### Frontend Development
```bash
cd Frontend
npm install
npm run dev
```

### Code Style
- Use meaningful variable names
- Follow existing code structure
- Add comments for complex logic
- Use ESLint configuration provided

## 📝 Commit Guidelines

We follow conventional commits:

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```bash
git commit -m "feat(auth): add password reset functionality"
git commit -m "fix(dashboard): resolve trainee count display issue"
git commit -m "docs: update API documentation"
```

## 🔄 Pull Request Process

1. **Update your fork**:
```bash
git fetch upstream
git rebase upstream/main
```

2. **Test your changes**:
```bash
npm test
npm run lint
```

3. **Push to your fork**:
```bash
git push origin feature/your-feature-name
```

4. **Create Pull Request**:
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template

### PR Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Dependent changes merged

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Screenshots (if applicable)

## Additional Notes
```

## 🐛 Reporting Bugs

Create an issue with:
- Clear title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details

## 💡 Suggesting Features

Create an issue with:
- Clear description
- Use case
- Possible implementation
- Alternatives considered

## ❓ Questions?

Feel free to:
- Open an issue
- Join our community chat
- Email: support@moveon.com

---

Thank you for contributing! 🙏
