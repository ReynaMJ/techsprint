export function calculate(subjectRecords, target) {
  let conducted = 0;
  let attended = 0;
  let absences = 0;

  subjectRecords.forEach(r => {
    if (r.status === "cancelled") return;

    conducted++;

    if (r.status === "present" || r.status === "duty") {
      attended++;
    } else if (r.status === "absent") {
      absences++;
    }
  });

  const percent = conducted === 0
    ? 100
    : Math.round((attended / conducted) * 100);

  const maxAbsences = Math.floor(
    conducted * (1 - target / 100)
  );

  const safeCuts = maxAbsences - absences;

  return {
    conducted,
    attended,
    percent,
    safeCuts
  };
}
