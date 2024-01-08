let student = [];   // <---------- CREATE STUDENT ARRAY TO STORE MULTIPLE ARRAYS --------<<

let editMode = false;
let rowIndex;
document.getElementById('submitButton').innerHTML = 'Submit';

// -------------- FORM VALIDATION CODE ----------------//

function validateForm() {
    let validation = true;

    // -------------- GET ALL FROM VARIABLES  ----------------//

    let userName = document.getElementById('userName').value.trim();
    let userContact = document.getElementById('userContact').value.trim();
    let userAddress = document.getElementById('userAddress').value.trim();
    let userPassword = document.getElementById('Password').value.trim();
    let confirmPassword = document.getElementById('ConfirmPassword').value.trim();
    let gender = document.querySelector('input[name="gender"]:checked');
    let hobbies = document.querySelectorAll('input[name="hobbies[]"]:checked');

    // -------------- GET ALL SELECTED HOBBIES VALUES ----------------//

    let checkedValues = Array.from(hobbies).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);

    // -------------- ERASE ALL PREVIIOS ERROR MSG  ----------------//

    document.getElementById('nameError').innerHTML = '';
    document.getElementById('contactError').innerHTML = '';
    document.getElementById('addressError').innerHTML = '';
    document.getElementById('passwordError').innerHTML = '';
    document.getElementById('confirmError').innerHTML = '';
    document.getElementById('genderError').innerHTML = '';
    document.getElementById('hobbiesError').innerHTML = '';

    function isContactExist(contact) {
        for (let i = 0; i < student.length; i++) {
            if (student[i].userContact === contact) {
                return true;
            }
        }
        return false;
    }

    function isEmailExist(email) {
        for (let i = 0; i < student.length; i++) {
            if (student[i].userAddress === email) {
                return true;
            }
        }
        return false;
    }

    // -------------- CONDITIONS ----------------//

    if (!userName) {
        document.getElementById('nameError').innerHTML = 'Please fill the Name';
        validation = false;
    } else {
        let alphaPattern = /^[a-zA-Z\s]+$/;
        let checkName = alphaPattern.test(userName);
        if (!checkName) {
            document.getElementById('nameError').innerHTML = 'Please fill the Name in Alphabets ';
            validation = false;
        } else if (userName.length < 3) {
            document.getElementById('nameError').innerHTML = 'Please fill the minimum 3 chracter ';
            validation = false;
        }
    }
    if (!userContact) {
        document.getElementById('contactError').innerHTML = 'Please fill the Contact';
        validation = false;
    } else {
        let numberPattern = /^[0-9]+$/;
        let checkContact = numberPattern.test(userContact);
        if (!checkContact) {
            document.getElementById('contactError').innerHTML = 'Only Digits are allowed ';
            validation = false;
        } else if (userContact.length !== 10) {
            document.getElementById('contactError').innerHTML = 'Please enter a 10-digit number.';
            validation = false;
        }
        else {
            let dbContact = (isContactExist(userContact))
            if (dbContact) {
                document.getElementById('contactError').innerHTML = 'This Contact Number is Already Exist.';
                validation = false;
            }
        }
    }
    if (!userAddress) {
        document.getElementById('addressError').innerHTML = 'Please fill the Email Address';
        validation = false;
    } else {
        let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let checkEmail = emailPattern.test(userAddress);
        if (!checkEmail) {
            document.getElementById('addressError').innerHTML = 'Please enter a valid Email Address';
            validation = false;
        }
        else {
            let dbEmail = isEmailExist(userAddress)
            if (dbEmail) {
                document.getElementById('addressError').innerHTML = 'This Email Address Already Taken';
                validation = false;
            }
        }
    }
    if (!userPassword) {
        document.getElementById('passwordError').innerHTML = 'Please fill the Password';
        validation = false;
    } else if (userPassword.length < 8 || userPassword.length > 15) {
        document.getElementById('passwordError').innerHTML = 'Password should be between 8 and 15 characters';
        validation = false;
    }

    if (!confirmPassword) {
        document.getElementById('confirmError').innerHTML = 'Please fill the Confirm Password';
        validation = false;
    } else if (userPassword !== confirmPassword) {
        alert('Passwords do not match');
        validation = false;
    }

    if (!gender) {
        document.getElementById('genderError').innerHTML = 'Select the gender';
        validation = false;
    }
    if (!checkedValues.length) {
        document.getElementById('hobbiesError').innerHTML = 'Select at least one hobby';
        validation = false;
    }
    // -------------- IF ALL INPUT FIELD ARE VALID THEN IT WILL RUN ----------------//

    if (validation === true) {
        alert('Form submitted successfully!');
        location.reload()

        let data = []; // <---------- ARRAY DATA CREATE FOR STORING INDIVIDUAL RECORD --------<<
        data[0] = userName;
        data[1] = userContact;
        data[2] = userAddress;
        data[3] = gender ? gender.value : '';
        data[4] = checkedValues;

        if (editMode) {
            // Update the existing row with edited data
            let rowToUpdate = document.querySelector('tbody').childNodes[rowIndex];
            for (let j = 0; j < data.length; j++) {
                rowToUpdate.cells[j].textContent = data[j];
            }

            // Update the corresponding data in the array
            student[rowIndex] = data.slice();
        } else {
            // Add a new row for a new entry
            student.push(data.slice());
        }

        // Clear the form fields
        document.getElementById('userName').value = '';
        document.getElementById('userContact').value = '';
        document.getElementById('userAddress').value = '';
        document.getElementById('Password').value = '';
        document.getElementById('ConfirmPassword').value = '';

        // Uncheck gender and hobbies
        let genderRadios = document.querySelectorAll('input[name="gender"]');
        genderRadios.forEach(radio => (radio.checked = false));

        let hobbyCheckboxes = document.querySelectorAll('input[name="hobbies[]"]');
        hobbyCheckboxes.forEach(checkbox => (checkbox.checked = false));

        localStorage.setItem('student', JSON.stringify(student));
        getStudentData();
        updateTable();
        editMode = false; // Reset edit mode
    } else {
        return false;
    }
}

function getStudentData() {
    if (storedStudent) {
        student = JSON.parse(storedStudent);
    }
}

//         THIS FUNCTION UPDATE THE TABLE
function updateTable() {
    let storedStudent = localStorage.getItem('student');
    if (storedStudent) {
        student = JSON.parse(storedStudent);

        let table = document.getElementById('studentTable');
        let tbody = table.querySelector('tbody');
        tbody.innerHTML = '';

        for (let i = 0; i < student.length; i++) {
            let data = student[i];
            let dataRow = tbody.insertRow();

            for (let j = 0; j < data.length; j++) {
                let cell = dataRow.insertCell();
                cell.textContent = data[j];
            }

            let buttonCell = dataRow.insertCell();
            buttonCell.appendChild(createDeleteButton(i));

            let checkboxCell = dataRow.insertCell();
            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkboxCell.appendChild(checkbox);

            let editCell = dataRow.insertCell();
            let editButton = createEditButton(i);
            editCell.appendChild(editButton);
        }
    }
}

function createEditButton(rowIndex) {
    let button = document.createElement('button');
    button.textContent = 'Edit';
    button.onclick = function () {
        editRow(rowIndex);
        //----------------- remove previous error messag -------------//
        document.getElementById('nameError').innerHTML = '';
        document.getElementById('contactError').innerHTML = '';
        document.getElementById('addressError').innerHTML = '';
        document.getElementById('passwordError').innerHTML = '';
        document.getElementById('confirmError').innerHTML = '';
        document.getElementById('genderError').innerHTML = '';
        document.getElementById('hobbiesError').innerHTML = '';

        document.getElementById('submitButton').innerHTML = 'Update';
    };
    return button;
}


function editRow(index) {
    editMode = true;
    rowIndex = index;

    let data = student[index];
    document.getElementById('userName').value = data[0];
    document.getElementById('userContact').value = data[1];
    document.getElementById('userAddress').value = data[2];
    // document.getElementById('Password').value = data[3];
    // document.getElementById('ConfirmPassword').value = data[4];

    // Set gender
    let genderRadios = document.querySelectorAll('input[name="gender"]');
    for (let i = 0; i < genderRadios.length; i++) {
        genderRadios[i].checked = false;
        if (genderRadios[i].value === data[3]) {
            genderRadios[i].checked = true;
        }
    }

    // Set hobbies
    let hobbyCheckboxes = document.querySelectorAll('input[name="hobbies[]"]');
    for (let i = 0; i < hobbyCheckboxes.length; i++) {
        if (data[4].includes(hobbyCheckboxes[i].value)) {
            hobbyCheckboxes[i].checked = true;
        } else {
            hobbyCheckboxes[i].checked = false;
        }
    }
}

function createDeleteButton(rowIndex) {
    let button = document.createElement('button');
    button.textContent = 'Delete';
    button.onclick = function () {
        // Remove the corresponding row when the delete button is clicked
        student.splice(rowIndex, 1);
        localStorage.setItem('student', JSON.stringify(student));
        updateTable();
    };
    return button;
}

function deleteAll() {
    localStorage.clear();
    location.reload();
}

function eraseAll() {
    let table = document.getElementById('studentTable');
    let checkboxes = table.querySelectorAll('tbody input[type="checkbox"]:checked');

    if (checkboxes.length === 0) {
        alert('Select at least one row to delete.');
        return;
    }

    let indicesToDelete = Array.from(checkboxes).map(checkbox => checkbox.parentNode.parentNode.rowIndex - 1);

    //<<------  Remove the selected records from the array
    indicesToDelete.sort((a, b) => b - a); // Sort in reverse order to avoid index issues
    indicesToDelete.forEach(index => student.splice(index, 1));

    // Update localStorage
    localStorage.setItem('student', JSON.stringify(student));

    //<<--------------- Update the table --------------------<<
    updateTable();
}
updateTable()