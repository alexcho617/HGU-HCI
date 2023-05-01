//  static/script.js
$(function () {
  // 음성 입력 버튼 클릭 시
  $("#record-btn").on("click", function () {
    // 버튼 텍스트 변경
    $("#record-btn").text("recording...");
    // 서버로 GET 요청 보냄
    $.get("/speech_to_text", function (data) {
      // 인식된 텍스트 표시
      $("#result").text(data);
      // OpenAI GPT-3 요청 보냄
      $.post("/get_openai_response", { text: data }, function (data) {
        // OpenAI GPT-3의 응답 표시
        $("#response").text(data);
        // 버튼 텍스트 원래대로 변경
        $("#record-btn").text("음성 입력");
      });
    });
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

// $('#category-select').on('change', function() {
//   var selectedCategory = $(this).val();
//   $.ajax({
//     url: '/set_category',
//     data: {'category': selectedCategory},
//     method: 'POST'
//   });
// });

// $('#record-btn').on('click', function () {
//   var selectedCategory = $('#category-select').val();
//   var spokenInput = ... // Retrieve the user's spoken input
// $.ajax({
//   url: '/get_response',
//   data: { 'category': selectedCategory, 'input': spokenInput },
//   method: 'POST',
//   success: function (response) {
//     $('#response').text(response);
//     // Output the response to speech
//   }
// });
// });
