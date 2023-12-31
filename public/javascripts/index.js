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
    let elems = document.querySelectorAll(".sidenav");
    let instances = M.Sidenav.init(elems, { edge: "right" });
}

function SettingPostList() {
    let path = document.getElementById("path-data").dataset.pathId;

    fetch("/api/post/main")
        .then((response) => response.json())
        .then((response) => {
            console.log(response);

            response.data.createdAtPosts.forEach((e, i) => {
                let listItem = document.getElementById(`last-post-${i}`);
                listItem.innerHTML =  `<a href="${path}post/${parseInt(e.id)}">${e.title}</a>`
            });

            response.data.likePosts.forEach((e, i) => {
                let listItem = document.getElementById(`like-post-${i}`);
                listItem.innerHTML =  `<a href="${path}post/${parseInt(e.id)}">${e.title}</a>`
            });

            response.data.commentPosts.forEach((e, i) => {
                let listItem = document.getElementById(`comment-post-${i}`);
                listItem.innerHTML =  `<a href="${path}post/${parseInt(e.id)}">${e.title}</a>`
            });

            response.data.totalPosts.forEach((e, i) => {
                let listItem = document.getElementById(`total-post-${i}`);
                listItem.innerHTML =  `<a href="${path}post/${parseInt(e.id)}">${e.title}</a>`
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
