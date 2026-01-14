import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const container = document.getElementById("analytics");

onAuthStateChanged(auth, async (user) => {
  if (!user) return location.href = "/auth.html";

  const attendanceSnap = await getDocs(
    collection(db, "attendance", user.uid, "days")
  );

  const stats = {};

  attendanceSnap.forEach(dayDoc => {
    dayDoc.ref.collection("classes").get().then(classes => {
      classes.forEach(c => {
        const { subject, status } = c.data();
        if (!stats[subject]) stats[subject] = { A: 0, C: 0 };

        if (status !== "cancelled") {
          stats[subject].C++;
          if (status === "present" || status === "duty") {
            stats[subject].A++;
          }
        }
      });
    });
  });

  // Small delay to wait for async loops
  setTimeout(() => render(stats), 500);
});

function render(stats) {
  container.innerHTML = "";

  Object.entries(stats).forEach(([subject, { A, C }]) => {
    const T = 0.75;
    const percent = ((A / C) * 100).toFixed(1);

    let safeCuts = Math.floor((A / T) - C);
    safeCuts = safeCuts < 0 ? 0 : safeCuts;

    let needed = 0;
    while ((A + needed) / (C + needed) < T) needed++;

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${subject}</h3>
      <p>Attendance: <b>${percent}%</b></p>
      <p>Attended: ${A} / Conducted: ${C}</p>
      <p class="${percent < 75 ? "low" : "ok"}">
        ${percent < 75
          ? `Need to attend next ${needed} classes`
          : `Can miss ${safeCuts} more classes`}
      </p>
    `;

    container.appendChild(card);
  });
}
