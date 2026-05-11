let selectedRow = null;

// ADD
function addData() {

  let code = document.getElementById("code").value;
  let description = document.getElementById("description").value;

  let gender = "";


  if (code == "1") {
    gender = "Male - ذكر";
  }
  else if (code == "2") {
    gender = "Female - أنثى";
  }
  else {
    alert("Invalid code! Use 1 for Male or 2 for Female");
    return;
  }

  if (code === "" || description === "") {
    alert("Please fill all fields");
    return;
  }

  let table = document.getElementById("dataTable").getElementsByTagName("tbody")[0];

  let newRow = table.insertRow();

  newRow.insertCell(0).innerHTML = code;
  newRow.insertCell(1).innerHTML = gender;
  newRow.insertCell(2).innerHTML = description;

  // عند الضغط على الصف
  newRow.onclick = function () {
    selectedRow = this;

    document.getElementById("code").value = this.cells[0].innerHTML;
    document.getElementById("description").value = this.cells[2].innerHTML;
  };

  clearFields();
}

// EDIT
function editData() {

  if (selectedRow == null) {
    alert("Select row first");
    return;
  }

  let code = document.getElementById("code").value;
  let description = document.getElementById("description").value;

  let gender = "";

  if (code == "1") {
    gender = "Male - ذكر";
  }
  else if (code == "2") {
    gender = "Female - أنثى";
  }
  else {
    alert("Invalid code! Use 1 or 2");
    return;
  }

  selectedRow.cells[0].innerHTML = code;
  selectedRow.cells[1].innerHTML = gender;
  selectedRow.cells[2].innerHTML = description;

  clearFields();
}

// DELETE
function deleteData() {

  if (selectedRow == null) {
    alert("Select row first");
    return;
  }

  selectedRow.remove();
  selectedRow = null;

  clearFields();
}

// CANCEL
function cancelData() {
  clearFields();
}

// CLEAR FIELDS
function clearFields() {
  document.getElementById("code").value = "";
  document.getElementById("description").value = "";
  selectedRow = null;
}