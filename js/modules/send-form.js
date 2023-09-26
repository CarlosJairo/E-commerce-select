/*
This module exports a function that handles form submission and validation for sending emails.
It attaches event listeners for keyup and form submission, performs input validation, and sends the email
data to a specified endpoint using the Fetch API.
*/

const d = document;

export default function sendEmail() {
  const $form = d.querySelector(".contact-form"),
    $inputs = d.querySelectorAll(".contact-form [required]");

  // Create and insert error message spans for each required input field.
  $inputs.forEach((input) => {
    const $span = d.createElement("span");
    $span.id = input.name;
    $span.textContent = input.title;
    $span.classList.add("contact-form-error", "none");
    input.insertAdjacentElement("afterend", $span);
  });

  // Listen for keyup events to perform input validation.
  d.addEventListener("keyup", (e) => {
    if (e.target.matches(".contact-form [required]")) {
      let $input = e.target;
      let pattern = $input.pattern || $input.dataset.pattern;

      if (pattern && $input.value !== "") {
        let regex = new RegExp(pattern);
        return !regex.exec($input.value)
          ? d.getElementById($input.name).classList.add("is-active")
          : d.getElementById($input.name).classList.remove("is-active");
      }
      if (!pattern) {
        return $input.value === ""
          ? d.getElementById($input.name).classList.add("is-active")
          : d.getElementById($input.name).classList.remove("is-active");
      }
    }
  });

  // Listen for form submission events and handle the submission.
  d.addEventListener("submit", (e) => {
    e.preventDefault();
    d.querySelector(".contact-form-loader").classList.remove("none");

    fetch("https://formsubmit.co/ajax/carlosjairo38@gmail.com", {
      method: "POST",
      body: new FormData(e.target),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((json) => {
        d.querySelector(".contact-form-loader").classList.add("none");
        d.querySelector(".contact-form-response").classList.remove("none");
        d.querySelector(
          ".contact-form-response"
        ).innerHTML = `<p>${json.message}</p>`;
        $form.reset();
      })
      .catch((err) => {
        let message = err.message || "Something went wrong, try again";
        d.querySelector(
          ".contact-form-response"
        ).innerHTML = `<p>${err.status}: ${message} </p>`;
      })
      .finally(
        setTimeout(
          () => d.querySelector(".contact-form-response").classList.add("none"),
          4000
        )
      );
  });
}
