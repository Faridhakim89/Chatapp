// Firebase Configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;

// Google login
function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).then((result) => {
    currentUser = result.user;
    document.getElementById('user-info').innerHTML = `Hello, ${currentUser.displayName}`;
    document.getElementById('user-info').classList.remove('hidden');
    document.getElementById('login-btn').classList.add('hidden');
    document.getElementById('chat-box').classList.remove('hidden');
  }).catch((error) => {
    console.log(error.message);
  });
}

// Send Message
function sendMessage() {
  const message = document.getElementById('messageInput').value;
  if (message.trim() !== "") {
    db.collection("messages").add({
      user: currentUser.displayName,
      message: message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      document.getElementById('messageInput').value = '';
    }).catch((error) => {
      console.log("Error sending message: ", error);
    });
  }
}

// Fetch Messages
function fetchMessages() {
  db.collection("messages").orderBy("timestamp", "asc").onSnapshot((snapshot) => {
    const messagesContainer = document.getElementById('messages');
    messagesContainer.innerHTML = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      const messageElement = document.createElement("div");
      messageElement.classList.add("message");
      messageElement.innerHTML = `<strong>${data.user}</strong>: ${data.message}`;
      messagesContainer.appendChild(messageElement);
    });
  });
}

// Initialize messages when the user logs in
auth.onAuthStateChanged((user) => {
  if (user) {
    currentUser = user;
    fetchMessages();
  }
});
function uploadFile() {
  const file = document.getElementById("uploadInput").files[0];
  if (!file) {
    alert("Sila pilih file dahulu.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "chatapp_unsigned"); // Ganti jika preset kamu namanya lain

  fetch("https://api.cloudinary.com/v1_1/dgojbzawi/upload", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    console.log("Upload berjaya:", data);
    document.getElementById("preview").innerHTML = `
      <p>Upload berjaya!</p>
      <a href="${data.secure_url}" target="_blank">Lihat File</a>
    `;
  })
  .catch(err => {
    console.error("Upload gagal:", err);
    alert("Gagal upload: " + err.message);
  });
}
