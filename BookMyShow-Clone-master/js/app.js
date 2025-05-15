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
        alert("Theater Successfully added: " + data+""+tid);
        theaterFrm.reset();
    })
    .catch(error => {
        console.error("Error:", error);
    });    
});