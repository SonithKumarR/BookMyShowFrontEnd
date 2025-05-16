let movies = [
    {
        image: 'img/banner/banner1.webp'
    },
    {
        image: 'img/banner/banner2.webp'
    },
    {
        image: 'img/banner/banner3.webp'
    },
    {
        image: 'img/banner/banner4.webp'
    },
    {
        image: 'img/banner/banner5.webp'
    },
    {
        image: 'img/banner/banner6.webp'
    }
]

<!-- https://docs.google.com/document/d/1Qe5pLis3gnZRwq10mQOneNL1T4zMuyb5NbnuZn1ypOM/edit?usp=sharing -->

/*<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dynamic Show Grid</title>
  <style>
    #showGridContainer {
      margin: 20px;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 10px;
      width: fit-content;
    }

    #showGrid {
      display: grid;
      gap: 10px;
      grid-auto-rows: auto;
    }

    .row-label {
      font-weight: bold;
      margin-right: 10px;
      white-space: nowrap;
    }

    .show-row {
      display: flex;
      align-items: center;
    }

    .show-btn {
      margin: 0 5px;
      padding: 8px 12px;
      border: 1px solid gray;
      border-radius: 8px;
      background-color: #f0f0f0;
      cursor: pointer;
    }

    .show-btn.selected {
      background-color: green;
      color: white;
      font-weight: bold;
    }

    .show-btn.disabled {
      background-color: #ccc;
      cursor: not-allowed;
      pointer-events: none;
    }
  </style>
</head>
<body>

<div>
  <label>🎬 Movie:</label>
  <select id="movieDropdown"></select>

  <label>📅 Date:</label>
  <input type="date" id="dateInput" />

  <button id="loadGridBtn">Load Shows</button>
  <button id="submitShowsBtn">Submit Selected Shows</button>
</div>

<div id="showGridContainer">
  <h3>Available Showtimes</h3>
  <div id="showGrid"></div>
</div>

<script>
const theaters = [
  { id: 1, name: "Theater A" },
  { id: 2, name: "Theater B" }
];

const showTimes = ["10:00", "13:00", "16:00", "19:00", "22:00"];
let selectedShows = [];
let existingShows = [];

const movies = [
  { id: 1, name: "Movie 1" },
  { id: 2, name: "Movie 2" }
];

const movieDropdown = document.getElementById("movieDropdown");
movies.forEach(movie => {
  const opt = document.createElement("option");
  opt.value = movie.id;
  opt.innerText = movie.name;
  movieDropdown.appendChild(opt);
});

document.getElementById("loadGridBtn").addEventListener("click", () => {
  const movieId = movieDropdown.value;
  const selectedDate = document.getElementById("dateInput").value;

  if (!movieId || !selectedDate) {
    alert("Please select movie and date");
    return;
  }

  document.getElementById("showGrid").innerHTML = "";
  selectedShows = [];

  // Simulate fetch existing shows
  existingShows = [
    { theaterId: 1, time: "13:00" },
    { theaterId: 2, time: "16:00" }
  ];

  buildShowGrid(movieId, selectedDate);
});

function buildShowGrid(movieId, selectedDate) {
  const grid = document.getElementById("showGrid");

  theaters.forEach(theater => {
    const row = document.createElement("div");
    row.classList.add("show-row");

    const label = document.createElement("div");
    label.classList.add("row-label");
    label.innerText = theater.name;
    row.appendChild(label);

    showTimes.forEach(time => {
      const btn = document.createElement("button");
      btn.classList.add("show-btn");
      btn.innerText = time;

      const isTaken = existingShows.some(s => s.theaterId === theater.id && s.time === time);
      if (isTaken) {
        btn.classList.add("disabled");
      } else {
        btn.addEventListener("click", () => {
          btn.classList.toggle("selected");
          const key = `${movieId}_${selectedDate}_${theater.id}_${time}`;
          const idx = selectedShows.findIndex(s => s.key === key);

          if (btn.classList.contains("selected")) {
            if (idx === -1) {
              selectedShows.push({ key, movieId, date: selectedDate, theaterId: theater.id, time });
            }
          } else {
            if (idx !== -1) selectedShows.splice(idx, 1);
          }
        });
      }

      row.appendChild(btn);
    });

    grid.appendChild(row);
  });
}

document.getElementById("submitShowsBtn").addEventListener("click", () => {
  if (selectedShows.length === 0) {
    alert("No shows selected");
    return;
  }

  const payload = selectedShows.map(s => ({
    movieId: s.movieId,
    theaterId: s.theaterId,
    showDate: s.date,
    showTime: s.time
  }));

  console.log("Submitting to backend:", payload);
  alert("Shows submitted successfully (check console)");
});
</script>
</body>
</html>*/