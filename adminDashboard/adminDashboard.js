 // Sidebar toggle
    const usersLi = document.getElementById("tabusers");
    const formsLi = document.getElementById("tabforms");
    const usersTable = document.getElementById("usersTable");
    const formsTable = document.getElementById("formsTable");
    const mainTitle = document.getElementById("mainTitle");
    const ancorcrea=document.getElementById("ancorcreate");
ancorcrea.addEventListener("click", () =>{
 window.location.href="../createForm/createForm .html";
});
    usersLi.addEventListener("click", () => {
      usersTable.classList.remove("hidden");
      formsTable.classList.add("hidden");
      mainTitle.textContent = "Users Management";
      usersLi.classList.add("active");
      formsLi.classList.remove("active");
    });

    formsLi.addEventListener("click", () => {
      usersTable.classList.add("hidden");
      formsTable.classList.remove("hidden");
      mainTitle.textContent = "Forms Management";
      formsLi.classList.add("active");
      usersLi.classList.remove("active");
    });

    // Logout
    document.getElementById("tablogout").addEventListener("click", () => {
      Swal.fire({
        title: 'Are You Sure?',
        text: "You want to logout?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText:'Yes, Logout'
      }).then(result => {
        if(result.isConfirmed) 
        window.location.href="../index/index.html";
      });
    });

    //--------------------------------------
    // Load Users
    //--------------------------------------
    function loadUsersIntoTable() {
      const tbody = document.querySelector("#usersTable tbody");
      tbody.innerHTML = "";
      let users = JSON.parse(localStorage.getItem("users")) || [];
      users.forEach(user => {
        let row = `<tr>
          <td>${user.firstName} ${user.lastName}</td>
          <td>${user.email}</td>
          <td>${user.phone}</td>
          <td>No Form Taken</td>
          <td>--</td>
          <td class="actions-td">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
          </td>
        </tr>`;
        tbody.innerHTML += row;
      });
    }

    function deleteUser(id){
      Swal.fire({
        title:'Are You Sure?',
        text:"You won't be able to revert this!",
        icon:'warning',
        showCancelButton:true,
        confirmButtonText:'Yes, delete it!'
      }).then(result=>{
        if(result.isConfirmed){
          let users = JSON.parse(localStorage.getItem("users"))||[];
          users = users.filter(u=>u.id!==id);
          localStorage.setItem("users", JSON.stringify(users));
          loadUsersIntoTable();
          Swal.fire('Deleted!','User deleted.','success');
        }
      });
    }

    //--------------------------------------
    // Load Forms
    //--------------------------------------
    function loadFormsIntoTable() {
      const tbody = document.querySelector("#formsTable tbody");
      tbody.innerHTML = "";

      let forms = JSON.parse(localStorage.getItem("quiz_forms")) || [];

      forms = forms.map(f => ({
        id: f.id || "form_" + Date.now() + Math.floor(Math.random()*1000),
        title: f.title || f.name || "Untitled Form",
        questions: f.questions || [],
        createdAt: f.createdAt || f.createdDate || new Date().toISOString(),
        active: f.status==="active" || f.active===true
      }));

      localStorage.setItem("quiz_forms", JSON.stringify(forms));

      // Populate filter
      const filter = document.getElementById("formFilter");
      filter.innerHTML = `<option value="all">All Forms</option>`;
      forms.forEach(f => filter.innerHTML += `<option value="${f.id}">${f.title}</option>`);

      forms.forEach(form=>{
        const statusClass = form.active ? "badge-active":"badge-inactive";
        const statusText = form.active ? "Active":"Inactive";

        let row = document.createElement('tr');
        row.innerHTML = `
          <td>${form.id}</td>
          <td>${form.title}</td>
          <td>${form.questions.length}</td>
          <td><span class="badge ${statusClass}">${statusText}</span></td>
          <td>${form.createdAt.split('T')[0]}</td>
          <td class="actions-td">
            <button class="edit-btn" data-form-id="${form.id}">Edit</button>
            <button class="toggle-status-btn" data-form-id="${form.id}">Toggle</button>
            <button class="formdelete" data-form-id="${form.id}">Delete</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    }

    // Event Delegation: All buttons inside formsTable tbody
    document.querySelector("#formsTable tbody").addEventListener("click", function(e){
      const target = e.target;

      if(target.classList.contains("edit-btn")) {
        const formId = target.getAttribute("data-form-id");
        if(formId){
        window.location.href = `../createForm/createForm.html?mode=edit&id=${formId}`;

        }
      }

      if(target.classList.contains("toggle-status-btn")){
        const formId = target.getAttribute("data-form-id");
        toggleFormStatus(formId);
      }

      if(target.classList.contains("formdelete")){
        const formId = target.getAttribute("data-form-id");
        deleteForm(formId);
      }
    });

    function toggleFormStatus(formId){
      let forms = JSON.parse(localStorage.getItem("quiz_forms"))||[];
      const idx = forms.findIndex(f=>f.id===formId);
      if(idx!==-1){
        forms[idx].active = !forms[idx].active;
        localStorage.setItem("quiz_forms", JSON.stringify(forms));
        loadFormsIntoTable();
        Swal.fire('Status Updated!',`Form is now ${forms[idx].active?'ACTIVE':'INACTIVE'}`,'success');
      }
    }

    function deleteForm(formId){
      Swal.fire({
        title:'Are You Sure?',
        text:"You won't be able to revert this!",
        icon:'warning',
        showCancelButton:true,
        confirmButtonText:'Yes, delete it!'
      }).then(result=>{
        if(result.isConfirmed){
          let forms = JSON.parse(localStorage.getItem("quiz_forms"))||[];
          forms = forms.filter(f=>f.id!==formId);
          localStorage.setItem("quiz_forms", JSON.stringify(forms));
          loadFormsIntoTable();
          Swal.fire('Deleted!','Form deleted.','success');
        }
      });
    }

    // Initial load
    loadUsersIntoTable();
    loadFormsIntoTable();