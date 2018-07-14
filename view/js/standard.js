$(() => {
  var standard = {
    init: () => {
      standard.listent();
    },
    listent: () => {
      $.ajax({
        dataType: "json",
        // url: "/view/js/standard.json",
        success: function(data) {
          standard.fenye(data.rows);
        },
        error: function() {
        }
      });
      //修改
      $(document).on("click", ".mod", function() {
        $("#tan_wrap").show();
        $("#basic_mod").show();
        $("#basic_add").hide();
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
      //新增
      $("#newAdd").on("click", function() {
        $("#tan_wrap").show();
        $("#basic_mod").hide();
        $("#basic_add").show();
      });

      $("#basic_add_yes").on("click", function() {
        $("#tan_wrap").hide();
        $("#basic_mod").hide();
        $("#basic_add").hide();
      });
      $("#basic_add_no").on("click", function() {
        $("#tan_wrap").hide();
        $("#basic_mod").hide();
        $("#basic_add").hide();
      });

      $("#basic_mod").on("click", function(event) {
        event.stopPropagation();
      });
      $("#basic_add").on("click", function(event) {
        event.stopPropagation();
      });
      //   分页
      $("#pageIndex").on("click", "a", function() {
        firstnum = $(this).attr("data-id");
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
            standard.fenyenum();
            standard.querybd(seach1, seach2, seach3, pageNum, pageSize);
          },
          error: function(err) {
          }
        });
      });
      $("#basic_del_no").on("click", function() {
        $("#tan_wrap").hide();
        $("#basic_del").hide();
      });
    },
    querydata: function(data, pages, oness) {
      // var oness = 6; //每页最多显示的数量
      // var ones = data.length < ones ? oness : 6; //每页显示的数量
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
      for (let i = firstnum; i < endnum; i++) {
        lidata +=
          "<li>" +
          '<span><input type="checkbox" name="xz">' +
          (i + 1) +
          "</span>" +
          "<span>" +
          data[i].projectName +
          "</span>" +
          "<span>" +
          data[i].bzname +
          "</span>" +
          "<span>" +
          data[i].bzid +
          "</span>" +
          "<span>" +
          data[i].topzhi +
          "</span>" +
          "<span>" +
          data[i].buttomzhi +
          "</span>" +
          '<span><a class="mod">修改</a><a class="del">删除</a></span>' +
          "</li>";
      }
      $("#tableContent").html(lidata);
    },
    fenye: data => {
      var pages = 1;
      var oness = 6; //每页最多显示的数量
      var pagenum = Math.ceil(data.length / oness);
      standard.querydata(data, pages, oness);
      //首页
      $("#basic_first").on("click", function() {
        pages = 1;
        standard.querydata(data, pages, oness);
        standard.activeColor(pages);
      });
      //末页
      $("#basic_end").on("click", function() {
        pages = Math.ceil(data.length / oness);
        standard.querydata(data, pages, oness);
        standard.activeColor(pages);
      });
      //上一页
      $("#basic_prev").on("click", function() {
        pages = pages - 1 > 0 ? pages - 1 : 1;
        standard.querydata(data, pages, oness);
        standard.activeColor(pages);
      });
      //下一页
      $("#basic_next").on("click", function() {
        pages = pages + 1 < pagenum ? pages + 1 : pagenum;
        standard.querydata(data, pages, oness);
        standard.activeColor(pages);
      });
      //点击数字翻页
      $("#pageIndex").on("click", "a", function() {
        pages = Math.round($(this).attr("data-id"));
        standard.querydata(data, pages, oness);
        standard.activeColor(pages);
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
  standard.init();
});
