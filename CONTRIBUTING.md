# Contributing to BiznesYordam

Thank you for your interest in contributing to BiznesYordam! This document provides guidelines and information for contributors.

## 🌟 How to Contribute

### Reporting Issues
- Use the GitHub issue tracker to report bugs
- Include detailed information about the issue
- Provide steps to reproduce the problem
- Include screenshots if applicable

### Suggesting Features
- Open an issue with a clear feature description
- Explain the use case and benefits
- Consider the impact on existing functionality

### Code Contributions

#### Getting Started
1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature/fix
4. Make your changes
5. Test your changes thoroughly
6. Submit a pull request

#### Development Setup
```bash
# Clone the repository
git clone https://github.com/your-username/BiznesYordam.uz.git
cd BiznesYordam.uz

# Install dependencies
npm install
cd client && npm install && cd ..

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Setup database
npm run db:push
npm run seed

# Start development server
npm run dev
```

#### Code Style Guidelines
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages
- Include comments for complex logic
- Follow existing naming conventions

#### Database Changes
- Use Drizzle ORM for all database operations
- Create migrations for schema changes
- Test migrations thoroughly
- Update seed data if necessary

#### API Development
- Follow RESTful conventions
- Include proper error handling
- Add input validation with Zod
- Document new endpoints
- Include rate limiting considerations

#### Frontend Development
- Use React hooks and functional components
- Implement responsive design (mobile-first)
- Follow accessibility guidelines
- Use Tailwind CSS for styling
- Implement proper error boundaries

#### Testing
- Test your changes thoroughly
- Include both positive and negative test cases
- Test on different screen sizes
- Verify database operations
- Test authentication flows

### Pull Request Process

1. **Before Creating PR**
   - Ensure all tests pass
   - Update documentation if needed
   - Rebase your branch on latest main
   - Check for TypeScript errors

2. **PR Description**
   - Clearly describe what changes were made
   - Reference related issues
   - Include screenshots for UI changes
   - List any breaking changes

3. **Review Process**
   - Code will be reviewed by maintainers
   - Address feedback promptly
   - Keep discussions constructive
   - Be patient during review process

## 🛡️ Security

### Reporting Security Issues
- **DO NOT** open public issues for security vulnerabilities
- Email security issues to: admin@biznes-yordam.uz
- Include detailed information about the vulnerability
- Allow time for assessment and fixing before disclosure

### Security Guidelines
- Never commit secrets or API keys
- Use environment variables for sensitive data
- Implement proper input validation
- Follow authentication best practices
- Use HTTPS for all communications

## 📋 Development Standards

### Code Quality
- Maintain high code quality standards
- Write self-documenting code
- Use meaningful variable and function names
- Keep functions small and focused
- Follow SOLID principles

### Documentation
- Update README.md for significant changes
- Document new features and APIs
- Include code comments where necessary
- Update CHANGELOG.md for releases

### Performance
- Consider performance implications
- Optimize database queries
- Implement proper caching strategies
- Monitor bundle sizes
- Use lazy loading where appropriate

### Accessibility
- Follow WCAG 2.1 guidelines
- Include proper ARIA labels
- Ensure keyboard navigation works
- Test with screen readers
- Maintain good color contrast

## 🌍 Internationalization

### Language Support
- Primary language: Uzbek
- Consider English translations for key features
- Use proper locale formatting
- Handle right-to-left text if needed

### Cultural Considerations
- Respect local business practices
- Consider Uzbekistan-specific requirements
- Adapt UI/UX for local preferences

## 📞 Communication

### Getting Help
- Join our development discussions
- Ask questions in GitHub issues
- Email: admin@biznes-yordam.uz
- Be respectful and constructive

### Code of Conduct
- Be respectful and inclusive
- Focus on constructive feedback
- Help create a welcoming environment
- Follow the Golden Rule

## 🎯 Development Priorities

### Current Focus Areas
1. Marketplace API integrations
2. Real-time analytics improvements
3. Mobile app development
4. Performance optimizations
5. Security enhancements

### Future Roadmap
- Mobile application (React Native)
- Advanced analytics dashboard
- Machine learning integration
- Multi-language support
- API marketplace for third-party developers

## 🏗️ Architecture Decisions

### Technology Choices
- **Frontend**: React + TypeScript for type safety and modern development
- **Backend**: Express.js for rapid development and ecosystem
- **Database**: PostgreSQL for reliability and advanced features
- **Real-time**: WebSocket for live communications
- **Styling**: Tailwind CSS for utility-first approach
- **Deployment**: Render.com for simplicity and reliability

### Design Patterns
- Repository pattern for data access
- Dependency injection for testability
- Event-driven architecture for real-time features
- RESTful API design
- Component-based UI architecture

## 🔄 Release Process

### Version Numbering
- Follow Semantic Versioning (SemVer)
- Major.Minor.Patch format
- Update CHANGELOG.md for each release

### Release Steps
1. Update version numbers
2. Update CHANGELOG.md
3. Create release branch
4. Test thoroughly
5. Create GitHub release
6. Deploy to production
7. Monitor for issues

Thank you for contributing to BiznesYordam! Together, we're building the future of e-commerce in Uzbekistan. 🇺🇿