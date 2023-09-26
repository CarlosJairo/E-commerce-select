/*
This module exports a function 'filterOfSearch' that enables filtering of a list of products
based on user input. It listens for keyboard events, specifically keyup events, to trigger
the filtering process.
param {string} input - The CSS selector for the input element that captures user input.
*/
const d = document;

export default function filterOfSearch(input) {
  d.addEventListener("keyup", (e) => {
    if (e.target.matches(input)) {
      if (e.key === "Escape") e.target.value = "";

      d.querySelectorAll(".product").forEach((el) => {
        let title = el.textContent.toLowerCase();
        if (title.includes(e.target.value.toLowerCase()))
          el.classList.remove("filter");
        else el.classList.add("filter");
      });
    }
  });
}
