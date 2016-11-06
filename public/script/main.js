var rootRef = firebase.database().ref();
var messageRef = rootRef.child("messages");

var loginButton = document.getElementById("login");
var logoutButton = document.getElementById("logout");
var commentContainer = document.getElementById("comment-container");
var commentInput = document.getElementById("comment-input");

loginButton.onclick = function() {
  console.log("login clicked");
};

logoutButton.onclick = function() {
  console.log("logout clicked");
};

commentInput.onkeypress = function(evt) {
  if (evt.code === "Enter" && commentInput.value.length > 0) {
    pushComment(commentInput.value);
    commentInput.value = "";
  }
};

function pushComment(txt) {
  messageRef.push({"text": txt});
}

function addCommentElement(key, text) {
  var commentElement = document.createElement("div");
  commentElement.innerText = text;
  commentContainer.appendChild(commentElement);
}

messageRef.on("child_added", function(data) {
  addCommentElement(data.key, data.val().text);
});
