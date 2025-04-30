document.addEventListener('DOMContentLoaded', function() {
    // Get book ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');
    
    // Check if we have the book ID
    if (!bookId) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Get book data
    const bookData = findBookById(bookId);
    if (!bookData) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Display book details
    displayBookDetails(bookData);
    
    // Set up language toggle buttons for the book detail page
    const langButtons = document.querySelectorAll('.language-btn');
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            toggleDetailLanguage(lang);
            
            // Update active state on buttons
            langButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
        
        // Add touch events for better mobile experience
        button.addEventListener('touchend', function(e) {
            e.preventDefault(); // Prevent double events
            const lang = this.getAttribute('data-lang');
            toggleDetailLanguage(lang);
            
            // Update active state on buttons
            langButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Check if the site language is set to Arabic
    const isArabic = localStorage.getItem('arabic') === 'true';
    if (isArabic) {
        toggleDetailLanguage('ar');
        // Update active button
        langButtons.forEach(btn => {
            if (btn.getAttribute('data-lang') === 'ar') {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // Handle images for responsive devices
    handleResponsiveImages();
    
    // Handle orientation changes
    window.addEventListener('orientationchange', function() {
        // Wait for orientation change to complete
        setTimeout(function() {
            handleResponsiveImages();
        }, 200);
    });
    
    // Handle window resize
    window.addEventListener('resize', debounce(function() {
        handleResponsiveImages();
    }, 250));
    
    // Load related books
    loadRelatedBooks(bookData);
});

// Find book by ID
function findBookById(id) {
    // Check if we have book data loaded
    if (typeof window.booksData === 'undefined') {
        return null;
    }
    
    // Find book with matching ID
    return window.booksData.find(book => book.id === parseInt(id));
}

// Display book details
function displayBookDetails(book) {
    // Set page title
    document.title = `${book.title} - BookBites`;
    
    // Get the book cover container
    const bookCoverContainer = document.querySelector('.book-detail-cover');
    bookCoverContainer.innerHTML = ''; // Clear existing content
    
    // Create image element
    const img = document.createElement('img');
    img.id = 'book-cover';
    img.src = book.coverImage || book.coverImg || '';
    img.alt = book.title;
    
    // Create fallback div
    const fallbackDiv = document.createElement('div');
    fallbackDiv.className = 'default-cover';
    fallbackDiv.style.display = 'none';
    fallbackDiv.textContent = book.title;
    
    // Add error handler to image
    img.onerror = function() {
        this.style.display = 'none';
        fallbackDiv.style.display = 'flex';
    };
    
    // Append elements to container
    bookCoverContainer.appendChild(img);
    bookCoverContainer.appendChild(fallbackDiv);
    
    // Set book details
    document.getElementById('book-title').textContent = book.title;
    document.getElementById('book-author').textContent = `By ${book.author}`;
    document.getElementById('book-year').textContent = book.year;
    document.getElementById('book-pages').textContent = book.pages;
    
    // Set book summaries
    document.getElementById('book-summary-en').innerHTML = book.summary || book.summaryEn;
    document.getElementById('book-summary-ar').innerHTML = book.arabicSummary || book.summaryAr;
    
    // Generate key takeaways
    const takeawaysEl = document.getElementById('book-takeaways');
    takeawaysEl.innerHTML = '';
    
    // Check which language to use
    const isArabic = localStorage.getItem('arabic') === 'true';
    const takeaways = isArabic ? (book.takeawaysAr || []) : (book.takeawaysEn || []);
    
    if (takeaways.length > 0) {
        takeaways.forEach(takeaway => {
            const li = document.createElement('li');
            li.textContent = takeaway;
            takeawaysEl.appendChild(li);
        });
    } else {
        // If no takeaways, display a default message
        const li = document.createElement('li');
        li.textContent = isArabic ? 'لا توجد نقاط رئيسية متاحة.' : 'No key takeaways available.';
        takeawaysEl.appendChild(li);
    }
    
    // Generate quotes
    const quotesEl = document.getElementById('book-quotes');
    quotesEl.innerHTML = '';
    
    const quotes = isArabic ? (book.quotesAr || []) : (book.quotesEn || []);
    
    if (quotes.length > 0) {
        quotes.forEach(quote => {
            const quoteDiv = document.createElement('div');
            quoteDiv.classList.add('book-quote');
            
            const quoteText = document.createElement('p');
            quoteText.classList.add('quote-text');
            quoteText.textContent = `"${quote.text}"`;
            
            const quotePage = document.createElement('p');
            quotePage.classList.add('quote-page');
            quotePage.textContent = `Page ${quote.page}`;
            
            quoteDiv.appendChild(quoteText);
            quoteDiv.appendChild(quotePage);
            quotesEl.appendChild(quoteDiv);
        });
    } else {
        // If no quotes, display a default message
        const quoteDiv = document.createElement('div');
        quoteDiv.classList.add('book-quote');
        
        const quoteText = document.createElement('p');
        quoteText.classList.add('quote-text');
        quoteText.textContent = isArabic ? '"لا توجد اقتباسات متاحة."' : '"No quotes available."';
        
        quoteDiv.appendChild(quoteText);
        quotesEl.appendChild(quoteDiv);
    }
}

// Toggle between English and Arabic
function toggleDetailLanguage(lang) {
    const enSummary = document.getElementById('book-summary-en');
    const arSummary = document.getElementById('book-summary-ar');
    
    if (lang === 'en') {
        enSummary.style.display = 'block';
        arSummary.style.display = 'none';
        
        // Update takeaways and quotes to English
        updateTakeawaysAndQuotes(false);
    } else {
        enSummary.style.display = 'none';
        arSummary.style.display = 'block';
        
        // Update takeaways and quotes to Arabic
        updateTakeawaysAndQuotes(true);
    }
}

// Update takeaways and quotes based on language
function updateTakeawaysAndQuotes(isArabic) {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');
    const bookData = findBookById(bookId);
    
    if (!bookData) return;
    
    // Update takeaways
    const takeawaysEl = document.getElementById('book-takeaways');
    takeawaysEl.innerHTML = '';
    
    const takeaways = isArabic ? (bookData.takeawaysAr || []) : (bookData.takeawaysEn || []);
    
    if (takeaways.length > 0) {
        takeaways.forEach(takeaway => {
            const li = document.createElement('li');
            li.textContent = takeaway;
            takeawaysEl.appendChild(li);
        });
    } else {
        // If no takeaways, display a default message
        const li = document.createElement('li');
        li.textContent = isArabic ? 'لا توجد نقاط رئيسية متاحة.' : 'No key takeaways available.';
        takeawaysEl.appendChild(li);
    }
    
    // Update quotes
    const quotesEl = document.getElementById('book-quotes');
    quotesEl.innerHTML = '';
    
    const quotes = isArabic ? (bookData.quotesAr || []) : (bookData.quotesEn || []);
    
    if (quotes.length > 0) {
        quotes.forEach(quote => {
            const quoteDiv = document.createElement('div');
            quoteDiv.classList.add('book-quote');
            
            const quoteText = document.createElement('p');
            quoteText.classList.add('quote-text');
            quoteText.textContent = `"${quote.text}"`;
            
            const quotePage = document.createElement('p');
            quotePage.classList.add('quote-page');
            quotePage.textContent = `Page ${quote.page}`;
            
            quoteDiv.appendChild(quoteText);
            quoteDiv.appendChild(quotePage);
            quotesEl.appendChild(quoteDiv);
        });
    } else {
        // If no quotes, display a default message
        const quoteDiv = document.createElement('div');
        quoteDiv.classList.add('book-quote');
        
        const quoteText = document.createElement('p');
        quoteText.classList.add('quote-text');
        quoteText.textContent = isArabic ? '"لا توجد اقتباسات متاحة."' : '"No quotes available."';
        
        quoteDiv.appendChild(quoteText);
        quotesEl.appendChild(quoteDiv);
    }
    
    // Update RTL direction for Arabic
    if (isArabic) {
        takeawaysEl.setAttribute('dir', 'rtl');
        quotesEl.setAttribute('dir', 'rtl');
    } else {
        takeawaysEl.removeAttribute('dir');
        quotesEl.removeAttribute('dir');
    }
}

// Load related books
function loadRelatedBooks(currentBook) {
    // Get related books
    const relatedBooks = getRelatedBooks(currentBook);
    
    // Get related books container
    const relatedBooksContainer = document.getElementById('related-books');
    relatedBooksContainer.innerHTML = '';
    
    // Add related books to container
    relatedBooks.forEach(book => {
        const bookCard = createRelatedBookCard(book);
        relatedBooksContainer.appendChild(bookCard);
    });
}

// Get related books
function getRelatedBooks(currentBook) {
    // Get 3 random books that are not the current book
    const relatedBooks = [];
    
    // Create a copy of books data
    const availableBooks = window.booksData.filter(book => book.id !== currentBook.id);
    
    // Get random books
    for (let i = 0; i < Math.min(3, availableBooks.length); i++) {
        const randomIndex = Math.floor(Math.random() * availableBooks.length);
        relatedBooks.push(availableBooks[randomIndex]);
        availableBooks.splice(randomIndex, 1);
    }
    
    return relatedBooks;
}

// Create related book card
function createRelatedBookCard(book) {
    const card = document.createElement('div');
    card.classList.add('related-book-card');
    card.dataset.id = book.id;
    
    const imageDiv = document.createElement('div');
    imageDiv.classList.add('related-book-image');
    
    const img = document.createElement('img');
    img.src = book.coverImage || book.coverImg || '';
    img.alt = book.title;
    img.loading = 'lazy'; // Add lazy loading for better performance
    
    // Create fallback div
    const fallbackDiv = document.createElement('div');
    fallbackDiv.className = 'default-cover';
    fallbackDiv.style.display = 'none';
    fallbackDiv.textContent = book.title;
    
    // Add error handler to image
    img.onerror = function() {
        this.style.display = 'none';
        fallbackDiv.style.display = 'flex';
    };
    
    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('related-book-details');
    
    const title = document.createElement('h3');
    title.classList.add('related-book-title');
    title.textContent = book.title;
    
    const author = document.createElement('p');
    author.classList.add('related-book-author');
    author.textContent = `By ${book.author}`;
    
    imageDiv.appendChild(img);
    imageDiv.appendChild(fallbackDiv);
    detailsDiv.appendChild(title);
    detailsDiv.appendChild(author);
    
    card.appendChild(imageDiv);
    card.appendChild(detailsDiv);
    
    // Handle click event
    card.addEventListener('click', function() {
        window.location.href = `book.html?id=${book.id}`;
    });
    
    // Add touch event for mobile
    card.addEventListener('touchend', function(e) {
        e.preventDefault(); // Prevent double events
        window.location.href = `book.html?id=${book.id}`;
    });
    
    return card;
}

// Handle responsive images
function handleResponsiveImages() {
    const bookCover = document.getElementById('book-cover');
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const isSmallMobile = window.matchMedia('(max-width: 480px)').matches;
    const isLandscape = window.matchMedia('(orientation: landscape)').matches;
    
    // Adjust image sizing for better mobile display
    if (isMobile) {
        bookCover.style.maxWidth = isSmallMobile ? '150px' : '200px';
        bookCover.style.height = 'auto';
        
        // Adjust takeaways and quotes for better mobile readability
        const takeaways = document.querySelectorAll('.book-takeaways li');
        takeaways.forEach(item => {
            item.style.marginBottom = '12px';
            item.style.fontSize = isSmallMobile ? '0.95rem' : '1rem';
        });
        
        const quotes = document.querySelectorAll('.book-quote');
        quotes.forEach(quote => {
            quote.style.padding = isSmallMobile ? '12px' : '15px';
            quote.style.marginBottom = '15px';
        });
        
        // Adjust related books grid
        const relatedGrid = document.querySelector('.related-books-grid');
        if (relatedGrid) {
            relatedGrid.style.gridTemplateColumns = isSmallMobile ? '1fr' : 'repeat(2, 1fr)';
        }
    } else {
        bookCover.style.maxWidth = '';
        bookCover.style.height = '';
        
        // Reset takeaways and quotes styling
        const takeaways = document.querySelectorAll('.book-takeaways li');
        takeaways.forEach(item => {
            item.style.marginBottom = '';
            item.style.fontSize = '';
        });
        
        const quotes = document.querySelectorAll('.book-quote');
        quotes.forEach(quote => {
            quote.style.padding = '';
            quote.style.marginBottom = '';
        });
        
        // Reset related books grid
        const relatedGrid = document.querySelector('.related-books-grid');
        if (relatedGrid) {
            relatedGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
        }
    }
    
    // Special handling for landscape on mobile devices
    if (isMobile && isLandscape) {
        // Optimize layout for landscape view on mobile
        const bookDetailHeader = document.querySelector('.book-detail-header');
        if (bookDetailHeader) {
            bookDetailHeader.style.flexDirection = 'row';
            bookDetailHeader.style.alignItems = 'flex-start';
        }
        
        if (relatedGrid) {
            relatedGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
        }
    }
    
    // Optimize lazy loading of images
    const relatedImages = document.querySelectorAll('.related-book-image img');
    relatedImages.forEach(img => {
        if ('loading' in HTMLImageElement.prototype) {
            img.loading = 'lazy';
        }
        
        // Add error handler to provide fallback for missing images
        img.onerror = function() {
            this.src = 'images/default-book-cover.jpg';
            this.alt = 'Book cover not available';
        };
    });
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