/**
 * PixelCraze Studio - AI Engine
 */

const apiKey = "AIzaSyCp67SEQ5V-HnxNMiSVmNJU56eAYQhxaV4"; 
const MODEL_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

/**
 * Core: Call Gemini API
 */
async function callGeminiAPI(userData) {
    const prompt = `Generate a business website profile for:
    Name: ${userData.business_name}
    Type: ${userData.business_type}
    Location: ${userData.city}
    Services: ${userData.services}
    
    Output exactly this JSON structure:
    {
      "headline": "A bold human headline",
      "subheadline": "A short supporting sentence",
      "about_text": "A 2-sentence story about the business",
      "services_list": ["Service 1", "Service 2", "Service 3"],
      "primary_cta_text": "Contact Us"
    }`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
    };

    const response = await fetch(`${MODEL_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error("API Failed");

    const data = await response.json();
    return JSON.parse(data.candidates[0].content.parts[0].text);
}

/**
 * UI: Inject Content
 */
function renderWebsite(content, userData) {
    // Basic Fields
    document.getElementById('tpl-headline').textContent = content.headline;
    document.getElementById('tpl-subheadline').textContent = content.subheadline;
    document.getElementById('tpl-about').textContent = content.about_text;
    document.getElementById('tpl-business-name').textContent = userData.business_name;
    document.getElementById('tpl-cta-main').textContent = content.primary_cta_text;

    // Services List
    const list = document.getElementById('tpl-services-list');
    list.textContent = ''; // Safe Clear
    content.services_list.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
    });

    // Handle Mailto
    document.getElementById('tpl-upgrade-cta').onclick = () => {
        const subject = encodeURIComponent(`Upgrade Inquiry: ${userData.business_name}`);
        window.location.href = `mailto:manas@pixelcraze.space?subject=${subject}`;
    };

    // Reveal Section
    const preview = document.getElementById('engine-preview');
    preview.classList.add('is-active');
    preview.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Event: Submission
 */
async function handleForm(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData.entries());
    
    document.body.classList.add('is-generating');
    const btn = document.getElementById('generate-btn');
    const originalText = btn.textContent;
    btn.textContent = "Generating...";

    try {
        const aiContent = await callGeminiAPI(userData);
        renderWebsite(aiContent, userData);
    } catch (err) {
        console.error(err);
        alert("The engine is busy. Please try again in a moment.");
    } finally {
        document.body.classList.remove('is-generating');
        btn.textContent = originalText;
    }
}

// Init
document.getElementById('website-generator-form').addEventListener('submit', handleForm);