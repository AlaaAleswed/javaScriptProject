function startExam(formId) {
  // تخزين formId مؤقتًا لو أردت استخدامه داخل takeExam.html بدون URL
  localStorage.setItem("currentFormId", formId);

  // توجه لصفحة takeExam.html مع تمرير formId في الرابط
  window.location.href = "../takeExam/takeExam.html?formId=" + formId;
}
document.addEventListener("DOMContentLoaded", () => {
  // ============================
  // 1) جلب بيانات اليوزر الحالي
  // ============================

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const currentUserEmail = sessionStorage.getItem("currentUserEmail");
  const currentUser = users.find((u) => u.email === currentUserEmail);

  if (!currentUser) return;

  // تأكد أنه عنده مصفوفة user_responses
  if (!currentUser.user_responses) {
    currentUser.user_responses = [];
  }

  // عرض بيانات اليوزر في البروفايل
  document.getElementById("fullName").textContent =
    currentUser.firstName + " " + currentUser.lastName;
  document.getElementById("firstName").textContent = currentUser.firstName;
  document.getElementById("lastName").textContent = currentUser.lastName;
  document.getElementById("email").textContent = currentUser.email;
  document.getElementById("phoneNumber").textContent = currentUser.phone || "-";
  document.getElementById("age").textContent = currentUser.age || "-";

  // ======== بداية كود Edit Profile ========
  const viewMode = document.getElementById("viewMode");
  const editMode = document.getElementById("editMode");

  const editToggle = document.getElementById("editToggle");
  const saveBtn = document.getElementById("saveBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  const editFirstName = document.getElementById("editFirstName");
  const editLastName = document.getElementById("editLastName");
  const editEmail = document.getElementById("editEmail");
  const editPhone = document.getElementById("editPhone");
  const editAge = document.getElementById("editAge");

  // fill inputs with current data
  editFirstName.value = currentUser.firstName;
  editLastName.value = currentUser.lastName;
  editEmail.value = currentUser.email;
  editPhone.value = currentUser.phone || "";
  editAge.value = currentUser.age || "";

  // Toggle to edit mode
  editToggle.addEventListener("click", (e) => {
    e.preventDefault();
    viewMode.style.display = "none";
    editMode.style.display = "block";
    editToggle.classList.add("active");
  });

  // Cancel editing
  cancelBtn.addEventListener("click", () => {
    editMode.style.display = "none";
    viewMode.style.display = "block";
    editToggle.classList.remove("active");

    editFirstName.value = currentUser.firstName;
    editLastName.value = currentUser.lastName;
    editEmail.value = currentUser.email;
    editPhone.value = currentUser.phone || "";
    editAge.value = currentUser.age || "";
  });

  // Save changes
  saveBtn.addEventListener("click", () => {
    if (!editFirstName.value || !editLastName.value || !editEmail.value) {
      Swal.fire({
        icon: "error",
        title: "Invalid Input",
        text: "First name, Last name, and Email are required",
        confirmButtonColor: "#2D336B",
      });
      return;
    }

    currentUser.firstName = editFirstName.value.trim();
    currentUser.lastName = editLastName.value.trim();
    currentUser.email = editEmail.value.trim();
    currentUser.phone = editPhone.value.trim();
    currentUser.age = editAge.value.trim();

    localStorage.setItem("users", JSON.stringify(users));
    sessionStorage.setItem("currentUserEmail", currentUser.email);

    document.getElementById("fullName").textContent =
      currentUser.firstName + " " + currentUser.lastName;
    document.getElementById("firstName").textContent = currentUser.firstName;
    document.getElementById("lastName").textContent = currentUser.lastName;
    document.getElementById("email").textContent = currentUser.email;
    document.getElementById("phoneNumber").textContent =
      currentUser.phone || "-";
    document.getElementById("age").textContent = currentUser.age || "-";

    editMode.style.display = "none";
    viewMode.style.display = "block";
    editToggle.classList.remove("active");

    Swal.fire({
      icon: "success",
      title: "Profile Updated",
      text: "Your profile has been updated successfully",
      confirmButtonColor: "#2D336B",
    });
  });
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
  // ======== نهاية كود Edit Profile ========

  // ==========================================
  // 2) عرض كل الامتحانات من quiz_forms
  // ==========================================

  function loadUserExams() {
    const allForms = JSON.parse(localStorage.getItem("quiz_forms")) || [];
    const grid = document.querySelector(".examsGrid");
    grid.innerHTML = "";

    allForms.forEach((form) => {
      let solved = currentUser.user_responses.find((r) => r.formId === form.id);

      const card = document.createElement("div");
      card.className = "examCard";

      card.innerHTML = `
        <div class="examHeader">
          <h3>${form.title}</h3>
          <span class="statusBadge ${solved ? "completed" : "active"}">
            ${solved ? "Completed" : "Available"}
          </span>
        </div>

        <p class="examDesc">${form.description}</p>

        ${
          solved
            ? `<div class="finalScore">${solved.totalScore}<span class="percent">points</span></div>`
            : `<a href="#" class="startBtn" onclick="startExam('${form.id}')">Start Exam</a>`
        }

      `;

      grid.appendChild(card);
    });
  }

  loadUserExams();
});
