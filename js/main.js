const API = "http://localhost:8000/sell";
let inpName = document.querySelector("#inpName");
let inpAuthor = document.querySelector("#inpAuthor");
let inpImg = document.querySelector("#inpImg");
let inpPrice = document.querySelector("#inpPrice");
let btnAdd = document.querySelector("#btnAdd");
let btnOpenForm = document.querySelector("#collapseThree");
let sectionBooks = document.querySelector(".container");
let countPage = 1;
let currentPage = 1;
let prevBtn = document.querySelector("#prevBtn");
let nextBtn = document.querySelector("#nextBtn");
btnAdd.addEventListener("click", () => {
  if (!inpName.value.trim() || !inpImg.value.trim() || !inpPrice.value.trim()) {
    alert("Заполните все поля!");
    return;
  }
  let newBook = {
    bookName: inpName.value,
    bookImg: inpImg.value,
    bookPrice: inpPrice.value,
  };
  createBook(newBook);
  readBooks();
});
// ! ------------------ Create ---------------------
function createBook(book) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(book),
  });
  inpName.value = "";
  inpImg.value = "";
  inpPrice.value = "";
  btnOpenForm.classList.toggle("show");
}
// ! --------------- READ -------------------
async function readBooks(test = currentPage) {
  const res = await fetch(`${API}?&_page=${test}&_limit=4`);
  const data = await res.json();
  sectionBooks.innerHTML = "";
  data.forEach((elem) => {
    sectionBooks.innerHTML += `   <div class="card m-4 cardBook" style="width: 350px">
    <img style="height: 350px" src="${elem.bookImg}" alt="" />
    <div class="card-body">
      <h5 class="card-title">${elem.bookName}</h5>
      <span>${elem.bookPrice}</span>
      <button id=${elem.id} class="btn btn-outline-danger btnDelete">Удалить</button>
      <button data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-outline-warning btnEdit" id="${elem.id}">Редактировать</button>
    </div>
  </div>`;
  });
}
readBooks();
// ! ------------------ DELETE -----------------
document.addEventListener("click", async (e) => {
  let del_id = e.target.id;
  let del_classList = [...e.target.classList];
  if (del_classList.includes("btnDelete")) {
    await fetch(`${API}/${del_id}`, {
      method: "DELETE",
    });
    readBooks();
  }
});
// ! ---------------- EDIT --------------
let editInpName = document.querySelector("#editInpName");
let editInpAuthor = document.querySelector("#editInpAuthor");
let editInpImg = document.querySelector("#editInpImg");
let editInpPrice = document.querySelector("#editInpPrice");
let editInpSave = document.querySelector("#editInpSave");
let editBtnSave = document.querySelector("#editBtnSave");
document.addEventListener("click", (e) => {
  let edit_class = [...e.target.classList];
  if (edit_class.includes("btnEdit")) {
    let id = e.target.id;
    console.log(id);
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editInpName.value = data.bookName;
        editInpImg.value = data.bookImg;
        editInpPrice.value = data.bookPrice;
        editBtnSave.setAttribute("id", data.id);
      });
    editBtnSave.addEventListener("click", () => {
      let editedBook = {
        bookName: editInpName.value,
        bookImg: editInpImg.value,
        bookPrice: editInpPrice.value,
      };
      editBook(editedBook, editBtnSave.id);
    });
  }
});
async function editBook(editBook, id) {
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editBook),
  });
}
// ! ------------------ PAGINATION -------------------
let test = currentPage;
function pageFunc() {
  fetch(API)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      countPage = Math.ceil(data.length / 3);
    });
}
pageFunc();
prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  test--;
  readBooks(test);
});
nextBtn.addEventListener("click", () => {
  if (currentPage >= countPage) return;
  currentPage++;
  test++;
  readBooks(test);
});
