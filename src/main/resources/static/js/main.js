const URL = 'http://localhost:8080/api/v1/users';

function getData() {
    fetch(URL)
        .then(response => response.json())
        .then(users => dataTable(users))
}

function dataTable(users) {
    let res = '';
    for (let user of users) {
        res +=
            `<tr>
                <td>${user.id}</td>
                <td>${user.firstname}</td>
                <td>${user.surname}</td>
                <td>${user.email}</td>
                <td id=${'role' + user.id}>${user.roles.map(r => r.name).join(' ')}</td>
                <td>
                    <button class="btn btn-primary" type="button"
                    data-bs-toggle="modal" data-bs-target="#edit-modal"
                    onclick="editModal(${user.id})">Edit
                    </button>
                </td>
                <td>
                    <button class="btn btn-danger" type="button"
                    data-bs-toggle="modal" data-bs-target="#delete-modal"
                    onclick="deleteModal(${user.id})">Delete
                    </button>
                </td>
            </tr>`
    }
    document.getElementById('tbody-users').innerHTML = res;
}

getData();

document.getElementById('form-new-user').addEventListener('submit', (e) => {
    e.preventDefault()
    let role = document.getElementById('select')
    let rolesAddUser = []
    let rolesAddUserValue = ''
    for (let i = 0; i < role.options.length; i++) {
        if (role.options[i].selected) {
            rolesAddUser.push({id: role.options[i].value, name: 'ROLE_' + role.options[i].innerHTML})
            rolesAddUserValue += role.options[i].innerHTML
        }
    }
    fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            firstname: document.getElementById('firstname').value,
            surname: document.getElementById('surname').value,
            birthdate: document.getElementById('birthdate').value,
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            roles: rolesAddUser
        })
    })
        .then((response) => {
            if (response.ok) {
                getData()
                document.getElementById("nav-user-table-tab").click()

                document.getElementById('firstname').value = ''
                document.getElementById('surname').value = ''
                document.getElementById('birthdate').value = ''
                document.getElementById('username').value = ''
                document.getElementById('email').value = ''
                document.getElementById('password').value = ''
                role.selectedIndex = -1
            }
        })
})

function closeModal() {
    document.querySelectorAll(".btn-close").forEach((btn) => btn.click())
}

function editModal(id) {
    fetch(URL + '/' + id, {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
        .then(res => res.json()
            .then(u => {
                document.getElementById('edit-id').value = u.id;
                document.getElementById('edit-firstname').value = u.firstname;
                document.getElementById('edit-surname').value = u.surname;
                document.getElementById('edit-birthdate').value = u.birthdate;
                document.getElementById('edit-email').value = u.email;
                document.getElementById('edit-username').value = u.username;
                document.getElementById('edit-password').value = u.password;
                console.log(u.roles.map(r => r.id));
                // TODO select roles
            })
        )

}

async function editUser() {
    const form_ed = document.getElementById('form-edit');
    let idValue = document.getElementById("edit-id").value;
    let firstnameValue = document.getElementById("edit-firstname").value;
    let surnameValue = document.getElementById("edit-surname").value;
    let birthdateValue = document.getElementById("edit-birthdate").value;
    let emailValue = document.getElementById("edit-email").value;
    let usernameValue = document.getElementById('edit-username').value;
    let passwordValue = document.getElementById("edit-password").value;
    let listOfRole = [];
    for (let i = 0; i < form_ed.roles.options.length; i++) {
        if (form_ed.roles.options[i].selected) {
            let tmp = {};
            tmp["id"] = form_ed.roles.options[i].value
            listOfRole.push(tmp);
        }
    }
    console.log(listOfRole);
    let user = {
        id: idValue,
        firstname: firstnameValue,
        surname: surnameValue,
        birthdate: birthdateValue,
        email: emailValue,
        username: usernameValue,
        password: passwordValue,
        roles: listOfRole
    }
    await fetch(URL + '/' + user.id, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(user)
    });
    closeModal();
    getData();
}

function deleteModal(id) {
    fetch(URL + '/' + id, {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
        .then(res => res.json())
        .then(user => {
            document.getElementById('delete-id').value = user.id;
            document.getElementById('delete-firstname').value = user.firstname;
            document.getElementById('delete-surname').value = user.surname;
            document.getElementById('delete-birthdate').value = user.birthdate;
            document.getElementById('delete-username').value = user.username;
            document.getElementById('delete-password').value = user.password;
            document.getElementById('delete-email').value = user.email;
        });
}

async function deleteUser() {
    const id = document.getElementById("delete-id").value
    let url = URL + "/" + id;
    let options = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        }
    }
    fetch(url, options)
        .then(() => {
            closeModal()
            getData()
        })
}