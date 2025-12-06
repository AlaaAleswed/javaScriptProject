// جلب ID الفورم من الرابط
      const urlParams = new URLSearchParams(window.location.search);
      const formId = urlParams.get("formId");

      // جلب كل الفورمز
      const forms = JSON.parse(localStorage.getItem("quiz_forms") || "[]");

      // اختيار الفورم الصحيح
      const quiz = forms.find((f) => f.id === formId);

      if (!quiz) {
        document.body.innerHTML = "<h3>No quiz found in localStorage.</h3>";
        throw new Error("No quiz found");
      }

      document.getElementById("quizTitle").innerHTML = quiz.title;
      document.getElementById("quizDesc").innerHTML = quiz.description;

      const box = document.getElementById("questionsBox");

      quiz.questions.forEach((q, index) => {
        const div = document.createElement("div");
        div.className = "question";

        div.innerHTML = `
      <div class="points">Points: ${q.points}</div>
      <div>${q.text}</div>
      <div style="margin-top: 10px;">${renderInput(q, index)}</div>
    `;

        box.appendChild(div);
      });

      function renderInput(q, index) {
        if (q.type === "text") {
          return `<input type="text" id="q_${index}" style="width:100%; padding:8px;">`;
        }
        if (q.type === "radio") {
          return q.choices
            .map(
              (c, i) => `
          <label>
            <input type="radio" name="q_${index}" value="${i}">
            ${c.text}
          </label><br>
        `
            )
            .join("");
        }
        if (q.type === "checkbox") {
          return q.choices
            .map(
              (c, i) => `
          <label>
            <input type="checkbox" name="q_${index}" value="${i}">
            ${c.text}
          </label><br>
        `
            )
            .join("");
        }
      }

      document.getElementById("submitQuiz").onclick = () => {
        let score = 0;
        let total = 0;

        quiz.questions.forEach((q, index) => {
          total += q.points;

          if (q.type === "text") {
            const userAns = document
              .getElementById(`q_${index}`)
              .value.trim()
              .toLowerCase();
            if (userAns === q.correctAnswer) score += q.points;
          }

          if (q.type === "radio") {
            const selected = document.querySelector(
              `input[name="q_${index}"]:checked`
            );
            if (selected && q.choices[selected.value].correct) {
              score += q.points;
            }
          }

          if (q.type === "checkbox") {
            const checked = Array.from(
              document.querySelectorAll(`input[name="q_${index}"]:checked`)
            ).map((e) => Number(e.value));

            const correctArray = q.choices
              .map((c, i) => (c.correct ? i : null))
              .filter((v) => v !== null);

            if (
              JSON.stringify(checked.sort()) ===
              JSON.stringify(correctArray.sort())
            ) {
              score += q.points;
            }
          }
        });
        // ====== تخزين إجابات المستخدم في LocalStorage ======
        let users = JSON.parse(localStorage.getItem("users") || "[]");

        // مثال: المستخدم الحالي (افتراضاً عند تسجيل الدخول خزنت الـ email في sessionStorage)
        const currentUserEmail = sessionStorage.getItem("currentUserEmail");
        const currentUser = users.find((u) => u.email === currentUserEmail);

        if (!currentUser) {
          alert("User not found. Please log in first.");
          return;
        }

        if (!currentUser.user_responses) {
          currentUser.user_responses = [];
        }

        // بناء الإجابات لكل سؤال
        const response = {
          formId: quiz.id, // ID الفورم من quiz_forms
          totalScore: score,
          questions: quiz.questions.map((q, index) => {
            let userAnswer;
            let questionScore = 0;

            if (q.type === "text") {
              userAnswer = document
                .getElementById(`q_${index}`)
                .value.trim()
                .toLowerCase();
              if (userAnswer === q.correctAnswer) questionScore = q.points;
            }

            if (q.type === "radio") {
              const selected = document.querySelector(
                `input[name="q_${index}"]:checked`
              );
              userAnswer = selected ? [q.choices[selected.value].text] : [];
              if (selected && q.choices[selected.value].correct)
                questionScore = q.points;
            }

            if (q.type === "checkbox") {
              const checked = Array.from(
                document.querySelectorAll(`input[name="q_${index}"]:checked`)
              );
              const checkedText = checked.map((c) => q.choices[c.value].text);
              const correctArray = q.choices
                .filter((c) => c.correct)
                .map((c) => c.text);
              if (
                JSON.stringify(checkedText.sort()) ===
                JSON.stringify(correctArray.sort())
              )
                questionScore = q.points;
              userAnswer = checkedText;
            }

            return {
              questionId: q.id, // ID السؤال من quiz_forms
              answer: userAnswer,
              score: questionScore,
            };
          }),
        };

        // أضف أو حدث response موجود مسبقاً لنفس الفورم
        const existingIndex = currentUser.user_responses.findIndex(
          (r) => r.formId === quiz.id
        );
        if (existingIndex > -1) {
          currentUser.user_responses[existingIndex] = response;
        } else {
          currentUser.user_responses.push(response);
        }

        // رجّع البيانات للـ LocalStorage
        localStorage.setItem("users", JSON.stringify(users));

        document.getElementById("finalScore").innerText = `${score} / ${total}`;
        document.getElementById("resultModal").style.display = "flex";
      };

      function closeModal() {
        document.getElementById("resultModal").style.display = "none";
         window.location.href = "../userProfile/userProfile.html"; 
      }