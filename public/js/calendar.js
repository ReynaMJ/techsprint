import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const cal = document.getElementById("calendar");

onAuthStateChanged(auth, async (user) => {
  if (!user) return location.href = "/auth.html";

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

    const dayDiv = document.createElement("div");
    dayDiv.className = "day gray";
    dayDiv.innerText = d;

    const snap = await getDocs(
      collection(db, "attendance", user.uid, "days", dateStr, "classes")
    );

    let hasAbsent = false;
    let hasPresent = false;
    let hasDuty = false;

    snap.forEach(c => {
      if (c.data().status === "absent") hasAbsent = true;
      if (c.data().status === "present") hasPresent = true;
      if (c.data().status === "duty") hasDuty = true;
    });

    if (hasAbsent) dayDiv.className = "day red";
    else if (hasPresent && hasDuty) dayDiv.className = "day yellow";
    else if (hasPresent) dayDiv.className = "day green";
    else if (hasDuty) dayDiv.className = "day blue";

    dayDiv.onclick = () =>
      location.href = `/day.html?date=${dateStr}`;

    cal.appendChild(dayDiv);
  }
});
