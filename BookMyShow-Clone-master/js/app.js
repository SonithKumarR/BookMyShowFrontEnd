const carousel = document.querySelector('.carousel');
let sliders = [];

let slideIndex = 0; // to track current slide index.

const createSlide = () => {
    if (slideIndex >= movies.length) {
        slideIndex = 0;
    }

    // creating DOM element
    let slide = document.createElement('div');
    let imgElement = document.createElement('img');

    // attaching all elements
    imgElement.appendChild(document.createTextNode(''));
    slide.appendChild(imgElement);
    carousel.appendChild(slide);

    // setting up image
    imgElement.src = movies[slideIndex].image;
    slideIndex++;

    // setting elements classname
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

//side navigation bar

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

    /* other code */

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

// java scrippt code Theater

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
    fetch('http://localhost:6959/api/v1/theater/addTh', {
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

            return fetch('http://localhost:6959/api/v1/theater/addSeat', {
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

/// All Creating Movies and Shows.
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
        language: moveForm.elements['lang'].value,
        rating: moveForm.elements['ratg'].value,
        image : moveForm.elements['showno'].value
    };

    showslimit = moveForm.elements['showno'].value;

    fetch('http://localhost:6959/api/v1/Movie', {
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
            fetch('http://localhost:6959/api/v1/theater/theaterList')
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

// Predefined show times
const showTimes = ["10:00", "13:00", "16:00", "19:00", "22:00"];

// Dynamically generate UI
function renderTheaterRows() {
    theaterContainer.innerHTML = '';

    const showDateInput = document.getElementById('showDate');
    const showdate = showDateInput?.value;
    if (!showdate) return;

    fetch(`http://localhost:6959/api/v1/show/getshowsbydate?showDate=${encodeURIComponent(showdate)}`)
        .then(response => response.json())
        .then(shows => {
            const showMap = {};

            shows.forEach(show => {
                const theaterId = show.theaterId;
                const showTime = show.showTime.substring(0, 5); // Normalize to "HH:mm"
                if (!showMap[theaterId]) {
                    showMap[theaterId] = [];
                }
                showMap[theaterId].push(showTime);
            });

            //  Now build UI AFTER showMap is ready
            theaterList.forEach(theater => {
                const theaterRow = document.createElement('div');
                theaterRow.classList.add('theater-row');

                const title = document.createElement('h4');
                title.innerText = `Theater: ${theater.name || "TheaterEmt"}`;
                theaterRow.appendChild(title);

                showTimes.forEach(time => {
                    const btn = document.createElement('button');
                    btn.innerText = time;
                    btn.className = "show-btn";
                    //let formattedTime = time + ":00";

         // Check if this time already exists for this theater_Id in showMap
            if(showMap[theater.theaterId] && showMap[theater.theaterId].includes(time) ){
                btn.id="isBooked";
                console.log(time);
            }

                    // Add click listener
                    btn.addEventListener('click', () => {
                        //if (btn.classList.contains('isBooked')) return;

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
// Attach event listener after DOM content loaded
/*document.addEventListener("DOMContentLoaded", () => {
    const showDateInput = document.getElementById('showDate');
    if (showDateInput) {
        showDateInput.addEventListener('change', renderTheaterRows);
    }
});*/

submitBtn.addEventListener('click', () => {
    if (selectedShows.length === 0) {
        alert("No shows selected!");
        return;
    }

    selectedShows.forEach(show => {
        console.log(show);
        fetch('http://localhost:6959/api/v1/show/add', {
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

/*showsForm.addEventListener('click',(e) => {
            e.preventDefault();
           
            fetch('', {
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(showData)
            })
            .then(response => response.text())
            .then(data =>{})
            .catch(error => console.error("error: "+error) );
});*/

document.addEventListener('DOMContentLoaded', () => {
    const movieCont = document.querySelector('.movies-list');

    // Create a horizontal scroll row
    const scrollRow = document.createElement("div");
    scrollRow.className = "card-container";

    fetch('http://localhost:6959/api/v1/Movie/get')
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

        fetch(`http://localhost:6959/api/v1/show/getshowes?movieName=${encodeURIComponent(movieName)}`)
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

    // Date button click
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
            theaterMap[show.theaterName].push(show); // push whole show object
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

showContainer.addEventListener('click', (event) => {
    const showbtn = event.target.closest('.showtime-btn');
    if (!showbtn) return; // Safeguard

    const showid = showbtn.dataset.showId;
    window.showButton = showid;
    seatContainer.innerHTML = "";

    console.log(showid);
    var indx = 0;
    // Fetch all show seats
    fetch(`http://localhost:6959/api/v1/show/getshowSeats?showId=48`)
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
                /*seatbtn.addEventListener('click', () => {
                    selectedseats.push(seate.seatNo);
                });
                */ seatContainer.addEventListener('click', (event) => {
                    const seat = event.target.closest('.seat-btn');
                    seat.classList.add('isSelected');
                    selectedseats.push(seat.dataset.seatNo);
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
    e.preventDefault(); // Prevent page reload
    if(selectedseats.length === 0){
        alert("Select atleast one seat! : No seats are selected");
        return;
    }

    const email = seatTabEmailInput.value.trim();

    if (email === "") {
        alert("Kindly Enter Your BookMyShow Email");
        return;
    }

    // Validate email against backend
    fetch(`http://localhost:6959/api/v1/user?emailId=${encodeURIComponent(email)}`)
        .then(response => {
            return response.text();
            //if throw error here move to catch that's it.
        })
        .then(data => {
            if (data === "") {
                alert("Email mismatch! Expected: user Not Found");
                return;
            }

            // Extract seat numbers only if needed
            
            console.log(selectedseats);
                    console.log(email);
                    console.log(data.emailId);
                    const seatData = {
                        requestedSeats: selectedseats,
                        emailId: email,
                        showId: 48 // window.showButton
                    };
            fetch('http://localhost:6959/api/v1/ticket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(seatData)
            })
            .then(response => response.text())
            .then(data => {
                alert("Booking Successful!\n");
                selectedseats = []; // Clear after success if needed
            })
            .catch(error => console.error('Booking failed:', error));
        })
        .catch(error => {
            console.error('Email validation failed:', error);
            alert("User not found or invalid email.");
        });
});

const ticketEmal = document.querySelector(".ticketEmail");
const ticketBtn = document.querySelector(".ticketbtn");
const ticketContainer = document.querySelector(".ticket-container");

ticketBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = ticketEmal.value.trim(); 
    fetch(`http://localhost:6959/api/v1/user?emailId=${encodeURIComponent(email)}`)
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
            fetch(`http://localhost:6959/api/v1/ticket?Email=${encodeURIComponent(email)}`)
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




