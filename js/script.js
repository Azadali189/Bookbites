// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Auth Pages
    const signInForm = document.getElementById('signin-form');
    const signUpToggle = document.getElementById('signup-toggle');
    const guestBtn = document.getElementById('guest-btn');
    
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    
    // Language Toggle
    const languageToggle = document.getElementById('language-toggle');
    
    // Book Container
    const booksContainer = document.getElementById('books-container');
    
    // Responsive variables
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const isSmallMobile = window.matchMedia('(max-width: 480px)').matches;
    
    // Initialize the app
    init();
    
    // Functions
    function init() {
        // Merge all book data sets
        mergeBookData();
        
        // Load books if on dashboard page
        if (booksContainer) {
            loadBooks();
        }
        
        // Set up event listeners
        setupEventListeners();
        
        // Check for theme preference
        checkTheme();
        
        // Check language preference
        checkLanguage();
        
        // Apply responsive adjustments
        applyResponsiveAdjustments();
    }
    
    // New function to handle responsive adjustments
    function applyResponsiveAdjustments() {
        if (isMobile) {
            // Adjust UI for mobile devices
            const headerOptions = document.querySelector('.header-options');
            if (headerOptions) {
                // Make sure all touch targets are at least 44px
                const touchButtons = headerOptions.querySelectorAll('button');
                touchButtons.forEach(btn => {
                    btn.style.minHeight = '44px';
                    btn.style.minWidth = '44px';
                });
            }
        }
        
        // Handle orientation changes
        window.addEventListener('orientationchange', handleOrientationChange);
        window.addEventListener('resize', debounce(handleResize, 250));
    }
    
    // Debounce function to limit resize event firing
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
    
    // Handle orientation changes
    function handleOrientationChange() {
        // Force reflow of elements after orientation change
        setTimeout(() => {
            if (booksContainer) {
                // Re-layout the books grid
                const newIsMobile = window.matchMedia('(max-width: 768px)').matches;
                if (newIsMobile !== isMobile) {
                    // Refresh layout if we crossed a breakpoint
                    loadBooks();
                }
            }
            // Scroll to top for better UX after orientation change
            window.scrollTo(0, 0);
        }, 200);
    }
    
    // Handle window resize
    function handleResize() {
        const newIsMobile = window.matchMedia('(max-width: 768px)').matches;
        const newIsSmallMobile = window.matchMedia('(max-width: 480px)').matches;
        
        // Only reload if breakpoint crossed
        if ((newIsMobile !== isMobile) || (newIsSmallMobile !== isSmallMobile)) {
            if (booksContainer) {
                loadBooks();
            }
        }
    }
    
    function mergeBookData() {
        // Create a master book data array if it doesn't exist
        if (typeof window.booksData === 'undefined') {
            window.booksData = [];
        }
        
        // Add books from other data files if they exist
        if (typeof booksData2 !== 'undefined') {
            window.booksData = [...window.booksData, ...booksData2];
        }
        
        if (typeof booksData3 !== 'undefined') {
            window.booksData = [...window.booksData, ...booksData3];
        }
        
        if (typeof booksData4 !== 'undefined') {
            window.booksData = [...window.booksData, ...booksData4];
        }
    }
    
    function setupEventListeners() {
        // Auth event listeners
        if (signInForm) {
            signInForm.addEventListener('submit', handleSignIn);
        }
        
        if (signUpToggle) {
            signUpToggle.addEventListener('click', () => {
                window.location.href = 'signup.html';
            });
        }
        
        if (guestBtn) {
            guestBtn.addEventListener('click', handleGuestAccess);
        }
        
        // Theme toggle - add touch events
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
            themeToggle.addEventListener('touchend', function(e) {
                e.preventDefault(); // Prevent double events
                toggleTheme();
            });
        }
        
        // Language toggle - add touch events
        if (languageToggle) {
            languageToggle.addEventListener('click', toggleLanguage);
            languageToggle.addEventListener('touchend', function(e) {
                e.preventDefault(); // Prevent double events
                toggleLanguage();
            });
        }
        
        // Add event listener for signup page "sign in" link
        const signInToggle = document.getElementById('signin-toggle');
        if (signInToggle) {
            signInToggle.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
        
        // Back to books button on book detail page - add touch events
        const backToBooksBtn = document.getElementById('back-to-books');
        if (backToBooksBtn) {
            backToBooksBtn.addEventListener('click', () => {
                window.location.href = 'dashboard.html';
            });
            backToBooksBtn.addEventListener('touchend', function(e) {
                e.preventDefault(); // Prevent double events
                window.location.href = 'dashboard.html';
            });
        }
        
        // Search functionality
        const searchBtn = document.getElementById('search-btn');
        const searchInput = document.getElementById('search-input');
        
        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', () => {
                const query = searchInput.value.trim().toLowerCase();
                if (query) {
                    searchBooks(query);
                } else {
                    loadBooks(); // Reset to show all books
                }
            });
            
            // Add touch event for mobile
            searchBtn.addEventListener('touchend', function(e) {
                e.preventDefault(); // Prevent double events
                const query = searchInput.value.trim().toLowerCase();
                if (query) {
                    searchBooks(query);
                } else {
                    loadBooks(); // Reset to show all books
                }
            });
            
            // Search on Enter key
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const query = searchInput.value.trim().toLowerCase();
                    if (query) {
                        searchBooks(query);
                    } else {
                        loadBooks(); // Reset to show all books
                    }
                }
            });
        }
        
        // Logout button - add touch events
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
            logoutBtn.addEventListener('touchend', function(e) {
                e.preventDefault(); // Prevent double events
                window.location.href = 'index.html';
            });
        }
        
        // Fix 300ms delay on mobile devices
        document.addEventListener('touchstart', function() {}, {passive: true});
    }
    
    function handleSignIn(e) {
        e.preventDefault();
        // In a real app, validate and send to server
        // For demo, redirect to dashboard
        window.location.href = 'dashboard.html';
    }
    
    function handleGuestAccess() {
        // Direct to dashboard as guest
        window.location.href = 'dashboard.html';
    }
    
    function toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('darkTheme', isDark);
        
        // Update icon
        const icon = themeToggle.querySelector('i');
        if (isDark) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
    
    function checkTheme() {
        const isDark = localStorage.getItem('darkTheme') === 'true';
        if (isDark) {
            document.body.classList.add('dark-theme');
            if (themeToggle) {
                const icon = themeToggle.querySelector('i');
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        }
    }
    
    function toggleLanguage() {
        document.body.classList.toggle('arabic');
        const isArabic = document.body.classList.contains('arabic');
        localStorage.setItem('arabic', isArabic);
        
        // Update language display
        if (languageToggle) {
            const langDisplay = languageToggle.querySelector('.current-lang');
            langDisplay.textContent = isArabic ? 'AR' : 'EN';
        }
    }
    
    function checkLanguage() {
        const isArabic = localStorage.getItem('arabic') === 'true';
        if (isArabic) {
            document.body.classList.add('arabic');
            if (languageToggle) {
                const langDisplay = languageToggle.querySelector('.current-lang');
                langDisplay.textContent = 'AR';
            }
        }
    }
    
    function loadBooks() {
        if (!booksContainer) return;
        
        // Clear container first
        booksContainer.innerHTML = '';
        
        const books = getBooksData();
        
        books.forEach(book => {
            const bookElement = createBookElement(book);
            booksContainer.appendChild(bookElement);
        });
    }
    
    function searchBooks(query) {
        if (!booksContainer) return;
        
        // Clear container
        booksContainer.innerHTML = '';
        
        const books = getBooksData();
        const filteredBooks = books.filter(book => 
            book.title.toLowerCase().includes(query) || 
            book.author.toLowerCase().includes(query) ||
            book.summary.toLowerCase().includes(query)
        );
        
        if (filteredBooks.length === 0) {
            booksContainer.innerHTML = `
                <div class="no-results">
                    <h2>No books found matching "${query}"</h2>
                    <p>Try a different search term or browse all books</p>
                </div>
            `;
            return;
        }
        
        filteredBooks.forEach(book => {
            const bookElement = createBookElement(book);
            booksContainer.appendChild(bookElement);
        });
    }
    
    function createBookElement(book) {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.setAttribute('data-book-id', book.id);
        
        // Determine image source and summary
        const imageSource = book.coverImage || book.coverImg || '';
        const summary = book.summary || book.summaryEn || 'No summary available.';
        
        // Create actual image element instead of background
        bookCard.innerHTML = `
            <div class="book-image-container">
                <img class="book-image-full" src="${imageSource}" alt="${book.title} cover" onerror="this.onerror=null; this.classList.add('error');">
                <div class="img-fallback">${book.title}</div>
            </div>
            <div class="book-details">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">By ${book.author}</p>
                <p class="book-summary">${summary.substring(0, 150)}...</p>
                <div class="book-actions">
                    <a href="book.html?id=${book.id}" class="btn-read-more">View Details</a>
                    <a href="#" class="read-more" data-book-id="${book.id}">Quick View</a>
                </div>
            </div>
        `;
        
        // Add event listener for quick view
        const readMoreBtn = bookCard.querySelector('.read-more');
        readMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showBookDetails(book);
        });
        
        return bookCard;
    }
    
    function showBookDetails(book) {
        // Create modal element
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.setAttribute('id', `book-modal-${book.id}`);
        
        // Determine image source
        const imageSource = book.coverImage || book.coverImg || '';
        
        // Determine summaries
        const englishSummary = book.summary || book.summaryEn || 'No summary available.';
        const arabicSummary = book.arabicSummary || book.summaryAr || 'لا يوجد ملخص متاح.';
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="modal-header">
                    <div class="modal-image">
                        <img src="${imageSource}" alt="${book.title} cover" onerror="this.onerror=null; this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="default-cover" style="display:none;">${book.title}</div>
                    </div>
                    <div class="modal-info">
                        <h2 class="modal-title">${book.title}</h2>
                        <p class="modal-author">By ${book.author}</p>
                        <p class="modal-year"><i class="fas fa-calendar"></i> ${book.year || "Unknown"}</p>
                        <a href="book.html?id=${book.id}" class="btn-full-details">See Full Details</a>
                    </div>
                </div>
                <div class="language-toggle">
                    <button class="language-btn active" data-lang="en">English</button>
                    <button class="language-btn" data-lang="ar">Arabic</button>
                </div>
                <div class="book-full-summary en">${englishSummary}</div>
                <div class="book-full-summary ar" style="display: none; direction: rtl;">${arabicSummary}</div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'block';
        
        // Close modal on X click
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            modal.remove();
        });
        
        // Close modal on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                modal.remove();
            }
        });
        
        // Close modal on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                modal.style.display = 'none';
                modal.remove();
            }
        });
        
        // Toggle language
        const langBtns = modal.querySelectorAll('.language-btn');
        langBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                langBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const lang = this.getAttribute('data-lang');
                const summaries = modal.querySelectorAll('.book-full-summary');
                
                summaries.forEach(summary => {
                    summary.style.display = 'none';
                });
                
                modal.querySelector(`.book-full-summary.${lang}`).style.display = 'block';
            });
        });
    }
    
    function getBooksData() {
        return window.booksData || [];
    }
}); 