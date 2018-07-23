$(function() {
  var maintenanceReport = {
    init: function() {
      maintenanceReport.listent();
    },
    listent: function() {
      $.ajax({
        dataType: "json",
        // url: "/view/js/maintenanceTask.json",
        success: function(data) {
          maintenanceReport.fenye(data.rows);
        },
        error: function() {
        }
      });
      //laydate
      laydate.render({
        elem: '#maintenanceTask1' //指定元素
      });
      laydate.render({
        elem: '#maintenanceTask2' //指定元素
      });
      //   分页
      $("#pageIndex").on("click", "a", function() {
        firstnum = $(this).attr("data-id");
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
       $("#exportExcel").on("click", function() {
        window.open(localhost + "/equipmentBase/exportExcel");
      });
    },
    querydata: function(data, pages, oness) {
      //分页
      var alis = "";
      var pagenum = Math.ceil(data.length / oness);
      for (var i = 0; i < pagenum; i++) {
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
      //   //查询数据
      var lidata = "";
      var firstnum = (pages - 1) * oness; //当前页第一条序号
      var endnum = pages * oness; //当前页最后一条序号
      var endnum = data.length > pages * oness ? pages * oness : data.length;
      var colors = "";
      for (var i = firstnum; i < endnum; i++) {
        lidata +=
          "<li data-id=" +
          i +
          ">" +
          '<span ><input type="checkbox" name="xz">' +
          (i + 1) +
          "</span>" +
          "<span>" +
          data[i].projectName +
          "</span>" +
          "<span>" +
          data[i].eqisystem +
          "</span>" +
          "<span>" +
          data[i].cheequi +
          "</span>" +
          "<span>" +
          data[i].code +
          "</span>" +
          "<span>" +
          data[i].installationSite +
          "</span>" +
          "<span>" +
          data[i].pinci +
          "</span>" +
          "<span>" +
          data[i].starttime +
          "</span>" +
          "<span>" +
          data[i].endtime +
          "</span>" +
          "<span>" +
          data[i].status +
          "</span>" +
          "<span>" +
          data[i].person +
          "</span>" +
          "<span><a class='xiangqing'>详情</a></span>" +
          "</li>";
      }
      $("#tableContent").html(lidata);
      $(".xiangqing").on("click", function() {
        $("#tan_wrap").show();
        var lis =
          data[
            $(
              $(this)
                .parent()
                .parent()[0]
            ).attr("data-id")
          ];
        //详情-任务详情
        var contentLeft =
          "<li><span>项目名称：</span><span>" +
          lis.projectName +
          "</span></li>" +
          "<li><span>设备系统：</span><span>" +
          lis.eqisystem +
          "</span></li>" +
          "<li><span>设备名称：</span><span>" +
          lis.cheequi +
          "</span></li>" +
          "<li><span>设备安装区域：</span><span>" +
          lis.code +
          "</span></li>" +
          "<li><span>设备编号：</span><span>" +
          lis.installationSite +
          "</span></li>" +
          "<li><span>保养频次：</span><span>" +
          lis.pinci +
          "</span></li>" +
          "<li><span>开始时间：</span><span>" +
          lis.starttime +
          "</span></li>" +
          "<li><span>结束时间：</span><span>" +
          lis.endtime +
          "</span></li>" +
          "<li><span>责任人：</span><span>" +
          lis.status +
          "</span></li>" +
          "<li><span>保养状态：</span><span>" +
          lis.person +
          "</span></li>";
        $("#tan-content-left").html("<ul>" + contentLeft + "</ul>");
        var colorr = {
          正常: "blacks",
          损坏: "reds",
          需检修: "oranges"
        };
        //详情-保养参数
        var contentRight =
          "<li><span>外观是否完整：</span><span class=" +
          colorr[lis.facade] +
          ">" +
          lis.facade +
          "</span></li>" +
          "<li><span>DTU是否正常：</span><span class=" +
          colorr[lis.dtu] +
          ">" +
          lis.dtu +
          "</span></li>" +
          "<li><span>电源是否正常：</span><span class=" +
          colorr[lis.power] +
          ">" +
          lis.power +
          "</span></li>" +
          "<li><span>温度传感器：</span><span class=" +
          colorr[lis.temperatureCG] +
          ">" +
          lis.temperatureCG +
          "</span></li>" +
          "<li><span>湿度传感器：</span><span class=" +
          colorr[lis.humidityCG] +
          ">" +
          lis.humidityCG +
          "</span></li>" +
          "<li><span>气压传感器：</span><span class=" +
          colorr[lis.pressureCG] +
          ">" +
          lis.pressureCG +
          "</span></li>" +
          "<li><span>降雨量传感器：</span><span class=" +
          colorr[lis.rainfallCG] +
          ">" +
          lis.rainfallCG +
          "</span></li>" +
          "<li><span>风力风向传感器：</span><span class=" +
          colorr[lis.windCG] +
          ">" +
          lis.windCG +
          "</span></li>" +
          "<li><span>显示器：</span><span class=" +
          colorr[lis.displayer] +
          ">" +
          lis.displayer +
          "</span></li>";
        $("#tan-content-right").html("<ul>" + contentRight + "</ul>");
        $(".blacks").css({ color: "#666666" });
        $(".reds").css({ color: "#EF5757" });
        $(".oranges").css({ color: "#F8A543" });
      });
    },
    fenye: function(data) {
      var pages = 1;
      var oness = 6; //每页最多显示的数量
      var pagenum = Math.ceil(data.length / oness);
      maintenanceReport.querydata(data, pages, oness);
      //首页
      $("#basic_first").on("click", function() {
        pages = 1;
        maintenanceReport.querydata(data, pages, oness);
        maintenanceReport.activeColor(pages);
      });
      //末页
      $("#basic_end").on("click", function() {
        pages = Math.ceil(data.length / oness);
        maintenanceReport.querydata(data, pages, oness);
        maintenanceReport.activeColor(pages);
      });
      //上一页
      $("#basic_prev").on("click", function() {
        pages = pages - 1 > 0 ? pages - 1 : 1;
        maintenanceReport.querydata(data, pages, oness);
        maintenanceReport.activeColor(pages);
      });
      //下一页
      $("#basic_next").on("click", function() {
        pages = pages + 1 < pagenum ? pages + 1 : pagenum;
        maintenanceReport.querydata(data, pages, oness);
        maintenanceReport.activeColor(pages);
      });
      //点击数字翻页
      $("#pageIndex").on("click", "a", function() {
        pages = Math.round($(this).attr("data-id"));
        maintenanceReport.querydata(data, pages, oness);
        maintenanceReport.activeColor(pages);
      });
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
  maintenanceReport.init();
});
