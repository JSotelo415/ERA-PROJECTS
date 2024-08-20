const todoValue = document.getElementById("todoText");
const todoAlert = document.getElementById("Alert");
const listItems = document.getElementById("list-items");
//setting my items in a variable be able to recieve them and index them as well.
let todo = JSON.parse(localStorage.getItem("todo-list")) || [];
console.log("whats coming in", todo);
//i want to render my list whenever there is something in localstorage
if (todo && todo.length > 0) {
  renderToDoItem();
}
//
function createToDoItem() {
  console.log("todoValue", todoValue.value);
  //step1.verify its not empty,
  if (todoValue.value !== "") {//lets take the happy route first , if input isnt empty , push the input into the todo local storage
    todoAlert.innerHTML = "";
    todo.push(todoValue.value);
    localStorage.setItem("todo-list", JSON.stringify(todo)); //setting my inouts into the local memory
    console.log("todo json", todo);
    renderToDoItem();
  } else {
    todoAlert.innerHTML = "Please enter what you need to do :)";
    console.log(todoAlert.innerHTML);
    //step 2 is setting a default vlaue so when is the value is true we can activate the corect message
  }
  
}
function renderToDoItem() {
  let html = "";
  todo.forEach((item, index) => {
    console.log("item in todo array", item);
    html += `
      <div class="todo-item" >
        <li class="todo-text" ondblClick="CompleteToDoItem(this)">
          ${item}
        </li>
        <div class="todo-controls">
          <img class="edit" onclick="updateToDoItems(${index},this)" src="/png/edit.png" />
          <img class="delete" onclick="deleteToDoItems(${index})" src="/png/delete.png" />
        </div>
      </div>`;
  });
  listItems.innerHTML = html;
}

function updateToDoItems(index, el) {
  //to update items i need to know what item i am targetting by using this and el
  console.log("el", el.parentElement.previousElementSibling);
  console.log(todo);
  todoAlert.innerHTML = "Please edit what you need to do :)";
  console.log(todoAlert.innerHTML);
  const liInput = el.parentElement.previousElementSibling;
  const currentText = liInput.textContent;
  console.log("curr", currentText);

  const inputField = document.createElement("input");

  inputField.type = "text";
  inputField.value = currentText.trim();
  inputField.className = "edit-input";
  inputField.placeholder = "add or edit item";
  liInput.innerHTML = "";
  liInput.appendChild(inputField);

  inputField.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      saveToDoItem(index, inputField.value);
    }
  });
}

function saveToDoItem(index, newValue) {
  console.log("in savetodo", index, newValue);
 
  todo[index] = newValue;
  saveToLocalStorage();
  renderToDoItem();
}

function saveToLocalStorage() {
  localStorage.setItem("todo-list", JSON.stringify(todo));
}

function deleteToDoItems(index) {
  console.log(index);
  console.log(todo);
  todo.splice(index, 1); //spice works by start and end. at start splice will cut up to the start but won cut the start but will cut the end so if you cut at a start and the nice point it will the
  localStorage.setItem("todo-list", JSON.stringify(todo));
  renderToDoItem();
}

function CompleteToDoItem(e) {
  if (e.style.textDecoration === "line-through") {
    e.style.textDecoration = "none";
  } else {
    e.style.textDecoration = "line-through";
  } //when this becomes turue later on add to delete after 24 hours
}


