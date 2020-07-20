// pages/robotcourses/robotcourses.js
//在使用的View中引入WxParse模块
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image:"cloud://prod-vd3xs.7072-prod-vd3xs-1302660826/homeconfig/qiye_code.png",
    html_div_instro:"",
    instro:'',
    markers: [{
      id: 0,
      name:"小青云工作室",
      title:"小青云工作室",
      latitude: 32.116002,
      longitude: 120.512953,
      width: 50,
      height: 50,
      scale:14,
      callout:{
        content:"小青云工作室",
        padding:10,
        display:'ALWAYS',
        textAlign:'center'
      }
    }],
    // polyline: [{
    //   points: [{
    //     longitude: 113.3245211,
    //     latitude: 23.10229
    //   }, {
    //     longitude: 113.324520,
    //     latitude: 23.21229
    //   }],
    //   color:"#FF0000DD",
    //   width: 2,
    //   dottedLine: true
    // }],
    // controls: [{
    //   id: 1,
    //   iconPath: '/resources/location.png',
    //   position: {
    //     left: 0,
    //     top: 300 - 50,
    //     width: 50,
    //     height: 50
    //   },
    //   clickable: true
    // }]
  },
  previewimg(){
    　　let _this = this
    　　//图片预览
        wx.previewImage({
          current:"cloud://prod-vd3xs.7072-prod-vd3xs-1302660826/homeconfig/qiye_code.png", // 当前显示图片的http链接
          urls:["cloud://prod-vd3xs.7072-prod-vd3xs-1302660826/homeconfig/qiye_code.png"] // 需要预览的图片http链接列表
        })
  },
  show_html_div_instro(html_div_instro){
    // var article = '<div>我是HTML代码</div>';
    var article = html_div_instro
    /**
    * WxParse.wxParse(bindName , type, data, target,imagePadding)
    * 1.bindName绑定的数据名(必填)
    * 2.type可以为html或者md(必填)
    * 3.data为传入的具体数据(必填)
    * 4.target为Page对象,一般为this(必填)
    * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
    */
    var that = this;
    WxParse.wxParse('article', 'html', article, that, 5);
  },
  get_instr(){
    // 1. 获取数据库引用
    const that = this
    const db = wx.cloud.database({
      env: 'prod-vd3xs'
    })
    db.collection('instro').where({
      _openid: 'ossYw5aGvHZfhkd02Z91v-keAHLE'
    }).get({
      success: function(res) {
        console.log(res)
        that.setData({
          instro:res.data[0],
        })
    }
    })
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.detail.markerId)
  },
  controltap(e) {
    console.log(e.detail.controlId)
  },

  getLocation(e){
    var that = this
    wx.chooseLocation({
      success: function (res) {
        console.log(res.address)
        console.log(res.latitude)
        console.log(res.longitude)
        console.log(res.name)
        var location = res.address
        that.setData({
          location: location
        })
      }
    })
  },

  gotohere(res){
    console.log(res);
    let lat = ''; // 获取点击的markers经纬度
    let lon = ''; // 获取点击的markers经纬度
    let name = ''; // 获取点击的markers名称
    let markerId = res.markerId;// 获取点击的markers  id
    let markers = res.currentTarget.dataset.markers;// 获取markers列表

    for (var i in markers){
      var item = markers[i]
      if (item.id == markerId) {
        lat = item.latitude;
        lon = item.longitude;
        name = item.callout.content;
        console.log(item)
        wx.openLocation({ // 打开微信内置地图，实现导航功能（在内置地图里面打开地图软件）
          latitude: lat,
          longitude: lon,
          name:name,
          success:function(res){
            console.log(res);
          },
          fail:function(res){
            console.log(res);
          }
        })
        break;
      }
    }
  },

  courseitemclick(e){
    wx.navigateTo({
      url: "/pages/robotcoursesdetail/robotcoursesdetail?id=" + e.target.id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_instr()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})