const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;

axios.defaults.headers.common["X-CSRFToken"] = csrfToken;

async function updateBookList() {
  try {
    const res = await axios.get("http://localhost:8000/api/book-list/");
    const data = res.data;

    const bookListContainer = document.querySelector(".book-list");

    bookListContainer.innerHTML = "";

    data.forEach((book) => {
      const bookContainer = document.createElement("div");
      bookContainer.classList.add("col-10");
      bookContainer.innerHTML = `
      <div class="book-container card text-white bg-dark text-center d-flex justify-content-around">
            <div class="book-details-container">
              <h3 class="book-title text-center h3 badge rounded-pill bg-secondary">${
                book.title
              }</h3>
              <p class="book-details">ID: ${book.id}</p>
              <p class="book-details">Author: ${book.author}</p>
              <p class="book-details">Genre: ${book.genre}</p>
              <p class="book-details">ISBN:${book.isbn}</p>
             
            </div>
            <div class="book-details-container second-col-book-detail">
              <p class="book-details">Availability: ${
                book.availability_status ? "Yes" : "No"
              }</p>
              <p class="book-details">Borrowed By: ${
                book.availability_status
                  ? "None"
                  : book.borrowed_by.borrowed_member.member
              }</p>
              <p class="book-details">ISBN:${book.isbn}</p>
              <button class='update-book btn btn-secondary'>Update</button>
              <button id=${
                book.id
              } class='delete-book btn btn-danger'>Delete</button>
            </div>
          </div>
        `;

      // Append the book container to the book list container
      bookListContainer.appendChild(bookContainer);
      // ... Your existing code ...

      const updateBookButton = document.querySelectorAll(".update-book");
      const modalContainer = document.querySelector(".modal-container");
      const modal = document.querySelector(".modal");
      const updateForm = document.getElementById("updateForm");
      const updateTitleInput = document.getElementById("updateTitle");
      const updateAuthorInput = document.getElementById("updateAuthor");
      const updateGenreInput = document.getElementById("updateGenre");
      const updateISBNInput = document.getElementById("updateISBN");

      const deleteBookButtons = document.querySelectorAll(".btn-danger");

      deleteBookButtons.forEach((btn) => {
        btn.addEventListener("click", async () => {
          const deleteId = btn.id;
          console.log(deleteId);
          await deleteMember(deleteId);
          location.reload();
        });
      });

      async function deleteMember(deleteId) {
        await axios.delete(`http://localhost:8000/api/book-list/${deleteId}/`);
      }

      // Function to populate the modal form with book data
      function populateFormWithData(book) {
        updateTitleInput.value = book.title;
        updateAuthorInput.value = book.author;
        updateGenreInput.value = book.genre;
        updateISBNInput.value = book.isbn;
        // Populate other form fields as needed based on the book object properties
      }

      updateBookButton.forEach((button, index) => {
        button.addEventListener("click", () => {
          // Get the book data associated with the clicked "Update" button
          const bookToUpdate = data[index];

          // Populate the form with book data
          populateFormWithData(bookToUpdate);

          // Show the modal when the "Update" button is clicked
          modalContainer.style.display = "block";
          modal.style.display = "block";

          const closeModalButton = document.querySelector(".close-modal");
          function hideModal() {
            const modalContainer = document.querySelector(".modal-container");
            modalContainer.style.display = "none";
          }
          const updateBookButtons = document.querySelectorAll(".update-book");
          updateBookButtons.forEach((button) => {
            button.addEventListener("click", () => {
              const modalContainer = document.querySelector(".modal-container");
              modalContainer.style.display = "block";
            });
          });
          // Add an event listener to the form submission
          closeModalButton.addEventListener("click", hideModal);
          updateForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            // Get the updated book data from the form inputs
            const updatedTitle = updateTitleInput.value;
            const updatedAuthor = updateAuthorInput.value;
            const updateGenre = updateGenreInput.value;
            const updateISBN = updateISBNInput.value;
            // Get other form input values as needed

            try {
              // Send a PUT request to update the book data
              await axios.patch(
                `http://localhost:8000/api/book-list/${bookToUpdate.id}/`,
                {
                  title: updatedTitle,
                  author: updatedAuthor,
                  genre: updateGenre,
                  isbn: updateISBN,
                  // Send other form input values as needed
                }
              );

              // If the update was successful, hide the modal
              modalContainer.style.display = "none";
              modal.style.display = "none";

              // Update the book list to reflect the changes
              location.reload();
            } catch (error) {
              console.error("Error updating book:", error);
            }
          });
        });
      });

      // ... Your existing code ...
    });
  } catch (error) {
    console.error("Error fetching book list:", error);
  }
}

updateBookList();

const bookAddForm = document.querySelector(".book-add-form");

bookAddForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const title = document.querySelector('input[name="title"]').value;
  const author = document.querySelector('input[name="author"]').value;
  const genre = document.querySelector('select[name="genre"]').value;
  const isbn = document.querySelector('input[name="isbn"]').value;
  document.querySelector('input[name="isbn"]').value = "";
  document.querySelector('input[name="title"]').value = "";
  document.querySelector('input[name="author"]').value = "";
  document.querySelector('select[name="genre"]').value = "";
  document.querySelector('input[name="isbn"]').value = "";
  const formData = {
    title,
    author,
    genre,
    isbn,
  };
  await axios.post("http://localhost:8000/api/book-list/", formData);
  location.reload();
});

// search for the book
const bookSearch = document.querySelector(".book-search");

bookSearch.addEventListener("keyup", (e) => {
  e.preventDefault();
  const searchValue = bookSearch.value;

  async function searchBook() {
    const res = await axios.get(
      `http://localhost:8000/api/book-search/?q=${searchValue}`
    );
    const data = res.data;

    const bookListContainer = document.querySelector(".book-list");

    bookListContainer.innerHTML = "";

    data.forEach((book) => {
      const bookContainer = document.createElement("div");
      bookContainer.classList.add("col-10");
      bookContainer.innerHTML = `
      <div class="book-container card text-white bg-dark text-center d-flex justify-content-around">
      <div class="book-details-container">
        <h3 class="book-title text-center h3 badge rounded-pill bg-secondary">${
          book.title
        }</h3>
        <p class="book-details">ID: ${book.id}</p>
        <p class="book-details">Author: ${book.author}</p>
        <p class="book-details">Genre: ${book.genre}</p>
        <p class="book-details">ISBN:${book.isbn}</p>
       
      </div>
      <div class="book-details-container second-col-book-detail">
        <p class="book-details">Availability: ${
          book.availability_status ? "Yes" : "No"
        }</p>
        <p class="book-details">Borrowed By: ${
          book.availability_status
            ? "None"
            : book.borrowed_by.borrowed_member.member
        }</p>
        <p class="book-details">ISBN:${book.isbn}</p>
        <button class='update-book btn btn-secondary'>Update</button>
        <button id=${book.id} class='delete-book btn btn-danger'>Delete</button>
      </div>
    </div>
  `;

      // Append the book container to the book list container
      bookListContainer.appendChild(bookContainer);
      const updateBookButton = document.querySelectorAll(".update-book");
      const modalContainer = document.querySelector(".modal-container");
      const modal = document.querySelector(".modal");
      const updateForm = document.getElementById("updateForm");
      const updateTitleInput = document.getElementById("updateTitle");
      const updateAuthorInput = document.getElementById("updateAuthor");
      const updateGenreInput = document.getElementById("updateGenre");
      const updateISBNInput = document.getElementById("updateISBN");
      const updateYearInput = document.getElementById("updateYear");

      const deleteBookButtons = document.querySelectorAll(".btn-danger");

      deleteBookButtons.forEach((btn) => {
        btn.addEventListener("click", async () => {
          const deleteId = btn.id;
          console.log(deleteId);
          await deleteMember(deleteId);
          location.reload();
        });
      });

      async function deleteMember(deleteId) {
        await axios.delete(`http://localhost:8000/api/book-list/${deleteId}/`);
      }

      // Function to populate the modal form with book data
      function populateFormWithData(book) {
        updateTitleInput.value = book.title;
        updateAuthorInput.value = book.author;
        updateGenreInput.value = book.genre;
        updateISBNInput.value = book.isbn;
        // Populate other form fields as needed based on the book object properties
      }

      updateBookButton.forEach((button, index) => {
        button.addEventListener("click", () => {
          // Get the book data associated with the clicked "Update" button
          const bookToUpdate = data[index];

          // Populate the form with book data
          populateFormWithData(bookToUpdate);

          // Show the modal when the "Update" button is clicked
          modalContainer.style.display = "block";
          modal.style.display = "block";

          const closeModalButton = document.querySelector(".close-modal");
          function hideModal() {
            const modalContainer = document.querySelector(".modal-container");
            modalContainer.style.display = "none";
          }
          const updateBookButtons = document.querySelectorAll(".update-book");
          updateBookButtons.forEach((button) => {
            button.addEventListener("click", () => {
              const modalContainer = document.querySelector(".modal-container");
              modalContainer.style.display = "block";
            });
          });
          // Add an event listener to the form submission
          closeModalButton.addEventListener("click", hideModal);
          updateForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            // Get the updated book data from the form inputs
            const updatedTitle = updateTitleInput.value;
            const updatedAuthor = updateAuthorInput.value;
            const updateGenre = updateGenreInput.value;
            const updateISBN = updateISBNInput.value;
            // Get other form input values as needed

            try {
              // Send a PUT request to update the book data
              await axios.patch(
                `http://localhost:8000/api/book-list/${bookToUpdate.id}/`,
                {
                  title: updatedTitle,
                  author: updatedAuthor,
                  genre: updateGenre,
                  isbn: updateISBN,
                  // Send other form input values as needed
                }
              );

              // If the update was successful, hide the modal
              modalContainer.style.display = "none";
              modal.style.display = "none";
              location.reload();
              // Update the book list to reflect the changes
            } catch (error) {
              console.error("Error updating book:", error);
            }
          });
        });
      });
    });
  }
  searchBook();
});
