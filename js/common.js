//var localhost = "http://192.168.1.119:8088";
var localhost = "http://14.116.184.77:8095";
var pageNum = 1,
  pageSum,
  pageSize = 5;
  if($(window).height()>=750){
    pageSize = 10;
  }else if($(window).height()>=550&&$(window).height()<750){
    pageSize = 5;
  }else if($(window).height()>=450&&$(window).height()<550){
    pageSize = 3;
  } if($(window).height()<450){
    pageSize = 2;
  }
  console.log($(window).height())
var common = {
  listen: function() {
    $(document).on("click", function() {
      $("#login-tan", window.parent.document).css({ display: "none" });
      $("#login-arr", window.parent.document).css(common.rotates(0));
    });
  },
  rotates: function(deg) {
    return {
      transform: "rotate(" + deg + "deg)",
      "-ms-transform": "rotate(" + deg + "deg)",
      "-moz-transform": "rotate(" + deg + "deg)" /* Firefox */,
      "-webkit-transform": "rotate(" + deg + "deg)" /* Safari 和 Chrome */,
      "-o-transform": "rotate(" + deg + "deg)" /* Opera */
    };
  },
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
common.listen();
