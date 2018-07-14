// let localhost = "http://192.168.1.119:8088";
let localhost = "http://14.116.184.77:8095";

var pageNum = 1,
    pageSum,
    pageSize = 6;
var common = {
  //时间转换
  formatDate: function(now) {
    var now = new Date(now);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    return (
      year +
      "-" +
      common.fixZero(month, 2) +
      "-" +
      common.fixZero(date, 2) +
      " " +
      common.fixZero(hour, 2) +
      ":" +
      common.fixZero(minute, 2) +
      ":" +
      common.fixZero(second, 2)
    );
  },
  //时间如果为单位数补0
  fixZero: function(num, length) {
    var str = "" + num;
    var len = str.length;
    var s = "";
    for (var i = length; i-- > len; ) {
      s += "0";
    }
    return s + str;
  }
};
