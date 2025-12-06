 function toggleMenu() {
        document.querySelector(".nav-links").classList.toggle("active");
      }
   /* ========= ABOUT API ========= */

  async function loadQuote() {
    try {
      const res = await fetch("https://api.adviceslip.com/advice");
      const data = await res.json();

      document.getElementById("quoteText").textContent = data.slip.advice;
      document.getElementById("quoteAuthor").textContent = "";
    } 
    catch (error) {
      document.getElementById("quoteText").textContent = "Failed to load quote.";
    }
  }

  loadQuote();