// settings.js
// Handles saving and loading settings for dark mode and bookmarks per folder

document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const bookmarksPerFolder = document.getElementById('bookmarksPerFolder');
    const status = document.getElementById('status');
    const saveBtn = document.getElementById('saveSettings');

    // Load settings
    chrome.storage.sync.get(['darkMode', 'bookmarksPerFolder'], (result) => {
        darkModeToggle.checked = !!result.darkMode;
        bookmarksPerFolder.value = result.bookmarksPerFolder || 15;
    });

    // Save settings
    saveBtn.addEventListener('click', () => {
        chrome.storage.sync.set({
            darkMode: darkModeToggle.checked,
            bookmarksPerFolder: parseInt(bookmarksPerFolder.value, 10)
        }, () => {
            status.textContent = 'Settings saved!';
            setTimeout(() => status.textContent = '', 1500);
        });
    });
});
