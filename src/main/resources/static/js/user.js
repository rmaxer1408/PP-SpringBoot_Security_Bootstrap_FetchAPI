const userURL = 'http://localhost:8080/api/v1/user';
const userBrand = document.getElementById('navbar-brand');
const userInfo = document.getElementById('principal-info');

function getUserData() {
    fetch(userURL)
        .then((res) => res.json())
        .then((user) => {
            let roles = rolesToString(user.roles);
            let data = '';

            data +=`<tr>
                        <td>${user.id}</td>
                        <td>${user.username}</td>
                        <td>${user.surname}</td>
                        <td>${user.birthdate}</td>
                        <td>${user.email}</td>
                        <td>${roles}</td>
                   </tr>`;
            userInfo.innerHTML = data;
            userBrand.innerHTML = `<span>${user.email} with roles: ${roles}</span>`;
        });
}

getUserData()

function rolesToString(roles) {
    let rolesString = '';

    for (let role of roles) {
        rolesString += (' ' + role.name.toString().replace('ROLE_', ''));
    }
    return rolesString;
}