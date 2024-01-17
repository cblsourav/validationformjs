let bttn = document.querySelector('#btn')

        bttn.addEventListener("click", function () {
            let name = document.querySelector('#name').value.trim();
            if (name === "") {
                swal("Error", "Please enter the name", "error")
            } else {
                swal("Success", "congratulation", "success")
            }
        })
