import { auth, db } from "./firebase.js";
import { doc, updateDoc } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user) location.href = "/auth.html";
});

document.getElementById("saveSetup").onclick = async () => {
  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;
  const target = Number(document.getElementById("target").value);

  const workingDays = [...document.querySelectorAll("input[type=checkbox]:checked")]
    .map(c => c.value);

  const uid = auth.currentUser.uid;

  await updateDoc(doc(db, "users", uid), {
    semesterStart: start,
    semesterEnd: end,
    attendanceTarget: target,
    workingDays,
    setupCompleted: true
  });

  location.href = "/home.html";
};
