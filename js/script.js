// THIS IS THE ULTIMATE TEST. If you don't see this message, the file is not being loaded.
console.log("script.js file has been loaded and is running!");

// Wait for the entire page content to load
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded event fired. The page is ready.");

    // --- Function for the Writings Page ---
    function handleWritingsPage() {
        const storyLinks = document.querySelectorAll('.story-link');
        const storyContent = document.getElementById('story-content');
        if (!storyLinks.length) return;

        storyLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                const sourceFile = this.getAttribute('data-source');
                storyContent.innerHTML = '<p>Loading story...</p>';
                
                fetch(sourceFile)
                    .then(response => {
                        if (!response.ok) throw new Error(`File not found.`);
                        return response.text();
                    })
                    .then(markdownText => {
                        // UPDATED: Convert Markdown to HTML using marked.js
                        storyContent.innerHTML = marked.parse(markdownText);
                    })
                    .catch(error => {
                        console.error('Error fetching the story:', error);
                        storyContent.innerHTML = `<p style="color: red;">Failed to load story. ${error.message}</p>`;
                    });
            });
        });
    }

    // --- Function for the Home Page (Updates Section) ---
    function handleHomePage() {
        const commitList = document.getElementById('commit-history');
        if (!commitList) return;

        const username = 'rxdsavt';
        const repo = 'rxdsavt.github.io';
        const branch = 'gh-pages';

        const apiUrl = `https://api.github.com/repos/${username}/${repo}/commits?sha=${branch}`;
        
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
                return response.json();
            })
            .then(commits => {
                if (commits && commits.length > 0) {
                    commitList.innerHTML = '';
                    // Display the latest 2 commits
                    for (let i = 0; i < commits.length && i < 2; i++) {
                        const commit = commits[i];
                        const commitMessage = commit.commit.message.split('\n')[0];
                        const commitDate = new Date(commit.commit.author.date).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric'
                        });
                        const listItem = document.createElement('li');
                        listItem.innerHTML = `
                            <span class="commit-date">${commitDate}</span>
                            <p class="commit-message">${commitMessage}</p>
                        `;
                        commitList.appendChild(listItem);
                    }
                } else {
                    commitList.innerHTML = '<li>No recent commits found on the gh-pages branch.</li>';
                }
            })
            .catch(error => {
                console.error('Failed to fetch commits:', error);
                commitList.innerHTML = '<li>Could not load updates at this time.</li>';
            });
    }

    // --- SCRIPT ROUTER ---
    if (document.querySelector('.story-list')) {
        handleWritingsPage();
    }
    if (document.getElementById('commit-history')) {
        handleHomePage();
    }
});
