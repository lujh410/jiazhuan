// miniprogram/pages/home/home.js
//const config = require('../../common/config')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners:"",
    advertisements:""
  },
  courseitemclick(e){
    wx.navigateTo({
      url: "/pages/robotcoursesdetail/robotcoursesdetail?id=" + e.currentTarget.dataset.id
    })
  },
  courseitemclick05(){
    wx.switchTab({
      url: "/pages/institute/institute"
    })
  },
  itemClick(e) {
    // 1.设置最新的index
    this.setData({
      currentIndex: e.currentTarget.dataset.index
    })
    console.log(e.currentTarget.dataset.index)
  },
  get_data(){
    const that = this
    const db = wx.cloud.database()
    wx.cloud.callFunction({
      // 云函数名称
      name: 'user',
    })
    .then(res => {
       that.setData({
         openid:res.result.openid
        })
        db.collection('homeconfig').where({
          // _openid: res.result.openid,
          _openid:'ossYw5aGvHZfhkd02Z91v-keAHLE'
        }).get({
          success: function(res) {
            console.log(res)
            const banners =  res.data[0].banner
            const advertisements = res.data[0].advertisement
            that.setData({
              banners:banners,
              advertisements:advertisements
            })
        }
        })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_data()
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

  },
  getnews(pagenum){
    const that = this
    //微信、百度等小程序参考代码，和 Jquery发送ajax请求是一样的
    const key='b790d0c48f60eba9d200afc89ee82070'
    wx.request({
      url: 'https://api.tianapi.com/topnews/index?key='+key+'&num=20&page='+pagenum, 
      success: function (res) {
        const news = that.data.news
        if(res.data.code == 200){
          news.push(...res.data.newslist)
        that.setData({
          news:news
        })
      }else{
            console.log(res.data.msg) 
      }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  newsitemtap(e){
    wx.navigateTo({
      url: '/pages/news_detail/news_detail?id='+e.currentTarget.dataset.key,
    })
  },
  newsmoretap(){
    wx.navigateTo({
      url: '/pages/news/news',
    })
  },
  libarymoretap(){
    wx.switchTab({
      url: '/pages/library/library',
    })
  }
})