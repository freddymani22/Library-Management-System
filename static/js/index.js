const table = document.querySelector("#table");
const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;

axios.defaults.headers.common["X-CSRFToken"] = csrfToken;

async function updateBookList() {
  const res = await axios.get("http://localhost:8000/api/book-list/");
  const data = await res.data;
  console.log(data);
  if (data.length === 0) {
    console.log("working");
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
    let tdNameElement = document.createElement("td");
    tdNameElement.textContent = book.title;

    let tdAvailabilityElement = document.createElement("td");
    tdAvailabilityElement.textContent = book.availability_status;

    let tdBorrowedByElement = document.createElement("td");
    if (book.availability_status === false) {
      tdBorrowedByElement.textContent = book.borrowed_by.borrowed_member.member;
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
        const booktitle = book.id;
        const memberId = selectedMemberId;
        const data = {
          book: booktitle,
          member: memberId,
          returned: false,
        };
        const res = await axios.post(
          "http://localhost:8000/api/book-status/",
          data
        );
        updateBookList();
      });

      tdBorrowedByElement.appendChild(selectElement);
    }
    let tdReturnElement = document.createElement("td");
    if (book.availability_status === false) {
      const checkbox = document.createElement("input");
      checkbox.classList.add("return-check");
      checkbox.id = book.borrowed_by.id;
      checkbox.type = "checkbox";
      checkbox.checked = book.borrowed_by.returned;
      tdReturnElement.appendChild(checkbox);
      checkbox.addEventListener("change", async (e) => {
        try {
          e.preventDefault();
          const delBtnId = checkbox.id;
          console.log(checkbox.id);
          await axios.patch(
            `http://localhost:8000/api/book-status/${book.borrowed_by.id}/`,
            {
              returned: true,
            }
          );
          // Update the checkbox state after the successful response
          checkbox.disabled = true; // Disable the checkbox after returning the book
        } catch (error) {
          console.error("Error updating book status:", error);
        }
        updateBookList();
      });
    } else {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.disabled = true;
      checkbox.checked = tdReturnElement.appendChild(checkbox);
    }

    let trElement = document.createElement("tr");
    trElement.appendChild(tdNameElement);
    trElement.appendChild(tdAvailabilityElement);
    trElement.appendChild(tdBorrowedByElement);
    trElement.appendChild(tdReturnElement);
    tableBody.appendChild(trElement);
  }
}

updateBookList();