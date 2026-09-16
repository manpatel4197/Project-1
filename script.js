"use strict";


// =====================================
// GET HTML ELEMENTS
// =====================================

const form =
    document.getElementById("studentForm");

const studentList =
    document.getElementById("studentList");

const emptyMessage =
    document.getElementById("emptyMessage");

const studentCount =
    document.getElementById("studentCount");

const successMessage =
    document.getElementById("successMessage");


// =====================================
// LOAD SAVED STUDENTS
// =====================================

let students = [];

try {

    students =
        JSON.parse(
            localStorage.getItem("students")
        ) || [];

} catch (error) {

    console.error(
        "Could not load student data.",
        error
    );

    students = [];
}


// Display students
displayStudents();


// =====================================
// REGISTER STUDENT
// =====================================

form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        // Get form values

        const name =
            document
                .getElementById("name")
                .value
                .trim();

        const className =
            document
                .getElementById("className")
                .value
                .trim();

        const enrollment =
            document
                .getElementById("enrollment")
                .value
                .trim();

        const phone =
            document
                .getElementById("phone")
                .value
                .trim();

        const gender =
            document
                .getElementById("gender")
                .value;

        const bloodGroup =
            document
                .getElementById("bloodGroup")
                .value;


        // =================================
        // VALIDATION
        // =================================

        if (
            !name ||
            !className ||
            !enrollment ||
            !phone ||
            !gender ||
            !bloodGroup
        ) {

            alert(
                "Please fill in all fields."
            );

            return;
        }


        // Phone validation

        if (!/^[0-9]{10}$/.test(phone)) {

            alert(
                "Please enter a valid 10-digit phone number."
            );

            return;
        }


        // =================================
        // DUPLICATE ENROLLMENT CHECK
        // =================================

        const duplicate =
            students.some(function (student) {

                return (
                    student.enrollment
                        .toLowerCase() ===
                    enrollment.toLowerCase()
                );

            });


        if (duplicate) {

            alert(
                "This enrollment number is already registered."
            );

            return;
        }


        // =================================
        // CREATE STUDENT
        // =================================

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


        // Save student

        saveStudents();


        // Clear form

        form.reset();


        // Show success

        successMessage.textContent =
            "✓ Student registered successfully!";


        setTimeout(function () {

            successMessage.textContent = "";

        }, 3000);


        // Update table

        displayStudents();

    }
);


// =====================================
// DISPLAY STUDENTS
// =====================================

function displayStudents() {

    studentList.innerHTML = "";


    // Update count

    studentCount.textContent =
        students.length +
        (
            students.length === 1
                ? " Student"
                : " Students"
        );


    // No students

    if (students.length === 0) {

        emptyMessage.style.display =
            "block";

        return;
    }


    emptyMessage.style.display =
        "none";


    // Create rows

    students.forEach(
        function (student, index) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${escapeHTML(student.name)}
                </td>

                <td>
                    ${escapeHTML(student.className)}
                </td>

                <td>
                    ${escapeHTML(student.enrollment)}
                </td>

                <td>
                    ${escapeHTML(student.phone)}
                </td>

                <td>
                    ${escapeHTML(student.gender)}
                </td>

                <td>
                    ${escapeHTML(student.bloodGroup)}
                </td>

                <td>

                    <button
                        class="delete-btn"
                        data-id="${student.id}">

                        Delete

                    </button>

                </td>
            `;


            studentList.appendChild(row);

        }
    );
}


// =====================================
// DELETE STUDENT
// =====================================

studentList.addEventListener(
    "click",
    function (event) {

        if (
            !event.target.classList
                .contains("delete-btn")
        ) {
            return;
        }


        const studentId =
            Number(
                event.target.dataset.id
            );


        const confirmed =
            confirm(
                "Are you sure you want to delete this student?"
            );


        if (!confirmed) {
            return;
        }


        students =
            students.filter(
                function (student) {

                    return student.id !== studentId;

                }
            );


        saveStudents();

        displayStudents();

    }
);


// =====================================
// SAVE STUDENTS
// =====================================

function saveStudents() {

    try {

        localStorage.setItem(
            "students",
            JSON.stringify(students)
        );

    } catch (error) {

        console.error(
            "Could not save student data.",
            error
        );

        alert(
            "Unable to save student data."
        );
    }
}


// =====================================
// SECURITY
// =====================================

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");
}
