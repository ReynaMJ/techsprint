import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// SIGN UP
export async function signup(email, password) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  // Create user document
  await setDoc(doc(db, "users", user.uid), {
    createdAt: new Date(),
    setupCompleted: false
  });

  return user;
}

// LOGIN
export async function login(email, password) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
}

// AUTH STATE LISTENER (GLOBAL GUARD)
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    if (!location.pathname.includes("auth")) {
      location.href = "auth.html";
    }
    return;
  }

  const snap = await getDoc(doc(db, "users", user.uid));
  const data = snap.data();

  if (!data?.setupCompleted && !location.pathname.includes("setup")) {
    location.href = "setup.html";
  }

  if (data?.setupCompleted && location.pathname.includes("setup")) {
    location.href = "home.html";
  }
});
