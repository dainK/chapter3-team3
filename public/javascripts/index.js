console.log("데이터테스트");

fetch('/api/post')
  .then(response => response.json())
  .then(data => {
    console.log(data)
    for (let i = 0; i < 5; i++) {
      const post = document.getElementById(`last-post-${i}`);
      post.innerText = data.data[i].title;
    }
    for (let i = 0; i < 5; i++) {
      const post = document.getElementById(`like-post-${i}`);
      post.innerText = data.data[i].title;
    }
    for (let i = 0; i < 5; i++) {
      const post = document.getElementById(`comment-post-${i}`);
      post.innerText = data.data[i].title;
    }
    for (let i = 0; i < 5; i++) {
      const post = document.getElementById(`total-post-${i}`);
      post.innerText = data.data[i].title;
    }

  })
  .catch(error => console.error('에러 발생:', error));

fetch('/api/user/me')
  .then(response => response.json())
  .then(data => {
    console.log(data.data)
    const nickName = document.getElementById('userNickName')
    nickName.innerText = data.data.nickName
    const userImage = document.getElementById('userProfileImage')
    userImage.src = data.data.imgUrl


  }).catch(error => console.log(error))

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".sidenav");
  var instances = M.Sidenav.init(elems, { edge: "right" });
});