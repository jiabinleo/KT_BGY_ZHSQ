$(function() {
  var frequency = {
    init: function() {
      frequency.listent();
    },
    listent: function() {
      
      //laydate
      laydate.render({
        elem: "#failuredata1" //指定元素
      });
      laydate.render({
        elem: "#failuredata2" //指定元素
      });
      //   分页
      $("#pageIndex").on("click", "a", function() {
        firstnum = $(this).attr("data-id");
      });
      //详情点击
      $(document).on("click", ".con", function() {
        $("#tan_wrap").show();
        $(".basic-mod").show();
      })
      $("#basic_mod_yes").on("click", function() {
        $("#tan_wrap").hide();
        $(".basic-mod").hide();
      });
      $("#basic_mod_no").on("click", function() {
        $("#tan_wrap").hide();
        $(".basic-mod").hide();
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
    },
    querydata: function(data, pages, oness) {
      //分页
      var alis = "";
      var pagenum = Math.ceil(data.length / oness);
      for (let i = 0; i < pagenum; i++) {
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
      let lidata = "";
      var firstnum = (pages - 1) * oness; //当前页第一条序号
      var endnum = pages * oness; //当前页最后一条序号
      var endnum = data.length > pages * oness ? pages * oness : data.length;
      var colors = "";
      for (let i = firstnum; i < endnum; i++) {
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
          data[i].eqiName +
          "</span>" +
          "<span>" +
          data[i].code +
          "</span>" +
          "<span>" +
          data[i].installationSite +
          "</span>" +
          "<span>" +
          data[i].frequency +
          "</span>" +
          '<span><a class="con">配置</a></span>' +
          "</li>";
      }
      $("#tableContent").html(lidata);
      //配置弹框
      $(document).on("click", ".con", function() {
        $("#tan_wrap").show();
        $("#basic_mod").show();
        $("#basic_add").hide();
        var lis =
          data[
            $(
              $(this)
                .parent()
                .parent()[0]
            ).attr("data-id")
          ];
      });
      $("#basic_mod_yes").on("click", function() {
        $("#tan_wrap").hide();
        $("#basic_mod").hide();
        $("#basic_add").hide();
      });
      $("#basic_mod_no").on("click", function() {
        $("#tan_wrap").hide();
        $("#basic_mod").hide();
        $("#basic_add").hide();
      });
    },

    //分页
    fenye: function(data) {
      var pages = 1;
      var oness = 6; //每页最多显示的数量
      var pagenum = Math.ceil(data.length / oness);
      frequency.querydata(data, pages, oness);
      //首页
      $("#basic_first").on("click", function() {
        pages = 1;
        frequency.querydata(data, pages, oness);
        frequency.activeColor(pages);
      });
      //末页
      $("#basic_end").on("click", function() {
        pages = Math.ceil(data.length / oness);
        frequency.querydata(data, pages, oness);
        frequency.activeColor(pages);
      });
      //上一页
      $("#basic_prev").on("click", function() {
        pages = pages - 1 > 0 ? pages - 1 : 1;
        frequency.querydata(data, pages, oness);
        frequency.activeColor(pages);
      });
      //下一页
      $("#basic_next").on("click", function() {
        pages = pages + 1 < pagenum ? pages + 1 : pagenum;
        frequency.querydata(data, pages, oness);
        frequency.activeColor(pages);
      });
      //点击数字翻页
      $("#pageIndex").on("click", "a", function() {
        pages = Math.round($(this).attr("data-id"));
        frequency.querydata(data, pages, oness);
        frequency.activeColor(pages);
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
  frequency.init();
});
