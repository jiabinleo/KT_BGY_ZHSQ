$(function() {
  var my_token = JSON.parse(sessionStorage.getItem("my_token")),
    seach1 = "", //查询条件
    data_json,
    data_name = "PH值",
    c = "";
  var water = {
    init: function() {
      water.listent();
    },
    listent: function() {
      // 项目名称
      $.ajax({
        url: localhost + "/system/getSysDictionary?code=PROJECT",
        type: "get",
        async:false,
        beforeSend: function(xhr) {
          xhr.setRequestHeader("login_token", my_token);
        },
        success: function(data) {
          console.log(data)
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
              '<option value="'+data.result[0].key+'" selected = "selected">'+data.result[0].value+'</option>'
            );
          }
          water.querysbName()
          setTimeout(() => {
            console.log($(".sbname option:selected").attr("value"));
            water.querydata($(".sbname option:selected").attr("value"))
          },200);
        },
        error: function(err) {
        }
      });
      $(".projectName").change("click",function(){
        water.querysbName()
      })
      //查询查询
      $("#seach").on("click", function() {
        seach3 = $(".sbname").val();
        var equipmentCode = seach3;
        $("#ph_radio").prop("checked", "true")
        data_name = "PH值";
        c = "";
        water.querydata(equipmentCode);
        water.echarts("ph", "PH值");
        
      });
      $("#top2_left").on("click", "input", function() {
        data_name = $(this).attr("data-id");
        switch ($(this).attr("data-id")) {
          case "ph":
            data_name = "PH值";
            c = "";
            break;
          case "temp":
            data_name = "温度";
            c = "°C";
            break;
          case "turbidity":
            data_name = "浑浊度";
            c = "";
            break;
          case "chlorine":
            data_name = "含氯气";
            c = "";
            break;
          default:
            break;
        }
        water.echarts(data_json[$(this).attr("data-id")], data_name);
      });
    },
    querysbName:function(){
      seach1 = $(".projectName").val();
        $.ajax({
          url: localhost + "/equipmentBase/getEquipmentCodeList",
          type: "POST",
          data: {
            projectCode: seach1,
            type: "02"
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
                '<option value="'+data.result[0].key+'" selected = "selected">'+data.result[0].value+'</option>'
              );
              $(".sbnamen").show();
              $(".sbname").show();
            }
          },
          error: function(err) {
          }
        });
    },
    //数据查询
    querydata:  function(equipmentCode) {
      $.ajax({
        type: "POST",
        url: localhost + "/equipmentData/getHistory",
        data: {
          equipmentCode: equipmentCode
        },
        beforeSend:  function(xhr) {
          xhr.setRequestHeader("login_token", my_token);
        },
        success: function(data) {
          console.log(data)
          if (data.success === "0") {
          data_json = data.result.element;
          water.echarts(data.result.element.ph, data_name);
          water.mess(data.result.equipmentBase);
          }
        },
        error: function(data) {}
      });
    },
    mess: function(data) {
      var list = 
      '<table>'+
        '<tr><td>项目名称：</td><td>'+data.projectName+'</td></tr>'+
        '<tr><td>设备系统：</td><td>'+data.typeName+'</td></tr>'+
        '<tr><td>设备名称：</td><td>'+data.name+'</td></tr>'+
        '<tr><td>设备编码：</td><td title='+data.code+'>'+data.code+'</td></tr>'+
      '</table>'
      $("#message").html(list);
    },
    echarts:  function(data, data_name) {
      if (data.length != "0" && data_name != "") {
        var humidityxAxis = [];
        var ph = [];
        for (var i = 0; i < data.length; i++) {
          humidityxAxis.push(data[i].time);
          ph.push(data[i].value);
        }
      }else{
        var humidityxAxis = ['','','','','','',''];
        var ph = ['','','','','','',''];
      }     

      var myChart = echarts.init(document.getElementById("main"));

      // 指定图表的配置项和数据
      var option = {
        title: {
        },
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
          left: '13%',
          bottom: '3%',
          containLabel: true
        },
        series: [
          {
            name: data_name,
            type: "line",
            smooth: true,
            data: ph,
            itemStyle : { normal: {label : {show: true}}}
          }
        ]
      };
      myChart.setOption(option);
    }
  };
  water.init();
});
