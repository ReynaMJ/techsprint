import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  collection,
  getDocs,
  setDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const container = document.getElementById("classes");
const emptyMsg = document.getElementById("empty");

const today = new Date();
const dateStr = today.toISOString().split("T")[0];
document.getElementById("date").innerText = dateStr;

onAuthStateChanged(auth, async (user) => {
  if (!user) return location.href = "/auth.html";

  const weekday = today.toLocaleDateString("en-US", { weekday: "long" });

  const snap = await getDocs(
    collection(db, "timetables", user.uid, weekday)
  );

  if (snap.empty) {
    emptyMsg.style.display = "block";
    return;
  }

  snap.forEach(cls => {
    const data = cls.data();

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${data.subject}</h3>
      <p>${data.time}</p>
      <button data-status="present">Present</button>
      <button data-status="absent">Absent</button>
      <button data-status="cancelled">Cancelled</button>
      <button data-status="duty">Duty</button>
    `;

    card.querySelectorAll("button").forEach(btn => {
      btn.onclick = async () => {
        await setDoc(
          doc(db, "attendance", user.uid, "days", dateStr, "classes", cls.id),
          {
            subject: data.subject,
            status: btn.dataset.status
          }
        );
        card.style.opacity = 0.5;
      };
    });

    container.appendChild(card);
  });
});
