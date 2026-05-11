---
name: react-from-shitty-code
user-invocable: true
description: '**WORKFLOW SKILL** — Convert shitty code into a full ready React frontend. USE FOR: refactoring bad codebases into modern React applications; creating complete frontend from legacy code; improving code quality with React best practices. DO NOT USE FOR: general coding questions; non-React refactoring; backend code. INVOKES: file system tools (read/write/edit files), run_in_terminal for builds and installs, subagents for codebase analysis.'
---

# React from Shitty Code

## Multi-Step Workflow

Follow this process to transform bad, unmaintainable code into a clean, functional React frontend application.

### Step 1: Codebase Analysis
- Use semantic_search or grep_search to explore the existing code.
- Identify UI components, business logic, data handling, and any existing frameworks.
- Note pain points: spaghetti code, lack of modularity, poor naming, etc.
- If needed, run a subagent to summarize the codebase structure.

### Step 2: Planning the React Architecture
- Determine the component hierarchy: break down into reusable React components.
- Decide on state management: useState for simple cases, Context API or Redux for complex state.
- Plan routing if the app has multiple pages (use React Router).
- Identify styling approach: CSS modules, styled-components, or Tailwind.
- Outline the folder structure: components/, hooks/, utils/, etc.

### Step 3: Set Up React Environment
- If no React project exists, create one using `npx create-react-app` or `npm create vite@latest`.
- Install necessary dependencies: react-router-dom, axios for API calls, etc.
- Set up build scripts and ensure the project runs.

### Step 4: Refactor and Implement Components
- Start with the main App component.
- Extract logic into custom hooks.
- Convert UI elements to JSX, ensuring proper props and event handlers.
- Handle state transitions and side effects with useEffect.
- Ensure code follows React best practices: functional components, hooks, no class components unless necessary.

### Step 5: Integrate Features and Styling
- Add styling to match the original functionality.
- Integrate API calls or data fetching.
- Implement error handling and loading states.
- Add accessibility features where possible.

### Step 6: Testing and Validation
- Run the application with `npm start` or equivalent.
- Test functionality against the original code's behavior.
- Use get_errors to check for linting issues.
- If tests exist, run them; otherwise, suggest adding basic tests.

### Step 7: Finalize and Document
- Clean up unused code.
- Update README with setup instructions.
- Ensure the app is production-ready: build with `npm run build`.

Throughout the process, use edit tools to modify files, run_in_terminal for commands, and validate with builds/tests.

## Quality Criteria
- Code is modular, readable, and follows React conventions.
- No console errors, app runs smoothly.
- Maintains original functionality while improving maintainability.