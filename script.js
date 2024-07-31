const token = "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";
const inputTxt = document.getElementById("input");
const image = document.getElementById("image");
const generateBtn = document.getElementById("generate_btn");
const downloadBtn = document.getElementById("download-btn");
const shareBtn = document.getElementById("share-btn");
const styleSelect = document.getElementById("style-select");
const sizeSelect = document.getElementById("size-select");
const loadingDiv = document.getElementById("loading");
const imageContainer = document.querySelector(".image-container");
const aboutLink = document.getElementById("about-link");
const aboutModal = document.getElementById("about-modal");
const closeModal = document.querySelector(".close");

async function query(prompt, style, size) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                "inputs": inputTxt.value + ", " + style + ", " + size
            })
        }
    );
    const result = await response.blob();
    return result;
}

function showLoading() {
    loadingDiv.classList.remove("hidden");
    imageContainer.classList.add("hidden");
}

function hideLoading() {
    loadingDiv.classList.add("hidden");
    imageContainer.classList.remove("hidden");
}

generateBtn.addEventListener("click", async function () {
    if (!inputTxt.value.trim()) {
        alert("Please enter a text prompt.");
        return;
    }

    showLoading();

    try {
        const response = await query(inputTxt.value, styleSelect.value, sizeSelect.value);
        const objectURL = URL.createObjectURL(response);
        image.src = objectURL;
        hideLoading();
    } catch (error) {
        console.error("Error generating image:", error);
        alert("An error occurred while generating the image. Please try again.");
        hideLoading();
    }
});

downloadBtn.addEventListener("click", function() {
    if (image.src) {
        const a = document.createElement("a");
        a.href = image.src;
        a.download = "generated-image.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
});

shareBtn.addEventListener("click", function() {
    if (image.src && navigator.share) {
        navigator.share({
            title: 'Generated Image',
            text: 'Check out this AI-generated image!',
            url: image.src
        }).then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
        alert("Sharing is not supported on this browser or no image has been generated yet.");
    }
});

aboutLink.addEventListener("click", function(e) {
    e.preventDefault();
    aboutModal.classList.remove("hidden");
});

closeModal.addEventListener("click", function() {
    aboutModal.classList.add("hidden");
});

window.addEventListener("click", function(event) {
    if (event.target == aboutModal) {
        aboutModal.classList.add("hidden");
    }
});