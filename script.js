const API_URL = "http://localhost:3000/students";

//get the elements
const studentList = document.getElementById("student-list");
const addStudentButton = document.getElementById("add-stud");
const studentNameInput = document.getElementById("student-name");
const studentIdInput = document.getElementById("student-id");

let students = [];

// Wait for the DOM to load before fetching students
document.addEventListener("DOMContentLoaded", fetchStudents);

// Fetch students from the API and render the list
async function fetchStudents() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    students = data; // Store the fetched students in the global array
    renderStudentList(); // Render the student list
  } catch (error) {
    console.error("Error fetching students:", error);
  }
}

// add event listener to the add student button
addStudentButton.addEventListener("click", async (e) => {
  e.preventDefault();

  // Add event listener to the add student button
  const name = studentNameInput.value.trim(); // Get the student name
  const id = studentIdInput.value.trim(); // Get the student ID

  if (name && id) {
    // Check if both name and ID are provided
    try {
      const response = await fetch(API_URL, {
        method: "POST", // Use POST method to add a new student
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ name, id, status: "present" }), // Convert the data to JSON format(stimgify turns the JavaScript object into a JSON string)
      });

      if (response.ok) {
        // Check if the response is OK

        studentNameInput.value = ""; // Clear the input fields
        studentIdInput.value = ""; // Clear the input fields
        await fetchStudents(); // Fetch the updated list of students
      } else {
        console.error("Failed to add student");
      }
    } catch (error) {
      console.error("Error:", error);
    } // Handle any errors that occur during the fetch
  } else {
    alert("Please enter both name and ID.");
  }
});
// Function to delete a student
async function deleteStudent(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      await fetchStudents(); // Fetch the updated list of students
    } else {
      console.error("Failed to delete student");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Function to toggle student status

async function updateStudentStatus(id, status) {
  const newStatus = status === "present" ? "absent" : "present"; // Toggle status

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH", // Use PATCH method to update the student status
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ status: newStatus }), //convert into a json obect & Update the status
    });

    if (response.ok) {
      await fetchStudents(); // Fetch the updated list of students
    } else {
      console.error("Failed to update student status");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
// Function to calculate attendance summary
function calculateAttendanceSummary() {
  const totalStudents = students.length;
  const presentCount = students.filter((s) => s.status === "present").length; // Count the number of students present
  const absentCount = totalStudents - presentCount;

  const summaryDiv = document.getElementById("atttendance-summary");
  summaryDiv.innerHTML = `
    <h5>Attendance Summary</h5>
    <p>Total Students: ${totalStudents}</p>
    <p>Present: ${presentCount}</p>
    <p>Absent: ${absentCount}</p>
  `;
}

// Function to render the student list
function renderStudentList() {
  studentList.innerHTML = "";

  students.forEach((student) => {
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";

    const info = document.createElement("span"); // Create a span for student info
    info.className = "student-info"; // Add a class for styling
    info.textContent = `${student.name} ${student.id}`;

    const badge = document.createElement("span");
    badge.className = `badge me-2 ${
      student.status === "present" ? "badge-present" : "badge-absent" // Add a class based on the status like present or absent
    }`;
    badge.textContent = student.status === "present" ? "Present" : "Absent"; // checks if the stud is present if true the texxt is changed to present if not it is changed to Absent

    const btnGroup = document.createElement("div");

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "btn btn-sm btn-outline-success me-1";
    toggleBtn.textContent =
      student.status === "present" ? "Mark Absent" : "Mark Present"; // Set the button text based on the status
    toggleBtn.onclick = () => updateStudentStatus(student.id, student.status); // when the button is clicked, it will call the updateStudentStatus function with the student's ID and current status

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-sm btn-outline-danger";
    deleteBtn.textContent = "Remove";
    deleteBtn.onclick = () => deleteStudent(student.id);

    btnGroup.append(badge, toggleBtn, deleteBtn);
    li.append(info, btnGroup);
    studentList.appendChild(li);
  });
  calculateAttendanceSummary(); // Calculate and display the attendance summary
}
