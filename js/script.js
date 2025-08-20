// Wait for the entire page content to load
document.addEventListener('DOMContentLoaded', function() {

    // --- Function for the Writings Page ---
    function handleWritingsPage() {
        const storyLinks = document.querySelectorAll('.story-link');
        const storyContent = document.getElementById('story-content');

        if (!storyLinks.length) return; // Exit if no story links found

        storyLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                const sourceFile = this.getAttribute('data-source');
                storyContent.innerHTML = '<p>Loading story...</p>';

                fetch(sourceFile)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`File not found. Check the path in the data-source attribute.`);
                        }
                        return response.text();
                    })
                    .then(text => {
                        storyContent.textContent = text;
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
        if (!commitList) return; // Exit if the commit list element isn't on this page

        // --- CONFIGURATION: CHANGE THESE VALUES ---
        const username = 'rxdsavt'; // <-- Replace with your GitHub username
        const repo = 'rxdsavt.github.io'; // <-- Replace with your repository name
        // -----------------------------------------

        const apiUrl = `https://api.github.com/repos/${username}/${repo}/commits`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            .then(commits => {
                commitList.innerHTML = ''; // Clear the "Loading..." message
                
                // Display the latest 3 commits
                for (let i = 0; i < commits.length && i < 3; i++) {
                    const commit = commits[i];
                    // Get only the first line of the commit message (the title)
                    const commitMessage = commit.commit.message.split('\n')[0]; 
                    const commitDate = new Date(commit.commit.author.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });

                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <span class="commit-date">${commitDate}</span>
                        <p class="commit-message">${commitMessage}</p>
                    `;
                    commitList.appendChild(listItem);
                }
            })
            .catch(error => {
                console.error('Failed to fetch commits:', error);
                commitList.innerHTML = '<li>Could not load updates at this time.</li>';
            });
    }

    // --- SCRIPT ROUTER ---
    // Check which page we are on and run the corresponding function
    if (document.querySelector('.story-list')) {
        handleWritingsPage();
    }
    if (document.getElementById('commit-history')) {
        handleHomePage();
    }
});
