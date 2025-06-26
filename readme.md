Student Attendance Tracker
A simple web application to help instructors track student attendance in real-time. Built using HTML, CSS, JavaScript, and a mock backend powered by JSON Server.

🚀 Features
✅ Add students with name and ID

📋 View a list of all added students

🔁 Toggle student attendance status between Present and Absent

❌ Remove students from the list

📊 Attendance summary (Total, Present, Absent counts)

🛠 Tech Stack
Frontend: HTML, CSS (Bootstrap), JavaScript

Backend: JSON Server (Mock API)

📦 Getting Started

1. Clone the project
   bash
   Copy
   Edit
   git clone https://github.com/adrienkym/student-attendance-tracker.git
   cd student-attendance-tracker
2. Install JSON Server
   bash
   Copy
   Edit
   npm install -g json-server
3. Start the server
   bash
   Copy
   Edit
   json-server --watch db.json
   Make sure db.json is in the root folder. Your mock API will run at:
   👉 http://localhost:3000/students

4. Open the app
   Open index.html in your browser.

✨ Sample Data (in db.json)
json
Copy
Edit
{
"students": [
{ "id": 1, "name": "Alice", "status": "present" },
{ "id": 2, "name": "Bob", "status": "absent" }
]
}
📌 Future Improvements
Data validation for unique IDs

Export attendance summary as CSV

Add timestamp for attendance logs

User login (Admin/Teacher view)

📄 License
This project is open source and free to use.
