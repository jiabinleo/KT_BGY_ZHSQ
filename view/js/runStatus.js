$(() => {
  var my_token = JSON.parse(sessionStorage.getItem("my_token")),
    seach1 = "", //查询条件
    seach2 = "",
    seach3 = "",
    delKey; //删除关键字
  var runStatus = {
    init: () => {
      runStatus.listent();
    },
    listent: () => {
      //项目名称
      $.ajax({
        dataType: "json",
        url: localhost + "/system/getSysDictionary?code=PROJECT",
        type: "get",
        beforeSend: function(xhr) {
          xhr.setRequestHeader("login_token", my_token);
        },
        success: function(data) {
          if (data.success === "0") {
            runStatus.selepro(data.result);
          }
        },
        error: function(err) {
        }
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
            runStatus.seleequi(data.result);
          }
        },
        error: function(err) {
        }
      });
      //运行状态
      $.ajax({
        url: localhost + "/system/getSysDictionary?code=STATUS",
        type: "get",
        beforeSend: function(xhr) {
          xhr.setRequestHeader("login_token", my_token);
        },
        success: function(data) {
          if (data.success === "0") {
            runStatus.status(data.result);
          }
        },
        error: function(err) {
        }
      });
      runStatus.fenyenum();
      //表单筛选
      runStatus.querybd(seach1, seach2, seach3, pageNum, pageSize);
      //查询
      $("#seach").on("click", function() {
        seach1 = $(".projectName option:selected").val();
        seach2 = $(".equi option:selected").val();
        seach3 = $(".run_status option:selected").val();
        runStatus.fenyenum();
        runStatus.querybd(seach1, seach2, seach3, pageNum, pageSize);
      });
      //导出
      $("#exportExcel").on("click", function() {
        window.open(localhost + "/equipmentBase/exportExcel");
      });
      //全选
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

      // 分页
      $("#pageIndex").on("click", "a", function() {
        pageNum = $(this).attr("data-id");
        runStatus.activeColor(pageNum);
        runStatus.querybd(seach1, seach2, seach3, pageNum, pageSize);
      });
      //首页
      $("#basic_first").on("click", function() {
        pageNum = $(this).attr("key");
        runStatus.activeColor(pageNum);
        runStatus.querybd(seach1, seach2, seach3, pageNum, pageSize);
      });
      //末页
      $("#basic_end").on("click", function() {
        $(this).attr("key", pageSum);
        pageNum = Math.ceil(pageSum / pageSize);
        runStatus.activeColor(pageNum);
        runStatus.querybd(seach1, seach2, seach3, pageNum, pageSize);
      });
      //上一页
      $("#basic_prev").on("click", function() {
        if (pageNum > 1) {
          pageNum--;
          runStatus.activeColor(pageNum);
          runStatus.querybd(seach1, seach2, seach3, pageNum, pageSize);
        }
      });
      //下一页
      $("#basic_next").on("click", function() {
        if (pageNum < Math.ceil(pageSum / pageSize)) {
          pageNum++;
          runStatus.activeColor(pageNum);
          runStatus.querybd(seach1, seach2, seach3, pageNum, pageSize);
        }
      });
    },
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
            runStatus.fenye(pageSum);
            runStatus.activeColor(pageNum);
          }
        },
        error: function(err) {
        }
      });
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
      }
      $(".equi").prepend(
        '<option value="" selected = "selected">全部系统</option>'
      );
    },
    status: function(data) {
      for (var i = data.length - 1; i >= 0; i--) {
        $(".run_status").prepend(
          '<option value="' + data[i].key + '">' + data[i].value + "</option>"
        );
      }
      $(".run_status").prepend(
        '<option value="" selected = "selected">全部状态</option>'
      );
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
          "<span> <a class=runcolor" +
          data[i].status +
          "></a>" +
          "</span>" +
          '<span><a class="hulue">忽略</a><a class="baoxiu">报修</a><a class="tingyong">停用</a></span>' +
          "</li>";
      }
      $("#tableContent").html(lidata);
      $(".runcolor0").css({
        background: "-webkit-linear-gradient(90deg,#1ea0e3,#32b5ee,#35bcf0"
      });
      $(".runcolor1").css({
        background: "-webkit-linear-gradient(90deg,#f79727,#f8a543,#fab059"
      });
      $(".runcolor2").css({
        background: "-webkit-linear-gradient(90deg,#e74040,#ef5757,#fb8d8d"
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
          status: seach3,
          pageNum: pageNum,
          pageSize: pageSize
        },
        beforeSend: function(xhr) {
          xhr.setRequestHeader("login_token", my_token);
        },
        success: function(data, header) {
          if (data.success === "0") {
            pageSum = data.result.total;
            // basic.fenye(pageSum)
            runStatus.querydata(data.result.rows);
          }
        },
        error: function(err) {
        }
      });
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
  runStatus.init();
});
