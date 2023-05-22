//  static/script.js

$(function () {
  $("#record-btn").on("click", function () {
    $("#record-btn").text("recording...");
    $.get("/speech_to_text", function (data) {
      $("#result").text(data);
      $.post("/get_openai_response", { text: data }, function (data) {
        $("#response").text(data);
        $("#record-btn").text("음성 입력");
      }).fail(function() {
        console.log("Error: failed to send request to server.");
      });
    }).fail(function() {
      console.log("Error: failed to send request to server.");
    });
  });

  $("#category-select").on("change", function () {
    var selectedCategory = $(this).val();
    var newUrl = window.location.href.replace(
      /(category=)[^&]+/,
      "$1" + selectedCategory,
    );
    if (newUrl.indexOf("?") === -1) {
      newUrl += "?category=" + selectedCategory;
    }
    window.location.href = newUrl;
  });
});


// function sendReady() {
//   console.log('script.js: sendReady() called');

//   $.ajax({
//     url: '/send_ready',
//     type: 'POST',
//     success: function(data) {
//       console.log('Ready signal sent');
//     },
//     error: function(jqXHR, textStatus, errorThrown) {
//       console.log('Error sending ready signal');
//     }
//   });
// }


// $(function () {
//   var isReady = false;
//   // 음성 입력 버튼 클릭 시
//   $("#record-btn").on("click", function () {
    
//     $("#status-p").text("인식 준비중");
//     // 버튼 텍스트 변경
//     $("#record-btn").text("recording...");

//     // 서버로 GET 요청 보냄
//     $.get("/speech_to_text", function (data) {
//       //TODO: status-p 레이블을 파이썬에서 음성인식 전에 준비 완료로 변경
//       $.get("/send_ready", function (isReady) {
//         if (isReady == "ready"){
//           $("#status-p").text("준비 완료");
//         }
//       });

//       // 인식된 텍스트 표시
//       $("#result").text(data);
//       // OpenAI GPT-3 요청 보냄
//       $.post("/get_openai_response", { text: data }, function (data) {
//         // OpenAI GPT-3의 응답 표시
//         $("#response").text(data);
//         // 버튼 텍스트 원래대로 변경
//         $("#record-btn").text("음성 입력");
//       });
//     });
//   });
// });

// $("#category-select").on("change", function () {
//   var selectedCategory = $(this).val();
//   var newUrl = window.location.href.replace(
//     /(category=)[^&]+/,
//     "$1" + selectedCategory,
//   );
//   if (newUrl.indexOf("?") === -1) {
//     newUrl += "?category=" + selectedCategory;
//   }
//   window.location.href = newUrl;
// });
