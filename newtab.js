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
                dom.html += '<li><a href="' + EscapeHtml(node.url) + '" title="' + EscapeHtml(node.url) + '"><img src="' + faviconUrl + '" onerror="this.style.display=\'none\'" />' + EscapeHtml(ShortenString(node.title || node.url, 30)) + '</a></li>';
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
        try {
                var domain = new URL(url).hostname;
                // Use Google's favicon service as a fallback that works across browsers
                return 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(domain) + '&sz=16';
        } catch (e) {
                // Fallback to a generic icon
                return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';
        }
}
