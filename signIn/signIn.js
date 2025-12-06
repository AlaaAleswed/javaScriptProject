document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let email = document.getElementById("loginEmail").value.trim();
  let password = document.getElementById("loginPassword").value.trim();
  let message = document.getElementById("loginMessage");

  // ======= بيانات الأدمن الثابتة =======
  const adminEmail = "admin@gmail.com";
  const adminPassword = "admin123123";

  // التحقق من الأدمن أولاً
  if (email === adminEmail && password === adminPassword) {
    sessionStorage.setItem("currentUserEmail", adminEmail);
    message.textContent = "Admin login successful!";
    message.style.color = "green";

    setTimeout(() => {
      window.location.href = "../adminDashboard/adminDashboard.html";
    });
    return; // رجوع بعد توجيه الأدمن
  }

  // جلب المستخدمين من localStorage
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // البحث عن مستخدم يطابق الإيميل المدخل
  let user = users.find((u) => u.email === email);

  if (!user) {
    message.textContent = "This email is not registered!";
    message.style.color = "red";
    return;
  }

  // التحقق من كلمة المرور
  if (user.password !== password) {
    message.textContent = "Incorrect password!";
    message.style.color = "red";
    return;
  }

  // نجاح تسجيل الدخول
  message.textContent = "Login successful!";
  message.style.color = "green";

  // ➤ إضافة هذا السطر
sessionStorage.setItem("currentUserEmail", user.email);

// توجيه للموقع
setTimeout(() => window.location.href = "../userProfile/userProfile.html");


});