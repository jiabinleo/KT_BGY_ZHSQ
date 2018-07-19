$(function() {
  var my_token = JSON.parse(sessionStorage.getItem("my_token"));
  var account = JSON.parse(sessionStorage.getItem("account"));
  var userName = JSON.parse(sessionStorage.getItem("userName"));
  var imgUrl = JSON.parse(sessionStorage.getItem("imgUrl"));
  var menuNull;
  var indexTop = 0;
  var jsonData;
  if (my_token == null) {
    window.open("login.html", "_self");
  }
  var indexPage = {
    inits: function() {
      var MenuView = "";
      $("#userName").html(userName);
      indexPage.listen();
    },
    listen: function() {
      $("#imgUrl").attr("src", localhost + "/file/getImg?" + imgUrl);
      $.ajax({
        url: localhost + "/menu/getMenuView",
        type: "get",
        beforeSend: function(xhr) {
          xhr.setRequestHeader("login_token", my_token);
        },
        success: function(data) {
          if (data.success === "0") {
            jsonData = data;
            indexPage.initLeftPage(data);
            indexPage.queryData(data);
          }
        },
        error: function(err) {}
      });
      $("#menuUl").on("click", "li", function() {
        $(this)
          .addClass("clickActive")
          .siblings()
          .removeClass("clickActive");
      });
      $("#logins").on("click", function(e) {
        if (e && e.stopPropagation) {
          //W3C取消冒泡事件
          e.stopPropagation();
        } else {
          //IE取消冒泡事件
          window.event.cancelBubble = true;
        }
        if ($("#login-tan").css("display") == "none") {
          $("#login-arr").css(indexPage.rotates(90));
          $("#login-tan").show();
        } else if ($("#login-tan").css("display") == "block") {
          $("#login-arr").css(indexPage.rotates(0));
          $("#login-tan").hide();
        }
      });
      $(document).on("click", function() {
        $("#login-arr").css(indexPage.rotates(0));
        $("#login-tan").hide();
      });
      $(document).on("click", "iframe", function() {
        $("#login-arr").css(indexPage.rotates(0));
        $("#login-tan").hide();
      });
      $("#tuichu").on("click", function() {
        window.open("login.html", "_self");
      });
      //左侧菜单
      $(document).on("click", ".top", function(e) {
        if (
          $(this)
            .parent()
            .find(".lisinnerul")
            .css("display") == "none"
        ) {
          $(this)
            .parent()
            .find(".lisinnerul")
            .show();
          $(this)
            .removeClass("arra")
            .addClass("arrb");
          $(this)
            .parent()
            .siblings()
            .find(".lisinnerul")
            .hide();
          $(this)
            .parent()
            .siblings()
            .find("span")
            .removeClass("arrb")
            .addClass("arra");
        } else {
          $(this)
            .parent()
            .find(".lisinnerul")
            .hide();
          $(this)
            .removeClass("arrb")
            .addClass("arra");
          $(this)
            .parent()
            .siblings()
            .find("span")
            .removeClass("arrb")
            .addClass("arra");
        }
        if ($(this).attr("url") != "null") {
          indexPage.loadIframe($(this).attr("url"));
        }
        var list_inner_content =
          jsonData.result[indexTop].children[
            $(this)
              .parent()
              .index()
          ].children;
        var list_inner = "";
        for (let i = 0; i < list_inner_content.length; i++) {
          list_inner +=
            "<li class='lisinnerulLis' data-id=" +
            list_inner_content[i].nemuUrl +
            ">" +
            list_inner_content[i].menuName +
            "</li>";
        }
        $(this)
          .parent()
          .find("ul")
          .html(list_inner);
      });
      //点击显示右侧iframe
      $(document).on("click", ".lisinnerulLis", function() {
        indexPage.loadIframe($(this).attr("data-id"));
      });
      //修改密码
      $("#updatePassword").on("click", function(e) {
        if (e && e.stopPropagation) {
          //W3C取消冒泡事件
          e.stopPropagation();
        } else {
          //IE取消冒泡事件
          window.event.cancelBubble = true;
        }
        $("#newpws").html("");
        $("#tan_wrap").show();
        $("#tan_inner").show();
      });
      $("#queding").on("click", function() {
        if ($("#newp").val() === $("#newsp").val()) {
          var newPwd = hex_md5($.trim($("#newp").val()));
          var oldPwd = hex_md5($.trim($("#oldPwd").val()));
          $.ajax({
            url: localhost + "/user/updatePassword",
            type: "POST",
            beforeSend: function(xhr) {
              xhr.setRequestHeader("login_token", my_token);
            },
            data: {
              account: account,
              newPwd: newPwd,
              oldPwd: oldPwd
            },
            success: function(data) {
              if (data.success == "1") {
                $("#tan-yes").html(data.msg);
              } else if (data.success == "0") {
                $("#tan-yes").html("密码修改成功");
              }
              $("#oldPwd").val("");
              $("#newp").val("");
              $("#newsp").val("");
              $("#tan-yes").show();
              $("#tan_inner").hide();
              setTimeout(function() {
                $("#tan-yes").hide();
                $("#tan_wrap").hide();
              }, 2000);
            },
            error: function(err) {}
          });
        } else {
          $("#newpws").html("两次密码不一致!!!");
        }
      });
      $("#quxiao").on("click", function(e) {
        if (e && e.stopPropagation) {
          //W3C取消冒泡事件
          e.stopPropagation();
        } else {
          //IE取消冒泡事件
          window.event.cancelBubble = true;
        }
        $("#tan_wrap").hide();
        $("#tan_inner").hide();
        $("#oldPwd").val("");
        $("#newp").val("");
        $("#newsp").val("");
      });
    },
    rotates: function(deg) {
      return {
        transform: "rotate(" + deg + "deg)",
        "-ms-transform": "rotate(" + deg + "deg)",
        "-moz-transform": "rotate(" + deg + "deg)" /* Firefox */,
        "-webkit-transform": "rotate(" + deg + "deg)" /* Safari 和 Chrome */,
        "-o-transform": "rotate(" + deg + "deg)" /* Opera */
      };
    },
    loadIframe: function(src) {
      var iframepage =
        '<iframe style="" id="ifPage" src="./view' + src + '" ></iframe>';
      setTimeout(function() {
        $("#page_wrap").html(iframepage);
      });
    },

    initLeftPage: function(data) {
      var childrenList = "";
      for (let i = 0; i < data.result[indexTop].children.length; i++) {
        childrenList +=
          "<li><span url=" +
          data.result[indexTop].children[i].nemuUrl +
          "  class='top arra'>" +
          data.result[indexTop].children[i].menuName +
          "</span><ul class='lisinnerul'></ul></li>";
      }
      $("#wrap_left").html(childrenList);
    },
    queryData: function(data) {
      //头部列表
      var top_list = "";
      for (let i = 0; i < data.result.length; i++) {
        top_list +=
          "<li class='menuUllist'>" + data.result[i].menuName + "</li>";
      }
      $("#menuUl").html(top_list);
      $("#menuUl")
        .find("li")
        .eq(0)
        .addClass("clickActive");
      //左侧默认显示
      $(document).on("click", ".menuUllist", function() {
        indexTop = $(this).index();
        menuNull = data.result[indexTop].children[0].children;
        var childrenList = "";
        for (let i = 0; i < data.result[indexTop].children.length; i++) {
          childrenList +=
            "<li><span url=" +
            data.result[indexTop].children[i].nemuUrl +
            " class='top arra'>" +
            data.result[indexTop].children[i].menuName +
            "</span><ul class='lisinnerul'></ul></li>";
        }
        $("#wrap_left").html(childrenList);
      });
      //右侧默认显示页面
      $("#page_wrap").html(
        `<iframe style="" id="ifPage" src="./view${
          data.result[0].children[0].children[0].nemuUrl
        }" ></iframe>`
      );
    }
  };
  indexPage.inits();
});
