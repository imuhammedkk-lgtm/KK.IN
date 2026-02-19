// Navigation Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Hero Slider Logic
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;

function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    slides[index].classList.add('active');
    dots[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

setInterval(nextSlide, 5000); // Auto slide every 5s

dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
        currentSlide = idx;
        showSlide(currentSlide);
    });
});

// Modal Logic
const modal = document.getElementById('orderModal');
const closeBtn = document.querySelector('.close-modal');
const modalProductName = document.getElementById('modalProductName');

document.querySelectorAll('.buy-btn').forEach(buyBtn => {
    buyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Find the product card
        const productCard = buyBtn.closest('.product-card');
        const name = productCard.getAttribute('data-name');

        modalProductName.value = name;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

closeBtn.onclick = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
};

window.onclick = (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
};

// Interactive Gallery Logic
document.querySelectorAll('.interactive-gallery').forEach(gallery => {
    const mainImg = gallery.querySelector('.main-img');
    const thumbs = gallery.querySelectorAll('.thumb');

    thumbs.forEach(thumb => {
        const updateImg = () => {
            mainImg.src = thumb.src;
            // Add a small fade effect
            mainImg.style.opacity = '0.5';
            setTimeout(() => { mainImg.style.opacity = '1'; }, 100);
        };

        thumb.onmouseover = updateImg;
        thumb.onclick = (e) => {
            e.stopPropagation();
            updateImg();
        };
    });
});

// Truck Button Animation (GSAP)
document.querySelectorAll('.truck-button').forEach(button => {
    button.addEventListener('click', e => {
        // Prevent form submission immediately to show animation
        // However, we want the form to submit to Web3Forms.
        // We'll manage this by preventing default, running the animation, 
        // and then actually submitting the form.

        const form = button.closest('form');

        if (!button.classList.contains('done')) {

            if (!button.classList.contains('animation')) {

                // Validate form first
                if (!form.checkValidity()) {
                    form.reportValidity();
                    return;
                }

                e.preventDefault();
                button.classList.add('animation');

                let box = button.querySelector('.box'),
                    truck = button.querySelector('.truck');

                gsap.to(button, {
                    '--box-s': 1,
                    '--box-o': 1,
                    duration: .3,
                    delay: .5
                });

                gsap.to(box, {
                    x: 0,
                    duration: .4,
                    delay: .7
                });

                gsap.to(button, {
                    '--hx': -5,
                    '--bx': 50,
                    duration: .18,
                    delay: .92
                });

                gsap.to(box, {
                    y: 0,
                    duration: .1,
                    delay: 1.15
                });

                gsap.set(button, {
                    '--truck-y': 0,
                    '--truck-y-n': -26
                });

                gsap.to(button, {
                    '--truck-y': 1,
                    '--truck-y-n': -25,
                    duration: .2,
                    delay: 1.25,
                    onComplete() {
                        gsap.timeline({
                            onComplete() {
                                button.classList.add('done');
                                // After animation finishes, we can handle the final state.
                                // Submit the form via Fetch to Web3Forms
                                submitForm(form);
                            }
                        }).to(truck, {
                            x: 0,
                            duration: .4
                        }).to(truck, {
                            x: 40,
                            duration: 1
                        }).to(truck, {
                            x: 20,
                            duration: .6
                        }).to(truck, {
                            x: 96,
                            duration: .4
                        });
                        gsap.to(button, {
                            '--progress': 1,
                            duration: 2.4,
                            ease: "power2.in"
                        });
                    }
                });

            }

        }
    });
});

async function submitForm(form) {
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: json
        });

        const result = await response.json();
        if (result.success) {
            console.log("Success:", result);
            // Optionally close the modal or show a message
            setTimeout(() => {
                alert("Order Placed Successfully!");
                location.reload(); // Reset the page
            }, 1000);
        } else {
            alert("Something went wrong. Please try again.");
        }
    } catch (e) {
        console.error(e);
        alert("Something went wrong. Please try again.");
    }
}

// Reveal Animations (GSAP)
gsap.from('.hero-content h1', { opacity: 0, y: 30, duration: 1, delay: 0.5 });
gsap.from('.hero-content p', { opacity: 0, y: 20, duration: 1, delay: 0.8 });
gsap.from('.hero-content .btn-primary', { opacity: 0, y: 20, duration: 1, delay: 1.1 });

// ScrollReveal would be better but simple GSAP works
const revealSections = document.querySelectorAll('.section');
revealSections.forEach(section => {
    gsap.from(section, {
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
        },
        opacity: 0,
        y: 50,
        duration: 1
    });
});
