# Onboarding Email Sequence Template

## Email 1: Welcome to NEZAM (Day 0)
- **Subject:** Welcome to NEZAM — Let's build something beautiful!
- **Preheader:** Your new visual workspace is ready. Here is how to get started.

### Body
Hi **[First Name]**,

Welcome to NEZAM! We're excited to help you design, build, and orchestrate visual workspaces and AI agents with ease.

Here is the quick-start guide to get your first workspace up and running:
1. **Initialize Workspace:** Run \`pnpm install\` in your workspace directory.
2. **Launch Design Hub:** Type \`pnpm design-hub\` to open your design editor in the browser.
3. **Run Checks:** Use \`pnpm check:all\` to verify token compliance and schema versions.

If you have any questions, reply directly to this email or join our community.

Best,  
The NEZAM Team

---

## Email 2: Master Design Tokens (Day 3)
- **Subject:** Master Design Tokens in NEZAM
- **Preheader:** Stop hardcoding CSS values. Learn to use the NEZAM design system.

### Body
Hi **[First Name]**,

Are you still hardcoding colors and pixel sizes in your CSS? Let's fix that.

With NEZAM, your layouts are strictly bound to the tokens declared in \`DESIGN.md\`. This ensures complete design system alignment.

To audit your workspace for hardcoded values:
\`\`\`bash
pnpm check:tokens
\`\`\`

If any violations are found, replace them with their respective design tokens to make your code clean and maintainable.

Happy styling,  
The NEZAM Team
