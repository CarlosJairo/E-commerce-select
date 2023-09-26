/*
 This module exports a function 'hamburgermenu' which adds interactivity to a hamburger menu.
 When certain elements with specific classes or their children are clicked, it toggles the visibility
 of related elements on the web page.
 */

// Import the 'document' object and assign it to the variable 'd'
const d = document;

// Export a function named 'hamburgermenu' as the default
export default function hamburgermenu() {
  d.addEventListener("click", (e) => {
    if (
      e.target.matches(".hamburger-btn") ||
      e.target.matches(`.hamburger-btn *`) ||
      e.target.matches(".go-section-btns .btn")
    ) {
      d.querySelector(".go-section-btns").classList.toggle("show");
      d.querySelector("#hamburger").classList.toggle("no-show");
      d.querySelector(".close-hamburger").classList.toggle("show");
    }
  });
}
