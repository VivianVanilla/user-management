const userTemplate = document.getElementById('user-template');
const usersContainer = document.getElementById('users-container');

let currentPage = 1;

async function fetchAndRenderUsers(page = 1) {

  const sortBy = document.querySelector('input[name="sortBy"]:checked')?.value || 'firstName';
  const orderSelect = document.getElementById('filter');
  const order = orderSelect?.value === 'asc' ? 'asc' : 'desc';

  const res = await fetch(`/api/users?page=${page}&query=${encodeURIComponent(searchInput.value)}&sortBy=${sortBy}&order=${order}`);

  const { users, total } = await res.json();


  usersContainer.innerHTML = '';

  users.forEach(user => {
    const userNode = userTemplate.content.cloneNode(true);
    userNode.querySelector('[data-name]').textContent = user.firstName;
    userNode.querySelector('[data-lastname]').textContent = user.lastName;
    userNode.querySelector('[data-email]').textContent = user.email;
    userNode.querySelector('[data-age]').textContent = user.age;
    userNode.querySelector('[data-id]').textContent = user.userId;

    usersContainer.appendChild(userNode);
  });

  renderPaginationControls(total);
}

function renderPaginationControls(total) {
  const totalPages = Math.ceil(total / 20);
  const pagination = document.createElement('div');
  pagination.className = 'pagination';

  if (currentPage > 1) {
    const prev = document.createElement('button');
    prev.textContent = ' Prev';
    prev.onclick = () => {
      currentPage--;
      fetchAndRenderUsers(currentPage);
    };
    pagination.appendChild(prev);
  }

  if (currentPage < totalPages) {
    const next = document.createElement('button');
    next.textContent = 'Next';
    next.onclick = () => {
      currentPage++;
      fetchAndRenderUsers(currentPage);
    };
    pagination.appendChild(next);
  }

  usersContainer.appendChild(pagination);
}

window.addEventListener('load', () => {
  fetchAndRenderUsers(currentPage);
});

const searchInput = document.getElementById('search');
const searchForm = document.getElementById('form');

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const query = searchInput.value.trim();

    fetchAndRenderUsers(1)
});


const addUserButton = document.getElementById('addUserButton');

addUserButton.addEventListener('click', async (e) => { 
e.preventDefault(); 

const newUser = {
  userId: Date.now(),
  firstName: prompt("Enter first name:"),
  lastName: prompt("Enter last name:"),
  email: prompt("Enter email:"),
  age: parseInt(prompt("Enter age:"))
};
    if (!newUser.firstName || !newUser.lastName || !newUser.email || isNaN(newUser.age)) {
        alert("Please fill in all fields correctly.");
        return;
    }

     try {
    const res = await fetch('/api/newUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    });

    const data = await res.json();
  } catch (error) {
    console.error('Error adding user:', error);
  }

});

// Delete User 

const deleteButtons = document.getElementById('delete-button');

deleteButtons.addEventListener('click', async (e) => {
  e.preventDefault();

  const userId = prompt("Enter user ID to delete:");

 

  if (!userId) return;

  try {
    const res = await fetch(`/api/deleteUser/${userId}`, {
      method: 'DELETE'
    });

    const data = await res.json();
    alert(data.message);
  } catch (error) {
    console.error('Error deleting user:', error);
  }
});

// Edit User

const editButton = document.getElementById('edit-button');

editButton.addEventListener('click', async (e) => { 
e.preventDefault();

const userId = prompt("Enter user ID to edit:");

if (!userId) return;

console.log('Editing user with ID:', userId);

 const UpdatedUser = {
  firstName: prompt("Enter first name:"),
  lastName: prompt("Enter last name:"),
  email: prompt("Enter email:"),
  age: parseInt(prompt("Enter age:"))
};
  
if (!UpdatedUser.firstName || !UpdatedUser.lastName || !UpdatedUser.email || isNaN(UpdatedUser.age)) {
    alert("Please fill in all fields correctly.");
    return;
}

try { 
    const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(UpdatedUser)
    }); 

   const data = await res.json();
   if (!res.ok) {
        alert(data.message || "Failed to update user.");
        return;
      }
       fetchAndRenderUsers(currentPage);
} catch (error) {
   console.error('Error fetching user:', error);
  }

});