# NewTabWithFavorites  - Microsoft Edge Extension

A clean and elegant Microsoft Edge extension that replaces your new tab page with a customized view of your favorites, organized in an easy-to-browse column layout.

## 🌟 Features

- **Custom New Tab Page**: Replaces the default Edge new tab with your favorites
- **Organized Layout**: Displays favorites in neat columns with folder structures preserved
- **Instant Access**: Click any favorite to navigate directly to your saved websites
- **Modern Design**: Clean, responsive interface that matches Edge's aesthetic
- **Cross-Browser Compatible**: Works with both Chrome and Edge browsers

## 📸 Screenshots

The extension displays your favorites in organized columns, making it easy to find and access your most important bookmarks right from every new tab.

## 🚀 Installation

### From Microsoft Edge Add-ons Store
1. Visit the [Microsoft Edge Add-ons store](#) *(coming soon)*
2. Click "Get" to install the extension
3. Open a new tab to see your favorites

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Microsoft Edge and navigate to `edge://extensions/`
3. Enable "Developer mode" in the bottom left corner
4. Click "Load unpacked" and select the extension folder
5. Open a new tab to see your favorites

## 🛠️ How It Works

The extension uses the browser's Bookmarks API to access your favorites and displays them in a clean, organized interface. It specifically focuses on your **Favorites Bar** content, ensuring you see the bookmarks you use most frequently.

### Key Components:
- **Favorites Detection**: Automatically finds and displays your favorites bar bookmarks
- **Folder Organization**: Preserves your folder structure for easy navigation  
- **Favicon Display**: Shows website icons for quick visual identification
- **Responsive Design**: Adapts to different screen sizes and preferences

## 📋 Permissions

This extension requires the following permission:
- **Bookmarks**: To read and display your favorites on the new tab page

Your data remains completely private and is never transmitted outside your browser.

## 🔧 Technical Details

- **Manifest Version**: 2 (I'll need to update to 3 I think)
- **Framework**: Vanilla JavaScript with jQuery for DOM manipulation
- **Browser APIs**: Chrome/Edge Bookmarks API for data access
- **Icons**: Custom-designed SVG icons optimized for different sizes

---

**Made with ❤️ for Microsoft Edge users who love organised favorites**

> Transform your new tab experience - install New Tab with Favorites today!

---

## 🤖 Purpose (for Copilot)

This extension is designed to replace the default new tab page in Microsoft Edge (and Chrome) with a custom page that displays the user's bookmarks (favorites), especially those from the Favorites Bar, in a visually organized, column-based layout. It uses the browser's Bookmarks API to read and render the user's favorites, preserving folder structure and favicons, and provides instant navigation to bookmarked sites. The extension is built with vanilla JavaScript and jQuery, and aims for a clean, modern, and responsive user interface.