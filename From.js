

        let student = [];   // <---------- CREATE STUDENT ARRAY TO STORE MULTIPLE ARRAYS --------<<

          // -------------- FORM VALIDATION CODE ----------------//

        function validateForm() 
        {
            let validation = true;

              // -------------- GET ALL FROM VARIABLES  ----------------//

            let userName = document.getElementById('userName').value;
            let userContact = document.getElementById('userContact').value;
            let userAddress = document.getElementById('userAddress').value;
            let userPassword = document.getElementById('Password').value;
            let confirmPassword = document.getElementById('ConfirmPassword').value;
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

              // -------------- CONDITIONS ----------------//

            if (!userName) 
            {
                document.getElementById('nameError').innerHTML = 'Please fill the Name';
                validation = false;
            } else 
            {
                let alphaPattern = /^[a-zA-Z\s]+$/;
                let checkName = alphaPattern.test(userName);
                if (!checkName) 
                {
                    document.getElementById('nameError').innerHTML = 'Please fill the Name in Alphabets ';
                    validation = false;
                }
            }

            if (!userContact) 
            {
                document.getElementById('contactError').innerHTML = 'Please fill the Contact';
                validation = false;
            } else 
            {
                let numberPattern = /^[0-9]+$/;
                let checkContact = numberPattern.test(userContact);
                if (!checkContact) 
                {
                    document.getElementById('contactError').innerHTML = 'Only Digits are allowed ';
                    validation = false;
                } else if (userContact.length !== 10) 
                {
                    document.getElementById('contactError').innerHTML = 'Please enter a 10-digit number.';
                    validation = false;
                }
            }
            if (!userAddress) 
            {
                    document.getElementById('addressError').innerHTML = 'Please fill the Address';
                    validation = false;
            } else 
            {
                    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    let checkEmail = emailPattern.test(userAddress);

                if (!checkEmail) 
                {
                    document.getElementById('addressError').innerHTML = 'Please enter a valid Email Address';
                    validation = false;
                }
            }
            if (!userPassword) 
            {
                document.getElementById('passwordError').innerHTML = 'Please fill the Password';
                validation = false;
            }else if (userPassword.length < 8 || userPassword.length > 15) 
            {
                document.getElementById('passwordError').innerHTML = 'Password should be between 8 and 15 characters';
                validation = false;
            }    
            
            if (!confirmPassword) 
            {
                document.getElementById('confirmError').innerHTML = 'Please fill the Confirm Password';
                validation = false;
            } else if (userPassword !== confirmPassword) 
            {
                alert('Passwords do not match');
                validation = false;
            }
            if (!gender) 
            {
                document.getElementById('genderError').innerHTML = 'Select the gender';
                validation = false;
            }
            if (!checkedValues.length) 
            {
                document.getElementById('hobbiesError').innerHTML = 'Select at least one hobby';
                validation = false;
            }

              // -------------- IF ALL INPUT FIELD ARE VALID THEN IT WILL RUN ----------------//

            if (validation === true) 
            {
                alert('Form submitted successfully!');

                location.reload()
                let data = [];                         // <---------- ARRAY DATA CREATE FOR STORING INDIVIDUAL RECORD --------<<
                data[0] = userName;
                data[1] = userContact;
                data[2] = userAddress;
                data[3] = gender ? gender.value : '';
                data[4] = checkedValues;

                student.push(data.slice());  // <---------- IT WILL ADD DATA IN TO STUDENT ARRAY AND EXTRACT VALUE FROPM IT  --------<<
                data = [];

                localStorage.setItem('student', JSON.stringify(student));

                getStudentData();
            } 
            else 
            {
                return false;
            }
        }

        function getStudentData() 
        {
            if (storedStudent) 
            {
                student = JSON.parse(storedStudent);
            }
        }

//         THIS FUNCTION UPDATE THE TABLE
        function updateTable() 
        {
            let storedStudent = localStorage.getItem('student');
            if (storedStudent) 
            {
                // JSON TO OBJECT
                student = JSON.parse(storedStudent);

                let table = document.getElementById('studentTable');
                let tbody = table.querySelector('tbody');
                tbody.innerHTML = '';

                for (let i = 0; i < student.length; i++) 
                {
                    let data = student[i];
                    let dataRow = tbody.insertRow();

                    for (let j = 0; j < data.length; j++) 
                    {
                        let cell = dataRow.insertCell();
                        cell.textContent = data[j];
                    }

                        //------------<< ADD DELETE CELL -----------------<<

                        let buttonCell = dataRow.insertCell();
                    buttonCell.appendChild(createDeleteButton(i));

                    //------------<< ADD CHECKBOX CELL -----------------<<
                    let checkboxCell = dataRow.insertCell();
                    let checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkboxCell.appendChild(checkbox);
                }
            }
        }

        function createDeleteButton(rowIndex) 
        {
            let button = document.createElement('button');
            button.textContent = 'Delete';
            button.onclick = function () 
            {
                // Remove the corresponding row when the delete button is clicked
                student.splice(rowIndex, 1);
                localStorage.setItem('student', JSON.stringify(student));
                updateTable();
            };
            return button;
        }

        function eraseAll() 
        {
                let table = document.getElementById('studentTable');
                let checkboxes = table.querySelectorAll('tbody input[type="checkbox"]:checked');

                if (checkboxes.length === 0) 
                {
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
            updateTable();
