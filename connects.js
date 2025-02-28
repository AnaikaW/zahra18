const connectionsItems = document.querySelectorAll('.connections-item');
const messageBox = document.getElementById('message-box');
const connectionsNextButton = document.getElementById('connections-next');

let selectedItems = new Set();
let foundGroups = new Set(); // To track found groups

// Define the correct answer groups with associated colors
const answerGroups = {
    "types of guys zahra is attracted to": { items: ["gay", "ugly", "dumb", "fictional"], color: "#FDFD96" }, // Yellow
    "things zahra does when she laughs": { items: ["cackles", "falls", "reddens", "rolls"], color: "#B2E2B3" }, // Green
    "things that describe zahra": { items: ["caring", "generous", "inspiring", "supportive"], color: "#5BA4E5" }, // Blue
    "nicknames for zahra": { items: ["zarzar", "bigback", "beta", "mom#2"], color: "#D6B5E8" } // Purple
};

// Array of all items to shuffle
const allItems = [
    "gay", "ugly", "dumb", "fictional",
    "cackles", "falls", "reddens", "rolls",
    "caring", "generous", "inspiring", "supportive",
    "zarzar", "bigback", "beta", "mom#2"
];

// Shuffle function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to initialize game
function initializeGame() {
    // Shuffle the words
    shuffleArray(allItems);

    // Populate the connections grid
    connectionsItems.forEach((item, index) => {
        item.textContent = allItems[index];
        item.style.backgroundColor = "#FFD700"; // Reset color to pink
        item.classList.remove('merged-item'); // Remove merged class
    });

    // Clear message and hide Next button
    messageBox.textContent = 'Start finding connections!';
    connectionsNextButton.style.display = 'none';
    foundGroups.clear(); // Reset found groups
}

// Add event listeners to each connections item
connectionsItems.forEach(item => {
    item.addEventListener('click', () => {
        const name = item.textContent;

        // Toggle selection
        if (selectedItems.has(name)) {
            selectedItems.delete(name);
            item.style.backgroundColor = "#FFD700"; // Original color
        } else {
            selectedItems.add(name);
            item.style.backgroundColor = "#A2C2E0"; // Selected color
        }

        // Check if four items are selected
        if (selectedItems.size === 4) {
            checkSelectedItems();
        }
    });
});

// Function to check if the selected items belong to any group
function checkSelectedItems() {
    const selectedArray = Array.from(selectedItems);
    let correctGroup = null;

    // Check which group the selected items belong to
    for (const group in answerGroups) {
        const groupItems = answerGroups[group].items;
        if (groupItems.every(item => selectedArray.includes(item))) {
            correctGroup = group;
            break;
        }
    }

    if (correctGroup) {
        // Highlight correct group items and merge them
        const mergedText = correctGroup; // Display the group name
        const groupColor = answerGroups[correctGroup].color; // Get the group's color

        // Create a new merged item
        const mergedItem = document.createElement('div');
        mergedItem.textContent = mergedText;
        mergedItem.classList.add('merged-item');
        mergedItem.style.backgroundColor = groupColor; // Set the background color of the merged item
        document.querySelector('.connections-grid').insertAdjacentElement('afterbegin', mergedItem);

        // Highlight the background for merged items
        answerGroups[correctGroup].items.forEach(item => {
            const itemElement = Array.from(connectionsItems).find(elem => elem.textContent === item);
            itemElement.style.display = 'none'; // Hide the original items
        });

        // Track the found group
        foundGroups.add(correctGroup);

        // Check if all groups have been found
        if (foundGroups.size === Object.keys(answerGroups).length) {
            connectionsNextButton.style.display = 'block'; // Show the Next button
            messageBox.textContent = 'Surprisingly you found all the groups! Click Next to proceed.';
        } else {
            messageBox.textContent = `You found "${correctGroup}"!`;
        }
    } else {
        // Deselect all if incorrect
        selectedItems.forEach(name => {
            const itemElement = Array.from(connectionsItems).find(elem => elem.textContent === name);
            itemElement.style.backgroundColor = "#FFD700"; // Reset color
        });
        messageBox.textContent = 'Damn bro not even close. Try again.';
    }
    // Clear selectedItems set
    selectedItems.clear();
}

// Next button functionality
connectionsNextButton.addEventListener('click', () => {
    window.location.href = 'birthday_card.html'; // Redirect to the birthday card page
});

// Reset button functionality
document.getElementById('reset-button').addEventListener('click', resetGame);

function resetGame() {
    selectedItems.clear();
    connectionsItems.forEach(item => {
        item.style.backgroundColor = "#FFD700"; // Reset color
        item.style.display = 'block'; // Show original items
    });
    document.querySelectorAll('.merged-item').forEach(item => item.remove()); // Remove merged items
    messageBox.textContent = 'Start finding connections!';
    connectionsNextButton.style.display = 'none'; // Hide the Next button
    foundGroups.clear(); // Reset found groups
}

// Initialize the game on page load
initializeGame();
