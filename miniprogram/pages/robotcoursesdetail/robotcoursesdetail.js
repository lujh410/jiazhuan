// pages/robotcoursesdetail/robotcoursesdetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const array_id = ['courseitem1','courseitem2','courseitem3','courseitem4']
    for(var index in array_id) {
      if (options.id == array_id[index]){
        const courseitem = '#'+options.id
        var that = this;
        var query = wx.createSelectorQuery().in(that);
        query.selectViewport().scrollOffset()
        query.select(courseitem).boundingClientRect();
        query.exec(function (res) {
          console.log(res);
          var miss = res[0].scrollTop + res[1].top - 10;
          wx.pageScrollTo({
            scrollTop: miss,
            duration: 300
          });        
        });
      }
    }
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