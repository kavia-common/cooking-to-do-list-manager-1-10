# Cooking To-Do List Manager (Frontend)

Modern React web app to create, manage, and organize cooking-related to-do lists. Built with a lightweight stack and the Ocean Professional theme.

## Features
- Categorized lists: Preparation, Cooking, Serving, Cleanup
- Add, edit, complete, delete tasks
- Reorder tasks with simple drag-and-drop
- Floating action button for quick adding
- Navigation drawer for categories
- Smooth transitions, rounded corners, subtle gradients
- LocalStorage persistence (no backend required)

## Tech
- React 18 + react-scripts
- No external UI library
- Vanilla CSS with theme variables

## Getting Started
- npm start — run dev server at http://localhost:3000
- npm test — run tests
- npm run build — production build

## Structure
- src/components — UI components (Header, Drawer, Task list, Modal, FAB)
- src/utils — helpers for persistence, types, reordering
- src/theme.js — theme variables and helpers

## Notes
- This app does not require environment variables.
- Data is stored in the browser’s localStorage.
