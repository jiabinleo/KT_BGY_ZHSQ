$(function() {
  var my_token = JSON.parse(sessionStorage.getItem("my_token")),
    seach1 = "", //查询条件
    seach2 = "",
    seach3 = "",
    seach4 = "",
    delKey, //删除关键字
    userImg = "";
  var personnel = {
    init: function() {
      personnel.listent();
    },
    listent: function() {
      // 项目名称
      $.ajax({
        url: localhost + "/system/getSysDictionary?code=PROJECT",
        type: "get",
        beforeSend: function(xhr) {
          xhr.setRequestHeader("login_token", my_token);
        },
        success: function(data) {
          if (data.success === "0") {
            personnel.selepro(data.result);
            personnel.projectNameList(data.result);
          }
        },
        error: function(err) {}
      });
      //部门
      $.ajax({
        url: localhost + "/dept/getDeptAll",
        type: "get",
        beforeSend: function(xhr) {
          xhr.setRequestHeader("login_token", my_token);
        },
        success: function(data) {
          if (data.success === "0") {
            personnel.querydept(data.result);
          }
        },
        error: function(err) {}
      });

      personnel.fenyenum();
      //表单筛选
      personnel.querybd(seach1, seach2, seach3, seach4, pageNum, pageSize);

      $("#seach").on("click", function() {
        seach1 = $(".projectName option:selected").val();
        seach2 = $(".depart option:selected").val();
        seach3 = $(".position option:selected").val();
        seach4 = $(".sbname").val();
        personnel.fenyenum();
        personnel.querybd(seach1, seach2, seach3, seach4, pageNum, pageSize);
      });
      //新增
      $("#newAdd").on("click", function() {
        $("#tan_wrap").show();
        $("#basic_add").show();

        $.ajax({
          url: localhost + "/dept/getDeptByParentId",
          type: "get",
          beforeSend: function(xhr) {
            xhr.setRequestHeader("login_token", my_token);
          },
          success: function(data) {
            if (data.success === "0") {
              personnel.department(data.result);
            }
          },
          error: function(err) {}
        });

        $("#per_department").change(function() {
          var parentId = $(".per_department option:selected").attr("value")
            ? $(".per_department option:selected").attr("value")
            : 999;
          $.ajax({
            url: localhost + "/dept/getDeptByParentId",
            type: "POST",
            beforeSend: function(xhr) {
              xhr.setRequestHeader("login_token", my_token);
            },
            data: {
              parentId: parentId
            },
            success: function(data) {
              if (data.success === "0") {
                personnel.position(data.result);
              }
            },
            error: function(err) {}
          });
        });
        //角色选择
        $.ajax({
          url: localhost + "/role/getList",
          type: "get",
          beforeSend: function(xhr) {
            xhr.setRequestHeader("login_token", my_token);
          },
          success: function(data) {
            if (data.success === "0") {
              personnel.role(data.result);
            }
          },
          error: function(err) {}
        });
      });
      $("#basic_add_yes").on("click", function() {
        var per_user = $("#per_user").val();
        var per_pass = hex_md5($("#per_pass").val());
        var per_name = $("#per_name").val();
        var per_tel = $("#per_tel").val();
        var projectNameList = "";
        var per_department = $("#per_department option:selected").val();
        var per_position = $("#per_position option:selected").val();
        var per_part = $("#per_part option:selected").val();
        ///
        var pro = $("#projectNameList").find("input[name='pro']");
        for (var i = 0; i < pro.length; i++) {
          if (pro.eq(i).prop("checked") === true) {
            projectNameList += pro.eq(i).attr("key") + ",";
          }
        }

        $.ajax({
          dataType: "json",
          url: localhost + "/user/add",
          type: "POST",
          data: {
            account: per_user,
            password: per_pass,
            projectCodeList: projectNameList,
            userName: per_name,
            telephone: per_tel,
            departmentId: per_department,
            positionId: per_position,
            roleId: per_part
          },
          beforeSend: function(xhr) {
            xhr.setRequestHeader("login_token", my_token);
          },
          success: function(data) {
            $("#tan_yes").html(data.msg);
            $("#basic_add").hide();
            $("#tan_yes").show();
            personnel.fenyenum();
            personnel.querybd(
              seach1,
              seach2,
              seach3,
              seach4,
              pageNum,
              pageSize
            );
            personnel.activeColor(pageNum);
            //添加成功后清除所填写的记录
            $("#per_user").val("");
            $("#per_pass").val("");
            $("#per_name").val("");
            $("#per_tel").val("");
            $("#manufacturerAdd").val("");
            $("#makeTimeAdd").val("");
            $("#useTimeAdd").val("");
            setTimeout(function() {
              $("#tan_yes").hide();
              $("#tan_wrap").hide();
            }, 2000);
          },
          error: function(err) {}
        });
      });
      $("#basic_add_no").on("click", function() {
        $("#tan_wrap").hide();
        $("#basic_add").hide();
      });
      // 修改
      $(document).on("click", ".mod", function() {
        delKey = $(
          $(this)
            .parent()
            .parent()[0]
        ).attr("key");
        userImg = $(
          $(this)
            .parent()
            .parent()[0]
        ).attr("img");
        var spans = $(
          $(this)
            .parent()
            .parent()[0]
        ).find("span");
        //部门
        $.ajax({
          url: localhost + "/dept/getDeptByParentId",
          type: "get",
          async: false,
          beforeSend: function(xhr) {
            xhr.setRequestHeader("login_token", my_token);
          },
          success: function(data) {
            if (data.success === "0") {
              personnel.department(data.result);
            }
          },
          error: function(err) {}
        });
        //职位
        $("#mod_department").change(function() {
          var parentId = $(".mod_department option:selected").attr("value")
            ? $(".mod_department option:selected").attr("value")
            : 1;
          $.ajax({
            url: localhost + "/dept/getDeptByParentId",
            type: "POST",
            async: false,
            beforeSend: function(xhr) {
              xhr.setRequestHeader("login_token", my_token);
            },
            data: {
              parentId: parentId
            },
            success: function(data) {
              if (data.success === "0") {
                personnel.position(data.result);
              }
            },
            error: function(err) {}
          });
        });
        $("#mod_department option[value='" + $(spans[4]).attr("key") + "']")
          .attr("selected", "selected")
          .siblings()
          .removeAttr("selected");
        var parentId = $(".mod_department option:selected").attr("value")
          ? $(".mod_department option:selected").attr("value")
          : 999;
        $.ajax({
          url: localhost + "/dept/getDeptByParentId",
          type: "POST",
          async: false,
          beforeSend: function(xhr) {
            xhr.setRequestHeader("login_token", my_token);
          },
          data: {
            parentId: parentId
          },
          success: function(data) {
            if (data.success === "0") {
              personnel.position(data.result);
            }
          },
          error: function(err) {}
        });

        $("#mod_position option[value='" + $(spans[5]).attr("key") + "']")
          .attr("selected", "selected")
          .siblings()
          .removeAttr("selected");

        //角色
        $.ajax({
          url: localhost + "/role/getList",
          type: "get",
          async: false,
          beforeSend: function(xhr) {
            xhr.setRequestHeader("login_token", my_token);
          },
          success: function(data) {
            if (data.success === "0") {
              personnel.role(data.result);
            }
          },
          error: function(err) {}
        });
        $("#mod_part option[value='" + $(spans[6]).attr("key") + "']")
          .attr("selected", "selected")
          .siblings()
          .removeAttr("selected");

        var projectCodeListArr = $(spans[1])
          .attr("key")
          .split(",");
        var projectNames = $("#mod_projectNameList").find("input");
        for (var i = 0; i < projectNames.length; i++) {
          if (
            $.inArray($(projectNames[i]).attr("key"), projectCodeListArr) >= 0
          ) {
            $(projectNames[i]).attr("checked", "checked");
          } else {
            $(projectNames[i]).removeAttr("checked");
          }
        }

        $("#tan_wrap").show();
        $("#basic_mod").show();
        $("#mod_name").val(
          $(spans[2]).html() == "&nbsp;" ? "" : $(spans[2]).html()
        );
        $("#mod_tel").val(
          $(spans[3]).html() == "&nbsp;" ? "" : $(spans[3]).html()
        );
      });
      $("#basic_mod_yes").on("click", function() {
        $("#tan_wrap").hide();
        $("#basic_mod").hide();
        var userName = $("#mod_name").val(),
          telephone = $("#mod_tel").val(),
          departmentId = $("#mod_department option:selected").val(),
          positionId = $("#mod_position option:selected").val(),
          roleId = $("#mod_part option:selected").val();

        var projectNames = $("#mod_projectNameList").find("input");
        var xzprojectNames = "";
        for (var i = 0; i < projectNames.length; i++) {
          if (projectNames[i].checked) {
            xzprojectNames += projectNames.eq(i).attr("key") + ",";
          }
        }
        xzprojectNames = xzprojectNames.substring(0, xzprojectNames.length - 1);
        $.ajax({
          url: localhost + "/user/update",
          type: "POST",
          data: {
            id: delKey,
            userName: userName,
            telephone: telephone,
            departmentId: departmentId,
            positionId: positionId,
            roleId: roleId,
            projectCodeList: xzprojectNames,
            imgUrl: userImg
          },
          beforeSend: function(xhr) {
            xhr.setRequestHeader("login_token", my_token);
          },
          success: function(data) {
            personnel.querybd(
              seach1,
              seach2,
              seach3,
              seach4,
              pageNum,
              pageSize
            );
            personnel.activeColor(pageNum);
          },
          error: function(err) {}
        });
      });
      $("#basic_mod_no").on("click", function() {
        $("#tan_wrap").hide();
        $("#basic_mod").hide();
      });
      //删除
      $(document).on("click", ".del", function() {
        $("#tan_wrap").show();
        $("#basic_del").show();
        delKey = $(
          $(this)
            .parent()
            .parent()[0]
        ).attr("key");
      });
      $("#basic_del_yes").on("click", function() {
        $("#basic_del").hide();
        $.ajax({
          url: localhost + "/user/deleteByIds",
          type: "POST",
          data: { ids: delKey },
          beforeSend: function(xhr) {
            xhr.setRequestHeader("login_token", my_token);
          },
          success: function(data) {
            if (delKey == "") {
              $("#tan_yes").html("操作失败！");
            } else {
              $("#tan_yes").html(data.msg);
            }

            $("#basic_del").hide();
            $("#tan_yes").show();
            personnel.fenyenum();
            personnel.querybd(
              seach1,
              seach2,
              seach3,
              seach4,
              pageNum,
              pageSize
            );
            personnel.activeColor(pageNum);
            setTimeout(function() {
              $("#tan_yes").hide();
              $("#tan_wrap").hide();
            }, 2000);
          },
          error: function(err) {}
        });
      });
      $("#basic_del_no").on("click", function() {
        $("#tan_wrap").hide();
        $("#basic_del").hide();
      });
      //批量删除
      $("#title_checkbox").on("click", function() {
        if (this.checked) {
          $("[name=xz]").prop("checked", true);
        } else {
          $("[name=xz]").prop("checked", false);
        }
      });
      $("[name=xz]").on("click", function() {
        var size = $("#tableContent > li").length;
        var chk = 0;
        $("[name=xz]").each(function() {
          if ($(this).prop("checked") == true) {
            chk++;
          }
        });
        if (size == chk) {
          $("#title_checkbox").prop("checked", true);
        } else {
          $("#title_checkbox").prop("checked", false);
        }
      });
      $("#delall").on("click", function() {
        var size = $("#tableContent > li").length;

        $("#tan_wrap").show();
        $("#basic_del").show();
        var delId = "";
        for (var i = 0; i < $("#tableContent").find("li").length; i++) {
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
      // 分页
      $("#pageIndex").on("click", "a", function() {
        pageNum = $(this).attr("data-id");
        personnel.querybd(seach1, seach2, seach3, seach4, pageNum, pageSize);
        personnel.activeColor(pageNum);
      });
      //首页
      $("#basic_first").on("click", function() {
        pageNum = $(this).attr("key");
        personnel.querybd(seach1, seach2, seach3, seach4, pageNum, pageSize);
        personnel.activeColor(pageNum);
      });
      //末页
      $("#basic_end").on("click", function() {
        $(this).attr("key", pageSum);
        pageNum = Math.ceil(pageSum / pageSize);
        personnel.querybd(seach1, seach2, seach3, seach4, pageNum, pageSize);
        personnel.activeColor(pageNum);
      });
      //上一页
      $("#basic_prev").on("click", function() {
        if (pageNum > 1) {
          pageNum--;
          personnel.querybd(seach1, seach2, seach3, seach4, pageNum, pageSize);
          personnel.activeColor(pageNum);
        }
      });
      //下一页
      $("#basic_next").on("click", function() {
        if (pageNum < Math.ceil(pageSum / pageSize)) {
          pageNum++;
          personnel.querybd(seach1, seach2, seach3, seach4, pageNum, pageSize);
          personnel.activeColor(pageNum);
        }
      });
      //导出
      $("#exportExcel").on("click", function() {
        window.open(localhost + "/user/exportExcel");
      });
    },
    // 获取分页数量
    fenyenum: function() {
      $.ajax({
        dataType: "json",
        url: localhost + "/user/getPage",
        type: "POST",
        async: false,
        data: {
          projectCode: seach1,
          type: seach2,
          name: seach3,
          pageNum: pageNum,
          pageSize: pageSize
        },
        beforeSend: function(xhr) {
          xhr.setRequestHeader("login_token", my_token);
        },
        success: function(data) {
          if (data.success === "0") {
            pageSum = data.result.total;
            personnel.fenye(pageSum);
            personnel.activeColor(pageNum);
          }
        },
        error: function(err) {}
      });
    },
    querybd: function(seach1, seach2, seach3, seach4, pageNum, pageSize) {
      $.ajax({
        dataType: "json",
        url: localhost + "/user/getPage",
        type: "POST",
        async: false,
        data: {
          projectCode: seach1,
          departmentId: seach2,
          positionId: seach3,
          userName: seach4,
          pageNum: pageNum,
          pageSize: pageSize
        },
        beforeSend: function(xhr) {
          xhr.setRequestHeader("login_token", my_token);
        },
        success: function(data, header) {
          if (data.success === "0") {
            pageSum = data.result.total;
            personnel.fenye(pageSum);
            personnel.querydata(data.result.rows);
          }
        },
        error: function(err) {}
      });
    },
    querydata: function(data) {
      var lidata = "";
      for (var i = 0; i < data.length; i++) {
        lidata +=
          "<li key=" +
          data[i].id +
          " img=" +
          data[i].imgUrl +
          ">" +
          '<span><input type="checkbox" name="xz">' +
          (i + 1) +
          "</span>" +
          "<span key=" +
          data[i].projectCodeList +
          ">" +
          (data[i].projectNameList ? data[i].projectNameList : "&nbsp") +
          "</span>" +
          "<span key=" +
          data[i].type +
          ">" +
          (data[i].userName ? data[i].userName : "&nbsp") +
          "</span>" +
          "<span>" +
          (data[i].telephone ? data[i].telephone : "&nbsp") +
          "</span>" +
          "<span key=" +
          data[i].departmentId +
          ">" +
          (data[i].departmentName ? data[i].departmentName : "&nbsp") +
          "</span>" +
          "<span key=" +
          data[i].positionId +
          ">" +
          (data[i].positionName ? data[i].positionName : "&nbsp") +
          "</span>" +
          "<span key=" +
          data[i].roleId +
          ">" +
          (data[i].roleName ? data[i].roleName : "&nbsp") +
          "</span>" +
          '<span><a class="mod">修改</a><a class="del">删除</a></span>' +
          "</li>";
      }
      $("#tableContent").html(lidata);
    },
    querydept: function(data) {
      for (var i = data.length - 1; i >= 0; i--) {
        $(".depart").prepend(
          '<option value="' + data[i].id + '">' + data[i].deptName + "</option>"
        );
      }
      $(".depart").prepend(
        '<option value="" selected = "selected">全部部门</option>'
      );
      $(".position").prepend(
        '<option value="" selected = "selected">全部岗位</option>'
      );
      $(".depart").change(function() {
        $(".position").html("");
        var departVal = $(".depart option:selected").val();
        if (departVal) {
          for (var i = data[departVal - 1].children.length - 1; i >= 0; i--) {
            $(".position").prepend(
              '<option value="' +
                data[departVal - 1].children[i].id +
                '">' +
                data[departVal - 1].children[i].deptName +
                "</option>"
            );
          }
        }
        $(".position").prepend(
          '<option value="" selected = "selected">全部岗位</option>'
        );
      });
    },
    selepro: function(data) {
      for (var i = data.length - 1; i >= 0; i--) {
        $(".projectName").prepend(
          '<option value="' + data[i].key + '">' + data[i].value + "</option>"
        );
      }
      $(".projectName").prepend(
        '<option value="" selected = "selected">全部项目</option>'
      );
    },
    //新增-部门列表
    department: function(data) {
      $(".per_department").html("");
      $(".mod_department").html("");
      for (var i = data.length - 1; i >= 0; i--) {
        $(".per_department").prepend(
          '<option value="' + data[i].id + '">' + data[i].deptName + "</option>"
        );
        $(".mod_department").prepend(
          '<option value="' + data[i].id + '">' + data[i].deptName + "</option>"
        );
      }
      $(".per_department").prepend(
        '<option value="" selected = "selected">请选择部门</option>'
      );
      $(".mod_department").prepend(
        '<option value="" selected = "selected">请选择部门</option>'
      );
    },
    //新增-职位列表
    position: function(data) {
      $(".per_position").html("");
      $(".mod_position").html("");
      for (var i = data.length - 1; i >= 0; i--) {
        $(".per_position").prepend(
          '<option value="' + data[i].id + '">' + data[i].deptName + "</option>"
        );
        $(".mod_position").prepend(
          '<option value="' + data[i].id + '">' + data[i].deptName + "</option>"
        );
      }
      $(".per_position").prepend(
        '<option value="" selected = "selected">请选择职位</option>'
      );
      $(".per_position").removeAttr("disabled");
      $(".mod_position").prepend(
        '<option value="" selected = "selected">请选择职位</option>'
      );
      // $(".mod_position").removeAttr("disabled");
    },
    //新增-角色列表
    role: function(data) {
      $(".per_part").html("");
      $(".mod_part").html("");
      for (var i = data.length - 1; i >= 0; i--) {
        $(".per_part").prepend(
          '<option value="' + data[i].id + '">' + data[i].roleName + "</option>"
        );
        $(".mod_part").prepend(
          '<option value="' + data[i].id + '">' + data[i].roleName + "</option>"
        );
      }
      $(".per_part").prepend(
        '<option value="" selected = "selected">请选择角色</option>'
      );
      $(".mod_part").prepend(
        '<option value="" selected = "selected">请选择角色</option>'
      );
    },
    seleequi: function(data) {
      for (var i = data.length - 1; i >= 0; i--) {
        $(".equi").prepend(
          '<option value="' + data[i].key + '">' + data[i].value + "</option>"
        );
        $(".updaequi").prepend(
          '<option value="' + data[i].key + '">' + data[i].value + "</option>"
        );
        $(".typeAdd").prepend(
          '<option value="' + data[i].key + '">' + data[i].value + "</option>"
        );
      }
      $(".equi").prepend(
        '<option value="" selected = "selected">全部系统</option>'
      );
    },
    fenye: function(pageSum) {
      // 分页按钮
      var alis = "";
      for (var i = 0; i < Math.ceil(pageSum / pageSize); i++) {
        alis +=
          "<a class=a" +
          (i + 1) +
          " data-id=" +
          (i + 1) +
          ">" +
          (i + 1) +
          "</a>";
      }
      $("#pageIndex").html(alis);
    },
    activeColor: function(pages) {
      $(".a" + pages)
        .css({
          background:
            "-webkit-linear-gradient(90deg, #1ea0e3, #32b5ee, #35bcf0)",
          color: "white"
        })
        .siblings()
        .css({
          background: "#ffffff",
          color: "#666666"
        });
    },
    projectNameList: function(data) {
      var projectName = "";
      for (var i = 0; i < data.length; i++) {
        projectName += 
          '<input type="checkbox" name="pro" key="'+
          data[i].key+
          '" name="" id=""><label>'+
          data[i].value+
          '</label>';
      }
      $("#projectNameList").html(projectName);
      $("#mod_projectNameList").html(projectName);
    }
  };
  personnel.init();
});
