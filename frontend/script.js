// 1. Tell the script where your Django REST Framework API is running
const API_URL = "http://127.0.0.1:8000/api/books/";

// Grab the parent container node where our cards will go
const listContainer = document.getElementById("books-list");

// 2. Request data from our Django backend server
fetch(API_URL)
    .then(response => response.json()) // Convert raw database stream to a JSON array list
    .then(books => {
        listContainer.innerHTML = ""; // Clear out the loading placeholder message

        // Check if our database table is completely empty
        if (books.length === 0) {
            listContainer.innerHTML = '<p class="status-msg">Your catalog is currently empty.</p>';
            return;
        }

        // 3. Loop through every single book block entry sent down by DRF
        books.forEach(book => {
            // Create a temporary container block element in memory
            const card = document.createElement("div");
            card.className = "book-card";

            // Inject the structured layout matching our fields from models.py
            card.innerHTML = `
                <h3 class="book-title">📖 ${book.title}</h3>
                <p class="book-author">by ${book.author}</p>
                <p class="book-desc">${book.desc}</p>
            `;

            // Append our freshly styled object card node into the visible HTML board layout
            listContainer.appendChild(card);
        });
    })
    .catch(error => {
        console.error("Connection failed:", error);
        listContainer.innerHTML = `
            <p class="status-msg" style="color: #e74c3c;">
                <strong>Failed to connect to backend server!</strong><br>
                Make sure your Django environment is running and CORS handles are allowed.
            </p>`;
    });
