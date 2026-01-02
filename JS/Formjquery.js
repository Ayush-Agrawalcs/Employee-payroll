$(document).ready(function () {

const empId = new URLSearchParams(window.location.search).get("id");

 
  if (empId) {
    $.get(`http://localhost:3000/Employee/${empId}`, function (data) {

      $("#name").val(data.name);
      $("#salary").val(data.salary);
      $("#text").val(data.text);

      $(`input[name="gender"][value="${data.gender}"]`).prop("checked", true);
      $(`input[name="pro"][value="${data.img}"]`).prop("checked", true);

      (data.dep || []).forEach(dep => {
        $(`.department-checkbox[value="${dep}"]`).prop("checked", true);
      });

      const [day, month, year] = data.date.split("-");
      $("#day").val(day);
      $("#month").val(month);
      $("#year").val(year);
    });
  }


  $("#employee-form").on("submit", function (e) {
    e.preventDefault();

    let departments = [];
    $(".department-checkbox:checked").each(function () {
      departments.push($(this).val());
    });

    let name = $("#name").val();
    let img = $("input[name='pro']:checked").val() || "";
    let gender = $("input[name='gender']:checked").val() || "";
    let salary = $("#salary").val();
    let day = $("#day").val();
    let month = $("#month").val();
    let year = $("#year").val();
    let text = $("#text").val();

$('.error-msg').hide();
let isValid = true;

if (name === '') {
  $('#Error').show();
  isValid = false;
}

else if (img === '') {
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


    const empObj = {
      name,
      img,
      gender,
      dep: departments,
      salary,
      date: `${day}-${month}-${year}`,
      text
    };

    const method = empId ? "PUT" : "POST";
    const url = empId
      ? `http://localhost:3000/Employee/${empId}`
      : "http://localhost:3000/Employee";

    $.ajax({
      url,
      method,
      contentType: "application/json",
      data: JSON.stringify(empObj),
      success: function () {
        $("#employee-form")[0].reset();
        window.location.href = "temp.html";
      },
      error: function (err) {
        console.error("Save error", err);
      }
    });
  });

});
