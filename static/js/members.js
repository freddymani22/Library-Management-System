const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;

axios.defaults.headers.common["X-CSRFToken"] = csrfToken;

async function updateMembersList() {
  try {
    const res = await axios.get("http://localhost:8000/api/member-list/");
    const data = res.data;

    const MemberListContainer = document.querySelector(".member-list");

    MemberListContainer.innerHTML = "";

    data.forEach((member) => {
      const memberContainer = document.createElement("div");
      memberContainer.classList.add("col-10");
      memberContainer.innerHTML = `
      <div class="member-container card text-white bg-primary text-center d-flex justify-content-around">
            <div class="member-details-container">
              <h3 class="member-title text-center badge rounded-pill bg-secondary">${
                member.member
              }</h3>
              <p class="member-details">ID: ${member.id}</p>
              <p class="member-details">Email: ${member.email}</p>
              <p class="member-details">Borrowed/Not-returned: ${
                member.latest_book != null ? member.latest_book : "none"
              }</p>
              <div class="member-details-container second-col-book-detail">
             
            </div>
              <button class='update-member btn btn-secondary'>Update</button>
              <button class='delete-member btn btn-danger' id=${
                member.id
              }>Delete</button>
            </div>
          </div>
        `;

      // Append the book container to the book list container
      MemberListContainer.appendChild(memberContainer);
      // ... Your existing code ...

      const updateMemberButton = document.querySelectorAll(".update-member");
      const deleteMemberButtons = document.querySelectorAll(".delete-member");
      const modalContainer = document.querySelector(".modal-container");
      const modal = document.querySelector(".modal");
      const updateForm = document.getElementById("updateForm");
      const updateNameInput = document.getElementById("updateName");
      const updateEmailInput = document.getElementById("updateEmail");

      for (let btn of deleteMemberButtons) {
        btn.addEventListener("click", () => {
          const deleteId = btn.id;
          deleteMember(deleteId);
          updateMembersList();
        });
      }

      async function deleteMember(deleteId) {
        await axios.delete(`http://localhost:8000/api/member-rud/${deleteId}/`);
      }

      // Function to populate the modal form with book data
      function populateFormWithData(member) {
        updateNameInput.value = member.member;
        updateEmailInput.value = member.email;
        // Populate other form fields as needed based on the book object properties
      }

      updateMemberButton.forEach((button, index) => {
        button.addEventListener("click", () => {
          // Get the book data associated with the clicked "Update" button
          const memberToUpdate = data[index];
          // Populate the form with book data
          populateFormWithData(memberToUpdate);

          // Show the modal when the "Update" button is clicked
          modalContainer.style.display = "block";
          modal.style.display = "block";

          const closeModalButton = document.querySelector(".close-modal");
          function hideModal() {
            const modalContainer = document.querySelector(".modal-container");
            modalContainer.style.display = "none";
          }
          const updateMemberButtons = document.querySelectorAll(".update-book");
          updateMemberButtons.forEach((button) => {
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
            const updatedName = updateNameInput.value;
            const updatedEmail = updateEmailInput.value;
            // Get other form input values as needed

            try {
              // Send a PUT request to update the book data
              await axios.patch(
                `http://localhost:8000/api/member-rud/${memberToUpdate.id}/`,
                {
                  member: updatedName,
                  email: updatedEmail,

                  // Send other form input values as needed
                }
              );

              // If the update was successful, hide the modal
              modalContainer.style.display = "none";
              modal.style.display = "none";

              // Update the book list to reflect the changes
              updateMembersList();
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

updateMembersList();

const memberAddForm = document.querySelector(".member-add-form");

memberAddForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const member = document.querySelector('input[name="member"]').value;
  const email = document.querySelector('input[name="email"]').value;
  const formData = {
    member,
    email,
  };
  await axios.post("http://localhost:8000/api/member-list/", formData);
  updateMembersList();
});

// search for the member

const memberSearch = document.querySelector(".member-search");

memberSearch.addEventListener("keyup", (e) => {
  e.preventDefault();
  const searchValue = memberSearch.value;

  async function searchMember() {
    const res = await axios.get(
      `http://localhost:8000/api/member-search/?q=${searchValue}`
    );
    const data = res.data;

    const MemberListContainer = document.querySelector(".member-list");

    MemberListContainer.innerHTML = "";

    data.forEach((member) => {
      const memberContainer = document.createElement("div");
      memberContainer.classList.add("col-10");
      memberContainer.innerHTML = `
      <div class="member-container card text-white bg-primary text-center d-flex justify-content-around">
            <div class="member-details-container">
              <h3 class="member-title text-center badge rounded-pill bg-secondary">${member.member}</h3>
              <p class="member-details">ID: ${member.id}</p>
              <p class="member-details">Email: ${member.email}</p>
              <div class="member-details-container second-col-book-detail">
             
            </div>
              <button class='update-member btn btn-secondary'>Update</button>
              <button class='delete-member btn btn-danger' id=${member.id}>Delete</button>
            </div>
          </div>
        `;

      // Append the book container to the book list container
      MemberListContainer.appendChild(memberContainer);
      // ... Your existing code ...

      const updateMemberButton = document.querySelectorAll(".update-member");
      const deleteMemberButtons = document.querySelectorAll(".delete-member");
      const modalContainer = document.querySelector(".modal-container");
      const modal = document.querySelector(".modal");
      const updateForm = document.getElementById("updateForm");
      const updateNameInput = document.getElementById("updateName");
      const updateEmailInput = document.getElementById("updateEmail");

      for (let btn of deleteMemberButtons) {
        btn.addEventListener("click", () => {
          const deleteId = btn.id;
          deleteMember(deleteId);
          searchMember();
        });
      }

      async function deleteMember(deleteId) {
        await axios.delete(`http://localhost:8000/api/member-rud/${deleteId}/`);
      }

      // Function to populate the modal form with book data
      function populateFormWithData(member) {
        updateNameInput.value = member.member;
        updateEmailInput.value = member.email;
        // Populate other form fields as needed based on the book object properties
      }

      updateMemberButton.forEach((button, index) => {
        button.addEventListener("click", () => {
          // Get the book data associated with the clicked "Update" button
          const memberToUpdate = data[index];
          // Populate the form with book data
          populateFormWithData(memberToUpdate);

          // Show the modal when the "Update" button is clicked
          modalContainer.style.display = "block";
          modal.style.display = "block";

          const closeModalButton = document.querySelector(".close-modal");
          function hideModal() {
            const modalContainer = document.querySelector(".modal-container");
            modalContainer.style.display = "none";
          }
          const updateMemberButtons = document.querySelectorAll(".update-book");
          updateMemberButtons.forEach((button) => {
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
            const updatedName = updateNameInput.value;
            const updatedEmail = updateEmailInput.value;
            // Get other form input values as needed

            try {
              // Send a PUT request to update the book data
              await axios.patch(
                `http://localhost:8000/api/member-rud/${memberToUpdate.id}/`,
                {
                  member: updatedName,
                  email: updatedEmail,

                  // Send other form input values as needed
                }
              );

              // If the update was successful, hide the modal
              modalContainer.style.display = "none";
              modal.style.display = "none";

              // Update the book list to reflect the changes
              updateMembersList();
            } catch (error) {
              console.error("Error updating book:", error);
            }
          });
        });
      });
    });
  }
  searchMember();
});
