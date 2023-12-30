let username = ''; // Global variable to store username
const firebaseConfig = {
  apiKey: "AIzaSyDsd2O3aobkIoF5qn57K0eyJ7W7O29FlIo",
  authDomain: "offsec2k24.firebaseapp.com",
  databaseURL: "https://offsec2k24-default-rtdb.firebaseio.com",
  projectId: "offsec2k24",
  storageBucket: "offsec2k24.appspot.com",
  messagingSenderId: "888519527414",
  appId: "1:888519527414:web:3215ad82824ff5966615d7",
  measurementId: "G-3TN8DRD18J"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
var database = firebase.database();


document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const enteredUsername = document.getElementById('username').value;
  const enteredPassword = document.getElementById('password').value;

  // Verify username and password
  fetch('secret.csv')
    .then(response => response.text())
    .then(data => {
      const rows = data.split('\n').map(row => row.split(','));
      const found = rows.some(row => row[0] === enteredUsername && row[1] === enteredPassword);

      if (found) {
        document.getElementById('loginMessage').textContent = 'Login successful!';
        username = enteredUsername; // Store the username in the global variable

        // Show chat container, enable message input, and enable send button
        document.querySelector('.chat-container').style.display = 'block';
        document.getElementById('messageInput').disabled = false;
        document.querySelector('.msgBtn').disabled = false;
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('username').disabled = true;
        document.getElementById('password').disabled = true;
        document.getElementById('loginButton').disabled = true;
        

        // // Display previous messages (you might have a function for this)
        displayPreviousMessages();

      } else {
        document.getElementById('loginMessage').textContent = 'Invalid username or password.';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('loginMessage').textContent = 'Error fetching data.';
    });
});

let messageListener = null;
function displayPreviousMessages() {
 
  // // Read data from the database
  // database.ref('data').once('value', function(snapshot) {
  //   snapshot.forEach(function(childSnapshot) {
  //     var childData = childSnapshot.val();
  //     displayMessage(childData.username, childData.message, childData.timestamp);
  //   });
  // });
  // database.ref('data').on('child_added', function(snapshot) {
  //   var childData = snapshot.val();
  //   displayMessage(childData.username, childData.message, childData.timestamp);
  // });

  // if (messageListener !== null) {
  //   database.ref('data').off('child_added', messageListener);
  // }
 
  // // Add new listener
  // messageListener = function(snapshot) {
  //   var childData = snapshot.val();
  //   displayMessage(childData.username, childData.message, childData.timestamp);
  // };
  // database.ref('data').on('child_added', messageListener);
 
  if (messageListener !== null) {
    database.ref('data').off('child_added', messageListener);
  }
 
  // Add new listener
  messageListener = function(snapshot) {
    var childData = snapshot.val();
    displayMessage(childData.username, childData.message, childData.timestamp);
  };
  database.ref('data').on('child_added', messageListener);
 }
 
 function displayMessage(username, message, timestamp) {

   var parts = timestamp.split(" ");
   var timeSent = parts[4]; // The time is the fifth element in the array

  const chatBox = document.querySelector('.chat-box');
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.innerHTML = `<span class="sender">${username}:</span> <span class="message-text">${message}</span>`;
  chatBox.appendChild(messageElement);
  
  const timeElement = document.createElement('div');
  timeElement.classList.add('messageTime');
  timeElement.innerHTML = `<span class="message-time">${timeSent}</span>`;
  chatBox.appendChild(timeElement); 

 }

function sendMessage() {
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value.trim();
 
  if (message && username) {
    const chatBox = document.querySelector('.chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
 
    const timestamp = new Date().toLocaleString(); // Get current timestamp
    const dataToWrite = `${username},${message},${timestamp}\n`; // Data to write to CSV
 
    // messageElement.innerHTML = `<span class="sender">${username}:</span> <span class="message-text">${message}</span>`;
    chatBox.appendChild(messageElement); 

    
    // Write new data to the database
    database.ref(`data/${username}${Date.now()}`).set({
      username: username,
      message: message,
      timestamp: Date().toString()
    });

  document.getElementById('messageInput').value = '';
  }
 }
 