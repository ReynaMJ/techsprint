import { auth, db } from "./firebase.js";
import { signOut, onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) return location.href = "/auth.html";

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();
    target.value = data.target || 75;
    start.value = data.startDate || "";
    end.value = data.endDate || "";
  }

  save.onclick = async () => {
    await updateDoc(ref, {
      target: Number(target.value),
      startDate: start.value,
      endDate: end.value
    });
    alert("Settings updated");
  };

  reset.onclick = async () => {
    if (!confirm("Delete timetable?")) return;

    const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    for (const day of days) {
      const snap = await getDocs(
        collection(db, "timetables", user.uid, day)
      );
      for (const d of snap.docs) {
        await deleteDoc(d.ref);
      }
    }

    alert("Timetable reset");
  };

  logout.onclick = async () => {
    await signOut(auth);
    location.href = "/auth.html";
  };
});
