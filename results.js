document.addEventListener("DOMContentLoaded", async function () {
    console.log("Results Page Loaded");

    // ✅ Retrieve the saved score from localStorage
    let score = localStorage.getItem("riskScore");
    console.log("Retrieved Score from LocalStorage:", score);

    if (score === null) {
        console.error("Error: No risk score found in localStorage!");
        return;
    }

    score = parseInt(score);

    // ✅ Update the displayed score
    const scoreElement = document.getElementById("risk-score");
    if (scoreElement) {
        scoreElement.textContent = score;
    } else {
        console.error("Error: Element with ID 'risk-score' not found!");
    }

    // ✅ Calculate marker position (-10 to 10 mapped to 0% - 100%)
    let position = ((score + 10) / 20) * 100; 

    // ✅ Update marker position
    let marker = document.getElementById("score-marker");
    if (marker) {
        marker.style.left = position + "%";
        marker.style.transition = "left 0.5s ease-in-out";
    } else {
        console.error("Error: Element with ID 'score-marker' not found!");
    }

    console.log("Final Score:", score);
    console.log("Marker Position:", position + "%");

    try {
        // ✅ Fetch Portfolio Data from Flask Backend
        const response = await fetch("http://127.0.0.1:5000/get-portfolio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ score: score })
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Portfolio Data:", data);

        // ✅ Display Portfolio Details
        displayPortfolioDetails(data);

    } catch (error) {
        console.error("Error fetching portfolio data:", error);
        alert("Failed to load portfolio data. Make sure Flask is running!");
    }
});

// ✅ Function to Display Portfolio Data
function displayPortfolioDetails(data) {
    const container = document.querySelector(".container");

    // ✅ Create Table for Portfolio Details
    const table = document.createElement("table");
    table.classList.add("portfolio-table");

    // ✅ Table Header
    table.innerHTML = `
        <thead>
            <tr>
                <th>Asset Name</th>
                <th>Allocation (%)</th>
            </tr>
        </thead>
        <tbody>
            ${data.assets.map(asset => {
                let icon = getAssetIcon(asset.name);
                let category = getAssetCategory(asset.name);
                return `
                    <tr>
                        <td>${icon} ${asset.name} <span class="category">${category}</span></td>
                        <td>${asset.allocation}</td>
                    </tr>
                `;
            }).join('')}
        </tbody>
    `;

    // ✅ Add Expected Return and Std Dev Below the Table
    const details = document.createElement("div");
    details.classList.add("portfolio-details");
    details.innerHTML = `
        <p><strong>Expected Return:</strong> ${data.expected_return}%</p>
        <p><strong>Standard Deviation:</strong> ${data.standard_deviation}%</p>
    `;

    // ✅ Append Table and Details to Container
    container.appendChild(table);
    container.appendChild(details);
}

// ✅ Function to Map Asset to Flag or Symbol
function getAssetIcon(name) {
    // ✅ US Equities (with US flag)
    const usEquities = [
        'Apple Inc.', 'Microsoft Corporation', 'NVIDIA Corporation', 'Alphabet Inc.', 'Amazon.com, Inc.', 'Meta Platforms Inc.', 'Tesla Inc.'
    ];

    // ✅ Indian Equities (with Indian flag)
    const largeCapIndianEquities = [
        'Reliance Industries Ltd.', 'Tata Consultancy Services', 'HDFC Bank Ltd.', 'Larsen & Toubro Ltd.', 'ITC'
    ];
    const midCapIndianEquities = [
        'Persistent Systems Ltd.', 'Zomato', 'Trent Ltd.', 'Dixon Technologies (India) Ltd.', 'Polycab India Ltd.'
    ];
    const smallCapIndianEquities = [
        'Sobha Ltd.', 'LT Foods Ltd.', 'Mama Earth', 'PCBL Chemical Ltd.', 'Cholamandalam Financial Holdings Ltd.'
    ];

    // ✅ Crypto (with BTC, ETH, and SOL symbols)
    const crypto = {
        'Bitcoin': '₿',
        'Ethereum': 'Ξ',
        'Solana': '◎'
    };

    // ✅ Government Bonds (with India flag)
    if (name === 'Govt Bond') return '🇮🇳';

    // ✅ Commodities (Gold and Copper)
    if (name === 'Gold') return '🥇';
    if (name === 'Copper') return '🥉';

    // ✅ Forex (US Dollar)
    if (name === 'US Dollar') return '💲';

    // ✅ Assign Flags and Symbols
    if (usEquities.includes(name)) return '🇺🇸';
    if (largeCapIndianEquities.includes(name)) return '🇮🇳';
    if (midCapIndianEquities.includes(name)) return '🇮🇳';
    if (smallCapIndianEquities.includes(name)) return '🇮🇳';
    if (crypto[name]) return crypto[name];

    // ✅ Default Icon (if no match)
    return '';
}

// ✅ Function to Categorize Assets
function getAssetCategory(name) {
    if (['Apple Inc.', 'Microsoft Corporation', 'NVIDIA Corporation', 'Alphabet Inc.', 'Amazon.com, Inc.', 'Meta Platforms Inc.', 'Tesla Inc.'].includes(name)) {
        return '(US Equities)';
    }
    if (['Reliance Industries Ltd.', 'Tata Consultancy Services', 'HDFC Bank Ltd.', 'Larsen & Toubro Ltd.', 'ITC'].includes(name)) {
        return '(Large Cap Indian Equities)';
    }
    if (['Persistent Systems Ltd.', 'Zomato', 'Trent Ltd.', 'Dixon Technologies (India) Ltd.', 'Polycab India Ltd.'].includes(name)) {
        return '(Mid Cap Indian Equities)';
    }
    if (['Sobha Ltd.', 'LT Foods Ltd.', 'Mama Earth', 'PCBL Chemical Ltd.', 'Cholamandalam Financial Holdings Ltd.'].includes(name)) {
        return '(Small Cap Indian Equities)';
    }
    if (['Bitcoin', 'Ethereum', 'Solana'].includes(name)) {
        return '(Crypto)';
    }
    if (name === 'Govt Bond') return '(Bond)';
    if (name === 'Gold' || name === 'Copper') return '(Commodities)';
    if (name === 'US Dollar') return '(Forex)';

    return '';
}
