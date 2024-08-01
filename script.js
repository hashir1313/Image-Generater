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

async function query(prompt, style, size) {
    let stylePrompt;
    switch(style) {
        case 'realistic':
            stylePrompt = 'photorealistic, highly detailed, professional photography';
            break;
        case 'cartoon':
            stylePrompt = 'cartoon style, vibrant colors, exaggerated features';
            break;
        case 'anime':
            stylePrompt = 'anime style, Japanese animation, big eyes, colorful hair';
            break;
        case '3d-render':
            stylePrompt = '3D rendered image, computer graphics, realistic textures';
            break;
        case 'digital-painting':
            stylePrompt = 'digital painting, blended colors, soft brush strokes';
            break;
        case 'pencil-sketch':
            stylePrompt = 'pencil sketch, black and white, detailed shading';
            break;
        case 'watercolor':
            stylePrompt = 'watercolor painting, soft edges, translucent colors';
            break;
        case 'oil-painting':
            stylePrompt = 'oil painting, textured canvas, rich colors';
            break;
        case 'pixel-art':
            stylePrompt = 'pixel art, retro game style, limited color palette';
            break;
        case 'comic-book':
            stylePrompt = 'comic book style, bold outlines, flat colors, action lines';
            break;
        case 'low-poly':
            stylePrompt = 'low poly 3D render, geometric shapes, flat shading';
            break;
        case 'claymation':
            stylePrompt = 'claymation style, stop motion, textured clay look';
            break;
        default:
            stylePrompt = 'photorealistic, highly detailed';
    }
    const [width, height] = sizeSelect.value.split('x').map(Number);
    const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                "inputs": `${prompt}, ${stylePrompt}, high quality, detailed`,
                "parameters": { "width": width, "height": height },
            })
        }
    );
    return await response.blob();
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
        a.download = "nexgen-ai-image.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
});

shareBtn.addEventListener("click", function() {
    if (image.src && navigator.share) {
        navigator.share({
            title: 'NexGen AI Generated Image',
            text: 'Check out this futuristic AI-generated masterpiece!',
            url: image.src
        }).then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
        alert("Sharing is not supported on this browser or no image has been generated yet.");
    }
});

// Add some futuristic flair to the input field
inputTxt.addEventListener("focus", function() {
    this.style.boxShadow = "0 0 20px var(--primary-color)";
});

inputTxt.addEventListener("blur", function() {
    this.style.boxShadow = "none";
});

