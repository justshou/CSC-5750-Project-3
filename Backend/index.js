// fetch call is to call the backend
document.addEventListener("DOMContentLoaded", function () {
  fetch("/getAll")
    .then((response) => response.json())
    .then((data) => loadHTMLTable(data["data"]));
});

function loadHTMLTable(data) {
  const table = document.querySelector("table tbody");

  if (data.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='7'>No Data</td></tr>";
    return;
  }

  let tableHtml = "";
  data.forEach(function ({
    student_id,
    first_name,
    last_name,
    project_title,
    email,
    phone,
    slot_label,
  }) {
    tableHtml += "<tr>";

    tableHtml += `<td>${student_id}</td>`;
    tableHtml += `<td>${first_name}</td>`;
    tableHtml += `<td>${last_name}</td>`;
    tableHtml += `<td>${project_title}</td>`;
    tableHtml += `<td>${email}</td>`;
    tableHtml += `<td>${phone}</td>`;
    tableHtml += `<td>${slot_label}</td>`;

    tableHtml += "</tr>";
  });

  table.innerHTML = tableHtml;
}
