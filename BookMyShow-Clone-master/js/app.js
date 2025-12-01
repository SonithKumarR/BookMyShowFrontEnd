const carousel = document.querySelector('.carousel');
let sliders = [];

let slideIndex = 0; 

const createSlide = () => {
    if (slideIndex >= movies.length) {
        slideIndex = 0;
    }

    let slide = document.createElement('div');
    let imgElement = document.createElement('img');

    imgElement.appendChild(document.createTextNode(''));
    slide.appendChild(imgElement);
    carousel.appendChild(slide);

    // setting up image
    imgElement.src = movies[slideIndex].image;
    slideIndex++;


    slide.className = 'slider';

    sliders.push(slide);

    if (sliders.length) {
        sliders[0].style.marginLeft = `calc(-${100 * (sliders.length - 2)}% - ${10 * (sliders.length - 2)}px)`;
    }
}

for (let i = 0; i < 3; i++) {
    createSlide();
}

setInterval(() => {
    createSlide();
}, 5000);


jQuery(document).ready(function () {

    $('.login, .overlay').on('click', function () {
        $('.sidebar').removeClass('active');
        $('.overlay').removeClass('active');
    });

    $('.open-menu').on('click', function (e) {
        e.preventDefault();
        $('.sidebar').addClass('active');
        $('.overlay').addClass('active');
        // close opened sub-menus
        $('.collapse.show').toggleClass('show');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });


});


// login page

// Get the modal
let modal = document.getElementById('id01');

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

const theaterBtn = document.querySelector('thBtn');



const theaterFrm = document.querySelector('.theaterForm');
const thtBtb = document.getElementById('thbtn');
var tid = 0;
theaterFrm.addEventListener("submit", (e) => {
    e.preventDefault();
    const thData = {
        name: theaterFrm.elements['name'].value,
        address: theaterFrm.elements['adres'].value,
        noOfScreens: theaterFrm.elements['scren'].value
    };
    fetch('http://localhost:6947/api/v1/theater/addTh', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(thData)
    })
        .then(response => response.text())
        .then(data => {
            tid = Number(data);

            const stData = {
                noOfClassicSeats: theaterFrm.elements['clasic'].value,
                noOfPremiumSeats: theaterFrm.elements['premium'].value,
                theaterId: tid
            };

            return fetch('http://localhost:6947/api/v1/theater/addSeat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(stData)
            });
        })
        .then(response => response.text())
        .then(data => {
            alert("Theater Successfully added: " + tid);
            theaterFrm.reset();
        })
        .catch(error => {
            console.error("Error:", error);
        });
});


const moveForm = document.querySelector('.movieForm');
const movbtn = document.getElementById('mvbtn');
const ShowvsTherFrm = document.getElementById('theaterContainerTop');
let showslimit, movieid = 0;
const theaterList = []; // keep this global for reuse

movbtn.addEventListener('click', (e) => {
    e.preventDefault();

    const mvData = {
        movieName: moveForm.elements['name'].value,
        duration: moveForm.elements['durt'].value,
        releaseDate: moveForm.elements['date'].value,
        language: moveForm.elements['langu'].value,
        rating: moveForm.elements['ratg'].value,
        image : moveForm.elements['showno'].value
    };

    showslimit = moveForm.elements['showno'].value;

    fetch('http://localhost:6947/api/v1/Movie', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(mvData)
    })
        .then(response => response.text())
        .then(data => {
            movieid = Number(data);
            console.log("movieId : " + movieid);

            // Fetch Theaters
            fetch('http://localhost:6947/api/v1/theater/theaterList')
                .then(response => response.json())
                .then(data => {
                    theaterList.length = 0;        // Clear old theaters
                    theaterList.push(...data);     // Populate with new data

                    ShowvsTherFrm.style.display = 'block';

                    // Delay to ensure UI is ready (usually not needed if DOM ready)
                })
                .catch(error => {
                    console.error("Error fetching theaters:", error);
                });
        })
        .catch(error => {
            console.error("Error creating movie:", error);
        });
});

const theaterContainer = document.getElementById('theaterContainer');
const submitBtn = document.getElementById('submitShows');
const selectedShows = []; // to hold selected show objects


const showTimes = ["10:00", "13:00", "16:00", "19:00", "22:00"];


function renderTheaterRows() {
    theaterContainer.innerHTML = '';

    const showDateInput = document.getElementById('showDate');
    const showdate = showDateInput?.value;
    if (!showdate) return;

    fetch(`http://localhost:6947/api/v1/show/getshowsbydate?showDate=${encodeURIComponent(showdate)}`)
    .then(response => response.json())
    .then(shows => {
      const showMap = {};
  
      shows.forEach(show => {
        const theaterId = show.theaterId;
        const showTime = show.showTime.substring(0, 5);
        if (!showMap[theaterId]) {
          showMap[theaterId] = [];
        }
        showMap[theaterId].push(showTime);
      });
  
      theaterList.forEach(theater => {
        const theaterRow = document.createElement('div');
        theaterRow.classList.add('theater-row');
  
        const title = document.createElement('h4');
        title.innerText = `Theater: ${theater.name || "TheaterEmpty"}`;
        theaterRow.appendChild(title);
  
        showTimes.forEach(time => {
          const btn = document.createElement('button');
          btn.innerText = time;
          btn.className = "show-btn";
  
          
          if (showMap[theater.theaterId] && showMap[theater.theaterId].includes(time)) {
            btn.classList.add("isBooked");
            btn.disabled = true; // extra safety
          }
  
          btn.addEventListener('click', () => {
            if (btn.classList.contains('isBooked')) return; // block clicking on booked ones
  
            btn.classList.toggle('selected');
  
            const show = {
              showDate: showdate,
              showTime: time,
              movieId: movieid,
              theaterId: theater.theaterId || theater.id
            };
  
            const index = selectedShows.findIndex(s =>
              s.theaterId === show.theaterId &&
              s.showTime === show.showTime &&
              s.showDate === show.showDate &&
              s.movieId === show.movieId
            );
  
            if (index === -1) {
              selectedShows.push(show);
            } else {
              selectedShows.splice(index, 1);
            }
          });
  
          theaterRow.appendChild(btn);
        });
  
        theaterContainer.appendChild(theaterRow);
      });
    })
    .catch(error => console.error(error));
}  
document.getElementById('showDate').addEventListener('change', renderTheaterRows);


submitBtn.addEventListener('click', () => {
    if (selectedShows.length === 0) {
        alert("No shows selected!");
        return;
    }

    selectedShows.forEach(show => {
        console.log(show);
        fetch('http://localhost:6947/api/v1/show/add', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(show)

        })
            .then(response => response.text())
            .then(data => console.log(data))
            .catch(error => console.error("Error creating show:", error));
              alert("Show and ShowSeats are Created");
    });
    Promise.all(promises).then(() => {
 // Clear the array correctly
  selectedShows.length = [];
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const movieCont = document.querySelector('.movies-list');

    // Create a horizontal scroll row
    const scrollRow = document.createElement("div");
    scrollRow.className = "card-container";

    fetch('http://localhost:6947/api/v1/Movie/get')
        .then(response => response.json())
        .then(movies => {
            for (const movie of movies) {
                const movi = document.createElement("div");
                movi.className = "movie";
                movi.innerHTML = `
                    <div class="card">
                        <img src="${movie.image}" class="card-img" alt="${movie.movieName}">
                        <div class="card-body">
                            <ion-icon name="heart-sharp"></ion-icon>
                            <p>${movie.rating} &ThinSpace; 76k votes &mdash; ${movie.duration} hrs</p>
                        </div>
                    </div>
                    <h3>${movie.movieName}</h3>
                    <p class="detail">Action/Drama/Romantic</p>
                `;
                scrollRow.appendChild(movi);
            }

            movieCont.appendChild(scrollRow);
        })
        .catch(error => console.error("Error: ", error));

    //  Attach click listener via event delegation
    movieCont.addEventListener('click', (event) => {
        const dateTab = document.querySelector(".date-container-Top");
        const ele = event.target.closest('.movie');
        if (!ele) return;

        const movieName = ele.querySelector('h3')?.innerText.trim();
        if (!movieName) return;

        fetch(`http://localhost:6947/api/v1/show/getshowes?movieName=${encodeURIComponent(movieName)}`)
            .then(res => res.json())
            .then(shows => {
                const uniqueDates = [...new Set(shows.map(s => s.showDate))];
                const dateContainer = document.getElementById('date-container');
                dateContainer.innerHTML = `<h3 id="mvishowtle">Select a date for - <span>${movieName}</span></h3>`;

                window.currentMovieShows = shows;

                uniqueDates.forEach(date => {
                    const dateBtn = document.createElement('button');
                    dateBtn.className = 'date-btn';
                    dateBtn.innerText = date;
                    dateBtn.dataset.date = date;
                    dateBtn.dataset.movieName = movieName;
                    dateContainer.appendChild(dateBtn);
                });

                dateTab.style.display = "block";
            })
            .catch(err => console.error('Error fetching shows:', err));
    });

    
    const dateContainer = document.getElementById('date-container');
    const showContainer = document.getElementById('show-container');
    const showTab = document.querySelector('.show-container-Top');

    dateContainer.addEventListener('click', (event) => {
        showTab.style.display = "block";
        const btn = event.target.closest('.date-btn');
        if (!btn) return;

        const selectedDate = btn.dataset.date;
        const movieName = btn.dataset.movieName;

        const filteredShows = window.currentMovieShows.filter(show => show.showDate === selectedDate);

        const theaterMap = {};
        filteredShows.forEach(show => {
            if (!theaterMap[show.theaterName]) {
                theaterMap[show.theaterName] = [];
            }
            theaterMap[show.theaterName].push(show);
        });

        showContainer.innerHTML = `<h3>Shows on ${selectedDate}</h3>`;

        Object.entries(theaterMap).forEach(([theater, times]) => {
            const theaterBlock = document.createElement('div');
            theaterBlock.className = 'theater-block';

            const title = document.createElement('h4');
            title.textContent = `${theater}`;
            theaterBlock.appendChild(title);

            times.forEach((show, index) => {
                const btn = document.createElement('button');
                btn.className = 'showtime-btn';
                btn.dataset.time = show.showTime;
                btn.dataset.showId = show.showId;
                console.log("show  ----> "+show.showid)
                btn.innerText = show.showTime;
                theaterBlock.appendChild(btn);

                if ((index + 1) % 4 === 0) {
                    const newline = document.createElement('br');
                    theaterBlock.appendChild(newline);
                }
            });

            showContainer.appendChild(theaterBlock);
        });
    });
});

const showContainer = document.getElementById('show-container');
const seatContainer = document.querySelector('#seat-container');
const seatTab = document.querySelector('.seat-container-Top');
const selectedseats = [];
let shid=0

showContainer.addEventListener('click', (event) => {
    const showbtn = event.target.closest('.showtime-btn');
    if (!showbtn) return; // Safeguard
    shid=0

    const showid =showbtn.dataset.showId;
    window.showButton = showid;
    shid=showid;
    seatContainer.innerHTML = "";

    // console.log("Show id this is ok ok "+showid);
    var indx = 0;

    fetch(`http://localhost:6947/api/v1/show/getshowSeats?showId=${showid}`)
        .then(response => response.json())
        .then(seats => {
            console.log(seats);
            seats.forEach((seate, index) => {
                const seatbtn = document.createElement('button');
                seatbtn.className = "seat-btn";
                if(seate.isBooked === true){
                    seatbtn.classList.add("isBooked")
                }
                seatbtn.id = seate.seatType;
                seatbtn.dataset.seatNo = seate.seatNo;
                seatbtn.innerText = seate.seatNo;
                seatbtn.dataset.seatType = seate.seatType;
                seatContainer.appendChild(seatbtn);

                // New line every 10 seats
                if ((indx + 1) % 7 === 0) {
                    seatContainer.appendChild(document.createElement('br'));
                }
                if (seats[indx]?.seatType === "CLASSIC" && seats[indx + 1]?.seatType === "PREMIUM") {
                    seatContainer.appendChild(document.createElement('br'));
                    indx = -1;
                }
                indx++;
            
                seatbtn.addEventListener('click', () => {
                                if (!seatbtn.classList.contains("isBooked")) {
                                    seatbtn.classList.toggle("isSelected");
                
                                    const seatNo = seatbtn.dataset.seatNo;
                                    if (seatbtn.classList.contains("isSelected")) {
                                        selectedseats.push(seatNo);
                                    } else {
                                        selectedseats = selectedseats.filter(s => s !== seatNo);
                                    }
                
                                    console.log("Selected Seats:", selectedseats);
                                }
                            });
                
            });
        })
        .catch(error => console.error('Error fetching seats:', error));
    seatTab.style.display = "block"; // Move this here so it's always triggered
});

//fetch for POST Ticket and selected Seates
const seatTabEmailInput = document.querySelector('.stfmeml'); // selects the email input
const seatTabSubmitBtn = document.querySelector('.stfmsbm'); // selects the submit button
const seatForm = document.querySelector('.seatForm'); // optional, for form handling

// Example: Get the email when the form is submitted
seatForm.addEventListener('submit', (e) => {
    e.preventDefault();


    if (selectedseats.length === 0) {
        alert("Select at least one seat!");
        return;
    }


    if (!loggedInUser) {
        document.getElementById('id05').style.display = 'block'; // open login popup
        
    }

    const email = loggedInUser.emailId.trim();

    if (email === "") {
        alert("Kindly login with your BookMyShow account first.");
        return;
    }

    fetch(`http://localhost:6947/api/v1/user?emailId=${encodeURIComponent(email)}`)
        .then(response => response.text())
        .then(data => {
            if (data === "") {
                alert("Email mismatch! User not found on server.");
                return;
            }

            const seatData = {
                requestedSeats: selectedseats,
                emailId: email,
                showId: window.showButton
            };

            return fetch('http://localhost:6947/api/v1/ticket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(seatData)
            });
        })
        .then(response => {
            if (response && response.ok) return response.text();
        })
        .then(data => {
            if (data) {
                alert("🎉 Booking Successful!");
                selectedseats = []; // clear selected seats
            }
        })
        .catch(error => {
            console.error("Booking failed:", error);
            alert("Something went wrong while booking. Try again!");
        });
});


const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  if (!email || !password) {
    alert("Enter both email and password!");
    return;
  }

  fetch(`http://localhost:6947/api/v1/user?emailId=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`)
    .then(res => {
      if (!res.ok) throw new Error("Invalid credentials");
      return res.json();
    })
    .then(user => {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      loggedInUser = user;
      alert(" Login Successful!");
      document.getElementById('id01').style.display = 'none';
    })
    .catch(() => alert(" Invalid email or password!"));
});


const ticketEmal = document.querySelector(".ticketEmail");
const ticketBtn = document.querySelector(".ticketbtn");
const ticketContainer = document.querySelector(".ticket-container");

ticketBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = ticketEmal.value.trim(); 
    fetch(`http://localhost:6947/api/v1/user?emailId=${encodeURIComponent(email)}`)
        .then(response => {
            return response.text();
            //if throw error here move to catch that's it.
        })
        .then(data => {
            if (data === "") {
                alert("Email mismatch! Expected: user Not Found");
                return;
            }
            const ticketscont = document.createElement('div');
            ticketscont.className="tickets";
            ticketContainer.innerHTML = "";
            fetch(`http://localhost:6947/api/v1/ticket?Email=${encodeURIComponent(email)}`)
            .then(response => response.json())
            .then(tickets => {
                tickets.forEach(ticket => {
                const userTicket = document.createElement('div')
                userTicket.className="userticket";
                userTicket.innerHTML=`
                <div>
                    <div><h3>${ticket.movieName}</h3></div>
                    <div> <p><strong>Theater Name: </strong> ${ticket.theaterName}</p></div>
                    <div> <p><strong>Show Date: </strong> ${ticket.showDate}</p></div>
                    <div>  <p><strong>Show Time:</strong> ${ticket.showTime}</p></div>
                    <div> <p><strong>Booked SeatsNo:</strong> ${ticket.bookedSeats}</p></div>
                    <div> <p><strong>Amount:</strong> ₹${ticket.totalAmount}</p></div>
                </div> `;
                
                  ticketscont.appendChild(userTicket);
                });
                ticketContainer.appendChild(ticketscont);
            })
            .catch(error => console.error('Tickets failed:', error));
        })
        .catch(error => {
            console.error('Email validation failed:', error);
            alert("User not found or invalid email.");
        });
});

// User Register
document.getElementById("userForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    var user = {
      name: document.getElementById("name").value.trim(),
      age: parseInt(document.getElementById("age").value.trim()),
      emailId: document.getElementById("emailId").value.trim(),
      mobileNo: document.getElementById("mobileNo").value.trim(),
      password: document.getElementById("password").value.trim()
    };
  
    if (!user.name || !user.age || !user.emailId || !user.mobileNo || !user.password) {
      alert("Please fill all fields before submitting.");
      return;
    }
  
    fetch("http://localhost:6947/api/v1/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    })
      .then(function (response) {
        return response
      })
      .then(function (data) {
        if (data) {
        //   localStorage.setItem("user", JSON.stringify(data));
        document.getElementById("name").innerHTML=""
        document.getElementById("emailId").innerHTML=""
        document.getElementById("mobileNo").innerHTML=""
        document.getElementById("password").innerHTML=""
          document.getElementById("id01").style.display = "none";
          alert("Registration Successful! Welcome ");
  
        //   var signBtn = document.querySelector(".signin");
        //   if (signBtn) signBtn.textContent = "Hi, " + data.name.split(" ")[0];
        }
      })
      .catch(function (err) {
        console.error("Error:", err);
        alert("Cannot connect to backend on port 6947.");
      });
  });
  

  document.getElementById('getTicketsBtn').addEventListener('click', () => {
    const email = document.getElementById('emailInput').value.trim();
    const ticketList = document.getElementById('ticketList');
  
    if (!email) {
      alert("Please enter your email");
      return;
    }
  
    ticketList.innerHTML = "<p>Loading your tickets...</p>";
  
    fetch(`http://localhost:6947/api/v1/ticket?Email=${encodeURIComponent(email)}`)
      .then(res => {
        if (!res.ok) throw new Error("No tickets found or server error");
        return res.json();
      })
      .then(tickets => {
        if (tickets.length === 0) {
          ticketList.innerHTML = "<p>No tickets found for this email.</p>";
          return;
        }
  
        ticketList.innerHTML = "";
        tickets.forEach(ticket => {
          const card = document.createElement('div');
          card.className = "ticket-card";
          card.innerHTML = `
            <h3>${ticket.movieName}</h3>
            <p><strong>Theater:</strong> ${ticket.theaterName}</p>
            <p><strong>Date:</strong> ${ticket.showDate}</p>
            <p><strong>Time:</strong> ${ticket.showTime}</p>
            <p><strong>Seats:</strong> ${ticket.bookedSeats}</p>
            <p><strong>Total Amount:</strong> ₹${ticket.totalAmount}</p>
          `;
          ticketList.appendChild(card);
        });
      })
      .catch(err => {
        console.error(err);
        ticketList.innerHTML = "<p style='color:red;'>Error fetching tickets. Please try again later.</p>";
      });
  });


  const logoutBtn = document.getElementById("logoutBtn")

logoutBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("loggedInUser");
      loggedInUser = null;
      alert("You have been logged out successfully!");
      updateLoginUI();
    }
  });
  