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

// All Creating Movies  and  Showes.
const moveForm = document.querySelector('.movieForm');
const movbtn = document.getElementById('mvbtn');
var showslimit,movieid;
movbtn.addEventListener('click',(e)=>{
    e.preventDefault();
    const mvData = {
        movieName:moveForm.elements['name'].value,
        duration:moveForm.elements['durt'].value,
        releaseDate:moveForm.elements['date'].value,
        language:moveForm.elements['lang'].value,
        rating:moveForm.elements['ratg'].value
    };
    showslimit = moveForm.elements['showno'].value;
    fetch('',{
        method:"POST",
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(mvData)
    })
    .then(reponse => reponse.text())
    .then(data => {
        movieid = data;
        // fetch  Theaters
        let theaterList = [];
        fetch('')
        .then(response => response.json())
        .then(data => theaterList =data)
        .catch(error => console.error(error))
        // char GPT see --> Question 
        // here I will create one side theater and next to it 4 timings of showes for each Theater
        // to create a showes  -- >  this are one row 
        // so I want to repeate the same for all list of theaters 
    })
    .catch(error => {
        console.error("error: "+ error);
    });
});
showsForm.addEventListener('click',(e) => {
     // char GPT see --> Question 
     // here every time creating some showes to each movie it should fetch that times to create show 
     // so how to get details(showTime,showDate,movieId,TheaterId) at the time of clicking showes 
     // and I have to create one dropdown that is ebow the theater   shwTime1  shwTime2 shwTime3 , like this 
     // when I select dropdown same Theater and showes should come to specific date 
     // so these are all Im using for owner to create a showes 
     // give answers
            e.preventDefault();
            const showData = {
                showDate : 
                showTime:
                movieId:movieid,
                theaterId:
            };
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
});
