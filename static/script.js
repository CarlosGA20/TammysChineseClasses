// Hero shapes data and animation
const heroShapes = [
  // Left side
  {
    type: "circle",
    side: "left",
    top: "10%",
    color: "#B5EAEA",
    size: 60,
    landing: "20px",
  },
  {
    type: "square",
    side: "left",
    top: "35%",
    color: "#FFD1DC",
    size: 50,
    landing: "80px",
  },
  {
    type: "triangle",
    side: "left",
    top: "60%",
    color: "#E2C2FF",
    size: 70,
    landing: "120px",
  },
  {
    type: "circle",
    side: "left",
    top: "75%",
    color: "#B5EAD7",
    size: 40,
    landing: "60px",
  },
  {
    type: "triangle",
    side: "left",
    top: "20%",
    color: "#FFF5BA",
    size: 55,
    landing: "150px",
  },
  // Right side
  {
    type: "square",
    side: "right",
    top: "15%",
    color: "#FFD1DC",
    size: 60,
    landing: "100px",
  },
  {
    type: "circle",
    side: "right",
    top: "40%",
    color: "#B5EAEA",
    size: 50,
    landing: "60px",
  },
  {
    type: "triangle",
    side: "right",
    top: "65%",
    color: "#E2C2FF",
    size: 70,
    landing: "140px",
  },
  {
    type: "square",
    side: "right",
    top: "80%",
    color: "#B5EAD7",
    size: 40,
    landing: "30px",
  },
  {
    type: "circle",
    side: "right",
    top: "25%",
    color: "#FFF5BA",
    size: 55,
    landing: "180px",
  },
];

// Contact form state
let submitted = false;
let turnstileToken = false;
let submitBtn;

// Generate hero shapes on page load
document.addEventListener("DOMContentLoaded", function () {
  generateHeroShapes();
  setupContactForm();
});

function generateHeroShapes() {
  const container = document.getElementById("hero-shapes");

  heroShapes.forEach((shape) => {
    const shapeElement = document.createElement("div");
    shapeElement.className = `hero-shape hero-shape-${shape.type} hero-shape-${shape.side}`;

    const delay = 0.2 * Math.random();

    shapeElement.style.cssText = `
            top: ${shape.top};
            ${shape.side}: -120px;
            width: ${shape.type === "triangle" ? "0" : shape.size + "px"};
            height: ${shape.type === "triangle" ? "0" : shape.size + "px"};
            ${shape.type === "circle" || shape.type === "square" ? `background: ${shape.color};` : ""}
            ${shape.type === "square" ? "border-radius: 0.3rem;" : ""}
            z-index: 1;
            opacity: 0.8;
            animation-delay: ${delay}s;
            --landing: ${shape.landing};
        `;

    if (shape.type === "triangle") {
      const triangleInner = document.createElement("div");
      triangleInner.className = "triangle-shape";
      triangleInner.style.cssText = `
                border-left: ${shape.size / 2}px solid transparent;
                border-right: ${shape.size / 2}px solid transparent;
                border-bottom: ${shape.size}px solid ${shape.color};
            `;
      shapeElement.appendChild(triangleInner);
    }

    container.appendChild(shapeElement);
  });
}

function setupContactForm() {
  const form = document.getElementById("contact-form");
  const formContainer = document.getElementById("contact-form-container");
  const successMessage = document.getElementById("success-message");
  submitBtn = document.getElementById("submit-btn");

  form.addEventListener("submit", handleSubmit);

  // Set up global captcha callbacks
  window.onTurnstileSuccess = onTurnstileSuccess;
  window.onTurnstileError = onTurnstileError;
}

async function handleSubmit(event) {
  event.preventDefault();

  if (!turnstileToken) {
    alert("Please complete the security verification.");
    return;
  }

  const form = event.target;
  const data = Object.fromEntries(new FormData(form).entries());
  data["cf-turnstile-response"] = turnstileToken;

  try {
    const response = await fetch("https://submit-form.com/hKw96ZEIR", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log(result);

    if (response.ok) {
      submitted = true;
      document.getElementById("contact-form-container").style.display = "none";
      document.getElementById("success-message").style.display = "block";
    } else {
      alert("There was a problem submitting the form. Please try again.");
    }
  } catch (error) {
    alert("There was a problem submitting the form. Please try again.");
  }
}

function onTurnstileSuccess(token) {
  turnstileToken = token;
  if (submitBtn) submitBtn.disabled = false;
}

function onTurnstileError() {
  turnstileToken = null;
  if (submitBtn) submitBtn.disabled = true;
  alert("Security verification failed. Please try again.");
}
