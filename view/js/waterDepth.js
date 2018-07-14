$(() => {
  let localhost = "http://192.168.1.119:8088";
  var my_token = JSON.parse(sessionStorage.getItem("my_token")),
    seach1 = "", //查询条件
    data_json,
    data_name = "水浸",
    c = "mm";
  var waterDepth = {
    init: () => {
      waterDepth.listent();
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
        error: function(err) {
        }
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
          error: function(err) {
          }
        });
      });
      //查询查询
      $("#seach").on("click", function() {
        seach3 = $(".sbname").val();
        var equipmentCode = seach3;
        waterDepth.querydata(equipmentCode);
      });
      $("#top2_left").on("click", "input", function() {
        data_name = $(this).attr("data-id");
        switch ($(this).attr("data-id")) {
          case "depth":
            data_name = "水浸";
            break;
          default:
            break;
        }
        waterDepth.echarts(data_json[$(this).attr("data-id")], data_name);
      });
    },
    //数据查询
    querydata: equipmentCode => {
      $.ajax({
        type: "POST",
        url: localhost + "/equipmentData/getHistory",
        data: {
          equipmentCode: equipmentCode
        },
        beforeSend: xhr => {
          xhr.setRequestHeader("login_token", my_token);
        },
        success: data => {
          data_json = data.result.element;
          waterDepth.echarts(data.result.element.depth, data_name);
          waterDepth.mess(data.result.equipmentBase);
        },
        error: data => {}
      });
    },
    mess: data => {
      var list = `<ul>
      <li><span>项目名称：</span><span>${data.projectName}</span></li>
      <li><span>设备系统：</span><span>${data.typeName}</span></li>
      <li><span>设备名称：</span><span>${data.name}</span></li>
      <li><span>设备编码：</span><span>${data.code}</span></li>
  </ul>`;

      $("#message").html(list);
    },
    echarts: (data, data_name) => {
      var humidityxAxis = [];
      var humidityseries = [];
      for (let i = 0; i < data.length; i++) {
        humidityxAxis.push(data[i].time);
        humidityseries.push(data[i].value);
      }
      var myChart = echarts.init(document.getElementById("main"));

      // 指定图表的配置项和数据
      var option = {
        title: {
          // text: "ECharts 入门示例"
        },
        tooltip: {
          trigger: "axis",
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
            formatter: "{value} mm"
          },
          axisPointer: {
            snap: true
          }
        },
        series: [
          {
            name: data_name,
            type: "line",
            smooth: true,
            data: humidityseries
          }
        ]
      };
      myChart.setOption(option);
    }
  };
  waterDepth.init();
});
