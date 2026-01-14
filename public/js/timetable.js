import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const grid = document.getElementById("grid");

onAuthStateChanged(auth, async (user) => {
  if (!user) return location.href = "/auth.html";

  renderGrid(user);

  document.getElementById("addForm").onsubmit = async (e) => {
    e.preventDefault();

    const subject = subject.value;
    const day = daySelect.value;
    const time = timeInput.value;

    await addDoc(collection(db, "timetables", user.uid, day), {
      subject,
      time
    });

    renderGrid(user);
  };
});

async function renderGrid(user) {
  grid.innerHTML = "";

  for (const day of days) {
    const col = document.createElement("div");
    col.className = "day";
    col.innerHTML = `<h3>${day}</h3>`;

    const snap = await getDocs(collection(db, "timetables", user.uid, day));

    snap.forEach(docSnap => {
      const data = docSnap.data();

      const item = document.createElement("div");
      item.className = "class";
      item.innerHTML = `
        ${data.subject} (${data.time})
        <button data-id="${docSnap.id}" data-day="${day}">✖</button>
      `;

      item.querySelector("button").onclick = async () => {
        await deleteDoc(
          doc(db, "timetables", user.uid, day, docSnap.id)
        );
        renderGrid(user);
      };

      col.appendChild(item);
    });

    grid.appendChild(col);
  }
}
