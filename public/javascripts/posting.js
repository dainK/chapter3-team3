 // Materialize initialization
 document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll("select");
  var instances = M.FormSelect.init(elems);
});

// Quill initialization
var quill = new Quill("#editor-container", {
  modules: {
      toolbar: [
          ["bold", "italic", "underline", "strike", "image"],
      ],
  },
  placeholder: "게시물을 작성하세요...",
  theme: "snow", // or 'bubble'
});

// 이미지 업로드를 위한 이벤트 핸들러 등록
document
  .getElementById("image-upload")
  .addEventListener("change", function (e) {
      var file = e.target.files[0];

      if (file) {
          var reader = new FileReader();

          reader.onload = function (e) {
              // 미리보기 영역에 이미지를 표시
              // document.getElementById('image-preview').innerHTML = '<img src="' + e.target.result + '" style="max-width:100%;">';

              // 이미지를 Quill에 추가
              var cursorPosition = quill.getSelection().index;
              quill.insertEmbed(
                  cursorPosition,
                  "image",
                  e.target.result,
              );
          };

          reader.readAsDataURL(file);
      }
  });

// 이미지 업로드 버튼 클릭 시 input을 클릭하는 함수
function triggerImageUpload() {
  document.getElementById("image-upload").click();
}

// // 문자열을 URL-safe Base64로 인코딩
// function encodeBase64UrlSafe(str) {
//   return btoa(str)
//       .replace(/\+/g, "-")
//       .replace(/\//g, "_")
//       .replace(/=+$/, "");
// }

// // URL-safe Base64를 디코딩
// function decodeBase64UrlSafe(encodedStr) {
//   encodedStr = encodedStr.replace(/-/g, "+").replace(/_/g, "/");
//   while (encodedStr.length % 4) {
//       encodedStr += "=";
//   }
//   return atob(encodedStr);
// }

// 등록 버튼 클릭 시 실행되는 함수
function registerPost() {
  var title = document.getElementById('postTitle').value;
  var categoryId = parseInt(document.getElementById("categorySelect").value);
  var content = quill.root.innerHTML;
  // var encodedContent = encodeBase64UrlSafe(unescape(encodeURIComponent(content)));
  // 여기서 서버로 데이터를 전송하거나 필요한 작업을 수행합니다.
  // console.log('title:', title);
  // console.log("categoryId:", categoryId);
  // console.log("content:", content);

  fetch('/api/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 다른 필요한 헤더가 있다면 여기에 추가
    },
    body: JSON.stringify({
      categoryId: categoryId,
      title: title,
      content: content
    }),
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}

// Quill 툴바에 이미지 업로드 버튼 추가
quill.getModule("toolbar").addHandler("image", function () {
  triggerImageUpload();
});