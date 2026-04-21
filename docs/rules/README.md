# AI Assistant Rules

Topic-specific rules for AI coding assistants. Files here are automatically picked up by Claude Code and Cursor via symlinks in `.claude/rules/` and `.cursor/rules/`.

## Current Rules

- **[testing.md](testing.md)**: Playwright testing conventions and best practices
- **[typescript.md](typescript.md)**: JavaScript to TypeScript migration guidance

## Adding New Rules

1. Create `docs/rules/topic-name.md` with your rules
2. Create symlinks:
   ```bash
   ln -s ../../docs/rules/topic-name.md .claude/rules/topic-name.md
   ln -s ../../docs/rules/topic-name.md .cursor/rules/topic-name.md
   ```
3. Update the "Current Rules" list above

**Example:**

```bash
# Create the rule file
cat > docs/rules/react.md << 'EOF'
# React Component Rules

- Use functional components with hooks
- Keep components small and focused
EOF

# Create symlinks
ln -s ../../docs/rules/react.md .claude/rules/react.md
ln -s ../../docs/rules/react.md .cursor/rules/react.md
```