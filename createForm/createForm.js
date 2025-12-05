window.addEventListener("DOMContentLoaded", () => {
  const questionsContainer = document.getElementById("questionsContainer");
  let questionCounter = 1;

  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode") || "create"; // create أو edit
  const formId = urlParams.get("id"); // موجود فقط لو edit

  const addQuestionWrapper = document.createElement("div");
  addQuestionWrapper.className = "add-question-wrapper";
  addQuestionWrapper.innerHTML = `<button id="addQuestionBtn" class="btn btn-success" style="padding:14px 40px; font-size:1.2rem;">Add New Question</button>`;
  questionsContainer.appendChild(addQuestionWrapper);

  // -------------------- LOAD FORM IF EDIT --------------------
  if (mode === "edit" && formId) {
    const forms = JSON.parse(localStorage.getItem("quiz_forms") || "[]");
    const formToEdit = forms.find((f) => f.id === formId);

    if (formToEdit) {
      // تعيين العنوان والوصف
      document.getElementById("formTitle").value = formToEdit.title;
      if (formToEdit.description !== undefined) {
        document.getElementById("formDesc").innerHTML = formToEdit.description;
      }

      // مسح أي أسئلة موجودة مسبقاً
      document.querySelectorAll(".question").forEach((q) => q.remove());
      questionCounter = 1;

      // إعادة بناء الأسئلة
      formToEdit.questions.forEach((qData) => {
        createQuestion();
        const qDivs = questionsContainer.querySelectorAll(".question");
        const qDiv = qDivs[qDivs.length - 1]; // آخر سؤال مضاف
        qDiv.querySelector(".question-text").innerHTML = qData.text;
        qDiv.querySelector(".question-type").value = qData.type;

        // تحديث required و points
        qDiv.querySelector(".required").checked = qData.required;
        qDiv.querySelector(".question-points").value = qData.points;

        // تحديث الإجابات
        if (qData.type === "text") {
          qDiv.querySelector(".correct-answer-input").value =
            qData.correctAnswer || "";
        } else if (qData.type === "radio" || qData.type === "checkbox") {
          const choicesContainer = qDiv.querySelector(".choices");
          choicesContainer.innerHTML = "";
          qData.choices.forEach((c) => {
            const inputType = qData.type === "radio" ? "radio" : "checkbox";
            const name =
              qData.type === "radio"
                ? "correct_radio"
                : `correct_checkbox_${Date.now()}`;
            const cDiv = document.createElement("div");
            cDiv.className = "choice";
            cDiv.innerHTML = `
              <input type="text" class="choice-text" value="${
                c.text
              }" placeholder="Option text" />
              <label>Correct Answer
                <input type="${inputType}" name="${name}" class="correct-answer" ${
              c.correct ? "checked" : ""
            }>
              </label>
              <button type="button" class="btn btn-danger btn-sm remove-choice">Delete</button>
            `;
            choicesContainer.appendChild(cDiv);
            cDiv.querySelector(".remove-choice").onclick = () => cDiv.remove();
          });
        }

        // عرض/اخفاء حسب النوع
        qDiv.querySelector(".choices-container").style.display =
          qData.type === "radio" || qData.type === "checkbox"
            ? "block"
            : "none";
        qDiv.querySelector(".text-answer").style.display =
          qData.type === "text" ? "block" : "none";
      });
    }
  }

  // -------------------- DESCRIPTION TOOLBAR --------------------
  const descToolbar = document.getElementById("descToolbar");
  const formDesc = document.getElementById("formDesc");

  descToolbar.querySelectorAll("button[data-cmd]").forEach((btn) => {
    btn.addEventListener("click", () => {
      formDesc.focus();
      document.execCommand(btn.dataset.cmd, false);
      btn.classList.toggle(
        "active",
        document.queryCommandState(btn.dataset.cmd)
      );
    });
  });

  descToolbar
    .querySelector(".font-select")
    .addEventListener("change", function () {
      formDesc.focus();
      if (this.value) document.execCommand("fontName", false, this.value);
      this.value = "";
    });

  // -------------------- CREATE QUESTION --------------------
  function createQuestion() {
    const qDiv = document.createElement("div");
    qDiv.className = "question";
    qDiv.innerHTML = `
      <div class="question-header">
        <span class="question-num">Question ${questionCounter++}</span>
        <button type="button" class="btn btn-danger btn-sm removeQuestion">Delete</button>
      </div>

      <div class="form-group">
        <label>Question Text</label>
        <div class="rich-toolbar">
          <button type="button" data-cmd="bold">Bold</button>
          <button type="button" data-cmd="italic">Italic</button>
          <button type="button" data-cmd="underline">Underline</button>
          <select class="font-select">
            <option value="">Default Font</option>
            <option value="Tajawal">Tajawal</option>
            <option value="Amiri">Amiri</option>
            <option value="Cairo">Cairo</option>
          </select>
        </div>
        <div class="rich-editor question-text" contenteditable="true"></div>
      </div>

      <div class="form-group">
        <label>Question Type</label>
        <select class="question-type">
          <option value="">Choose Type</option>
          <option value="text">Short Text Answer</option>
          <option value="radio">Single Choice (One Correct)</option>
          <option value="checkbox">Multiple Choice (Multiple Correct)</option>
        </select>
      </div>

      <div class="form-group" style="display: flex; gap: 20px; align-items: center; flex-wrap: wrap;">
        <label style="margin: 0;">
          <input type="checkbox" class="required" checked /> Required Question?
        </label>
        <label style="margin: 0;">
          Points: 
          <input type="number" class="question-points" min="0" max="100" value="1" style="width: 80px; padding: 8px; margin-left: 8px; border: 2px solid var(--border); border-radius: 8px; text-align: center;" />
        </label>
      </div>

      <div class="correct-answer-section text-answer" style="display:none;">
        <label>Correct Answer (Short Text)</label>
        <input type="text" class="correct-answer-input" placeholder="e.g., JavaScript" />
        <small>The user's answer will be compared in lowercase (case-insensitive)</small>
      </div>

      <div class="choices-container" style="display:none;">
        <hr/>
        <div class="choices"></div>
        <button type="button" class="btn btn-primary btn-sm add-choice">Add Option</button>
      </div>
    `;

    questionsContainer.insertBefore(qDiv, addQuestionWrapper);

    const qText = qDiv.querySelector(".question-text");
    const qToolbar = qDiv.querySelector(".rich-toolbar");
    const typeSelect = qDiv.querySelector(".question-type");
    const choicesContainer = qDiv.querySelector(".choices-container");
    const choicesList = qDiv.querySelector(".choices");
    const textAnswerSection = qDiv.querySelector(".text-answer");
    const addChoiceBtn = qDiv.querySelector(".add-choice");

    qToolbar.querySelectorAll("button[data-cmd]").forEach((btn) => {
      btn.onclick = () => {
        qText.focus();
        document.execCommand(btn.dataset.cmd, false);
        btn.classList.toggle(
          "active",
          document.queryCommandState(btn.dataset.cmd)
        );
      };
    });

    qToolbar.querySelector(".font-select").onchange = function () {
      qText.focus();
      if (this.value) document.execCommand("fontName", false, this.value);
      this.value = "";
    };

    function addChoice(text = "", isCorrect = false) {
      const cDiv = document.createElement("div");
      cDiv.className = "choice";
      const inputType = typeSelect.value === "radio" ? "radio" : "checkbox";
      const name =
        typeSelect.value === "radio"
          ? "correct_radio"
          : `correct_checkbox_${Date.now()}`;

      cDiv.innerHTML = `
        <input type="text" class="choice-text" value="${text}" placeholder="Option text" />
        <label>Correct Answer
          <input type="${inputType}" name="${name}" class="correct-answer" ${
        isCorrect ? "checked" : ""
      }>
        </label>
        <button type="button" class="btn btn-danger btn-sm remove-choice">Delete</button>
      `;
      choicesList.appendChild(cDiv);
      cDiv.querySelector(".remove-choice").onclick = () => cDiv.remove();
    }

    function toggleQuestionType() {
      const type = typeSelect.value;
      choicesContainer.style.display =
        type === "radio" || type === "checkbox" ? "block" : "none";
      textAnswerSection.style.display = type === "text" ? "block" : "none";

      choicesList.innerHTML = "";
      if (type === "radio" || type === "checkbox") {
        addChoice("Option 1", true);
        addChoice("Option 2");
      }
    }

    addChoiceBtn.onclick = () => addChoice();
    typeSelect.onchange = toggleQuestionType;

    qDiv.querySelector(".removeQuestion").onclick = () => {
      qDiv.remove();
      renumberQuestions();
    };

    toggleQuestionType();
    renumberQuestions();
  }

  function renumberQuestions() {
    questionCounter = 1;
    document.querySelectorAll(".question-num").forEach((el) => {
      el.textContent = `Question ${questionCounter++}`;
    });
  }

  document.getElementById("addQuestionBtn").onclick = createQuestion;

  // -------------------- SAVE FORM --------------------
  document.getElementById("saveForm").onclick = () => {
    const title = document.getElementById("formTitle").value.trim();
    if (!title) {
      Swal.fire({ icon: "error", text: "Please enter a form title!" });
      return;
    }

    const questions = Array.from(document.querySelectorAll(".question"))
      .map((q, i) => {
        const text = q.querySelector(".question-text").innerHTML.trim();
        const type = q.querySelector(".question-type").value;
        const required = q.querySelector(".required").checked;
        const points = parseInt(q.querySelector(".question-points").value) || 1;

        let correctAnswer = null;
        let choices = [];

        if (type === "text") {
          correctAnswer =
            q
              .querySelector(".correct-answer-input")
              ?.value.trim()
              .toLowerCase() || "";
        } else if (type === "radio" || type === "checkbox") {
          choices = Array.from(q.querySelectorAll(".choice"))
            .map((c) => {
              const optionText = c.querySelector(".choice-text").value.trim();
              const isCorrect = c.querySelector(".correct-answer").checked;
              return { text: optionText, correct: isCorrect };
            })
            .filter((c) => c.text);
        }

        return {
          id: "q_" + Date.now() + "_" + i,
          text,
          type,
          required,
          points,
          correctAnswer,
          choices,
        };
      })
      .filter((q) => q.text);

    if (questions.length === 0) {
      Swal.fire({ icon: "error", text: "Please add at least one question" });
      return;
    }

    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    let forms = JSON.parse(localStorage.getItem("quiz_forms") || "[]");

    const formData = {
      id: mode === "edit" && formId ? formId : "form_" + Date.now(),
      title,
      description: document.getElementById("formDesc").innerHTML,
      createdAt:
        mode === "edit" && formId
          ? forms.find((f) => f.id === formId)?.createdAt
          : new Date().toISOString(),
      active: true,
      questions,
      totalPoints,
    };

    if (mode === "edit" && formId) {
      const index = forms.findIndex((f) => f.id === formId);
      if (index !== -1)
        forms[index] = { ...forms[index], ...formData, id: formId };
    } else {
      forms.push(formData);
    }

    localStorage.setItem("quiz_forms", JSON.stringify(forms));

    Swal.fire({
      title: "Test saved successfully!",
      icon: "success",
      draggable: true,
    }).then(() => {
      window.location.href = "../adminDashboard/adminDashboard.html";
    });
  };

  // -------------------- CANCEL --------------------
  document.getElementById("cancelForm").onclick = () => {
    if (confirm("Discard all changes?")) window.location.reload();
  };
});
