const letters = document.querySelectorAll(".coolors-text span");

const palette = [
  "#FBF8CC", // lemon-chiffon
  "#FDE4CF", // powder-petal
  "#FFCFD2", // cotton-rose
  "#F1C0E8", // pink-orchid
  "#CFBAF0", // mauve
  "#A3C4F3", // baby-blue-ice
  "#90DBF4", // frosted-blue
  "#8EECF5", // electric-aqua
  "#98F5E1", // aquamarine
  "#B9FBC0"  // celadon
];


let colorIndex = 0;

letters.forEach(letter => {
  letter.addEventListener("mouseenter", () => {
    const color = palette[colorIndex];
    colorIndex = (colorIndex + 1) % palette.length;

    letter.style.color = color;

    // Restart animation
    letter.classList.remove("active");
    void letter.offsetWidth;
    letter.classList.add("active");

    setTimeout(() => {
      letter.classList.remove("active");
      letter.style.color = "#7c3aed";
    }, 2800);
  });
});

const victoryBtn = document.getElementById('victory-btn');
const tableHeaders = document.querySelectorAll('.timetable th:not(.break-col)');

victoryBtn.addEventListener('change', () => {
  if (victoryBtn.checked) {
    // APPLY: Attended all
    tableHeaders.forEach(header => {
      header.classList.remove('state-red', 'state-pink');
      header.classList.add('state-green');
    });
  } else {
    // UNDO: Reset everything
    tableHeaders.forEach(header => {
      header.classList.remove(
        'state-green',
        'state-red',
        'state-pink',
        'attended'
      );
    });
  }
});
