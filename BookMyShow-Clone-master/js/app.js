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
}, 10000);

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

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

const theaterBtn = document.querySelector('thBtn');

// java scrippt code Theater

const theaterFrm = document.querySelector('.theaterForm');
const thtBtb = document.getElementById('thbtn');
var tid=0;
theaterFrm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const thData = {
        name:theaterFrm.elements['name'].value,
        address:theaterFrm.elements['adres'].value,
        noOfScreens:theaterFrm.elements['scren'].value
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
        tid = data;
    
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
        alert("Theater Successfully added: "+tid);
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
let showslimit, movieid=0;
const theaterList = []; // keep this global for reuse

movbtn.addEventListener('click', (e) => {
    e.preventDefault();

    const mvData = {
        movieName: moveForm.elements['name'].value,
        duration: moveForm.elements['durt'].value,
        releaseDate: moveForm.elements['date'].value,
        language: moveForm.elements['lang'].value,
        rating: moveForm.elements['ratg'].value
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
        console.log("movieId : "+movieid);

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
    theaterContainer.innerHTML = ''; // Clear previous content

    const showDateInput = document.getElementById('showDate');
    if (!showDateInput) {
        console.error("Show date input not found!");
        return;
    }
    
    const showdate = showDateInput.value;
    if (!showdate) {
        console.warn("Select a show date first.");
        return;
    }

    theaterList.forEach(theater => {
        const theaterRow = document.createElement('div');
        theaterRow.classList.add('theater-row');

        const title = document.createElement('h4');
        const displayName = (theater.name === "") ? "TheaterEmt" : theater.name;
        title.innerText = `Theater: ${displayName}`;
        theaterRow.appendChild(title);

        showTimes.forEach(time => {
            const btn = document.createElement('button');
            btn.innerText = time;
            btn.classList.add('show-btn');

            // Toggle selection
            btn.addEventListener('click', () => {
                btn.classList.toggle('selected');
                const Thid = theater.theaterId || theater.id;
                const show = {
                    showDate : showdate,
                    showTime: time,
                    movieId: movieid,
                    theaterId: Thid
                };

                 //selectedShows.push(show);

                // Toggle show in selectedShows array
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

        theaterContainer.insertAdjacentElement('afterbegin',theaterRow);
    });
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
        fetch('http://localhost:6959/api/v1/show/add',{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(show)
            
        })
        .then(response => response.text())
        .then(data => alert("Created show: " + data))
        .catch(error => console.error("Error creating show:", error));
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
