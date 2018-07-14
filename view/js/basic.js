$(() => {
  var my_token = JSON.parse(sessionStorage.getItem("my_token")),
    seach1 = "", //查询条件
    seach2 = "",
    seach3 = "",
    delKey; //删除关键字
  var basic = {
    init: () => {
      // setTimeout(() => {
        basic.listent();
      // });
    },
    listent: () => {
      // 项目名称
      $.ajax({
        url: localhost + "/system/getSysDictionary?code=PROJECT",
        type: "get",
        beforeSend: function(xhr) {
          xhr.setRequestHeader("login_token", my_token);
        },
        success: function(data) {
          if (data.success === "0") {
            basic.selepro(data.result);
          }
        },
        error: function(err) {
        }
      });

      //laydate
      laydate.render({
        elem: "#makeTimeAdd", //指定元素
        type: "datetime"
      });
      laydate.render({
        elem: "#useTimeAdd",
        type: "datetime"
      });
      // 设备系统
      $.ajax({
        url: localhost + "/system/getSysDictionary?code=EQUIPMENT",
        type: "get",
        beforeSend: function(xhr) {
          xhr.setRequestHeader("login_token", my_token);
        },
        success: function(data) {
          if (data.success === "0") {
            basic.seleequi(data.result);
          }
        },
        error: function(err) {
        }
      });
      basic.fenyenum();
      //表单筛选
      basic.querybd(seach1, seach2, seach3, pageNum, pageSize);

      $("#seach").on("click", function() {
        seach1 = $(".projectName option:selected").val();
        seach2 = $(".equi option:selected").val();
        seach3 = $(".sbname").val();
        basic.fenyenum();
        basic.querybd(seach1, seach2, seach3, pageNum, pageSize);
      });
      //新增
      $("#newAdd").on("click", function() {
        $("#tan_wrap").show();
        $("#basic_add").show();
      });
      $("#basic_add_yes").on("click", function() {
        var projectCodeAdd = $("#projectNameAdd option:selected").val();
        var typeAdd = $("#typeAdd option:selected").val();
        var nameAdd = $("#nameAdd").val();
        var codeAdd = $("#codeAdd").val();
        var idAdd = $("#idAdd").val();
        var manufacturerAdd = $("#manufacturerAdd").val();
        var makeTimeAdd = $("#makeTimeAdd").val();
        var useTimeAdd = $("#useTimeAdd").val();
        $.ajax({
          dataType: "json",
          url: localhost + "/equipmentBase/add",
          type: "POST",
          data: {
            projectCode: projectCodeAdd,
            type: typeAdd,
            name: nameAdd,
            code: codeAdd,
            county: idAdd,
            manufacturer: manufacturerAdd,
            makeTime: makeTimeAdd,
            useTime: useTimeAdd
          },
          beforeSend: function(xhr) {
            xhr.setRequestHeader("login_token", my_token);
          },
          success: function(data) {
            basic.fenyenum();
            basic.querybd(seach1, seach2, seach3, pageNum, pageSize);
          },
          error: function(err) {
          }
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
        delKey = $(
          $(this)
            .parent()
            .parent()[0]
        ).attr("key");
        var spans = $(
          $(this)
            .parent()
            .parent()[0]
        ).find("span");
        $("#updaproName option[value='" + $(spans[1]).attr("key") + "']")
          .attr("selected", "selected")
          .siblings()
          .removeAttr("selected");
        $("#updaequi option[value='" + $(spans[2]).attr("key") + "']")
          .attr("selected", "selected")
          .siblings()
          .removeAttr("selected");
        $("#updateName").val($(spans[3]).html()=="&nbsp;"?"":$(spans[3]).html());
        $("#updatecode").val($(spans[5]).html()=="&nbsp;"?"":$(spans[5]).html());
        $("#updateId").val($(spans[4]).html()=="&nbsp;"?"":$(spans[4]).html());
        $("#updateAddress").val($(spans[6]).html()=="&nbsp;"?"":$(spans[6]).html());
        $("#tan_wrap").show();
        $("#basic_mod").show();
      });
      $("#basic_mod_yes").on("click", function() {
        $("#tan_wrap").hide();
        $("#basic_mod").hide();
        var projectCode = $("#updaproName option:selected").val(),
          updateType = $("#updaequi option:selected").val(),
          updateName = $("#updateName").val(),
          updatemanu = $("#updateId").val(),
          updatecode = $("#updatecode").val(),
          updateAddress = $("#updateAddress").val();
        $.ajax({
          url: localhost + "/equipmentBase/update",
          type: "POST",
          data: {
            id: delKey,
            projectCode: projectCode,
            type: updateType,
            name: updateName,
            manufacturer: updatemanu,
            code: updatecode,
            address: updateAddress
          },
          beforeSend: function(xhr) {
            xhr.setRequestHeader("login_token", my_token);
          },
          success: function(data) {
            basic.querybd(seach1, seach2, seach3, pageNum, pageSize);
          },
          error: function(err) {
          }
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
        $("#tan_wrap").hide();
        $("#basic_del").hide();
        $.ajax({
          url: localhost + "/equipmentBase/deleteById",
          type: "POST",
          data: { id: delKey },
          beforeSend: function(xhr) {
            xhr.setRequestHeader("login_token", my_token);
          },
          success: function(data) {
            basic.fenyenum();
            basic.querybd(seach1, seach2, seach3, pageNum, pageSize);
          },
          error: function(err) {
          }
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
        for (
          let i = 0;
          i <
          $("#tableContent")
            .find("li")
            .length;
          i++
        ) {
          if (
            $("#tableContent")
              .find($("[name=xz]"))
              .eq(i)
              .prop("checked") === true
          ) {
            delId+=($("#tableContent").find($("[name=xz]")).eq(i).parent().parent().attr("key")+","
            );
          }
        }
        delId = delId.substring(0, delId.length - 1);
        delKey = delId;
      });
      // 分页
      $("#pageIndex").on("click", "a", function() {
        pageNum = $(this).attr("data-id");
        basic.activeColor(pageNum);
        basic.querybd(seach1, seach2, seach3, pageNum, pageSize);
      });
      //首页
      $("#basic_first").on("click", function() {
        pageNum = $(this).attr("key");
        basic.activeColor(pageNum);
        basic.querybd(seach1, seach2, seach3, pageNum, pageSize);
      });
      //末页
      $("#basic_end").on("click", function() {
        $(this).attr("key", pageSum);
        pageNum = Math.ceil(pageSum / pageSize);
        basic.activeColor(pageNum);
        basic.querybd(seach1, seach2, seach3, pageNum, pageSize);
      });
      //上一页
      $("#basic_prev").on("click", function() {
        if (pageNum > 1) {
          pageNum--;
          basic.activeColor(pageNum);
          basic.querybd(seach1, seach2, seach3, pageNum, pageSize);
        }
      });
      //下一页
      $("#basic_next").on("click", function() {
        if (pageNum < Math.ceil(pageSum / pageSize)) {
          pageNum++;
          basic.activeColor(pageNum);
          basic.querybd(seach1, seach2, seach3, pageNum, pageSize);
        }
      });
      //导出
      $("#exportExcel").on("click", function() {
        window.open(localhost + "/equipmentBase/exportExcel");
      });
    },
    // 获取分页数量
    fenyenum: function() {
      $.ajax({
        dataType: "json",
        url: localhost + "/equipmentBase/getPage",
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
            basic.fenye(pageSum);
            basic.activeColor(pageNum);
          }
        },
        error: function(err) {
        }
      });
    },
    querybd: function(seach1, seach2, seach3, pageNum, pageSize) {
      $.ajax({
        dataType: "json",
        url: localhost + "/equipmentBase/getPage",
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
        success: function(data, header) {
          if (data.success === "0") {
            pageSum = data.result.total;
            basic.querydata(data.result.rows);
          }
        },
        error: function(err) {
        }
      });
    },
    querydata: function(data) {
      let lidata = "";
      for (let i = 0; i < data.length; i++) {
        lidata +=
          "<li key=" +
          data[i].id +
          ">" +
          '<span><input type="checkbox" name="xz">' +
          (i + 1) +
          "</span>" +
          "<span key=" +
          data[i].projectCode +
          ">" +
          (data[i].projectName ? data[i].projectName : "&nbsp") +
          "</span>" +
          "<span key=" +
          data[i].type +
          ">" +
          (data[i].typeName ? data[i].typeName : "&nbsp") +
          "</span>" +
          "<span>" +
          (data[i].name ? data[i].name : "&nbsp") +
          "</span>" +
          "<span>" +
          (data[i].id ? data[i].id : "&nbsp") +
          "</span>" +
          "<span>" +
          (data[i].code ? data[i].code : "&nbsp") +
          "</span>" +
          "<span>" +
          (data[i].address ? data[i].address : "&nbsp") +
          "</span>" +
          "<span>" +
          (data[i].manufacturer ? data[i].manufacturer : "&nbsp") +
          "</span>" +
          "<span>" +
          (data[i].makeTime ? data[i].makeTime : "&nbsp") +
          "</span>" +
          "<span>" +
          (data[i].useTime ? data[i].useTime : "&nbsp") +
          "</span>" +
          '<span><a class="mod">修改</a><a class="del">删除</a></span>' +
          "</li>";
      }
      $("#tableContent").html(lidata);
    },
    selepro: function(data) {
      for (var i = data.length - 1; i >= 0; i--) {
        $(".projectName").prepend(
          '<option value="' + data[i].key + '">' + data[i].value + "</option>"
        );
        $(".projectNameAdd").prepend(
          '<option value="' + data[i].key + '">' + data[i].value + "</option>"
        );
        $(".updaproName").prepend(
          '<option value="' + data[i].key + '">' + data[i].value + "</option>"
        );
      }
      $(".projectName").prepend(
        '<option value="" selected = "selected">全部项目</option>'
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
      for (let i = 0; i < Math.ceil(pageSum / pageSize); i++) {
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
    }
  };
  basic.init();
});
