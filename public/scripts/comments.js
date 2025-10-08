const loadCommmentsBtn = document.getElementById("load-comments");
const commentsSection = document.getElementById("comments");
const formElement = document.querySelector("#comments-form form");

function createList(arr) {
  const ul = document.createElement("ul");

  for (let i = 0; i < arr.length; i++) {
    const li = document.createElement("li");
    li.innerHTML = `
        <article class="comment-item">
        <h2>${arr[i].title}</h2>
        <p>${arr[i].text}</p>
        </article>
`;
    ul.appendChild(li);
  }
  return ul;
}

async function fetchComments() {
  const postId = loadCommmentsBtn.dataset.postid;
  const res = await fetch(`/posts/${postId}/comments`);
  const data = await res.json();
  console.log(data.length);
  commentsSection.innerHTML = " ";
  if (data.length > 0) {
    const listOfComments = createList(data);
    commentsSection.appendChild(listOfComments);
  } else {
    const pTag = document.createElement("p");
    pTag.textContent = "no comments found, maybe start commenting";
    commentsSection.append(pTag);
  }
}

async function saveComment(e) {
  e.preventDefault();
  const postId = formElement.dataset.postid;

  const formData = new FormData(formElement);
  const title = formData.get("title");
  const text = formData.get("text");

  console.log(postId);

  await fetch(`/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, text }),
  });

  fetchComments();

  formElement.reset();
}

loadCommmentsBtn.addEventListener("click", fetchComments);
formElement.addEventListener("submit", saveComment);
