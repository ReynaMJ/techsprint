const chartGrid = document.getElementById("chartGrid");

const backendData = [
  { subject: "OS", present: 10, total: 12 },
  { subject: "DBMS", present: 4, total: 12 },
  { subject: "MATHS", present: 80, total: 100 },
  { subject: "SE", present: 9, total: 12 },
  { subject: "CAO", present: 10, total: 12 },
  { subject: "HONOURS", present: 9, total: 12 },
  { subject: "ECONOMICS", present: 9, total: 12 },
  { subject: "OS LAB", present: 11, total: 12 }
];

backendData.forEach(item => {
  const percentage = Math.round((item.present / item.total) * 100);
  const absent = item.total - item.present;

  const donut = document.createElement("div");
  donut.className = "donut";
  donut.style.setProperty("--present", `${percentage}%`);
const canSkip =
  percentage > 75 ? "YES" :
  percentage === 75 ? "RISKY" :
  "NO";

donut.innerHTML = `
  <div class="center">
    <span>${percentage}%</span>
    <small>${item.subject}</small>
  </div>

  <div class="tooltip">
    Present: ${item.present}<br>
    Absent: ${absent}<br>
    Can I Skip <b>${canSkip}</b>
  </div>
`;

  chartGrid.appendChild(donut);
});
