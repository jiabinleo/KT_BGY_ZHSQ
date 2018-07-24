$(function() {
  var my_token = JSON.parse(sessionStorage.getItem("my_token")),
    seach1 = "", //查询条件
    data_json,
    data_name = "偏移角度",
    c = "°";
  var wellCover = {
    init: function() {
      wellCover.listent();
    },
    listent: function() {
      // 项目名称
      $.ajax({
        url: localhost + "/system/getSysDictionary?code=PROJECT",
        type: "get",
        async: false,
        beforeSend: function(xhr) {
          xhr.setRequestHeader("login_token", my_token);
        },
        success: function(data) {
          if (data.success === "0") {
            for (var i = data.result.length - 1; i >= 1; i--) {
              $(".projectName").prepend(
                '<option value="' +
                  data.result[i].key +
                  '">' +
                  data.result[i].value +
                  "</option>"
              );
            }
            $(".projectName").prepend(
              '<option value="' +
                data.result[0].key +
                '" selected = "selected">' +
                data.result[0].value +
                "</option>"
            );
            wellCover.querysbName();
            setTimeout(() => {
              wellCover.querydata($(".sbname option:selected").attr("value"));
            }, 200);
          }
        },
        error: function(err) {}
      });

      $(".projectName").change(function() {
        wellCover.querysbName();
      });
      //查询查询
      $("#seach").on("click", function() {
        seach3 = $(".sbname").val();
        var equipmentCode = seach3;
        $("#alarmAng_radio").prop("checked", "true");
        data_name = "偏移角度";
        c = "°";
        wellCover.querydata(equipmentCode);
        wellCover.echarts("angleCurrent", "偏移角度");
        
      });
      $("#top2_left").on("click", "input", function() {
        data_name = $(this).attr("data-id");
        switch ($(this).attr("data-id")) {
          case "angleCurrent":
            data_name = "偏移角度";
            c = "°";
            break;
          case "alertOutWaterline":
            data_name = "雨水状态";
            c = "mm";
            break;
          case "alertLowbattery":
            data_name = "电池电压";
            c = "V";
            break;
        }
        wellCover.echarts(data_json[$(this).attr("data-id")], data_name);
      });
    },
    //获取设备名称
    querysbName: function() {
      seach1 = $(".projectName").val();
      $.ajax({
        url: localhost + "/equipmentBase/getEquipmentCodeList",
        type: "POST",
        data: {
          projectCode: seach1,
          type: "04"
        },
        beforeSend: function(xhr) {
          xhr.setRequestHeader("login_token", my_token);
        },
        success: function(data) {
          if (data.success === "0") {
            $(".sbname").html("");
            for (var i = data.result.length - 1; i >= 1; i--) {
              $(".sbname").prepend(
                '<option value="' +
                  data.result[i].key +
                  '">' +
                  data.result[i].value +
                  "</option>"
              );
            }
            $(".sbname").prepend(
              '<option value="' +
                data.result[0].key +
                '" selected = "selected">' +
                data.result[0].value +
                "</option>"
            );
            $(".sbnamen").show();
            $(".sbname").show();
          }
        },
        error: function(err) {}
      });
    },
    //数据查询
    querydata: function(equipmentCode) {
      $.ajax({
        type: "POST",
        url: localhost + "/equipmentData/getHistory",
        data: {
          equipmentCode: equipmentCode
        },
        beforeSend: function(xhr) {
          xhr.setRequestHeader("login_token", my_token);
        },
        success: function(data) {
          console.log(data);
          data_json = data.result.element;
          wellCover.echarts(data.result.element.angleCurrent, data_name);
          wellCover.mess(data.result.equipmentBase);
        },
        error: function(data) {}
      });
    },
    mess: function(data) {
      var list =
        "<table>" +
        "<tr><td>项目名称：</td><td>" +
        data.projectName +
        "</td></tr>" +
        "<tr><td>设备系统：</td><td>" +
        data.typeName +
        "</td></tr>" +
        "<tr><td>设备名称：</td><td>" +
        data.name +
        "</td></tr>" +
        "<tr><td>设备1编码：</td><td title=" +
        data.code +
        ">" +
        data.code +
        "</td></tr>" +
        "</table>";
      $("#message").html(list);
    },
    echarts: function(data, data_name) {
      console.log(data,data_name)
      if (data.length != "0" && data_name != "") {
        var humidityxAxis = [];
        var humidityseries = [];
        for (var i = 0; i < data.length; i++) {
          humidityxAxis.push(data[i].time);
          humidityseries.push(data[i].value);
        }
      }else{
        var humidityxAxis = ['','','','','','',''];
        var humidityseries = ['','','','','','',''];
      }
      var myChart = echarts.init(document.getElementById("main"));

      // 指定图表的配置项和数据
      var option = {
        title: {},
        tooltip: {
          trigger: "axis",
          formatter: '{a0}:{c0}'+c,
          axisPointer: {
            type: "cross",
            animation: false,
            label: {
              backgroundColor: "#efefef",
              borderColor: "#efefef",
              borderWidth: 1,
              shadowBlur: 0,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              textStyle: {
                color: "#222"
              }
            }
          }
        },
        legend: {
          data: ["气象"]
        },
        xAxis: {
          data: humidityxAxis
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value}" + c
          },
          axisPointer: {
            snap: true
          }
        },
        grid: {
          left: "8%",
          bottom: "3%",
          containLabel: true
        },
        series: [
          {
            name: data_name,
            type: "line",
            smooth: true,
            data: humidityseries,
            itemStyle: { normal: { label: { show: true } } }
          }
        ]
      };
      myChart.setOption(option);
    }
  };
  wellCover.init();
});
