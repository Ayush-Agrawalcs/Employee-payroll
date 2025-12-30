$(document).ready(function () {
  if ($('#employee-form').length > 0) {

    $('#employee-form').on('submit', function (e) {
      e.preventDefault();

      let departments = [];

      let name = $('#name').val();
      let profileimage = $('input[name="pro"]:checked').val() || "";
      let gender = $('input[name="gender"]:checked').val() || "";

      $('.department-checkbox:checked').each(function () {
        departments.push($(this).val());
      });

      let salary = $('#salary').val();
      let day = $('#day').val();
      let month = $('#month').val();
      let year = $('#year').val();
      let text = $('#text').val();

  $('.error-msg').hide();
let isValid = true;

if (name === '') {
  $('#Error').show();
  isValid = false;
}

else if (profileimage === '') {
  $('#Error1').show();
  isValid = false;
}

else if (gender === '') {
  $('#Error2').show();
  isValid = false;
}

else if (departments.length === 0) {
  $('#Error3').show();
  isValid = false;
}

else if (salary === '') {
  $('#Error4').show();
  isValid = false;
}

else if (day === '' || month === '' || year === '') {
  $('#Error5').show();
  isValid = false;
}

else if (text === '') {
  $('#Error6').show();
  isValid = false;
}

if (!isValid) return;



      let obj = {
        name: name,
        img: profileimage,
        gender: gender,
        dep: departments,
        salary: salary,
        date: `${day}-${month}-${year}`,
        text: text
      };

      $.ajax({
        url: "http://localhost:3000/Employee",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(obj),
        success: function () {
          $('#employee-form')[0].reset();
          window.location.href = "temp.html";
        },
        error: function (err) {
          console.error("Save error", err);
        }
      });

    });
  }


  if ($('#tab').length > 0) {
    fetchEmployees();
  }

  function fetchEmployees() {
    $.ajax({
      url: "http://localhost:3000/Employee",
      method: "GET",
      success: function (data) {
        renderTable(data);
      },
      error: function (err) {
        console.error("Fetch error", err);
      }
    });
  }

  function renderTable(items) {
    const $tab = $('#tab');
    $tab.empty();

    items.forEach(it => {

      let deptHtml = "";
      (it.dep || []).forEach(d => {
        deptHtml += `<span class="dept">${d}</span>
               `;
      });

      $(document).ready(function(){
        $("#search").on('keyup' ,function(){
          console.log("Typing", $(this).val());
          let val=$(this).val().toLowerCase();
          $('#tab tr').each(function(){
            let row=$(this).text().toLowerCase();
            $(this).toggle(row.indexOf(val)>-1);
          })
        })
      })

      const row = `
        <tr>
          <td>
            <img src="${it.img}" width="40" height="40"
              class="rounded-circle border me-2">
            <span>${it.name}</span>
          </td>
          <td>${it.gender}</td>
          <td>${deptHtml}</td>
          <td>${it.salary}</td>
          <td>${it.date}</td>
          <td>
          <i class="bi bi-trash action-icon delete-btn cursor" data-id="${it.id}"></i>
          </i>
          <i class="bi bi-pencil action-icon"></i>
          </td>
        </tr>
      `;

      $tab.append(row);
    });
  }
  $(document).on("click", ".delete-btn", function () {
    const id = $(this).data("id");
    deleteitem(id);
});

  function deleteitem(id){
    $.ajax({
      url:`http://localhost:3000/Employee/${id}`,
      method:"Delete",
      success: function () {
        fetchEmployees()
      },
       error: function (err) {
        console.error("Fetch error", err);
      }

    })
  }
});
