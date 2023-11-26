document.addEventListener("DOMContentLoaded", function () {
    SettingNavigation();
    SettingPostList();
    document.getElementById(`main-post-container`).style.display = "block";
    document.getElementById(`category-post-container`).style.display = "none";
});

// ______________________________카테고리____________________________________
document.getElementById("category-posts").addEventListener("click", () => {
    MovePostList("");
});

document.getElementById("category-parts").addEventListener("click", () => {
    MovePostList("?categoryId=1");
});

document.getElementById("category-laptop").addEventListener("click", () => {
    MovePostList("?categoryId=2");
});

document.getElementById("category-monitor").addEventListener("click", () => {
    MovePostList("?categoryId=3");
});

document.getElementById("category-keyboard").addEventListener("click", () => {
    MovePostList("?categoryId=4");
});

document.getElementById("category-mouse").addEventListener("click", () => {
    MovePostList("?categoryId=5");
});
//__________________________________________________________________________

// ______________________________게시물______________________________________
document.getElementById("last-post-list").addEventListener("click", () => {
    MovePostList("?sort=new");
});

document.getElementById("like-post-list").addEventListener("click", () => {
    MovePostList("?sort=likes");
});

document.getElementById("comment-post-list").addEventListener("click", () => {
    MovePostList("?sort=comments");
});

document.getElementById("total-post-list").addEventListener("click", () => {
    MovePostList("?sort=new");
});
//__________________________________________________________________________

function SettingNavigation() {
    var elems = document.querySelectorAll(".sidenav");
    var instances = M.Sidenav.init(elems, { edge: "right" });
}

function SettingPostList() {
    let path = document.getElementById("path-data").dataset.path;

    fetch("/api/post/main")
        .then((response) => response.json())
        .then((response) => {
            console.log(response);

            response.data.createdAtPosts.forEach((e, i) => {
                var listItem = document.getElementById(`last-post-${i}`);
                var link = document.createElement('a');
                link.href = `${path}/post/${e.id}`;
                link.textContent = '하이퍼링크 텍스트';
                listItem.appendChild(link);
                listItem.innerText = e.title;
            });

            response.data.likePosts.forEach((e, i) => {
                var listItem = document.getElementById(`like-post-${i}`);
                var link = document.createElement('a');
                link.href = `${path}/post/${e.id}`;
                link.textContent = '하이퍼링크 텍스트';
                listItem.appendChild(link);
                listItem.innerText = e.title;
            });

            response.data.commentPosts.forEach((e, i) => {
                var listItem = document.getElementById(`comment-post-${i}`);
                var link = document.createElement('a');
                link.href = `${path}/post/${e.id}`;
                link.textContent = '하이퍼링크 텍스트';
                listItem.appendChild(link);
                listItem.innerText = e.title;
            });

            response.data.totalPosts.forEach((e, i) => {
                var listItem = document.getElementById(`total-post-${i}`);
                var link = document.createElement('a');
                link.href = `${path}/post/${e.id}`;
                link.textContent = '하이퍼링크 텍스트';
                listItem.appendChild(link);
                listItem.innerText = e.title;
            });
        })
        .catch((error) => console.error("에러 발생:", error));
}

function MovePostList(sortType) {
    fetch("/api/post/rank" + sortType)
        .then((response) => response.json())
        .then((response) => {
            console.log(response);

            const parentElement = document.getElementById("category-post-list");
            let firstChild = parentElement.firstChild;
            while (firstChild) {
                firstChild.innerText = "";
                firstChild = firstChild.nextSibling;
            }

            response.data.forEach((e, i) => {
                if (i < 10) {
                    // 임시코드 수정하기
                    document.getElementById(`category-post-${i}`).innerText =
                        e.title;
                }
            });

            document.getElementById(`main-post-container`).style.display =
                "none";
            document.getElementById(`category-post-container`).style.display =
                "block";
        })
        .catch((error) => console.error("에러 발생:", error));
}
