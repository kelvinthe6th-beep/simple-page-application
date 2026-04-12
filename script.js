const searchBtn = document.getElementById("searchBtn");
const historyBtn = document.getElementById("historyBtn");
const wordInput = document.getElementById("wordInput");

const resultDiv = document.getElementById("result");
const favoritesList = document.getElementById("favoritesList");

const historyContainer = document.getElementById("historyContainer");
const historyList = document.getElementById("historyList");

// Load from localStorage
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];

// FETCH WORD
async function fetchWord(word) {
    try {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await res.json();

        if (data.title) {
            resultDiv.innerHTML = `<p>Word not found</p>`;
            return;
        }

        saveHistory(word);
        displayResult(data[0]);

    } catch (error) {
        resultDiv.innerHTML = `<p>Error fetching data</p>`;
    }
}

// DISPLAY RESULT
function displayResult(data) {
    const word = data.word;
    const phonetic = data.phonetic || "";
    const meaning = data.meanings[0];
    const definition = meaning.definitions[0].definition;
    const example = meaning.definitions[0].example || "No example available";

    resultDiv.innerHTML = `
        <div class="word">${word} (${phonetic})</div>
        <div class="definition">${definition}</div>
        <div class="example">${example}</div>
        <button class="favorite-btn" onclick="addFavorite('${word}')">
            Add to Favorites
        </button>
    `;
}

// FAVORITES
function addFavorite(word) {
    if (!favorites.includes(word)) {
        favorites.push(word);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        renderFavorites();
    }
}

function removeFavorite(word) {
    favorites = favorites.filter(w => w !== word);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();
}

function renderFavorites() {
    favoritesList.innerHTML = "";

    favorites.forEach(word => {
        const li = document.createElement("li");

        li.innerHTML = `
            ${word}
            <button class="remove-btn" onclick="removeFavorite('${word}')">Remove</button>
        `;

        li.addEventListener("click", () => fetchWord(word));

        favoritesList.appendChild(li);
    });
}

// HISTORY
function saveHistory(word) {
    if (!history.includes(word)) {
        history.unshift(word);

        if (history.length > 10) {
            history.pop();
        }

        localStorage.setItem("history", JSON.stringify(history));
        renderHistory();
    }
}

function renderHistory() {
    historyList.innerHTML = "";

    history.forEach(word => {
        const li = document.createElement("li");
        li.textContent = word;

        li.addEventListener("click", () => {
            fetchWord(word);
        });

        historyList.appendChild(li);
    });
}

// TOGGLE HISTORY
historyBtn.addEventListener("click", () => {
    historyContainer.classList.toggle("hidden");
});

// SEARCH EVENTS
searchBtn.addEventListener("click", () => {
    const word = wordInput.value.trim();
    if (word) fetchWord(word);
});

wordInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const word = wordInput.value.trim();
        if (word) fetchWord(word);
    }
});

// INITIAL LOAD
renderFavorites();
renderHistory();