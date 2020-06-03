// miniprogram/pages/index/index.js
const config = require('../../common/config')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners:config.banners,
    teams:config.teams,
    teams_detail:config.teams_detail,
    currentIndex:0,
    news:[],
    pagenum:1
  },

  itemClick(e) {
    // 1.设置最新的index
    this.setData({
      currentIndex: e.currentTarget.dataset.index
    })
    console.log(e.currentTarget.dataset.index)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.teams[0])
    const v = this.data.teams[1]
   console.log(this.data.teams_detail[v])
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
    this.getnews(this.data.pagenum)
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