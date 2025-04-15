document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menuClose = document.querySelector('.menu-close');
    const mobileMenuContainer = document.querySelector('.mobile-menu-container');
    const body = document.body;

    if (menuToggle && mobileMenuContainer) {
        menuToggle.addEventListener('click', function() {
            mobileMenuContainer.classList.add('is-active');
            body.classList.add('mobile-menu-open'); // Add class to body for overlay
            this.setAttribute('aria-expanded', 'true');
        });
    }

    if (menuClose && mobileMenuContainer) {
        menuClose.addEventListener('click', function() {
            mobileMenuContainer.classList.remove('is-active');
            body.classList.remove('mobile-menu-open'); // Remove class from body
            if (menuToggle) {
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Optional: Close menu if clicking outside of it on the overlay
    body.addEventListener('click', function(event) {
        if (body.classList.contains('mobile-menu-open') && 
            !mobileMenuContainer.contains(event.target) && 
            !menuToggle.contains(event.target)) {
            
            mobileMenuContainer.classList.remove('is-active');
            body.classList.remove('mobile-menu-open');
            if (menuToggle) {
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // Optional: Close menu on Escape key press
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && body.classList.contains('mobile-menu-open')) {
            mobileMenuContainer.classList.remove('is-active');
            body.classList.remove('mobile-menu-open');
             if (menuToggle) {
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // --- Mega Menu Logic --- //

    const servicesMenuItem = document.querySelector('#primary-menu > .menu-item-has-children.services-mega-menu'); // Target the specific services item
    const megaMenuPanel = document.querySelector('.services-mega-menu-panel .mega-menu-panel-wrapper > .sub-menu'); // Find the panel within the wrapper using classes
    let leaveTimeout; // Timer for delaying mega menu close

    // Function to show the mega menu
    function showMegaMenu() {
        clearTimeout(leaveTimeout); // Clear any pending hide actions
        if (megaMenuPanel) {
            megaMenuPanel.classList.add('is-active');
        }
    }

    // Function to hide the mega menu (with delay)
    function hideMegaMenu() {
        clearTimeout(leaveTimeout); // Clear previous timeouts
        leaveTimeout = setTimeout(() => {
            if (megaMenuPanel) {
                megaMenuPanel.classList.remove('is-active');
                // Also remove active state from columns
                megaMenuPanel.querySelectorAll('.mega-menu-column').forEach(col => {
                     col.style.display = 'none';
                });
                 megaMenuPanel.querySelectorAll('.active-level-1').forEach(item => {
                     item.classList.remove('active-level-1');
                 });

            }
        }, 250); // Delay closing slightly to allow moving mouse between elements
    }

     // Function to reset/hide all columns except the first (Level 1)
    function resetColumns(exceptColumn = null) {
        if (!megaMenuPanel) return;
        const columns = megaMenuPanel.querySelectorAll('.mega-menu-column');
        columns.forEach((col, index) => {
             if (index > 0 && col !== exceptColumn) { // Hide L2 and L3 columns
                col.style.display = 'none';
             }
         });
         // Remove active state from L1 items
         megaMenuPanel.querySelectorAll('.level-1-item.active-level-1').forEach(item => {
             item.classList.remove('active-level-1');
         });
    }


    if (servicesMenuItem && megaMenuPanel) {
        // Trigger on hover Services link
        servicesMenuItem.addEventListener('mouseenter', showMegaMenu);
        servicesMenuItem.addEventListener('mouseleave', hideMegaMenu);

        // Keep menu open if mouse is over the panel itself
        megaMenuPanel.addEventListener('mouseenter', showMegaMenu);
        megaMenuPanel.addEventListener('mouseleave', hideMegaMenu);

        // Handle hover on Level 1 items (e.g., K-12 Learners)
        const level1Items = megaMenuPanel.querySelectorAll('.level-1-item > a'); // Need class .level-1-item on LIs
        const level2Column = megaMenuPanel.querySelector('.level-2-column'); // Need class on L2 column div

        level1Items.forEach(item => {
            item.addEventListener('mouseenter', function() {
                // Hide other columns and remove active states
                resetColumns(level2Column);
                 item.parentElement.classList.add('active-level-1'); // Highlight active L1 item

                // Populate and show Level 2 column
                const level2Content = item.parentElement.querySelector('.sub-menu'); // Get L2 submenu
                if (level2Column && level2Content) {
                    level2Column.innerHTML = '<h4>' + item.textContent + '</h4>' + level2Content.outerHTML; // Copy L2 content
                    level2Column.style.display = 'block';
                    addLevel2Listeners(level2Column);
                }
            });
        });
    }

     // Function to add listeners to dynamically added Level 2 items
    function addLevel2Listeners(level2Container) {
        const level2Items = level2Container.querySelectorAll('.level-2-item > a'); // Need class .level-2-item on LIs
        const level3Column = megaMenuPanel.querySelector('.level-3-column'); // Need class on L3 column div

        level2Items.forEach(item => {
             item.addEventListener('mouseenter', function() {
                 // Hide level 3 column initially
                 if (level3Column) {
                     level3Column.style.display = 'none';
                 }

                 const level3Content = item.parentElement.querySelector('.sub-menu'); // Get L3 submenu
                 if (level3Column && level3Content) {
                     level3Column.innerHTML = '<h4>' + item.textContent + '</h4>' + level3Content.outerHTML;
                     level3Column.style.display = 'block';

                     // Add a class to the UL in level 3 for specific styling
                     const level3List = level3Column.querySelector('ul');
                     if(level3List) {
                        level3List.classList.add('detailed-service-list');
                     }
                 }
             });
         });
    }

}); 