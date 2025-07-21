$(function()
{
        // Use cross-browser compatible API
        var bookmarksAPI = (typeof browser !== 'undefined' && browser.bookmarks) ? browser.bookmarks : chrome.bookmarks;
        
        // Check if the API is available
        if (!bookmarksAPI) {
                $('#bookmarks').html('<div class="empty-state">Bookmarks API not available. Please ensure the extension has proper permissions.<br><small>Available APIs: ' + Object.keys(window).filter(k => k.includes('chrome') || k.includes('browser')).join(', ') + '</small></div>');
                return;
        }
        
        // Show loading state
        $('#bookmarks').html('<div class="empty-state">Loading favorites...</div>');
        
        bookmarksAPI.getTree(function(itemTree)
        {
                console.log('Raw bookmark tree:', itemTree);
                var dom = { html: '' };
                var debugInfo = [];
                
                // Check if we have bookmark data
                if (itemTree && itemTree.length > 0) {
                        // Find the favorites/bookmarks bar (usually the first child with id "1")
                        var favoritesBar = null;
                        
                        // Look for the bookmarks bar in the root structure
                        itemTree.forEach(function(rootNode, index) {
                                debugInfo.push('Root ' + index + ': ' + (rootNode.title || 'Untitled') + ' (id: ' + rootNode.id + ')');
                                
                                if (rootNode.children) {
                                        rootNode.children.forEach(function(child) {
                                                debugInfo.push('  Child: ' + (child.title || 'Untitled') + ' (id: ' + child.id + ')');
                                                // The bookmarks bar typically has id "1" in Chrome/Edge
                                                if (child.id === '1' || child.title === 'Bookmarks bar' || child.title === 'Favorites bar') {
                                                        favoritesBar = child;
                                                        console.log('Found favorites bar:', child);
                                                }
                                        });
                                }
                        });
                        
                        // If we found the favorites bar, process its contents
                        if (favoritesBar && favoritesBar.children) {
                                console.log('Processing favorites bar contents...');
                                favoritesBar.children.forEach(function(item) {
                                        ProcessBookmarkNode(item, dom);
                                });
                        }
                        
                        if (dom.html === '') {
                                dom.html = '<div class="empty-state">No favorites found in the favorites bar. Add some favorites to see them here!<br><small>Debug Info:<br>' + debugInfo.join('<br>') + '<br>Favorites bar found: ' + (favoritesBar ? 'Yes' : 'No') + '</small></div>';
                        }
                } else {
                        dom.html = '<div class="empty-state">No favorites found. Add some favorites to see them here!<br><small>Debug: itemTree is empty or null</small></div>';
                }
                
                $('#bookmarks').html(dom.html);
        });
});

function ProcessBookmarkNode(node, dom)
{
        // Skip empty or invalid nodes
        if (!node || (!node.children && !node.url)) {
                return;
        }
        
        // Process folders
        if (node.children && node.children.length > 0)
        {
                // Only show folders that have content
                var hasContent = false;
                var tempDom = { html: '' };
                
                node.children.forEach(function(child)
                {
                        ProcessBookmarkNode(child, tempDom);
                        if (tempDom.html) hasContent = true;
                });
                
                if (hasContent) {
                        dom.html += '<li><h2>' + EscapeHtml(node.title || 'Untitled Folder') + '</h2><ul>';
                        dom.html += tempDom.html;
                        dom.html += '</ul></li>';
                }
        }
        
        // Process individual bookmarks
        if (node.url)
        {
                var faviconUrl = GetFaviconUrl(node.url);
                var displayText = node.title ? EscapeHtml(ShortenString(node.title, 30)) : '';
                // Add a unique id to the img for later reference
                var imgId = 'favicon-' + Math.random().toString(36).substr(2, 9);
                dom.html += `<li><a href="${EscapeHtml(node.url)}" title="${EscapeHtml(node.url)}"><img id="${imgId}" src="${faviconUrl}" width="16" height="16" />${displayText}</a></li>`;
                // After DOM insertion, compare favicon with placeholder and swap if needed
                setTimeout(() => {
                    const img = document.getElementById(imgId);
                    if (img) {
                        isPlaceholderFavicon(img, function(isPlaceholder) {
                            if (isPlaceholder) {
                                img.src = 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(new URL(node.url).hostname) + '&sz=32';
                            }
                        });
                    }
                }, 100);
        }
}

function ShortenString(str, length)
{
        if (!str) return '';
        return str.length > length ? str.substr(0, length - 3) + '...' : str;
}

function EscapeHtml(text)
{
        if (!text) return '';
        var map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function GetFaviconUrl(url)
{
    return `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(url)}&size=32`;
}

// Utility to compare favicon with placeholder
function isPlaceholderFavicon(faviconImg, callback) {
    const placeholderImg = new Image();
    placeholderImg.src = 'assets/placeholder.bmp';
    placeholderImg.onload = function() {
        // Create canvases
        const w = faviconImg.naturalWidth, h = faviconImg.naturalHeight;
        if (!w || !h) return callback(false); // Image not loaded
        const canvas1 = document.createElement('canvas');
        const canvas2 = document.createElement('canvas');
        canvas1.width = canvas2.width = w;
        canvas1.height = canvas2.height = h;
        const ctx1 = canvas1.getContext('2d');
        const ctx2 = canvas2.getContext('2d');
        ctx1.drawImage(faviconImg, 0, 0, w, h);
        ctx2.drawImage(placeholderImg, 0, 0, w, h);
        // Compare data URLs
        const data1 = canvas1.toDataURL();
        const data2 = canvas2.toDataURL();
        callback(data1 === data2);
    };
}
