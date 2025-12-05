document.getElementById("registerForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    let fName = document.getElementById("fName").value.trim();
    let lName = document.getElementById("lName").value.trim();
    let age = document.getElementById("age").value.trim();
    let phone = document.getElementById("phoneNumber").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let confirmPassword = document.getElementById("confirmPassword").value.trim();
    let field = document.getElementById("field").value; 

    // Regex
    let nameRegex = /^[A-Za-z]+$/;
    let phoneRegex = /^[0-9]+$/;
    let emailRegex = /^[^@]+@[^@]+\.[^@]+$/;

    // دالة عرض رسالة الخطأ باستخدام SweetAlert
    const showErrorAlert = (text) => {
        Swal.fire({
            icon: 'error',
            title: 'Registration Error',
            text: text,
            confirmButtonColor: '#2D336B'
        });
    }

    // Validations (بدون تغيير)
    if (!nameRegex.test(fName)) {
        showErrorAlert("First name must contain letters only.");
        return;
    }

    if (!nameRegex.test(lName)) {
        showErrorAlert("Last name must contain letters only.");
        return;
    }

    if (age < 18) {
        showErrorAlert("Age cannot be negative.");
        return;
    }

    if (!phoneRegex.test(phone)) {
        showErrorAlert("Phone number must contain digits only.");
        return;
    }

    if (!emailRegex.test(email)) {
        showErrorAlert("Invalid email format.");
        return;
    }
    
    if (password !== confirmPassword) {
        showErrorAlert("Passwords do not match.");
        return;
    }

    // ====== تخزين البيانات في LocalStorage ======
    let users = [];

    // 1. جلب المستخدمين المخزنين مسبقًا
    if (localStorage.getItem("users")) {
        users = JSON.parse(localStorage.getItem("users"));
    }

    // 2. تحديد رقم ID الجديد
    // الـ ID الجديد = عدد المستخدمين الحاليين + 1
    let newId = users.length + 1; 

    // 3. إنشاء مستخدم جديد (وإضافة الـ ID)
    let newUser = {
        id: newId, // ✨ تم إضافة الـ ID هنا
        firstName: fName,
        lastName: lName,
        age: age,
        phone: phone,
        email: email,
        password: password,
        field: field
    };

    // 4. إضافة المستخدم للـ array
    users.push(newUser);

    // 5. إعادة تخزين users في localStorage
    localStorage.setItem("users", JSON.stringify(users));
    sessionStorage.setItem("currentUserEmail", email);


    // رسالة نجاح باستخدام SweetAlert
    Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        text: `Your ID is: ${newId}`, 
        confirmButtonColor: '#2D336B'
    });

    // تفريغ الحقول
    document.getElementById("registerForm").reset();
});
