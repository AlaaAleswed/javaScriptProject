document.addEventListener('DOMContentLoaded', () => {
  let editToggle = document.getElementById('editToggle');
  let viewMode   = document.getElementById('viewMode');
  let editMode   = document.getElementById('editMode');
  let saveBtn    = document.getElementById('saveBtn');
  let cancelBtn  = document.getElementById('cancelBtn');

  // Enter edit mode
  editToggle.addEventListener('click', (e) => {
    e.preventDefault();
    viewMode.style.display = 'none';
    editMode.style.display = 'block';
    editToggle.classList.add('active');

    // Fill inputs
    document.getElementById('editFirstName').value = document.getElementById('firstName').textContent.trim();
    document.getElementById('editLastName').value  = document.getElementById('lastName').textContent.trim() === '-' ? '' : document.getElementById('lastName').textContent.trim();
    document.getElementById('editEmail').value     = document.getElementById('email').textContent.trim();
    document.getElementById('editPhone').value     = document.getElementById('phoneNumber').textContent.trim() === '-' ? '' : document.getElementById('phoneNumber').textContent.trim();
    document.getElementById('editAge').value       = document.getElementById('age').textContent.trim() === '-' ? '' : document.getElementById('age').textContent.trim();
  });

  // Save
  saveBtn.addEventListener('click', () => {
    const fName = document.getElementById('editFirstName').value.trim();
    const lName = document.getElementById('editLastName').value.trim();

    document.getElementById('firstName').textContent   = fName;
    document.getElementById('lastName').textContent    = lName || '-';
    document.getElementById('email').textContent       = document.getElementById('editEmail').value.trim();
    document.getElementById('phoneNumber').textContent = document.getElementById('editPhone').value.trim() || '-';
    document.getElementById('age').textContent         = document.getElementById('editAge').value.trim() || '-';
    document.getElementById('fullName').textContent    = fName + (lName ? ' ' + lName : '');

    viewMode.style.display = 'block';
    editMode.style.display = 'none';
    editToggle.classList.remove('active');
  });

  // Cancel
  cancelBtn.addEventListener('click', () => {
    viewMode.style.display = 'block';
    editMode.style.display = 'none';
    editToggle.classList.remove('active');
  });
});