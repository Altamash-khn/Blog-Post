const loadCommmentsBtn = document.getElementById("load-comments");
const commentsSection = document.getElementById("comments");

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

loadCommmentsBtn.addEventListener("click", async function (e) {
  const postId = loadCommmentsBtn.dataset.postid;
  const res = await fetch(`/posts/${postId}/comments`);
  const data = await res.json();
  console.log(data);
  const listOfComments = await createList(data);
  console.log(listOfComments);
  commentsSection.innerHTML = " ";
  commentsSection.appendChild(listOfComments);
});
