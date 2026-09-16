"use strict";

// ===============================
// Get HTML Elements
// ===============================

const form = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");
const emptyMessage = document.getElementById("emptyMessage");
const studentCount = document.getElementById("studentCount");
const successMessage = document.getElementById("successMessage");


// ===============================
// Load Students from Local Storage
// ===============================

let students = [];

try {
    students = JSON.parse(
        localStorage.getItem("students")
    ) || [];
} catch (error) {
    console.error("Unable to load student data:", error);
    students = [];
}


// ===============================
// Display Students on Page Load
// ===============================

displayStudents();


// ===============================
// Register Student
// ===============================

form.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const className = document.getElementById("className").value.trim();
    const enrollment = document.getElementById("enrollment").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const gender = document.getElementById("gender").value;
    const bloodGroup = document.getElementById("bloodGroup").value;


    // Validate fields
    if (
        !name ||
        !className ||
        !enrollment ||
        !phone ||
        !gender ||
        !bloodGroup
    ) {
        alert("Please fill in all fields.");
        return;
    }


    // Validate phone number
    if (!/^\d{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }


    // Check duplicate enrollment number
    const duplicate = students.some(function (student) {

        return student.enrollment.toLowerCase() ===
               enrollment.toLowerCase();

    });


    if (duplicate) {
        alert("This enrollment number is already registered.");
        return;
    }


    // Create student object
    const student = {
        id: Date.now(),

        name: name,

        className: className,

        enrollment: enrollment,

        phone: phone,

        gender: gender,

        bloodGroup: bloodGroup
    };


    // Add student
    students.push(student);


    // Save data
    saveStudents();


    // Clear form
    form.reset();


    // Success message
    showSuccessMessage(
        "✓ Student registered successfully!"
    );


    // Update table
    displayStudents();

});


// ===============================
// Display Students
// ===============================

function displayStudents() {

    studentList.innerHTML = "";


    // Update student count
    studentCount.textContent =
        students.length +
        (students.length === 1 ? " Student" : " Students");


    // Show empty message
    if (students.length === 0) {

        emptyMessage.style.display = "block";

        return;
    }


    emptyMessage.style.display = "none";


    // Create student rows
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
                    data-id="${student.id}">
                    Delete
                </button>
            </td>
        `;


        studentList.appendChild(row);

    });

}


// ===============================
// Delete Student
// ===============================

studentList.addEventListener("click", function (event) {

    if (!event.target.classList.contains("delete-btn")) {
        return;
    }


    const studentId =
        Number(event.target.dataset.id);


    const confirmed = confirm(
        "Are you sure you want to delete this student?"
    );


    if (!confirmed) {
        return;
    }


    students = students.filter(function (student) {

        return student.id !== studentId;

    });


    saveStudents();

    displayStudents();

});


// ===============================
// Save Students
// ===============================

function saveStudents() {

    try {

        localStorage.setItem(
            "students",
            JSON.stringify(students)
        );

    } catch (error) {

        console.error(
            "Unable to save student data:",
            error
        );

        alert(
            "Unable to save student data on this device."
        );
    }

}


// ===============================
// Success Message
// ===============================

function showSuccessMessage(message) {

    successMessage.textContent = message;

    setTimeout(function () {

        successMessage.textContent = "";

    }, 3000);

}


// ===============================
// Security Helper
// ===============================

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");
}
