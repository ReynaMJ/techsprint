import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const list = document.getElementById("list");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.href = "/auth.html";
    return;
  }

  const dutySnap = await getDocs(
    collection(db, "dutyLeaves", user.uid)
  );

  if (dutySnap.empty) {
    list.innerHTML = "<p>No duty leaves recorded.</p>";
    return;
  }

  dutySnap.forEach(docSnap => {
    const data = docSnap.data();
    const date = docSnap.id;

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${date}</h3>
      <p><b>Subject:</b> ${data.subject || "-"}</p>
      <p><b>Reason:</b> ${data.reason || "-"}</p>
      ${
        data.proofLink
          ? `<p><b>Proof:</b> <a href="${data.proofLink}" target="_blank">View</a></p>`
          : `<p><b>Proof:</b> Not provided</p>`
      }
    `;

    list.appendChild(card);
  });
});
