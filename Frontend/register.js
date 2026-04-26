document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:5050/getAvailableSlots")
    .then((response) => response.json())
    .then((data) => {
      const select = document.querySelector("#slot-select");

      data.data.forEach((slot) => {
        const option = document.createElement("option");
        option.value = slot.slot_number;
        option.textContent = `${slot.slot_label} — ${slot.capacity} seats left`;
        select.appendChild(option);
      });
    });
});

document.querySelector("#register-btn").onclick = function () {
  const message = document.querySelector("#message");

  const student = {
    student_id: document.querySelector("#student-id").value,
    first_name: document.querySelector("#first-name").value,
    last_name: document.querySelector("#last-name").value,
    project_title: document.querySelector("#project-title").value,
    email: document.querySelector("#email").value,
    phone: document.querySelector("#phone").value,
    slot_number: document.querySelector("#slot-select").value,
  };

  if (
    !student.student_id ||
    !student.first_name ||
    !student.last_name ||
    !student.project_title ||
    !student.email ||
    !student.phone ||
    !student.slot_number
  ) {
    message.textContent = "All fields are required.";
    message.style.color = "red";
    return;
  }

  // looked up how to do regex lol
  if (!/^\d{10}$/.test(student.phone)) {
    message.textContent = "Phone number must be 10 digits.";
    message.style.color = "red";
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) {
    message.textContent = "Invalid email format.";
    message.style.color = "red";
    return;
  }

  if (!/^\d{8}$/.test(student.student_id)) {
    message.textContent =
      "Student ID must be exactly 8 digits and also only contain numbers.";
    message.style.color = "red";
    return;
  }

  fetch("http://localhost:5050/registerStudent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(student),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        message.textContent = "Registered.";
      } else {
        message.textContent = data.message || "Not registered";
      }
    });
};
