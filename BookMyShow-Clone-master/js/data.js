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

/*if user click on submit button open login page then book ticket <form class="seatForm">
        <input type="email" name="email" class="stfmeml" placeholder="Enter your email" required />
        <input type="submit" class="stfmsbm" />
    </form>  see here //fetch for POST Ticket and selected Seates
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
    fetch(`http://localhost:6953/api/v1/user?emailId=${encodeURIComponent(email)}`)
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
                        showId:  window.showButton
                    };
            fetch('http://localhost:6953/api/v1/ticket', {
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
});   , every time if they click open login page like add this and you only put condition if login then processd */