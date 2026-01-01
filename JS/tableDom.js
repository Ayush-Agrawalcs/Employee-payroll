document.addEventListener("DOMContentLoaded", () => {
    empId = null;
const tab = document.getElementById("tab");
    const searchInput = document.getElementById("search");
    let allemployees = [];
    if (tab) loadEmployees();


    // fetch the data and show on the table form
    async function loadEmployees() {
        const res = await fetch("http://localhost:3000/Employee");
        const employees = await res.json();
        allemployees = employees;
        renderTable(allemployees.reverse());
    }
    

    function renderTable(items) {
        tab.innerHTML = "";

        items.forEach(item => {
            const tr = document.createElement("tr");


            const User = document.createElement("td");
            const wrap = document.createElement("div");
            wrap.className = "d-flex align-items-center gap-2";

            const img = document.createElement("img");
            img.src = item.img;
            img.width = 40;
            img.height = 40;
            img.className = "rounded-circle border";
            img.onerror = () => img.src = "assets/default-user.png";

            const nameSpan = document.createElement("span");
            nameSpan.textContent = item.name;

            wrap.append(img, nameSpan);
            User.appendChild(wrap);


            const Gender = document.createElement("td");
            Gender.textContent = item.gender;


            const Dept = document.createElement("td");

            if (Array.isArray(item.dep)) {
                item.dep.forEach(d => {
                    const span = document.createElement("span");
                    span.textContent = d;
                    span.style.background = "#e9fea5";
                    span.style.padding = "4px 8px";
                    span.style.borderRadius = "12px";
                    span.style.marginRight = "6px";
                    span.style.fontSize = "12px";
                    Dept.appendChild(span);
                });
            }


            const Salary = document.createElement("td");
            Salary.textContent = item.salary;


            const Date = document.createElement("td");
            Date.textContent = item.date;


            const Action = document.createElement("td");
            const editBtn = document.createElement("button");
            editBtn.className = "btn btn-sm me-2";
            editBtn.innerHTML = `<i class="bi bi-pencil"></i>`;
            editBtn.onclick = () => window.location.href = `Form.HTML?id=${item.id}`;

            const deleteBtn = document.createElement("button");
            deleteBtn.className = "btn btn-sm";
            deleteBtn.innerHTML = `<i class="bi bi-trash"></i>`;
            deleteBtn.onclick = () => deleteItem(item.id);

            Action.append(editBtn, deleteBtn);

            tr.append(User, Gender, Dept, Salary, Date, Action);
            tab.appendChild(tr);
        });
    }

    // Search Querry
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const p = searchInput.value.toLowerCase();
            const filt = allemployees.filter((emp) =>
                emp.name.toLowerCase().includes(p) ||
                emp.gender.toLowerCase().includes(p) ||
                emp.salary.toLowerCase().includes(p) ||
                (emp.dep && emp.dep.some(dep => dep.toLowerCase().includes(p)))
            )
            renderTable(filt)
        })
    }
     // Delete Item

   async function deleteItem(id) {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    await fetch(`http://localhost:3000/Employee/${id}`, {
        method: "DELETE"
    });

    loadEmployees();
}

// Load edit data
// async function loadEditData(id) {
//     const res = await fetch(`http://localhost:3000/Employee/${id}`);
//     const data = await res.json();

//     document.getElementById("name").value = data.name;
//     document.getElementById("salary").value = data.salary;
//     document.getElementById("text").value = data.text;

//     const [day, month, year] = data.date.split("-");
//     document.getElementById("day").value = day;
//     document.getElementById("month").value = month;
//     document.getElementById("year").value = year;

//     const genderRadio = document.querySelector(`input[name="gender"][value="${data.gender}"]`);
//     if (genderRadio) genderRadio.checked = true;

//     const profileRadio = document.querySelector(`input[name="pro"][value="${data.img}"]`);
//     if (profileRadio) profileRadio.checked = true;

//     if (Array.isArray(data.dep)) {
//         data.dep.forEach(dep => {
//             const checkbox = document.querySelector(`input[name="checkbox"][value="${dep}"]`);
//             if (checkbox) checkbox.checked = true;
//         });
//     }
//     document.getElementById("submit").innerHTML="Update";
// }
})