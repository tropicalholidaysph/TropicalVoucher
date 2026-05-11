# Maximum Efficiency Rules

1. **Atomic Edits**: Always prefer `replace_file_content` or `multi_replace_file_content` over rewriting entire files to save tokens and time.
2. **Context Sync**: Keep `.agent/plan.md` updated after every major task. This is the source of truth for all agents.
3. **Dependency First**: Check `package.json` for existing packages before suggesting new ones. Use `npm install` only for missing core dependencies.
4. **Security First**: Never hardcode secrets. Use `.env` and environment variables. Verify that `.env` is in `.gitignore`.
5. **Quality Control**: Run type checking (`npm run typecheck`) and linting (`npm run lint`) to verify code before concluding a task.
6. **Concise Communication**: Maintain professional brevity. Use artifacts (`walkthrough.md`, `analysis_results.md`) for detailed reports.
7. **Branch Integrity**: Work on task-specific branches (e.g., `factory-init`, `feat/vouchers`). Push frequently to synchronize context.
8. **Visual Validation**: Use the browser tool to verify UI changes and capture evidence of success.
9. **Zero Placeholder Policy**: Never use placeholder images or text. Generate actual assets or use realistic data.
