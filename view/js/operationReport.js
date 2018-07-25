$(function() {
  var my_token = JSON.parse(sessionStorage.getItem("my_token")),
    seach1 = "", //查询条件
    seach2 = "",
    seach3 = "";
  var operationReport = {
    init: function() {
      operationReport.listent();
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
            operationReport.selepro(data.result);
          }
        },
        error: function(err) {}
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
            operationReport.seleequi(data.result);
          }
        },
        error: function(err) {}
      });
      operationReport.fenyenum();
      //表单筛选
      operationReport.querybd(seach1, seach2, seach3, pageNum, pageSize);

      $("#seach").on("click", function() {
        seach1 = $(".projectName option:selected").val();
        seach2 = $(".equi option:selected").val();
        seach3 = $(".sbname").val();
        operationReport.fenyenum();
        operationReport.querybd(seach1, seach2, seach3, pageNum, pageSize);
      });

      // 分页
      $("#pageIndex").on("click", "a", function() {
        pageNum = $(this).attr("data-id");
        operationReport.activeColor(pageNum);
        operationReport.querybd(seach1, seach2, seach3, pageNum, pageSize);
      });
      //首页
      $("#basic_first").on("click", function() {
        pageNum = $(this).attr("key");
        operationReport.activeColor(pageNum);
        operationReport.querybd(seach1, seach2, seach3, pageNum, pageSize);
      });
      //末页
      $("#basic_end").on("click", function() {
        $(this).attr("key", pageSum);
        pageNum = Math.ceil(pageSum / pageSize);
        operationReport.activeColor(pageNum);
        operationReport.querybd(seach1, seach2, seach3, pageNum, pageSize);
      });
       //上一页
       $("#basic_prev").on("click", function() {
        if (pageNum > 1) {
          pageNum--;
          operationReport.activeColor(pageNum);
          operationReport.querybd(seach1, seach2, seach3, pageNum, pageSize);
        }
      });
      //下一页
      $("#basic_next").on("click", function() {
        if (pageNum < Math.ceil(pageSum / pageSize)) {
          pageNum++;
          operationReport.activeColor(pageNum);
          operationReport.querybd(seach1, seach2, seach3, pageNum, pageSize);
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
            operationReport.fenye(pageSum);
            operationReport.activeColor(pageNum);
          }
        },
        error: function(err) {}
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
        success: function(data) {
          if (data.success === "0") {
            pageSum = data.result.total;
            operationReport.querydata(data.result.rows);
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
          ">" +
          '<span><input type="checkbox" name="xz">' +
          (i + 1) +
          "</span>" +
          "<span>" +
          (data[i].makeTime ? data[i].makeTime : "&nbsp") +
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
          // (data[i].code ? data[i].code : "&nbsp") +
          "</span>" +
          "<span>" +
          (data[i].address ? data[i].address : "&nbsp") +
          "</span>" +
          "<span>" +
          // (data[i].manufacturer ? data[i].manufacturer : "&nbsp") +
          "</span>" +
          
          "</li>";
      }
      $("#tableContent").html(lidata);
    },
    selepro: function(data) {
      console.log(data)
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
    }
  };
  operationReport.init();
});
