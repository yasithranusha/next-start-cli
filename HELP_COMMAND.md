# Help Command Documentation

This document describes the comprehensive help system added to Next Start CLI v2.0.0.

## Overview

The CLI now includes a detailed help command that provides:
- Complete usage instructions
- Detailed option descriptions
- Feature lists
- Quick start guide
- Post-setup configuration instructions
- Usage examples
- Tips and best practices
- Troubleshooting guide
- Resource links

## Usage

Display help information:

```bash
next-start-cli --help
# or
next-start-cli -h
```

Display version information:

```bash
next-start-cli --version
# or
next-start-cli -v
```

## Implementation Details

### Files Created/Modified

1. **`src/commands/help.js`** (New)
   - `showHelp()` - Displays comprehensive help information
   - `showVersion()` - Displays version information
   - Uses chalk for colored output
   - Uses gradient-string for attractive header

2. **`src/cli.js`** (Modified)
   - Added help and version flag parsing
   - Handles --help, -h, --version, -v flags
   - Exits after displaying help/version

3. **`README.MD`** (Enhanced)
   - Added comprehensive usage examples
   - Added troubleshooting section
   - Added tips and best practices
   - Added resources and documentation links
   - Reorganized for better readability

4. **`package.json`** (Modified)
   - Added `help` script for quick access

## Help Command Sections

### 1. Header
Beautiful ASCII art header with gradient colors showing:
- CLI name and version
- Project tagline
- Visual appeal

### 2. Usage
Basic usage syntax and common invocations

### 3. Options
Detailed description of each flag:
- `--admin, -a` - Admin dashboard setup
- `--tests, -t` - Testing frameworks
- `--no-git` - Skip git commits
- `--help, -h` - Display help
- `--version, -v` - Display version

### 4. Combining Options
Examples of using multiple flags together

### 5. Features
Comprehensive list of what's included:
- Base project features
- Admin dashboard features
- Testing setup features
- Docker support features

### 6. Project Structure
Visual representation of generated project structure

### 7. Quick Start Guide
5-step process to get started:
1. Create project
2. Follow prompts
3. Navigate to project
4. Start dev server
5. Open in browser

### 8. Post-Setup Configuration
What to do after project creation:
- Update brand information
- Customize routes
- Setup authentication
- Run with Docker

### 9. Usage Examples
Real-world examples with explanations:
- Basic project
- Full-featured admin
- Development mode

### 10. Tips & Best Practices
Expert advice on:
- Project naming conventions
- Version selection
- Admin dashboard setup
- Docker deployment
- Testing strategies

### 11. Troubleshooting
Common issues and solutions:
- Yarn not found
- Directory exists
- Invalid project name
- Port conflicts
- Component issues

### 12. Resources & Documentation
Links to official documentation:
- Next.js, shadcn/ui, Tailwind, TypeScript
- Testing frameworks
- Authentication providers

### 13. Support & Contribution
How to get help and contribute

### 14. Notes
Important reminders and clarifications

## Color Scheme

The help command uses a consistent color scheme:
- **Blue**: Section headers
- **Yellow**: Commands and code
- **Green**: Options and success indicators
- **Cyan**: Feature categories
- **Gray**: Descriptions and explanations
- **Red** (in errors): Error indicators
- **Gradient**: Header with pastel colors

## Benefits

### For New Users
- Comprehensive onboarding
- Clear examples
- Step-by-step guidance
- Troubleshooting help

### For Experienced Users
- Quick reference
- Flag combinations
- Advanced tips
- Resource links

### For Contributors
- Clear structure
- Consistent formatting
- Easy to extend
- Well-documented

## Extending the Help System

To add new sections to the help command:

1. Open `src/commands/help.js`
2. Find the appropriate section
3. Add content using chalk for formatting
4. Follow existing color scheme
5. Test output with `node src/index.js --help`

Example:

```javascript
console.log(chalk.bold.blue("\n🆕 NEW SECTION:"));
console.log(chalk.green("  Option Name"));
console.log(chalk.gray("    Description of the option"));
console.log(chalk.gray("    Example: ") + chalk.yellow("command-example\n"));
```

## Version Command

The version command displays:
- CLI name with emoji
- Current version number
- Author name
- License type

Simple and quick for checking installed version.

## Integration with README

The help command content is synchronized with README.MD:
- Consistent information
- Same examples
- Matching structure
- Cross-referenced

## Testing

To test the help command:

```bash
# Install dependencies
npm install

# Test help
node src/index.js --help

# Test version
node src/index.js --version

# Test short flags
node src/index.js -h
node src/index.js -v
```

## Future Enhancements

Potential improvements:
- Interactive help (inquirer-based navigation)
- Context-sensitive help (help for specific flags)
- Help search functionality
- Multi-language support
- Help categories (beginner, advanced, reference)
- Video tutorial links
- Code snippets that can be copied

## Maintenance

When updating the CLI:
1. Update version in `package.json`
2. Update version in `src/commands/help.js`
3. Add new features to help text
4. Update README.MD accordingly
5. Test help command output
6. Update this documentation

## Feedback

Help command improvements are based on:
- User feedback
- Common support questions
- Documentation gaps
- Best practices evolution

To suggest improvements, open an issue on GitHub.

---

**Last Updated**: v2.0.0
**Author**: Yasith Silva
