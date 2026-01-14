import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  collection,
  doc,
  getDocs,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Read date from URL
const params = new URLSearchParams(location.search);
const dateStr = params.get("date");

if (!dateStr) {
  alert("Invalid date");
  location.href = "/calendar.html";
}

document.getElementById("dateTitle").innerText =
  `Attendance for ${dateStr}`;

const container = document.getElementById("classes");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.href = "/auth.html";
    return;
  }

  const date = new Date(dateStr);
  const dayName = date.toLocaleDateString("en-US", {
    weekday: "long"
  });

  // Load timetable for that weekday
  const timetableSnap = await getDocs(
    collection(db, "timetables", user.uid, dayName)
  );

  if (timetableSnap.empty) {
    container.innerHTML = "<p>No classes scheduled.</p>";
    return;
  }

  for (const cls of timetableSnap.docs) {
    const data = cls.data();

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <b>${data.subject}</b> (${data.time})<br/>

      <select class="status">
        <option value="present">Present</option>
        <option value="absent">Absent</option>
        <option value="cancelled">Cancelled</option>
        <option value="duty">Duty Leave</option>
      </select>

      <div class="duty-extra" style="display:none; margin-top:10px;">
        <textarea placeholder="Reason for duty leave"></textarea><br>
        <input placeholder="Proof link (Drive / PDF / Docs)" /><br>
        <button class="save-duty">Save Duty Info</button>
      </div>
    `;

    const select = card.querySelector(".status");
    const dutyDiv = card.querySelector(".duty-extra");
    const reasonInput = dutyDiv.querySelector("textarea");
    const proofInput = dutyDiv.querySelector("input");
    const saveBtn = dutyDiv.querySelector(".save-duty");

    // Attendance status handler
    select.onchange = async () => {
      await setDoc(
        doc(db, "attendance", user.uid, "days", dateStr, "classes", cls.id),
        {
          subject: data.subject,
          status: select.value
        }
      );

      dutyDiv.style.display =
        select.value === "duty" ? "block" : "none";
    };

    // Save duty leave info
    saveBtn.onclick = async () => {
      if (!reasonInput.value.trim()) {
        alert("Please enter a reason for duty leave");
        return;
      }

      await setDoc(
        doc(db, "dutyLeaves", user.uid, dateStr),
        {
          subject: data.subject,
          reason: reasonInput.value,
          proofLink: proofInput.value,
          updatedAt: new Date()
        },
        { merge: true }
      );

      alert("Duty leave saved");
    };

    container.appendChild(card);
  }
});
