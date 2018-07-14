$(() => {
  var my_token = JSON.parse(sessionStorage.getItem("my_token")),
    delKey, //删除关键字
    menuListOk = []; //原有的权限
  var permission = {
    init: () => {
      permission.listent();
    },
    listent: () => {
      //表单筛选
      permission.querybd();
      //新增
      $("#newAdd").on("click", function() {
        $("#tan_wrap").show();
        $("#basic_add").show();
      });
      $("#basic_add_yes").on("click", function() {
        var roleName = $("#basicAddName").val();
        var menus = "";
        $.ajax({
          dataType: "json",
          url: localhost + "/role/add",
          type: "POST",
          data: {
            roleName: roleName,
            menus: menus
          },
          beforeSend: function(xhr) {
            xhr.setRequestHeader("login_token", my_token);
          },
          success: function(data) {
            permission.querybd();
          },
          error: function(err) {}
        });

        $("#tan_wrap").hide();
        $("#basic_add").hide();
      });
      $("#basic_add_no").on("click", function() {
        $("#tan_wrap").hide();
        $("#basic_add").hide();
      });
      // 修改
      $(document).on("click", ".mod", function() {
        delKey = $($(this).parent().parent()[0]).attr("key");
        $("#roleName").val($(this).parent().parent().find("span").eq(1).html());
        //获取所有菜单
        $.ajax({
          url: localhost + "/menu/getMenuList",
          type: "get",
          async:false,
          beforeSend: function(xhr) {
            xhr.setRequestHeader("login_token", my_token);
          },
          success: function(data) {
            permission.getMenu(data, delKey);
          },
          error: function(err) {}
        });
        $("#tan_wrap").show();
        $("#basic_mod").show();
      });
      $("#basic_mod_yes").on("click", function() {
        $("#tan_wrap").hide();
        $("#basic_mod").hide();

        var roleName = $("#roleName").val();
        var xuanzhong = [];
        $("input[name=cb]").each(function() {
          if ($(this).prop("checked") == true) {
            xuanzhong.push($(this).attr("key"));
          }
        });
        $.unique(xuanzhong.sort());
        var menus = "";
        $.each(xuanzhong, function(n, val) {
          menus += val + ",";
        });

        menus = menus.substring(0, menus.length - 1);
        console.log(menus);
        $.ajax({
          url: localhost + "/role/update",
          type: "POST",
          data: {
            id: delKey,
            roleName: roleName,
            menus: menus
          },
          beforeSend: function(xhr) {
            xhr.setRequestHeader("login_token", my_token);
          },
          success: function(data) {
            permission.querybd();
          },
          error: function(err) {}
        });
      });
      $("#basic_mod_no").on("click", function() {
        $("#tan_wrap").hide();
        $("#basic_mod").hide();
      });
      $("#delall").on("click", function() {
        var size = $("#tableContent > li").length;
        $("#tan_wrap").show();
        $("#basic_del").show();
        var delId = "";
        for (let i = 0; i < $("#tableContent").find("li").length; i++) {
          if (
            $("#tableContent")
              .find($("[name=xz]"))
              .eq(i)
              .prop("checked") === true
          ) {
            delId +=
              $("#tableContent")
                .find($("[name=xz]"))
                .eq(i)
                .parent()
                .parent()
                .attr("key") + ",";
          }
        }
        delId = delId.substring(0, delId.length - 1);
        delKey = delId;
      });
      $("#basic_del_yes").on("click", function() {
        $("#tan_wrap").hide();
        $("#basic_del").hide();
        $.ajax({
          url: localhost + "/role/deleteById",
          type: "POST",
          data: { id: delKey },
          beforeSend: function(xhr) {
            xhr.setRequestHeader("login_token", my_token);
          },
          success: function(data) {
            permission.querybd();
          },
          error: function(err) {}
        });
      });
      $("#basic_del_no").on("click", function() {
        $("#tan_wrap").hide();
        $("#basic_del").hide();
      });
    },
    querybd: function() {
      $.ajax({
        dataType: "json",
        url: localhost + "/role/getList",
        type: "POST",
        async: false,
        beforeSend: function(xhr) {
          xhr.setRequestHeader("login_token", my_token);
        },
        success: function(data) {
          if (data.success === "0") {
            permission.querydata(data.result);
          }
        },
        error: function(err) {}
      });
    },
    querydata: function(data) {
      let lidata = "";
      for (let i = 0; i < data.length; i++) {
        lidata +=
          "<li key=" +
          data[i].id +
          ">" +
          '<span><input type="radio" name="xz">' +
          (i + 1) +
          "</span>" +
          "<span key=" +
          data[i].id +
          ">" +
          (data[i].roleName ? data[i].roleName : "&nbsp") +
          "</span>" +
          (data[i].description ? data[i].description : "&nbsp") +
          "</span>" +
          '<span><a class="mod">修改</a></span>' +
          "</li>";
      }
      $("#tableContent").html(lidata);
    },

    getMenu: function(data, delKey) {
      //项目权限
      console.log(data);
      console.log(delKey);
      $.ajax({
        dataType: "json",
        url: localhost + "/menu/getMenuByRoleId",
        type: "POST",
        async: false,
        beforeSend: function(xhr) {
          xhr.setRequestHeader("login_token", my_token);
        },
        data: {
          roleId: delKey
        },
        success: function(data) {
          console.log("-----------");
          console.log(data);
          console.log("-----------");
          if (data.success === "0") {
            menuListOk = [];
            data = data.result;
            for (let i = 0; i < data.length; i++) {
              menuListOk.push(data[i].id);
              for (let j = 0; j < data[i].children.length; j++) {
                menuListOk.push(data[i].children[j].id);
                for (let k = 0; k < data[i].children[j].children.length; k++) {
                  menuListOk.push(data[i].children[j].children[k].id);
                }
              }
            }
          }
          $.unique(menuListOk.sort());
          console.log("原有的权限");
          console.log(menuListOk);
        },
        error: function(err) {}
      });
      //第一级菜单
      var menuleve = "";
      for (let i = 0; i < data.length; i++) {
        var check = "";
        if ($.inArray(parseInt(data[i].id), menuListOk) > -1) {
          check = "checked";
        }
        menuleve += `<li class="menuLists-li">
          <div class="menuLists-div"><input class="leve1" ${check} name="cb" key=${
          data[i].id
        } type="checkbox"/><span class="title1" id=${data[i].id}>${
          data[i].menuName
        }</span></div><ul style="padding-left:30px;display: none" class="ul1 menuleve1${i}"></ul></li>`;
        $(".menuleve2-ul").html("123");
      }
      $(".menuLists-ul").html(menuleve);
      //第二级菜单
      var leve2 = 0;
      for (let i = 0; i < data.length; i++) {
        var menuleve2 = "";
        for (let j = 0; j < data[i].children.length; j++) {
          leve2++;
          var check = "";
          if ($.inArray(parseInt(data[i].children[j].id), menuListOk) > -1) {
            check = "checked";
          }
          menuleve2 += `<li class="menuleve2-li"><div class="menuleve2-div"><input class="leve2" ${check} name="cb" key=${
            data[i].children[j].id
          } type="checkbox"/><span class="title2" id=${
            data[i].children[j].id
          }>${
            data[i].children[j].menuName
          }</span></div><ul style="padding-left:30px;display: none" class="ul2 menuleve2${leve2}"></ul></li>`;
        }
        $(".menuleve1" + i).html(menuleve2);
      }
      //第三级菜单
      var leve3 = 0;
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].children.length; j++) {
          var menuleve3 = "";
          leve3++;
          for (let k = 0; k < data[i].children[j].children.length; k++) {
            var check = "";

            if (
              $.inArray(
                parseInt(data[i].children[j].children[k].id),
                menuListOk
              ) > -1
            ) {
              check = "checked";
            }
            menuleve3 += `<li class="menuleve3-li"><div class="menuleve3-div"><input ${check} name="cb" key=${
              data[i].children[j].children[k].id
            } type="checkbox"/><span class="title2" id=${
              data[i].children[j].children[k].id
            }>${data[i].children[j].children[k].menuName}</span></div></li>`;
          }
          $(".menuleve2" + leve3).html(menuleve3);
        }
      }

      //全选框
      $(document).on("click", "#allCheck", function() {
        if (this.checked) {
          $("[name=cb]").prop("checked", true);
        } else {
          $("[name=cb]").prop("checked", false);
        }
      });
      //不全选
      permission.noCheckAll();
      $(document).on("click", "[name=cb]", function() {
        if (this.checked) {
          $(this).parent().parent().parent().parent().find("input").eq(0).prop("checked", true)
        }
        permission.noCheckAll();
      });
      $(document).on("click", ".leve1", function() {
        if (this.checked) {
          $(this)
            .parent()
            .parent()
            .find("[name=cb]")
            .prop("checked", true);
        } else {
          $(this)
            .parent()
            .parent()
            .find("[name=cb]")
            .prop("checked", false);
        }
        permission.noCheckAll();
      });
      $(document).on("click", ".leve2", function() {
        if (this.checked) {
          $(this)
            .parent()
            .parent()
            .find("[name=cb]")
            .prop("checked", true);
        } else {
          $(this)
            .parent()
            .parent()
            .find("[name=cb]")
            .prop("checked", false);
        }
        permission.noCheckAll();
      });
      //折叠
      $(".title1").on("click", function() {
        $(this).parent().parent().find(".ul1").slideToggle();
      });
      $(".title2").on("click", function() {
        $(this).parent().parent().find(".ul2").slideToggle();
      });
    },
    noCheckAll: function() {
      var size = 0;
      $("[name=cb]").each(function() {
        size++;
      });
      var chk = 0;
      $("[name=cb]").each(function() {
        if ($(this).prop("checked") == true) {
          chk++;
        }
      });
      if (size == chk) {
        $("#allCheck").prop("checked", true);
      } else {
        $("#allCheck").prop("checked", false);
      }
    }
  };
  permission.init();
});
