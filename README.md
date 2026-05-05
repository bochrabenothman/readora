# Readora 📚

A web-based ebook platform where users can browse, read, download, and save their favorite books.

## Features

- **Browse books** by category (Fiction, Kids, Science, History, Self-Development, Romance)
- **Search** books by title or author
- **Read & Download** PDFs directly from the browser
- **User authentication** (Register / Login) powered by Firebase Auth
- **Favorites system** — save books to your personal dashboard
- **Responsive design** for desktop and mobile

## Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend / Auth / DB:** Firebase (Authentication + Firestore)

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Landing page with book grid, search, categories, and reviews |
| `login.html` | Login and Register forms |
| `dashboard.html` | Personal dashboard showing saved favorite books |

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/readora.git
   cd readora
   ```

2. Open `index.html` in your browser — no build step required.

> The app uses Firebase for auth and favorites. If you want to use your own Firebase project, replace the config in `java.js` and `dashboard.html` with your own credentials.

## Project Structure

```
readora/
├── index.html          # Main landing page
├── login.html          # Login / Register
├── dashboard.html      # User dashboard (favorites)
├── style.css           # Main stylesheet
├── login.css           # Login page styles
├── java.js             # App logic (books, Firebase, auth, favorites)
├── images/             # All images (covers, logo, backgrounds)
└── books/              # All ebook PDF files
```

## License

This project is for educational purposes.
1