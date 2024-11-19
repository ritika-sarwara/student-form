
// Your other JavaScript code goes here...
document.addEventListener('DOMContentLoaded', loadRecords); // Load existing records when the page loads

// Add or Edit a student record
document.getElementById('student-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    // Get input values from the form
    const studentName = document.getElementById('studentName').value;
    const studentID = document.getElementById('studentID').value;
    const email = document.getElementById('email').value;
    const contactNo = document.getElementById('contactNo').value;

    // Validate the input fields
    if (!validateForm(studentName, studentID, email, contactNo)) {
        return; // Stop if validation fails
    }

    // Create a new student object
    const newStudent = { studentName, studentID, email, contactNo };

    // Get the existing list of students from localStorage
    let students = JSON.parse(localStorage.getItem('students')) || [];

    // Check if we're editing an existing record
    const editingIndex = document.getElementById('student-form').getAttribute('data-edit-index');
    if (editingIndex) {
        students[editingIndex] = newStudent; // Update the existing student record
    } else {
        students.push(newStudent); // Add a new student record
    }

    // Save the updated list back to localStorage
    localStorage.setItem('students', JSON.stringify(students));

    // Reset the form after submitting
    document.getElementById('student-form').reset();
    document.getElementById('student-form').removeAttribute('data-edit-index'); // Remove edit flag

    // Reload the records
    loadRecords();
});

// Function to load and display student records from localStorage
function loadRecords() {
    let students = JSON.parse(localStorage.getItem('students')) || [];
    const recordsBody = document.getElementById('records-body');
    recordsBody.innerHTML = '';  // Clear the existing records

    // Display a message if no students are found
    if (students.length === 0) {
        recordsBody.innerHTML = '<tr><td colspan="5">No records found. Please register a student.</td></tr>';
    } else {
        students.forEach((student, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.studentName}</td>
                <td>${student.studentID}</td>
                <td>${student.email}</td>
                <td>${student.contactNo}</td>
                <td>
                    <button class="edit-btn" onclick="editRecord(${index})">Edit</button>
                    <button class="delete-btn" onclick="deleteRecord(${index})">Delete</button>
                </td>
            `;
            recordsBody.appendChild(row);
        });
    }

    // Dynamically add a vertical scrollbar if the table content exceeds a certain number of records
    const table = document.getElementById('records-table');
    if (students.length > 5) {
        table.style.maxHeight = '300px';
        table.style.overflowY = 'auto';
    } else {
        table.style.maxHeight = '';
        table.style.overflowY = '';
    }
}

// Function to edit a student's record
function editRecord(index) {
    let students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students[index];

    // Populate the form with the student's existing data
    document.getElementById('studentName').value = student.studentName;
    document.getElementById('studentID').value = student.studentID;
    document.getElementById('email').value = student.email;
    document.getElementById('contactNo').value = student.contactNo;

    // Mark the form as editing an existing record
    document.getElementById('student-form').setAttribute('data-edit-index', index);
}

// Function to delete a student's record
function deleteRecord(index) {
    if (confirm('Are you sure you want to delete this record?')) {
        let students = JSON.parse(localStorage.getItem('students')) || [];
        students.splice(index, 1);  // Remove the student at the specified index

        // Save the updated list back to localStorage
        localStorage.setItem('students', JSON.stringify(students));

        // Reload the records after deletion
        loadRecords();
    }
}

// Validate the input form fields
function validateForm(studentName, studentID, email, contactNo) {
    const nameRegex = /^[A-Za-z\s]+$/;   // Regex for validating names (only letters)
    const idRegex = /^\d+$/;              // Regex for validating student IDs (only numbers)
    const contactRegex = /^\+?\d+$/;      // Regex for validating contact numbers (only numbers)

    // Clear previous errors
    clearErrors();

    // Validate student name
    if (!studentName || !nameRegex.test(studentName)) {
        showError('studentName', 'Student Name must contain only letters.');
        return false;
    }

    // Validate student ID
    if (!studentID || !idRegex.test(studentID)) {
        showError('studentID', 'Student ID must contain only numbers.');
        return false;
    }

    // Check for duplicate student ID in localStorage
    let students = JSON.parse(localStorage.getItem('students')) || [];
    if (students.some(student => student.studentID === studentID)) {
        showError('studentID', 'Student ID already exists.');
        return false;
    }

    // Validate contact number
    if (!contactNo || !contactRegex.test(contactNo)) {
        showError('contactNo', 'Contact No. must contain only numbers.');
        return false;
    }

    // Validate email address
    if (!email || !email.includes('@') || !email.includes('.')) {
        showError('email', 'Please enter a valid email address.');
        return false;
    }

    return true;
}

// Display error messages below the respective fields
function showError(field, message) {
    const input = document.getElementById(field);
    input.classList.add('error');
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('error-message');
    errorMessage.textContent = message;
    input.parentElement.appendChild(errorMessage);
}

// Clear all previous error messages
function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.remove());
    const inputs = document.querySelectorAll('.error');
    inputs.forEach(input => input.classList.remove('error'));
}
