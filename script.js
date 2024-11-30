const apiKey = 'REPLACE_WITH_YOUR_API_KEY'; // Replace with your Emoji API key
const apiUrl = `https://emoji-api.com/emojis?access_key=${apiKey}`;

const searchInput = document.getElementById('search');
const emojiContainer = document.getElementById('emoji-container');
const paginationContainer = document.getElementById('pagination');

let currentPage = 1;
const itemsPerPage = 25;
let allEmojis = [];

async function fetchEmojis() {
    const response = await fetch(apiUrl);
    const emojis = await response.json();
    return emojis;
}

function displayEmojis(emojis, page = 1) {
    emojiContainer.innerHTML = '';
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedEmojis = emojis.slice(start, end);

    paginatedEmojis.forEach(emoji => {
        const emojiDiv = document.createElement('div');
        emojiDiv.classList.add('emoji');
        emojiDiv.textContent = emoji.character;
        emojiDiv.title = emoji.unicodeName;
        emojiDiv.addEventListener('click', () => {
            navigator.clipboard.writeText(emoji.character);
            alert(`Copied ${emoji.character} to clipboard!`);
        });
        emojiContainer.appendChild(emojiDiv);
    });

    displayPagination(emojis.length, page);
}

function displayPagination(totalItems, currentPage) {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        displayEmojis(allEmojis, currentPage - 1);
    });
    paginationContainer.appendChild(prevButton);

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        displayEmojis(allEmojis, currentPage + 1);
    });
    paginationContainer.appendChild(nextButton);
}

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredEmojis = allEmojis.filter(emoji => emoji.unicodeName.includes(searchTerm));
    displayEmojis(filteredEmojis, 1);
});

fetchEmojis().then(emojis => {
    allEmojis = emojis;
    displayEmojis(allEmojis, 1);
});