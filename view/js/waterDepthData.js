$(function() {
  var my_token = JSON.parse(sessionStorage.getItem("my_token")),
    seach1 = "", //查询条件
    seach2 = "",
    seach3 = "",
    delKeyl, //删除关键字
    startTime = "",
    endTime = "";
  var waterDepthData = {
    init: function() {
      waterDepthData.listent();
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
            for (var i = data.result.length - 1; i >= 0; i--) {
              $(".projectName").prepend(
                '<option value="' +
                  data.result[i].key +
                  '">' +
                  data.result[i].value +
                  "</option>"
              );
            }
            $(".projectName").prepend(
              '<option value="" selected = "selected">选择项目</option>'
            );
          }
        },
        error: function(err) {}
      });

      $(".projectName").change(function() {
        seach1 = $(".projectName").val();
        $.ajax({
          url: localhost + "/equipmentBase/getEquipmentCodeList",
          type: "POST",
          data: {
            projectCode: seach1,
            type: "03"
          },
          beforeSend: function(xhr) {
            xhr.setRequestHeader("login_token", my_token);
          },
          success: function(data) {
            if (data.success === "0") {
              $(".sbname").html("");
              for (var i = data.result.length - 1; i >= 0; i--) {
                $(".sbname").prepend(
                  '<option value="' +
                    data.result[i].key +
                    '">' +
                    data.result[i].value +
                    "</option>"
                );
              }
              $(".sbname").prepend(
                '<option value="" selected = "selected">选择设备名称</option>'
              );
              $(".sbnamen").show();
              $(".sbname").show();
            }
          },
          error: function(err) {}
        });
      });

      //laydate
      laydate.render({
        elem: "#failuredata1", //指定元素
        type: "datetime"
      });
      laydate.render({
        elem: "#failuredata2",
        type: "datetime"
      });
      //表单筛选
      // waterDepthData.querybd(seach1, seach2, seach3, pageNum, pageSize,startTime,endTime);
      //数据查询
      $("#seach").on("click", function() {
        // waterDepthData.fenyenum()
        startTime = $("#failuredata1").val() ? $("#failuredata1").val() : "";
        endTime = $("#failuredata2").val() ? $("#failuredata2").val() : "";
        seach3 = $(".sbname").val();
        waterDepthData.querybd(
          seach1,
          seach2,
          seach3,
          pageNum,
          pageSize,
          startTime,
          endTime
        );

        $(".tableContent").show();
        $(".menu-bottom-wrap").show();
      });
      //导出
      $("#exportExcel").on("click", function() {
        window.open(localhost + "/user/exportExcel");
      });
      // 分页
      $("#pageIndex").on("click", "a", function() {
        pageNum = $(this).attr("data-id");
        waterDepthData.activeColor(pageNum);
        waterDepthData.querybd(
          seach1,
          seach2,
          seach3,
          pageNum,
          pageSize,
          startTime,
          endTime
        );
      });
      //首页
      $("#basic_first").on("click", function() {
        pageNum = $(this).attr("key");
        waterDepthData.activeColor(pageNum);
        waterDepthData.querybd(
          seach1,
          seach2,
          seach3,
          pageNum,
          pageSize,
          startTime,
          endTime
        );
      });
      //末页
      $("#basic_end").on("click", function() {
        $(this).attr("key", pageSum);
        pageNum = Math.ceil(pageSum / pageSize);
        waterDepthData.activeColor(pageNum);
        waterDepthData.querybd(
          seach1,
          seach2,
          seach3,
          pageNum,
          pageSize,
          startTime,
          endTime
        );
      });
      //上一页
      $("#basic_prev").on("click", function() {
        if (pageNum > 1) {
          pageNum--;
          waterDepthData.activeColor(pageNum);
          waterDepthData.querybd(
            seach1,
            seach2,
            seach3,
            pageNum,
            pageSize,
            startTime,
            endTime
          );
        }
      });
      //下一页
      $("#basic_next").on("click", function() {
        if (pageNum < Math.ceil(pageSum / pageSize)) {
          pageNum++;
          waterDepthData.activeColor(pageNum);
          waterDepthData.querybd(
            seach1,
            seach2,
            seach3,
            pageNum,
            pageSize,
            startTime,
            endTime
          );
        }
      });
    },
    querybd: function(
      seach1,
      seach2,
      seach3,
      pageNum,
      pageSize,
      startTime,
      endTime
    ) {
      $.ajax({
        dataType: "json",
        url: localhost + "/equipmentData/getPage",
        type: "POST",
        async: false,
        data: {
          equipmentCode: seach3,
          pageNum: pageNum,
          pageSize: pageSize,
          startTime: startTime,
          endTime: endTime
        },
        beforeSend: function(xhr) {
          xhr.setRequestHeader("login_token", my_token);
        },
        success: function(data) {
          if (data.msg === "获取成功") {
            waterDepthData.fenye(pageSum);
            waterDepthData.querydata(data.result.rows);
            pageSum = data.result.total;
            waterDepthData.fenye(pageSum);
            waterDepthData.activeColor(pageNum);
          }
        },
        error: function(err) {}
      });
    },
    querydata: function(data) {
      var lidata = "";
      for (var i = 0; i < data.length; i++) {
        lidata +=
          "<li>" +
          '<span><input type="checkbox" name="xz">' +
          (i + 1) +
          "</span>" +
          "<span>" +
          (common.formatDate(data[i].monitorTime)
            ? common.formatDate(data[i].monitorTime)
            : "&nbsp") +
          "</span>" +
          "<span>" +
          (data[i].depth ? data[i].depth : "&nbsp") +
          "</span>";
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
  waterDepthData.init();
});
