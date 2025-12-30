document.addEventListener("DOMContentLoaded", () => {


    const form = document.getElementById("employee-form");

    if (form) {
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


// validation for all the field
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
                date: `${day}-${month}-${year}`,
                text
            };

            const res = await fetch("http://localhost:3000/Employee");
const employees = await res.json();

const isDuplicate = employees.some(emp =>
    emp.name.toLowerCase() === name.toLowerCase()
);
if (isDuplicate) {
    alert("User already exists");
    return;
}

            // post the data from the from and added to the json server
            await fetch("http://localhost:3000/Employee", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(employee)
            });

            form.reset();
            window.location.href = "temp.html";
        });
    }


    const tab = document.getElementById("tab");
    const searchInput = document.getElementById("search");
    let allemployees = [];
    if (tab) loadEmployees();


    // fetch the data and show on the table form
    async function loadEmployees() {
        const res = await fetch("http://localhost:3000/Employee");
        const employees = await res.json();
        allemployees = employees;
        renderTable(employees);
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
            editBtn.onclick = () => editItem(item.id);

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
                emp.salary.toLowerCase().includes(p)

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

//edit Item
async function editItem(id) {
    const newName = prompt("Enter new name:");
    if (!newName) return;

    await fetch(`http://localhost:3000/Employee/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: newName })
    });

    loadEmployees(); 
}
});
