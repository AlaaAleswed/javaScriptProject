document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let email = document.getElementById("loginEmail").value.trim();
  let password = document.getElementById("loginPassword").value.trim();
  let message = document.getElementById("loginMessage");

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

  // إعادة التوجيه بعد ثانية
  // setTimeout(() => window.location.href = "home.html", 1000);
});