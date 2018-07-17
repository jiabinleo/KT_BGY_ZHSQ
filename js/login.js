$(function() {
  var tokens = "";
  var loginPage = {
    init: function() {
      loginPage.listening();
    },
    listening: function() {
      $(".username").on("focus", function() {
        $("#usernameimg").attr("src", "./img/un.png");
        $("#unP").css({ "border-bottom": "solid 1px #1ea0e3" });
      });
      $(".username").on("blur", function() {
        $("#usernameimg").attr("src", "./img/un-hide.png");
        $("#unP").css({ "border-bottom": "solid 1px #D7D5D7" });
      });
      $(".password").on("focus", function() {
        $("#passwordimg").attr("src", "./img/uppw.png");
        $("#pwP").css({ "border-bottom": "solid 1px #1ea0e3" });
      });
      $(".password").on("blur", function() {
        $("#passwordimg").attr("src", "./img/uppw-hide.png");
        $("#pwP").css({ "border-bottom": "solid 1px #D7D5D7" });
      });
      var flag = true;

      $("#pwhide")
        .mousedown(function() {
          $(this).attr("src", "./img/pw.png");
          $(".password").attr("type", "text");
        })
        .mouseup(function() {
          $(this).attr("src", "./img/pw-hide.png");
          $(".password").attr("type", "password");
        });

      $(document).keyup(function(event) {
        if (event.keyCode == 13) {
          $("#sub").trigger("click");
        }
      });

      $("#sub").on("click", function() {
        var username = $.trim($("input[name='username']").val());
        var password = hex_md5($.trim($("input[name='password']").val()));
        if (username == "" && $.trim($("input[name='password']").val()) == "") {
          $("#login_prompt").html("用户名和密码不能为空");
        } else if (username == "") {
          $("#login_prompt").html("用户名不能为空");
        } else if ($.trim($("input[name='password']").val()) == "") {
          $("#login_prompt").html("密码不能为空");
        } else {
          $.ajax({
            url: localhost + "/system/login",
            type: "POST",
            data: { account: username, password: password },
            success: function(data) {
              if (data.success === "0") {
                sessionStorage.setItem(
                  "userName",
                  JSON.stringify(data.result.user.userName)
                );
                sessionStorage.setItem(
                  "imgUrl",
                  JSON.stringify(data.result.user.imgUrl)
                );
                sessionStorage.setItem("account", JSON.stringify(username));
                sessionStorage.setItem(
                  "my_token",
                  JSON.stringify(data.result.token)
                );
                window.open("index.html", "_self");
                console.log(data.result.user.imgUrl);
              } else {
                $("#login_prompt").html("用户名或密码错误");
              }
            },
            error: function(err) {}
          });
        }
      });
    }
  };
  loginPage.init();
});
