const BOOKS = {
  'sam-says-no':         { title: 'Sam Says No',                          author: 'Sam',                  category: 'kids',             imgSrc: 'books/Sam-Says-NO.pdf',                 pdf: 'books/Sam-Says-NO.pdf' },
  'the-moment-we-met':   { title: 'The Moment We Met Was a Lie - Vol. 1', author: 'Kari Wiethop',         category: 'fiction',          imgSrc: 'images/themomentwemeet.png',            pdf: 'books/themomentwemeetwasalie.pdf' },
  'selling-things':      { title: 'Selling Things',                       author: 'Orison Swett Marden',  category: 'self-development', imgSrc: 'images/sellingthings.png',              pdf: 'books/Selling-Things.pdf' },
  'the-asteroid-heist':  { title: 'The Asteroid Heist',                   author: 'Rex Hurst',            category: 'science',          imgSrc: 'images/theasteroidman.png',             pdf: 'books/The-Asteroid-Heist.pdf' },
  'the-last-honest-man': { title: 'The Last Honest Man',                  author: 'Mark Puchon',          category: 'history',          imgSrc: 'images/the last honest man.png',        pdf: 'books/The-Last-Honest-Man.pdf' },
  'three-stories':       { title: 'Three Stories and Ten Poems',          author: 'Ernest Hemingway',     category: 'self-development', imgSrc: 'images/three stories and ten poems.png', pdf: 'books/Three-Stories--Ten-Poems.pdf' },
  'dreams-for-stones':   { title: 'Dreams for Stones',                    author: 'Ann Warner',           category: 'romance',          imgSrc: 'images/dreamsofstones.png',             pdf: 'books/Dreams-for-Stones.pdf' },
  'emma':                { title: 'Emma',                                  author: 'Jane Austen',          category: 'romance',          imgSrc: 'images/emma.png',                       pdf: 'books/Emma.pdf' },
  'the-damon-girl':      { title: 'The Damon Girl',                       author: 'Penelope Fletcher',    category: 'romance',          imgSrc: 'images/theDamonGirl.png',               pdf: 'books/The-Demon-Girl.pdf' }
};

// ── FIREBASE ──
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyAHeG4_RzQs14ty45PyLD4fiP65JPfn-_s",
    authDomain: "readora-df6cc.firebaseapp.com",
    projectId: "readora-df6cc",
    storageBucket: "readora-df6cc.firebasestorage.app",
    messagingSenderId: "784039353043",
    appId: "1:784039353043:web:e5867bb711b45b216ad226"
  });
}

const auth = firebase.auth();
const db   = firebase.firestore();
let currentUser = null;

const $ = id => document.getElementById(id);

function firebaseError(code) {
  const errors = {
    'auth/email-already-in-use':   'This email is already registered. Please login instead.',
    'auth/invalid-email':          'Please enter a valid email address.',
    'auth/weak-password':          'Password must be at least 6 characters.',
    'auth/user-not-found':         'No account found with this email.',
    'auth/wrong-password':         'Incorrect password. Please try again.',
    'auth/invalid-credential':     'Incorrect email or password. Please try again.',
    'auth/too-many-requests':      'Too many failed attempts. Please wait a moment and try again.',
    'auth/network-request-failed': 'Network error. Check your internet connection.',
    'auth/operation-not-allowed':  'Email/Password login is not enabled. Contact the administrator.'
  };
  return errors[code] || 'An error occurred. Please try again.';
}

// ── AU CHARGEMENT ──
document.addEventListener("DOMContentLoaded", () => {

  // Afficher les livres
  const grid = document.querySelector(".books-container#books");
  if (grid) {
    grid.innerHTML = Object.entries(BOOKS).map(([id, b]) => `
      <div class="book-card" data-category="${b.category}" data-book-id="${id}">
        <img src="${b.imgSrc}" alt="${b.title}">
        <div class="heart-icon" onclick="toggleFavorite('${id}', this)"><i class="fas fa-heart"></i></div>
        <div class="book-info">
          <h3>${b.title}</h3>
          <p class="author">${b.author}</p>
          <div class="actions">
            <a href="${b.pdf}" target="_blank">Read</a>
            <a href="${b.pdf}" download>Download</a>
          </div>
        </div>
      </div>`).join('');
  }

  // Filtre par catégorie
  document.querySelectorAll(".categories button").forEach(btn =>
    btn.addEventListener("click", () => {
      const cat = btn.dataset.category;
      document.querySelectorAll(".book-card").forEach(card =>
        card.style.display = (cat === "all" || card.dataset.category === cat) ? "block" : "none"
      );
    })
  );

  // Recherche
  const search = $("searchInput");
  if (search) {
    search.addEventListener("input", () => {
      const val = search.value.toLowerCase();
      document.querySelectorAll(".book-card").forEach(card => {
        const text = card.querySelector("h3").textContent.toLowerCase()
                   + card.querySelector(".author").textContent.toLowerCase();
        card.style.display = text.includes(val) ? "block" : "none";
      });
    });
  }

  // Toggle Login ↔ Register
  const box = document.querySelector('.container');
  if (box) {
    document.querySelector('.register-btn')?.addEventListener('click', () => box.classList.add('active'));
    document.querySelector('.login-btn')?.addEventListener('click', () => box.classList.remove('active'));
  }
});

// ── SESSION UTILISATEUR ──
auth.onAuthStateChanged(user => {
  currentUser = user;

  // Si déjà connecté sur la page login → rediriger vers index
  if (user && document.querySelector('.form-box.login')) {
    location.href = "index.html";
    return;
  }

  if (!user) return;

  // Charger les cœurs favoris sur index.html
  db.collection("users").doc(user.uid).get().then(doc => {
    (doc.data()?.favorites || []).forEach(id => {
      document.querySelector(`[data-book-id="${id}"] .heart-icon`)?.classList.add("active");
    });
  });
});

// ── AUTHENTIFICATION ──
function register() {
  const email    = $("registerEmail").value.trim();
  const password = $("registerPassword").value;
  if (!email || !password) return alert("Please fill in all fields.");
  if (password.length < 6) return alert("Password must be at least 6 characters.");
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => location.href = "index.html")
    .catch(e => alert(firebaseError(e.code)));
}

function login() {
  const email    = $("loginEmail").value.trim();
  const password = $("loginPassword").value;
  if (!email || !password) return alert("Please fill in all fields.");
  auth.signInWithEmailAndPassword(email, password)
    .then(() => location.href = "index.html")
    .catch(e => alert(firebaseError(e.code)));
}

function logout() {
  auth.signOut().then(() => location.href = "login.html");
}

function goToDashboard() {
  location.href = currentUser ? "dashboard.html" : "login.html";
}

// ── FAVORIS ──
function toggleFavorite(bookId, el) {
  if (!currentUser) {
    alert("Please login first to save favorites.");
    location.href = "login.html";
    return;
  }
  el.classList.toggle("active");
  const op = el.classList.contains("active")
    ? firebase.firestore.FieldValue.arrayUnion(bookId)
    : firebase.firestore.FieldValue.arrayRemove(bookId);
  db.collection("users").doc(currentUser.uid).set({ favorites: op }, { merge: true });
}
