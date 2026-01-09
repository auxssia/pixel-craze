/**
 * PixelCraze Studio - AI Website Engine
 * Senior Frontend Logic: Clean, Modular, and Secure-Ready
 */

const apiKey = "none"; 
const MODEL_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

/**
 * Logic: Fetch from Gemini
 */
async function generateBusinessContent(userData) {
    const prompt = `Act as a high-end copywriter. Generate a business profile for:
    Name: ${userData.business_name}
    Industry: ${userData.business_type}
    Location: ${userData.city}
    Services: ${userData.services}

    Return valid JSON with these keys:
    "headline": "A bold, punchy headline",
    "subheadline": "A professional one-sentence subtext",
    "about": "A clear, 2-sentence about section",
    "services": ["Array of 3 detailed services"],
    "cta": "Action-oriented button text"`;

    const response = await fetch(`${MODEL_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        })
    });

    if (!response.ok) throw new Error("API Connection Failed");

    const data = await response.json();
    return JSON.parse(data.candidates[0].content.parts[0].text);
}

/**
 * UI: Render the generated site
 */
function renderPreview(content, userData) {
    // Inject text safely using textContent
    document.getElementById('tpl-headline').textContent = content.headline;
    document.getElementById('tpl-subheadline').textContent = content.subheadline;
    document.getElementById('tpl-about').textContent = content.about;
    document.getElementById('tpl-business-name').textContent = userData.business_name;
    document.getElementById('tpl-cta-main').textContent = content.cta;

    // Build services list
    const list = document.getElementById('tpl-services-list');
    list.innerHTML = ''; 
    content.services.forEach(s => {
        const li = document.createElement('li');
        li.textContent = s;
        li.style.marginBottom = "0.8rem";
        list.appendChild(li);
    });

    // Setup Mailto
    document.getElementById('tpl-upgrade-cta').onclick = () => {
        const subject = encodeURIComponent(`Inquiry: ${userData.business_name}`);
        window.location.href = `mailto:manas@pixelcraze.space?subject=${subject}`;
    };

    // Show and Scroll
    const previewSection = document.getElementById('engine-preview');
    previewSection.classList.add('is-active');
    previewSection.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Controller: Handle Form
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('generate-btn');
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData.entries());

    // UI Feedback
    btn.disabled = true;
    btn.textContent = "Architecting your site...";
    document.body.style.cursor = "wait";

    try {
        const content = await generateBusinessContent(userData);
        renderPreview(content, userData);
    } catch (error) {
        console.error(error);
        alert("The engine timed out. Please check your API key and internet.");
    } finally {
        btn.disabled = false;
        btn.textContent = "Generate Preview";
        document.body.style.cursor = "default";
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('website-generator-form').addEventListener('submit', handleFormSubmit);
});