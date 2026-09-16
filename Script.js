const form = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");
const emptyMessage = document.getElementById("emptyMessage");
const studentCount = document.getElementById("studentCount");
const successMessage = document.getElementById("successMessage");


// Get students saved in browser
let students = JSON.parse(localStorage.getItem("students")) || [];


// Display students when page opens
displayStudents();


// =========================
// Register Student
// =========================

form.addEventListener("submit", function (event) {

    event.preventDefault();

    const student = {
        name: document.getElementById("name").value.trim(),

        className:
            document.getElementById("className").value.trim(),

        enrollment:
            document.getElementById("enrollment").value.trim(),

        phone:
            document.getElementById("phone").value.trim(),

        gender:
            document.getElementById("gender").value,

        bloodGroup:
            document.getElementById("bloodGroup").value
    };


    // Check duplicate enrollment number
    const duplicate = students.some(
        item => item.enrollment.toLowerCase() ===
                student.enrollment.toLowerCase()
    );

    if (duplicate) {
        alert("This enrollment number is already registered.");
        return;
    }


    // Add student
    students.push(student);


    // Save to browser
    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );


    // Reset form
    form.reset();


    // Show message
    successMessage.textContent =
        "✓ Student registered successfully!";


    setTimeout(() => {
        successMessage.textContent = "";
    }, 3000);


    // Refresh list
    displayStudents();
});


// =========================
// Display Students
// =========================

function displayStudents() {

    studentList.innerHTML = "";


    // Student count
    studentCount.textContent =
        students.length +
        (students.length === 1 ? " Student" : " Students");


    // No students
    if (students.length === 0) {
        emptyMessage.style.display = "block";
        return;
    }


    emptyMessage.style.display = "none";


    // Add rows
    students.forEach(function (student, index) {

        const row = document.createElement("tr");


        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${escapeHTML(student.name)}</td>
            <td>${escapeHTML(student.className)}</td>
            <td>${escapeHTML(student.enrollment)}</td>
            <td>${escapeHTML(student.phone)}</td>
            <td>${escapeHTML(student.gender)}</td>
            <td>${escapeHTML(student.bloodGroup)}</td>

            <td>
                <button
                    class="delete-btn"
                    onclick="deleteStudent(${index})">
                    Delete
                </button>
            </td>
        `;


        studentList.appendChild(row);
    });
}


// =========================
// Delete Student
// =========================

function deleteStudent(index) {

    const confirmed =
        confirm("Are you sure you want to delete this student?");

    if (!confirmed) {
        return;
    }


    students.splice(index, 1);


    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );


    displayStudents();
}


// =========================
// Security Helper
// =========================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
