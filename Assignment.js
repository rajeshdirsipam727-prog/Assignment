const API_KEY = "YOUR_HUGGINGFACE_API_KEY";

// -------- TEXT ENHANCEMENT --------
async function enhancePrompt() {
  const userPrompt = document.getElementById("userPrompt").value;
  const enhancedText = document.getElementById("enhancedText");

  if (!userPrompt) {
    alert("Please enter a prompt");
    return;
  }

  enhancedText.innerText = "Enhancing prompt...";

  // Simple enhancement logic (basic version)
  const improvedPrompt = `High quality, cinematic, detailed, realistic: ${userPrompt}`;
  enhancedText.innerText = improvedPrompt;
}

// -------- IMAGE GENERATION --------
async function generateImage() {
  const prompt = document.getElementById("enhancedText").innerText;
  const imageElement = document.getElementById("generatedImage");

  if (!prompt || prompt === "No enhanced prompt yet.") {
    alert("Please enhance the prompt first.");
    return;
  }

  imageElement.style.display = "none";

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: prompt })
      }
    );

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);

    imageElement.src = imageUrl;
    imageElement.style.display = "block";
  } catch (error) {
    alert("Error generating image");
    console.error(error);
  }
}

// -------- IMAGE ANALYSIS --------
async function analyzeImage() {
  const fileInput = document.getElementById("imageUpload");
  const result = document.getElementById("imageAnalysis");

  if (!fileInput.files[0]) {
    alert("Please upload an image");
    return;
  }

  result.innerText = "Analyzing image...";

  const file = fileInput.files[0];

  try {
    const arrayBuffer = await file.arrayBuffer();

    const response = await fetch(
      "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/octet-stream"
        },
        body: arrayBuffer
      }
    );

    const data = await response.json();

    if (Array.isArray(data) && data[0]?.generated_text) {
      result.innerText = `Caption: ${data[0].generated_text}`;
    } else {
      result.innerText = "Could not analyze image.";
    }

  } catch (error) {
    result.innerText = "Error analyzing image.";
    console.error(error);
  }
}