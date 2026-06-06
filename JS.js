// Scriba Library - Interactive Operations JS File

document.addEventListener("DOMContentLoaded", () => {
    // --- BOOK CATALOG DATASET ---
    const books = [
        {
            id: 1,
            title: "Clean Code",
            author: "Robert C. Martin",
            category: "programming",
            rating: 5.0,
            image: "images/book_programming.png",
            description: "Clean Code is divided into three parts. The first describes the principles, patterns, and practices of writing clean code. The second part consists of several case studies of increasing complexity. The third part is the payoff: a list of heuristics and 'smells' gathered while creating the case studies."
        },
        {
            id: 2,
            title: "A Brief History of Time",
            author: "Stephen Hawking",
            category: "science",
            rating: 4.8,
            image: "images/book_science.png",
            description: "Stephen Hawking's landmark work explores the most profound questions of our universe: How did it begin? What is time? Will it ever end? Written in clear, accessible language, this classic book takes us on an incredible journey through cosmology, black holes, and the laws of physics."
        },
        {
            id: 3,
            title: "The Guns of August",
            author: "Barbara W. Tuchman",
            category: "history",
            rating: 4.0,
            image: "images/book_history.png",
            description: "This Pulitzer Prize-winning history classic details the events leading up to and the first month of World War I. Tuchman examines the political and military decisions that set the conflict in motion, providing a masterful analysis of human error, arrogance, and fate."
        },
        {
            id: 4,
            title: "Nineteen Eighty-Four",
            author: "George Orwell",
            category: "fiction",
            rating: 4.9,
            image: "images/book_fiction.png",
            description: "Orwell's haunting dystopian masterpiece presents a chilling vision of a totalitarian regime that dominates every aspect of life and thought. Through the eyes of Winston Smith, the book explores themes of surveillance, propaganda, censorship, and the resilience of the human spirit."
        },
        {
            id: 5,
            title: "The Pragmatic Programmer",
            author: "Andrew Hunt & David Thomas",
            category: "programming",
            rating: 4.7,
            image: "images/christopher-gower-m_HRfLhgABo-unsplash.jpg",
            description: "One of the most significant books on software development. The Pragmatic Programmer cuts through the increasing specialization and technicalities of modern software development to examine the core process—taking a requirement and producing working, maintainable code."
        },
        {
            id: 6,
            title: "Cosmos",
            author: "Carl Sagan",
            category: "science",
            rating: 4.9,
            image: "images/kobu-agency-csJt89dL9pE-unsplash.jpg",
            description: "Sagan's masterpiece explores the 15 billion years of cosmic evolution. With beautiful prose, Sagan details how science and civilization grew together, taking readers on a journey through space and time to discover our place in the universe."
        }
    ];

    // --- STATE MANAGEMENT ---
    let activeCategory = "all";
    let searchQuery = "";

    // --- DOM ELEMENTS ---
    const bookGrid = document.getElementById("book-grid");
    const searchInput = document.getElementById("book-search");
    const searchClearBtn = document.getElementById("search-clear-btn");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const noResultsMsg = document.getElementById("no-results");
    
    // Theme Switch Elements
    const themeToggle = document.getElementById("theme-toggle");
    const htmlElement = document.documentElement;

    // Mobile Navbar Elements
    const mobileToggle = document.querySelector(".mobile-toggle");
    const navLinks = document.querySelector(".nav-links");

    // Modal Elements
    const modal = document.getElementById("book-modal");
    const modalImg = document.getElementById("modal-img");
    const modalTitle = document.getElementById("modal-title");
    const modalAuthor = document.getElementById("modal-author-name");
    const modalCategory = document.getElementById("modal-category");
    const modalRating = document.getElementById("modal-rating");
    const modalDesc = document.getElementById("modal-description");
    const closeModalBtn = document.querySelector(".close-modal");
    const modalBackdrop = document.querySelector(".modal-backdrop");
    const btnRead = document.getElementById("btn-read");
    const btnListen = document.getElementById("btn-listen");

    // Contact form Elements
    const contactForm = document.getElementById("quick-contact");
    const formSuccess = document.getElementById("form-success");

    // --- DYNAMIC RENDERING FUNCTIONS ---

    // Generate HTML rating stars
    function getStarsHTML(rating) {
        let starsHTML = "";
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 >= 0.5;
        const total = 5;

        for (let i = 1; i <= fullStars; i++) {
            starsHTML += '<i class="fa-solid fa-star"></i>';
        }
        if (hasHalf) {
            starsHTML += '<i class="fa-solid fa-star-half-stroke"></i>';
        }
        const remaining = total - fullStars - (hasHalf ? 1 : 0);
        for (let i = 1; i <= remaining; i++) {
            starsHTML += '<i class="fa-regular fa-star"></i>';
        }
        starsHTML += ` <span>${rating.toFixed(1)}</span>`;
        return starsHTML;
    }

    // Render Book Grid
    function renderBooks() {
        // Filter dataset based on category and search query
        const filteredBooks = books.filter(book => {
            const matchesCategory = activeCategory === "all" || book.category === activeCategory;
            const matchesSearch = book.title.toLowerCase().includes(searchQuery) ||
                                  book.author.toLowerCase().includes(searchQuery) ||
                                  book.category.toLowerCase().includes(searchQuery);
            return matchesCategory && matchesSearch;
        });

        // Toggle no-results message
        if (filteredBooks.length === 0) {
            bookGrid.style.display = "none";
            noResultsMsg.style.display = "block";
        } else {
            bookGrid.style.display = "grid";
            noResultsMsg.style.display = "none";
        }

        // Generate Cards
        bookGrid.innerHTML = filteredBooks.map((book, idx) => `
            <article class="card book-card glass animate-on-scroll visible" data-id="${book.id}" style="animation-delay: ${idx * 0.05}s;">
                <div class="card-img-wrapper">
                    <img src="${book.image}" alt="${book.title}" loading="lazy">
                </div>
                <div class="card-body">
                    <span class="card-tag">${book.category}</span>
                    <h3>${book.title}</h3>
                    <p class="card-author">${book.author}</p>
                    <div class="card-rating">
                        ${getStarsHTML(book.rating)}
                    </div>
                    <button class="btn btn-card-details" data-id="${book.id}">View Details</button>
                </div>
            </article>
        `).join("");

        // Attach modal event triggers to buttons
        const detailButtons = bookGrid.querySelectorAll(".btn-card-details");
        detailButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const id = parseInt(btn.getAttribute("data-id"));
                openModal(id);
            });
        });
    }

    // --- SEARCH AND FILTER INTERACTIVE EVENTS ---

    // Search input handler
    searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        
        // Toggle search clear button visibility
        if (searchQuery.length > 0) {
            searchClearBtn.style.display = "block";
        } else {
            searchClearBtn.style.display = "none";
        }
        
        renderBooks();
    });

    // Clear search handler
    searchClearBtn.addEventListener("click", () => {
        searchInput.value = "";
        searchQuery = "";
        searchClearBtn.style.display = "none";
        renderBooks();
        searchInput.focus();
    });

    // Category filter handler
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove active classes
            filterButtons.forEach(b => b.classList.remove("active"));
            
            // Add active class to clicked button
            btn.classList.add("active");
            activeCategory = btn.getAttribute("data-category");
            
            renderBooks();
        });
    });

    // --- DETAILS MODAL CONTROLLER ---

    function openModal(bookId) {
        const book = books.find(b => b.id === bookId);
        if (!book) return;

        // Populate modal data
        modalImg.src = book.image;
        modalImg.alt = book.title;
        modalTitle.textContent = book.title;
        modalAuthor.textContent = book.author;
        modalCategory.textContent = book.category;
        modalRating.innerHTML = getStarsHTML(book.rating);
        modalDesc.textContent = book.description;

        // Button Actions
        btnRead.onclick = () => {
            alert(`Mock Action: Opening reader for "${book.title}"...`);
        };
        btnListen.onclick = () => {
            alert(`Mock Action: Starting audiobook narrator for "${book.title}"...`);
        };

        // Open modal
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden"; // Prevent background scroll
    }

    function closeModal() {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = ""; // Restore background scroll
    }

    // Modal Close Triggers
    closeModalBtn.addEventListener("click", closeModal);
    modalBackdrop.addEventListener("click", closeModal);
    
    // Close modal on Escape key press
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) {
            closeModal();
        }
    });

    // --- DARK & LIGHT THEME TOGGLE ---

    // Initial check: look for user preference in local storage, or fall back to system preferences
    const savedTheme = localStorage.getItem("scriba-theme");
    const userPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "light" || (!savedTheme && !userPrefersDark)) {
        htmlElement.setAttribute("data-theme", "light");
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        htmlElement.setAttribute("data-theme", "dark");
        themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }

    // Toggle click listener
    themeToggle.addEventListener("click", () => {
        const currentTheme = htmlElement.getAttribute("data-theme");
        
        if (currentTheme === "dark") {
            htmlElement.setAttribute("data-theme", "light");
            themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
            localStorage.setItem("scriba-theme", "light");
        } else {
            htmlElement.setAttribute("data-theme", "dark");
            themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
            localStorage.setItem("scriba-theme", "dark");
        }
    });

    // --- MOBILE BURGER MENU TOGGLE ---

    mobileToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.contains("active");
        
        if (isOpen) {
            navLinks.classList.remove("active");
            mobileToggle.classList.remove("active");
            mobileToggle.setAttribute("aria-expanded", "false");
        } else {
            navLinks.classList.add("active");
            mobileToggle.classList.add("active");
            mobileToggle.setAttribute("aria-expanded", "true");
        }
    });

    // Close menu when clicking nav links
    const linkItems = navLinks.querySelectorAll("a");
    linkItems.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            mobileToggle.classList.remove("active");
            mobileToggle.setAttribute("aria-expanded", "false");
        });
    });

    // --- SCROLL ANIMATION SCRIPT ---

    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    
    const observerOptions = {
        root: null, // viewport
        rootMargin: "0px",
        threshold: 0.10 // 10% visible
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => scrollObserver.observe(el));

    // --- CONTACT FORM SUBMISSION MOCK ---
    
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Mocking input submission loading
            const btn = contactForm.querySelector("button[type='submit']");
            const originalText = btn.textContent;
            btn.textContent = "Sending...";
            btn.disabled = true;
            
            setTimeout(() => {
                contactForm.reset();
                btn.textContent = originalText;
                btn.disabled = false;
                
                // Show success message
                formSuccess.style.display = "block";
                
                // Fade out success message after 5 seconds
                setTimeout(() => {
                    formSuccess.style.display = "none";
                }, 5000);
            }, 1200);
        });
    }

    // --- INITIAL RENDERING TRIGGER ---
    renderBooks();
});
