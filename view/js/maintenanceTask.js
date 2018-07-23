$(function() {
  var my_token = JSON.parse(sessionStorage.getItem("my_token")),
    projectCode = "",
    type = "",
    userName = "",
    status = "",
    frequency = "",
    startTime = "",
    endTime = "";
  var maintenanceTask = {
    init: function() {
      maintenanceTask.listent();
      maintenanceTask.querybd();
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
            maintenanceTask.selepro(data.result);
          }
        },
        error: function(err) {}
      });
      //设备系统
      $.ajax({
        url: localhost + "/system/getSysDictionary?code=EQUIPMENT",
        type: "get",
        beforeSend: function(xhr) {
          xhr.setRequestHeader("login_token", my_token);
        },
        success: function(data) {
          if (data.success === "0") {
            maintenanceTask.seleequi(data.result);
          }
        },
        error: function(err) {}
      });
      //状态
      $.ajax({
        url: localhost + "/system/getSysDictionary?code=STATUS",
        type: "get",
        beforeSend: function(xhr) {
          xhr.setRequestHeader("login_token", my_token);
        },
        success: function(data) {
          if (data.success === "0") {
            maintenanceTask.status(data.result);
          }
        },
        error: function(err) {}
      });

      laydate.render({
        elem: "#maintenanceTask1", //指定元素
        type: "datetime"
      });
      laydate.render({
        elem: "#maintenanceTask2", //指定元素
        type: "datetime"
      });

      //查询
      $("#seach").on("click", function() {
        projectCode = $(".projectName option:selected").val();
        type = $(".equi option:selected").val();
        userName = $(".userName").val();
        status = $(".status option:selected").val();
        startTime = $("#maintenanceTask1").val()
          ? $("#maintenanceTask1").val()
          : "";
        endTime = $("#maintenanceTask2").val()
          ? $("#maintenanceTask2").val()
          : "";
        maintenanceTask.querybd(
          projectCode,
          type,
          userName,
          status,
          startTime,
          endTime,
          pageNum,
          pageSize
        );
      });

      //详情点击
      $(".amend").on("click", function() {
        $("#tan_wrap").show();
      });
      $("#close").on("click", function() {
        $("#tan_wrap").hide();
      });
      $(".mai-details").on("click", function() {
        $(".mai-details").addClass("xq-acitve");
        $(".mai-arguments").removeClass("xq-acitve");
        $(".tan-content-left").show();
        $(".tan-content-right").hide();
      });
      $(".mai-arguments").on("click", function() {
        $(".mai-details").removeClass("xq-acitve");
        $(".mai-arguments").addClass("xq-acitve");
        $(".tan-content-left").hide();
        $(".tan-content-right").show();
      });
       //导出
       $("#ext").on("click", function() {
        window.open(localhost + "/equipmentBase/exportExcel");
      });
    },
    //项目名称
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
    //设备系统
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
    //状态
    status: function(data) {
      for (var i = data.length - 1; i >= 0; i--) {
        $(".status").prepend(
          '<option value="' + data[i].key + '">' + data[i].value + "</option>"
        );
        $(".updaequi").prepend(
          '<option value="' + data[i].key + '">' + data[i].value + "</option>"
        );
        $(".typeAdd").prepend(
          '<option value="' + data[i].key + '">' + data[i].value + "</option>"
        );
      }
      $(".status").prepend(
        '<option value="" selected = "selected">全部状态</option>'
      );
    },
    querybd: function(
      projectCode,
      type,
      userName,
      status,
      startTime,
      endTime,
      pageNum,
      pageSize
    ) {
      $.ajax({
        dataType: "json",
        url: localhost + "/maintain/getPage",
        type: "POST",
        async: false,
        data: {
          projectCode: projectCode,
          type: type,
          userName: userName,
          status: status,
          startTime: startTime,
          endTime: endTime,
          pageNum: pageNum,
          pageSize: pageSize
        },
        beforeSend: function(xhr) {
          xhr.setRequestHeader("login_token", my_token);
        },
        success: function(data, header) {
          if (data.success === "0") {
            pageSum = data.result.total;
            // personnel.fenye(pageSum);
            maintenanceTask.querydata(data.result.rows);
          }
        },
        error: function(err) {}
      });
    },
    statu: function(status) {
      switch (status) {
        case "0":
          return "在线";
          break;
        case "1":
          return "离线";
          break;
        case "2":
          return "故障";
          break;
      }
    },
    querydata: function(data) {
      var lidata = "";
      for (var i = 0; i < data.length; i++) {
        lidata +=
          "<li cs=" +
          data[i].maintainParams +
          " data-id=" +
          i +
          ">" +
          '<span ><input type="checkbox" name="xz">' +
          (i + 1) +
          "</span>" +
          "<span>" +
          data[i].projectName +
          "</span>" +
          "<span>" +
          data[i].equipmentType +
          "</span>" +
          "<span>" +
          data[i].code +
          "</span>" +
          "<span>" +
          data[i].address +
          "</span>" +
          "<span>" +
          data[i].frequency +
          "</span>" +
          "<span>" +
          common.formatDate(data[i].startTime) +
          "</span>" +
          "<span>" +
          common.formatDate(data[i].endTime) +
          "</span>" +
          "<span>" +
          maintenanceTask.statu(data[i].status) +
          "</span>" +
          "<span>" +
          data[i].personName +
          "</span>" +
          "<span><a class='xiangqing'>详情</a></span>" +
          "</li>";
      }
      $("#tableContent").html(lidata);
      $(".xiangqing").on("click", function() {
        $(".mai-details").addClass("xq-acitve");
        $(".mai-arguments").removeClass("xq-acitve");
        $(".tan-content-left").show();
        $(".tan-content-right").hide();
        $("#tan_wrap").show();
        var lis =
          data[
            $(
              $(this)
                .parent()
                .parent()[0]
            ).attr("data-id")
          ];
        var lis2 = JSON.parse(
          $(
            $(this)
              .parent()
              .parent()[0]
          )
            .attr("cs")
            .replace(/'/g, '"')
        );
        //详情-任务详情
        var contentLeft =
          "<li><span>项目名称：</span><span>" +
          lis.projectName +
          "</span></li>" +
          "<li><span>设备系统：</span><span>" +
          lis.equipmentName +
          "</span></li>" +
          "<li><span>设备安装区域：</span><span>" +
          lis.address +
          "</span></li>" +
          "<li><span>设备编号：</span><span>" +
          lis.code +
          "</span></li>" +
          "<li><span>保养频次：</span><span>" +
          lis.frequency +
          "</span></li>" +
          "<li><span>开始时间：</span><span>" +
          common.formatDate(lis.startTime) +
          "</span></li>" +
          "<li><span>结束时间：</span><span>" +
          common.formatDate(lis.endTime) +
          "</span></li>" +
          "<li><span>责任人：</span><span>" +
          lis.personName +
          "</span></li>" +
          "<li><span>保养状态：</span><span>" +
          maintenanceTask.statu(lis.status) +
          "</span></li>";
        $("#tan-content-left").html("<ul>" + contentLeft + "</ul>");

        //详情-保养参数
        $.ajax({
          dataType: "json",
          url: localhost + "/maintain/getMaintainParams?type=01",
          type: "POST",
          async: false,
          beforeSend: function(xhr) {
            xhr.setRequestHeader("login_token", my_token);
          },
          success: function(data) {
            if (data.success == "0") {
              maintenanceTask.bycs(data.result, lis2);
            }
          },
          error: function(err) {}
        });
      });
    },
    bycs: function(data, lis2) {
      var colorr = {
        "1": "green",
        "2": "reds",
        "3": "oranges"
      };

      var contentRight = "";
      for (var index in lis2) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].id == index) {
            contentRight +=
              "<li><span>" +
              data[i].param +
              ":</span><span class=" +
              colorr[lis2[index]] +
              ">" +
              maintenanceTask.par(lis2[index]) +
              "</span></li>";
          }
        }
      }
      $("#tan-content-right").html("<ul>" + contentRight + "</ul>");
      $(".green").css({ color: "#009688" });
      $(".reds").css({ color: "#EF5757" });
      $(".oranges").css({ color: "#F8A543" });
    },
    fenye: function(data) {
      var pages = 1;
      var oness = 6; //每页最多显示的数量
      var pagenum = Math.ceil(data.length / oness);
      maintenanceTask.querydata(data, pages, oness);
      //首页
      $("#basic_first").on("click", function() {
        pages = 1;
        maintenanceTask.querydata(data, pages, oness);
        maintenanceTask.activeColor(pages);
      });
      //末页
      $("#basic_end").on("click", function() {
        pages = Math.ceil(data.length / oness);
        maintenanceTask.querydata(data, pages, oness);
        maintenanceTask.activeColor(pages);
      });
      //上一页
      $("#basic_prev").on("click", function() {
        pages = pages - 1 > 0 ? pages - 1 : 1;
        maintenanceTask.querydata(data, pages, oness);
        maintenanceTask.activeColor(pages);
      });
      //下一页
      $("#basic_next").on("click", function() {
        pages = pages + 1 < pagenum ? pages + 1 : pagenum;
        maintenanceTask.querydata(data, pages, oness);
        maintenanceTask.activeColor(pages);
      });
      //点击数字翻页
      $("#pageIndex").on("click", "a", function() {
        pages = Math.round($(this).attr("data-id"));
        maintenanceTask.querydata(data, pages, oness);
        maintenanceTask.activeColor(pages);
      });
    },
    //保养参数
    par: function(num) {
      switch (num) {
        case "1":
          return "正常";
          break;
        case "2":
          return "损坏";
          break;
        case "3":
          return "需检修";
          break;
        default:
          return "暂无信息";
          break;
      }
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
  maintenanceTask.init();
});
