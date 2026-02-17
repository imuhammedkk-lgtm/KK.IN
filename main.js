// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Three.js Setup
const canvas = document.querySelector('#canvas3d');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xf97316, 2, 10);
pointLight.position.set(-3, 3, 3);
scene.add(pointLight);

// Create a Tech-Looking "Fan Dust Cleaner" 3D Model
const cleanerGroup = new THREE.Group();

// Materials
const whiteMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.1,
    metalness: 0.1
});
const blueMaterial = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    roughness: 0.2,
    metalness: 0.5
});
const darkMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f172A,
    roughness: 0.5
});
const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf97316,
    metalness: 0,
    roughness: 0.1,
    transmission: 0.9,
    transparent: true,
    opacity: 0.5
});

// Main Body (Handle)
const handleBox = new THREE.BoxGeometry(0.8, 2.5, 0.8);
const handle = new THREE.Mesh(handleBox, whiteMaterial);
// Round the bottom a bit
const handleBottom = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.5, 32), whiteMaterial);
handleBottom.position.y = -1.25;
cleanerGroup.add(handle);
cleanerGroup.add(handleBottom);

// Accent Panels
const panelGeom = new THREE.BoxGeometry(0.85, 1, 0.85);
const panel = new THREE.Mesh(panelGeom, blueMaterial);
panel.position.y = 0.5;
cleanerGroup.add(panel);

// Power Button
const buttonGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 32);
const button = new THREE.Mesh(buttonGeom, darkMaterial);
button.rotation.x = Math.PI / 2;
button.position.set(0, 0.5, 0.4);
cleanerGroup.add(button);

// LED Light
const ledGeom = new THREE.SphereGeometry(0.05, 16, 16);
const ledMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const led = new THREE.Mesh(ledGeom, ledMat);
led.position.set(0, 0.8, 0.42);
cleanerGroup.add(led);

// Neck
const neckGeom = new THREE.CylinderGeometry(0.3, 0.2, 0.8, 32);
const neck = new THREE.Mesh(neckGeom, darkMaterial);
neck.position.y = 1.6;
cleanerGroup.add(neck);

// Head
const headGeom = new THREE.SphereGeometry(0.6, 32, 32);
const head = new THREE.Mesh(headGeom, whiteMaterial);
head.position.y = 2.2;
head.scale.y = 1.2;
cleanerGroup.add(head);

// Fan/Suction Part (Inside Head)
const fanGeom = new THREE.TorusGeometry(0.4, 0.05, 16, 100);
const fan = new THREE.Mesh(fanGeom, blueMaterial);
fan.rotation.x = Math.PI / 2;
fan.position.y = 2.2;
cleanerGroup.add(fan);

// Bristles (Tech Version)
const bristleContainer = new THREE.Group();
for (let i = 0; i < 12; i++) {
    const bGeom = new THREE.CylinderGeometry(0.02, 0.02, 1, 8);
    const b = new THREE.Mesh(bGeom, new THREE.MeshStandardMaterial({ color: 0xcccccc }));
    const angle = (i / 12) * Math.PI * 2;
    b.position.x = Math.cos(angle) * 0.4;
    b.position.z = Math.sin(angle) * 0.4;
    b.position.y = 3;
    b.rotation.x = (Math.random() - 0.5) * 0.2;
    bristleContainer.add(b);
}
cleanerGroup.add(bristleContainer);

scene.add(cleanerGroup);

camera.position.z = 6;
camera.position.y = 0.5;

// Animation Loop
let frame = 0;
function animate() {
    requestAnimationFrame(animate);
    frame += 0.01;

    cleanerGroup.rotation.y += 0.005;
    cleanerGroup.position.y = Math.sin(frame) * 0.1;

    // Subtle bristle movement
    bristleContainer.rotation.y += 0.02;

    renderer.render(scene, camera);
}

animate();

// Handle Resize
window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
});

// GSAP Animations
gsap.from(".reveal-text", {
    duration: 1.5,
    y: 100,
    opacity: 0,
    stagger: 0.2,
    ease: "power4.out"
});

gsap.from(".feature-card", {
    scrollTrigger: {
        trigger: ".features",
        start: "top 80%",
    },
    duration: 1,
    y: 50,
    opacity: 0,
    stagger: 0.2,
    ease: "power3.out"
});

gsap.from(".gallery-item", {
    scrollTrigger: {
        trigger: ".gallery",
        start: "top 80%",
    },
    duration: 1,
    scale: 0.8,
    opacity: 0,
    stagger: 0.2,
    ease: "power2.out"
});

// Interactive 3D Model on Scroll
gsap.to(cleanerGroup.position, {
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1
    },
    x: 2.5,
    y: -0.5,
    rotation: Math.PI / 4
});

// Checkout Modal Logic
const modal = document.getElementById("checkoutModal");
const buyBtns = document.querySelectorAll('.btn-primary, .floating-cta');
const closeBtn = document.querySelector(".close-modal");
const orderForm = document.getElementById("orderForm");

buyBtns.forEach(btn => {
    btn.onclick = (e) => {
        if (btn.innerText.includes("Buy Now") || btn.innerText.includes("Order Now")) {
            e.preventDefault();
            modal.style.display = "block";

            // Calculate Delivery Date (10 days from today)
            const deliverySpan = document.getElementById("deliveryDate");
            const date = new Date();
            date.setDate(date.getDate() + 10);
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            deliverySpan.innerText = date.toLocaleDateString('en-IN', options);
        }
    }
});

closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; }

// Dynamic Price Calculation
const unitPrice = 499;
const qtyInput = document.getElementById("orderQty");
const hiddenQty = document.getElementById("hiddenQty");
const priceDisplay = document.getElementById("displayPrice");

qtyInput.oninput = () => {
    const total = unitPrice * qtyInput.value;
    priceDisplay.innerText = `₹${total}`;
    hiddenQty.value = qtyInput.value; // Sync with hidden input for Web3Forms
};

// Form Submission to Web3Forms with Animation
orderForm.onsubmit = async (e) => {
    e.preventDefault();

    const orderButton = orderForm.querySelector('.order');
    if (orderButton.classList.contains('animate')) return;

    // Start Animation
    orderButton.classList.add('animate');

    // Prepare Web3Forms submission
    const formData = new FormData(orderForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        });

        // Wait for animation to finish (at least 10s) before showing result
        setTimeout(() => {
            modal.style.display = "none";
            orderForm.reset();
            orderButton.classList.remove('animate');
            priceDisplay.innerText = `₹${unitPrice}`;
            hiddenQty.value = "1";

            if (response.status === 200) {
                alert("Order Placed Successfully! Check your email for confirmation.");
            } else {
                alert("Something went wrong. Please try again.");
            }
        }, 10000);

    } catch (error) {
        console.log(error);
        orderButton.classList.remove('animate');
        alert("Submission failed. Please check your connection.");
    }
};


