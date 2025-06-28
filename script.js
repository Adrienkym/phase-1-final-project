const API_URL = "https://json-server-rql1.onrender.com/students";

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

let attendanceChart; // For updating the chart later

// Function to calculate attendance summary
function calculateAttendanceSummary() {
  const totalStudents = students.length;
  const presentCount = students.filter((s) => s.status === "present").length; // students.filter() returns an array of students with status "present"
  const absentCount = totalStudents - presentCount;

  const summaryDiv = document.getElementById("atttendance-summary");
  summaryDiv.innerHTML = `
    <div class="col-md-4">
      <div class="card text-white bg-primary shadow-sm h-100">
        <div class="card-body text-center">
          <h5 class="card-title">Total Students</h5>
          <h1 class="display-5">${totalStudents}</h1>
          <i class="bi bi-people-fill fs-2"></i>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card text-white bg-success shadow-sm h-100">
        <div class="card-body text-center">
          <h5 class="card-title">Present</h5>
          <h1 class="display-5">${presentCount}</h1>
          <i class="bi bi-check-circle-fill fs-2"></i>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card text-white bg-danger shadow-sm h-100">
        <div class="card-body text-center">
          <h5 class="card-title">Absent</h5>
          <h1 class="display-5">${absentCount}</h1>
          <i class="bi bi-x-circle-fill fs-2"></i>
        </div>
      </div>
    </div>
  `;

  // Create or update attendance chart
  const ctx = document.getElementById("attendanceChart").getContext("2d"); // Get the context of the canvas for the chart

  const chartData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        label: "Attendance",
        data: [presentCount, absentCount],
        backgroundColor: ["#198754", "#dc3545"],
        borderColor: ["#198754", "#dc3545"],
        borderWidth: 1, // Set the border width for the chart
      },
    ],
  };

  if (attendanceChart) {
    attendanceChart.data = chartData; // Update the existing chart data
    attendanceChart.update(); // Update the existing chart with new data
  } else {
    attendanceChart = new Chart(ctx, {
      // Create a new chart instance
      type: "doughnut", // Use doughnut chart type
      data: chartData,
      options: {
        responsive: true, // Make the chart responsive
        plugins: {
          // Configure plugins for the chart
          legend: {
            //
            position: "bottom", // Position the legend at the bottom
            labels: {
              color: "#fff", // white legend text
              font: {
                size: 14,
              },
            },
          },
        },
      },
    });
  }
}

//

const searchInput = document.getElementById("search-student");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();

  const filtered = students.filter(
    (student) =>
      student.name.toLowerCase().includes(query) || // Filter by name or ID
      String(student.id).toLowerCase().includes(query) // Convert ID to string for comparison
  );

  renderStudentList(filtered); // Render the filtered list of students
});

// Function to render the student list
function renderStudentList(filteredStudents = students) {
  // Default to all students if no filter is applied
  studentList.innerHTML = "";

  filteredStudents.forEach((student) => {
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center";

    const info = document.createElement("span");
    info.className = "student-info";
    info.textContent = `${student.name} (${student.id})`;

    const badge = document.createElement("span");
    badge.className = `badge me-2 ${
      student.status === "present" ? "badge-present" : "badge-absent"
    }`;
    badge.textContent = student.status === "present" ? "Present" : "Absent";

    const btnGroup = document.createElement("div");

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "btn btn-sm btn-outline-light me-1";
    toggleBtn.textContent =
      student.status === "present" ? "Mark Absent" : "Mark Present";
    toggleBtn.onclick = () => updateStudentStatus(student.id, student.status);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-sm btn-outline-danger";
    deleteBtn.textContent = "Remove";
    deleteBtn.onclick = () => deleteStudent(student.id);

    btnGroup.append(badge, toggleBtn, deleteBtn);
    li.append(info, btnGroup);
    studentList.appendChild(li);
  });

  calculateAttendanceSummary();
}
