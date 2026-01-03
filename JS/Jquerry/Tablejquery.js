$(document).ready(function () {

  if ($("#tab").length) {
    fetchEmployees();
  }


  function fetchEmployees() {
    $.ajax({
      url: "http://localhost:3000/Employee",
      method: "GET",
      success: renderTable,
      error: err => console.error("Fetch error", err)
    });
  }

  function renderTable(items) {
    const $tab = $("#tab");
    $tab.empty();

    items.forEach(it => {

      let deptHtml = "";
      (it.dep || []).forEach(d => {
        deptHtml += `<span class="dept">${d}</span> `;
      });

      $tab.append(`
        <tr>
          <td>
            <img src="${it.img}" width="40" height="40" class="rounded-circle me-2">
            ${it.name}
          </td>
          <td>${it.gender}</td>
          <td>${deptHtml}</td>
          <td>₹${it.salary}</td>
          <td>${it.date}</td>
          <td>
            <i class="bi bi-trash delete-btn cursor me-2" data-id="${it.id}"></i>
            <i class="bi bi-pencil edit-btn cursor" data-id="${it.id}"></i>
          </td>
        </tr>
      `);
    });
  }


  $("#search").on("keyup", function () {
    const val = $(this).val().toLowerCase();
    $("#tab tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().includes(val));
    });
  });


  $(document).on("click", ".delete-btn", function () {
    const id = $(this).data("id");

    $.ajax({
      url: `http://localhost:3000/Employee/${id}`,
      method: "DELETE",
      success: fetchEmployees,
      error: err => console.error("Delete error", err)
    });
  });


  $(document).on("click", ".edit-btn", function () {
    const id = $(this).data("id");
    window.location.href=`Form.html?id=${id}`;
  });

})
