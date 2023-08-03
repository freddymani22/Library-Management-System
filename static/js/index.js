const table = document.querySelector("#table");
const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;

axios.defaults.headers.common["X-CSRFToken"] = csrfToken;

async function updateBookList() {
  const res = await axios.get(`http://localhost:8000/api/book-list/`);
  const data = await res.data;
  console.log(data);
  if (data.length === 0) {
    document
      .querySelector(".chart-data")
      .style.setProperty("display", "none", "important");
  } else {
    document
      .querySelector(".chart-data")
      .style.setProperty("display", "flex", "important");
  }
  const tableBody = document.querySelector(".table-body");
  tableBody.innerHTML = "";

  for (let book of data) {
    let tdIdElement = document.createElement("td");
    tdIdElement.textContent = book.id;
    let tdNameElement = document.createElement("td");
    tdNameElement.textContent = book.title;

    let tdAvailabilityElement = document.createElement("td");
    if (book.availability_status) {
      tdAvailabilityElement.textContent = "✅";
    } else {
      tdAvailabilityElement.textContent = "🚫";
    }
    let tdBorrowedByElement = document.createElement("td");
    if (book.availability_status === false) {
      const selectElement = document.createElement("select");
      selectElement.classList.add("form-control");
      selectElement.disabled = true;

      const defaultOption = document.createElement("option");
      defaultOption.textContent = book.borrowed_by.borrowed_member.member;
      defaultOption.disabled = true;
      defaultOption.selected = true;
      selectElement.appendChild(defaultOption);

      const borrowedMember = book.borrowed_by.borrowed_member.member;

      const option = document.createElement("option");
      option.textContent = borrowedMember;
      selectElement.appendChild(option);

      tdBorrowedByElement.appendChild(selectElement);
    } else if (book.availability_status === true) {
      const memberList = await axios.get(
        "http://localhost:8000/api/member-list/"
      );
      const memberListData = memberList.data;

      const selectElement = document.createElement("select");
      selectElement.classList.add("form-control");
      const defaultOption = document.createElement("option");
      defaultOption.textContent = "Select a member"; // Display a default option as the placeholder
      defaultOption.disabled = true;
      defaultOption.selected = true;
      selectElement.appendChild(defaultOption);

      memberListData.forEach((member) => {
        const option = document.createElement("option");
        option.value = member.id; // Assuming you want to use the member's ID as the value
        option.textContent = member.member; // Display the member name as the option text
        selectElement.appendChild(option);
      });

      selectElement.addEventListener("change", async (event) => {
        event.preventDefault();
        const selectedMemberId = event.target.value;
        const bookID = book.id;
        const memberId = selectedMemberId;
        const data = {
          book: bookID,
          member: memberId,
          returned: false,
        };
        const res = await axios.post(
          "http://localhost:8000/api/book-status/",
          data
        );
        // selectElement.disabled = true;
        // tdAvailabilityElement.textContent = false;
        // const ids = book.borrowed_by.id;
        // const returnChecker = `#checkbox-${ids}`;
        // const returnCheck = document.querySelector(returnChecker);
        // returnCheck.disabled = false;
        // returnCheck.checked = false;
        // returnCheck.addEventListener("click", () => {});
        updateBookList();
      });

      tdBorrowedByElement.appendChild(selectElement);
    }
    let tdReturnElement = document.createElement("td");
    const formCheckDiv = document.createElement("div");
    formCheckDiv.classList.add("form-check", "form-switch");
    const checkbox = document.createElement("input");
    checkbox.classList.add("return-check", "form-check-input");
    checkbox.type = "checkbox";
    if (book.availability_status === false) {
      checkbox.checked = book.borrowed_by.returned;
      tdReturnElement.appendChild(checkbox);
      formCheckDiv.appendChild(checkbox);
      tdReturnElement.appendChild(formCheckDiv);
      checkbox.addEventListener("change", async (e) => {
        try {
          e.preventDefault();
          const delBtnId = book.borrowed_by.id;
          console.log(checkbox.id);
          tdAvailabilityElement.textContent = true;
          await axios.patch(
            `http://localhost:8000/api/book-status/${book.borrowed_by.id}/`,
            {
              returned: true,
            }
          );
          // Update the checkbox state after the successful response
          checkbox.disabled = true;

          // Disable the checkbox after returning the book
        } catch (error) {
          console.error("Error updating book status:", error);
        }

        updateBookList();
      });
    } else {
      checkbox.disabled = true;
      checkbox.checked = true;
      formCheckDiv.appendChild(checkbox);
      tdReturnElement.appendChild(formCheckDiv);
    }

    let trElement = document.createElement("tr");
    trElement.appendChild(tdIdElement);
    trElement.appendChild(tdNameElement);
    trElement.appendChild(tdAvailabilityElement);
    trElement.appendChild(tdBorrowedByElement);
    trElement.appendChild(tdReturnElement);
    tableBody.appendChild(trElement);
  }
}

updateBookList();
let timeoutId;

const bookSearchForm = document.querySelector(".book-search-form");
const bookSearch = document.querySelector(".book-search");
function debounceSearchBook(searchValue) {
  clearTimeout(timeoutId);
  // Only trigger the search if searchValue is greater than 3 characters
  if (searchValue.length > 5) {
    timeoutId = setTimeout(() => {
      searchBook(searchValue);
    }, 5000);
  }
}

bookSearchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchValue = bookSearch.value;
  console.log(searchValue);
  debounceSearchBook(searchValue);
  async function searchBook() {
    const res = await axios.get(
      `http://localhost:8000/api/book-search/?q=${searchValue}`
    );
    const data = res.data;

    document
      .querySelector(".chart-data")
      .style.setProperty("display", "flex", "important");
    const tableBody = document.querySelector(".table-body");
    tableBody.innerHTML = "";

    for (let book of data) {
      let tdIdElement = document.createElement("td");
      tdIdElement.textContent = book.id;
      let tdNameElement = document.createElement("td");
      tdNameElement.textContent = book.title;

      let tdAvailabilityElement = document.createElement("td");
      if (book.availability_status) {
        tdAvailabilityElement.textContent = "✅";
      } else {
        tdAvailabilityElement.textContent = "🚫";
      }
      let tdBorrowedByElement = document.createElement("td");
      if (book.availability_status === false) {
        const selectElement = document.createElement("select");
        selectElement.classList.add("form-control");
        selectElement.disabled = true;

        const defaultOption = document.createElement("option");
        defaultOption.textContent = book.borrowed_by.borrowed_member.member;
        defaultOption.disabled = true;
        defaultOption.selected = true;
        selectElement.appendChild(defaultOption);

        const borrowedMember = book.borrowed_by.borrowed_member.member;

        const option = document.createElement("option");
        option.textContent = borrowedMember;
        selectElement.appendChild(option);

        tdBorrowedByElement.appendChild(selectElement);
      } else if (book.availability_status === true) {
        const memberList = await axios.get(
          "http://localhost:8000/api/member-list/"
        );
        const memberListData = memberList.data;

        const selectElement = document.createElement("select");
        selectElement.classList.add("form-control");
        const defaultOption = document.createElement("option");
        defaultOption.textContent = "Select a member"; // Display a default option as the placeholder
        defaultOption.disabled = true;
        defaultOption.selected = true;
        selectElement.appendChild(defaultOption);

        memberListData.forEach((member) => {
          const option = document.createElement("option");
          option.value = member.id; // Assuming you want to use the member's ID as the value
          option.textContent = member.member; // Display the member name as the option text
          selectElement.appendChild(option);
        });

        selectElement.addEventListener("change", async (event) => {
          event.preventDefault();
          const selectedMemberId = event.target.value;
          const bookID = book.id;
          const memberId = selectedMemberId;
          const data = {
            book: bookID,
            member: memberId,
            returned: false,
          };
          const res = await axios.post(
            "http://localhost:8000/api/book-status/",
            data
          );
          searchBook();
          // selectElement.disabled = true;
          // tdAvailabilityElement.textContent = false;
          // const ids = book.borrowed_by.id;
          // const returnChecker = `#checkbox-${ids}`;
          // const returnCheck = document.querySelector(returnChecker);
          // returnCheck.disabled = false;
          // returnCheck.checked = false;
          // returnCheck.addEventListener("click", () => {});
          // searchBook();
        });

        tdBorrowedByElement.appendChild(selectElement);
      }
      let tdReturnElement = document.createElement("td");
      const formCheckDiv = document.createElement("div");
      formCheckDiv.classList.add("form-check", "form-switch");
      const checkbox = document.createElement("input");
      checkbox.classList.add("return-check", "form-check-input");
      checkbox.type = "checkbox";
      if (book.availability_status === false) {
        checkbox.checked = book.borrowed_by.returned;
        tdReturnElement.appendChild(checkbox);
        formCheckDiv.appendChild(checkbox);
        tdReturnElement.appendChild(formCheckDiv);
        checkbox.addEventListener("change", async (e) => {
          try {
            e.preventDefault();
            const delBtnId = book.borrowed_by.id;
            console.log(checkbox.id);
            tdAvailabilityElement.textContent = true;
            await axios.patch(
              `http://localhost:8000/api/book-status/${book.borrowed_by.id}/`,
              {
                returned: true,
              }
            );
            // Update the checkbox state after the successful response
            checkbox.disabled = true;
            searchBook();
            // Disable the checkbox after returning the book
          } catch (error) {
            console.error("Error updating book status:", error);
          }

          // searchBook();
        });
      } else {
        checkbox.disabled = true;
        checkbox.checked = true;
        formCheckDiv.appendChild(checkbox);
        tdReturnElement.appendChild(formCheckDiv);
      }

      let trElement = document.createElement("tr");
      trElement.appendChild(tdIdElement);
      trElement.appendChild(tdNameElement);
      trElement.appendChild(tdAvailabilityElement);
      trElement.appendChild(tdBorrowedByElement);
      trElement.appendChild(tdReturnElement);
      tableBody.appendChild(trElement);
    }
  }
  searchBook();
});
