/**
 * PixelCraze Studio - AI Website Engine
 * Pure Vanilla JS Implementation
 */

const apiKey = ""; // Provisioned by environment at runtime
const MODEL_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent";

/**
 * Utility: Generate a clean URL slug from business name
 */
const generateSlug = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
};

/**
 * Core: Call Gemini API with Exponential Backoff
 */
async function callGeminiAPI(prompt, retryCount = 0) {
    const payload = {
        contents: [{
            parts: [{ text: prompt }]
        }],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    headline: { type: "STRING" },
                    subheadline: { type: "STRING" },
                    about_text: { type: "STRING" },
                    services_list: {
                        type: "ARRAY",
                        items: { type: "STRING" }
                    },
                    primary_cta_text: { type: "STRING" }
                },
                required: ["headline", "subheadline", "about_text", "services_list", "primary_cta_text"]
            }
        }
    };

    try {
        const response = await fetch(`${MODEL_URL}?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const result = await response.json();
        const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!textResponse) throw new Error("Empty AI Response");
        
        return JSON.parse(textResponse);
    } catch (error) {
        if (retryCount < 5) {
            const waitTime = Math.pow(2, retryCount) * 1000;
            await new Promise(resolve => setTimeout(resolve, waitTime));
            return callGeminiAPI(prompt, retryCount + 1);
        }
        throw error;
    }
}

/**
 * UI: Update DOM with generated content
 */
function renderWebsite(content, userData) {
    // 1. Update Head
    document.title = `${userData.business_name} | ${userData.business_type}`;

    // 2. Inject Content
    const elements = {
        'tpl-headline': content.headline,
        'tpl-subheadline': content.subheadline,
        'tpl-about': content.about_text,
        'tpl-business-name': userData.business_name,
        'tpl-cta-main': content.primary_cta_text,
        'tpl-watermark': "Free demo site — Custom version available"
    };

    Object.entries(elements).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    });

    // 3. Render Services List
    const servicesContainer = document.getElementById('tpl-services-list');
    if (servicesContainer && content.services_list) {
        servicesContainer.innerHTML = ''; 
        content.services_list.forEach(service => {
            const li = document.createElement('li');
            li.textContent = service;
            li.style.marginBottom = "0.5rem";
            servicesContainer.appendChild(li);
        });
    }

    // 4. Update Custom CTA mailto
    const upgradeBtn = document.getElementById('tpl-upgrade-cta');
    if (upgradeBtn) {
        upgradeBtn.textContent = "Get this website without watermark";
        upgradeBtn.onclick = () => {
            const subject = encodeURIComponent(`Upgrade Inquiry: ${userData.business_name}`);
            window.location.href = `mailto:manas@pixelcraze.space?subject=${subject}`;
        };
    }

    // 5. Show Preview Section and Scroll
    const previewSection = document.getElementById('engine-preview');
    if (previewSection) {
        previewSection.classList.add('is-active');
        previewSection.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Fallback: Default content if AI fails
 */
function getFallbackContent(userData) {
    return {
        headline: `Expert ${userData.business_type} in ${userData.city}`,
        subheadline: `Professional solutions tailored for your business needs.`,
        about_text: `${userData.business_name} provides top-tier ${userData.business_type} services in ${userData.city}.`,
        services_list: userData.services.split(',').map(s => s.trim()),
        primary_cta_text: "Contact Us"
    };
}

/**
 * Event: Handle Form Submission
 */
async function handleGeneratorSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const userData = {
        business_name: formData.get('business_name'),
        business_type: formData.get('business_type'),
        city: formData.get('city'),
        services: formData.get('services'),
        contact_email: formData.get('contact_email')
    };

    const prompt = `Generate a business website profile for the following data:
    Name: ${userData.business_name}
    Type: ${userData.business_type}
    Location: ${userData.city}
    Services Offered: ${userData.services}
    
    Tone: Professional, Human, High-end. No marketing fluff. Output valid JSON.`;

    document.body.classList.add('is-generating');

    try {
        const aiContent = await callGeminiAPI(prompt);
        renderWebsite(aiContent, userData);
    } catch (error) {
        const fallback = getFallbackContent(userData);
        renderWebsite(fallback, userData);
    } finally {
        document.body.classList.remove('is-generating');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const generatorForm = document.getElementById('website-generator-form');
    if (generatorForm) {
        generatorForm.addEventListener('submit', handleGeneratorSubmit);
    }
});