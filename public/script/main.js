var rootRef = firebase.database().ref();
var messageRef = rootRef.child("messages");
var userRef = rootRef.child("users");

var loginButton = document.getElementById("login");
var logoutButton = document.getElementById("logout");
var commentContainer = document.getElementById("comment-container");
var commentInput = document.getElementById("comment-input");

var googleAuth = new firebase.auth.GoogleAuthProvider();
var user = null;

function canonicalizeUser() {
  userRef.child(user.uid).set({
    displayName: user.displayName,
    photoUrl: user.photoURL
  });
};

loginButton.onclick = function() {
  firebase.auth().signInWithPopup(googleAuth);
};

logoutButton.onclick = function() {
  firebase.auth().signOut();
};

commentInput.onkeypress = function(evt) {
  if (user && evt.code === "Enter" && commentInput.value.length > 0) {
    pushComment(commentInput.value);
    commentInput.value = "";
  }
};

function pushComment(txt) {
  messageRef.push({"text": txt, "author": user.uid});
}

function addCommentElement(key, comment) {
  var commentElement = document.createElement("div");
  if (!comment.author) {
    commentElement.innerText = "someone: " + comment.text;
    commentContainer.appendChild(commentElement);
  } else {
    userRef.child(comment.author).once("value").then(function (authorSnapshot) {
      var author = authorSnapshot.val();
      commentElement.innerText = author.displayName + ": " + comment.text;
      commentContainer.appendChild(commentElement);
    });
  }
}

messageRef.on("child_added", function(data) {
  addCommentElement(data.key, data.val());
});

firebase.auth().onAuthStateChanged(function (signedInUser) {
  user = signedInUser;
  if (user) {
    canonicalizeUser();
    commentInput.disabled = false;
  } else {
    commentInput.disabled = true;
  }
});
