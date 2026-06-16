# GrowFusion Backend

Backend application built using **Node.js**, **TypeScript**, and **Express**.

---

# Runtime Environment

**Node.js - 22.12.0** - Development runtime  
**npm - 11.4.2** - Package management and script execution

---

# Tech Stack

**Node.js** - JavaScript runtime environment.  
**TypeScript - 6** - Static typing and improved developer experience.  
**Express** - Backend framework for APIs and server-side logic.  
**ESLint - 9** - Code quality and linting.  
**TSX** - TypeScript execution and development watcher.

---

# Project Dependencies

## Production Dependencies

```json
"dependencies": {
  "cors": "2.8.5",
  "dotenv": "17.2.3",
  "express": "5.1.0",
  "helmet": "8.1.0",
}
```

### Dependency Usage

`express` - Builds REST APIs and backend services  
`cors` - Enables controlled cross-origin requests  
`helmet` - Adds security-related HTTP headers  
`dotenv` - Loads environment variables from `.env` files

---

## Development Dependencies

```json
"devDependencies": {
  "@eslint/js": "10.0.1",
  "@types/cors": "2.8.19",
  "@types/express": "5.0.5",
  "@types/node": "25.6.2",
  "eslint": "10.3.0",
  "globals": "17.6.0",
  "tsx": "4.21.0",
  "typescript": "6.0.3",
  "typescript-eslint": "8.59.2"
}
```

### Development Tooling Usage

`typescript` - Adds static typing support  
`tsx` - Runs TypeScript files directly during development  
`@types/node` - Node.js type definitions  
`@types/express` - Express type definitions  
`@types/cors` - CORS type definitions  
`eslint` - Linting and code quality checks  
`@eslint/js` - Base ESLint JavaScript configurations  
`typescript-eslint` - TypeScript ESLint integration utilities  
`globals` - Provides predefined global variables for ESLint

---

# Getting Started

## 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-folder>
```

---

## 2. Install Dependencies

```bash
npm install
```

This command installs all required packages listed in `package.json`.

---

## 3. Configure Environment Variables

Create a `.env` file in the project root.

Example:

```env
PORT=3000
NODE_ENV=development
```

---

## 4. Start Development Server

```bash
npm run dev
```

Runs the backend server in development mode using TSX.

---

# Build for Production

```bash
npm run build
```

Compiles TypeScript files into the `dist` directory.

---

# Start Production Server

```bash
npm start
```

Runs the compiled production build.

---

# Available Scripts

`npm run dev` - Starts development server with file watching  
`npm run build` - Compiles TypeScript project  
`npm start` - Runs production build  
`npm run lint` - Runs ESLint checks  
`npm run lint-fix` - Automatically fixes lint issues

---
