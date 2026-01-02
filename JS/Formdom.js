document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("employee-form");
    if (!form) return;

    let empId = null;


    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get("id");
    if (editId) {
        empId = editId;
        loadEditData(editId);
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const salary = document.getElementById("salary").value;
        const day = document.getElementById("day").value;
        const month = document.getElementById("month").value;
        const year = document.getElementById("year").value;
        const text = document.getElementById("text").value.trim();

        const profile = document.getElementsByName("pro");
        const genderr = document.getElementsByName("gender");
        const dept = document.getElementsByName("checkbox");

        let img = "";
        let gender = "";
        let dep = [];

            for (let i = 0; i < profile.length; i++) {
                if (profile[i].checked) {
                    img = profile[i].value;
                    break;
                }
            }

            for (let i = 0; i < genderr.length; i++) {
                if (genderr[i].checked) {
                    gender = genderr[i].value;
                    break;
                }
            }

            for (let i = 0; i < dept.length; i++) {
                if (dept[i].checked) {
                    dep.push(dept[i].value);
                }
            }



            if (name === "") {
                document.getElementById("Error").style.display = "block";
                return;
            }
            else if (img === "") {
                document.getElementById("Error1").style.display = "block";
                return;
            }
            else if (gender === "") {
                document.getElementById("Error2").style.display = "block";
                return;
            }
            else if (dep.length === 0) {
                document.getElementById("Error3").style.display = "block";
                return;
            }
            else if (salary === "") {
                document.getElementById("Error4").style.display = "block";
                return;
            }
            else if (day === "" || month === "" || year === "") {
                document.getElementById("Error5").style.display = "block";
                return;
            }
            else if (text === "") {
                document.getElementById("Error6").style.display = "block";
                return;
            }

            const employee = {
                name,
                img,
                gender,
                dep,
                salary,
                date: `${day} ${month} ${year}`,
                text
            };

             if (empId) {
            await fetch(`http://localhost:3000/Employee/${empId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(employee)
            });
        } else {
            const res = await fetch("http://localhost:3000/Employee");
            const employees = await res.json();

            if (employees.some(emp => emp.name.toLowerCase() === name.toLowerCase())) {
                alert("User already exists");
                return;
            }

            await fetch("http://localhost:3000/Employee", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(employee)
            });
        }

        form.reset();
        window.location.href = "temp.html";
    });
});

  async function loadEditData(id) {
    const res = await fetch(`http://localhost:3000/Employee/${id}`);
    const data = await res.json();

    document.getElementById("name").value = data.name;
    document.getElementById("salary").value = data.salary;
    document.getElementById("text").value = data.text;

    const [day, month, year] = data.date.split("-");
    document.getElementById("day").value = day;
    document.getElementById("month").value = month;
    document.getElementById("year").value = year;

    document.querySelector(`input[name="gender"][value="${data.gender}"]`)?.click();
    document.querySelector(`input[name="pro"][value="${data.img}"]`)?.click();

    data.dep?.forEach(d => {
        document.querySelector(`input[name="checkbox"][value="${d}"]`)?.click();
    });

    document.getElementById("submit").innerText = "Update";
}

