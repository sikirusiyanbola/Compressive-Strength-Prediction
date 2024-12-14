document.addEventListener('DOMContentLoaded', function () {

    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('nav .nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            window.scrollTo({
                top: targetElement.offsetTop - 50,
                behavior: 'smooth'
            });
        });
    });

    // Form submission for prediction
    const predictionForm = document.querySelector('form');
    if (predictionForm) {
        predictionForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Disable the submit button to prevent multiple submissions
            const submitButton = predictionForm.querySelector('button');
            submitButton.disabled = true;
            submitButton.innerHTML = "Processing...";

            const formData = new FormData(predictionForm);
            fetch('/predict', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Display predicted compressive strength
                if (data.prediction) {
                    const resultSection = document.querySelector('.prediction-result');
                    resultSection.innerHTML = `<h3>Predicted Compressive Strength: ${data.prediction} MPa</h3>`;
                } else {
                    const resultSection = document.querySelector('.prediction-result');
                    resultSection.innerHTML = `<h3>Prediction failed. Please check your inputs.</h3>`;
                }
                submitButton.disabled = false;
                submitButton.innerHTML = "Predict Compressive Strength";
            })
            .catch(error => {
                console.error('Error:', error);
                const resultSection = document.querySelector('.prediction-result');
                resultSection.innerHTML = `<h3>There was an error processing your request. Please try again later.</h3>`;
                submitButton.disabled = false;
                submitButton.innerHTML = "Predict Compressive Strength";
            });
        });
    }

    // Display prediction result
    const predictionResult = document.querySelector('.prediction-result');
    if (predictionResult) {
        predictionResult.style.display = 'none';
    }

    // Show result after form submission
    const resultSection = document.querySelector('.prediction-result');
    if (resultSection) {
        resultSection.style.display = 'block';
    }

    // Toggle about-us sections on small screens
    const aboutSections = document.querySelectorAll('.about-section');
    aboutSections.forEach(section => {
        section.addEventListener('click', function () {
            section.classList.toggle('expanded');
        });
    });

    // Hide/show sections for about-us page dynamically
    const toggleButtons = document.querySelectorAll('.about-toggle');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function () {
            const content = this.nextElementSibling;
            if (content.style.display === 'block') {
                content.style.display = 'none';
            } else {
                content.style.display = 'block';
            }
        });
    });

});