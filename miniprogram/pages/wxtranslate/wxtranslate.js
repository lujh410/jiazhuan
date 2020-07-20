// pages/wxtranslate/wxtranslate.js
//语音输入定义
var plugin = requirePlugin("WechatSI")
var speech_input = ""
let manager = plugin.getRecordRecognitionManager()

//manager.start({duration:30000, lang: "zh_CN"})
//-------------------------------------
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentText:"test"
  },
  initRecord: function() {
    //有新的识别内容返回，则会调用此事件
    manager.onRecognize = (res) => {
      let text = res.result
      this.setData({
        currentText: text,
      })
    }
    // 识别结束事件
    manager.onStop = (res) => {
      let text = res.result
      if(text == '') {
        // 用户没有说话，可以做一下提示处理...
        return
      }
      this.setData({
        currentText: text,
      })
      // 得到完整识别内容就可以去翻译了
      this.translateTextAction()
    }
  },
  streamRecord(){
    //manager.start({duration:30000, lang: "zh_CN"})
    this.initRecord()
    manager.start({lang: "zh_CN",})
  },
  endStreamRecord(){
      manager.stop()
 
  },
  translateTextAction(e){
      var that = this
    plugin.translate({
        // lfrom:"en_US",
        // lto:"zh_CN",
        lfrom:"zh_CN",
        lto:"en_US",
        content:that.data.currentText,
        success: function(res) {
          if(res.retcode == 0) {
            console.log("result", res.result)
            that.setData({
                output:res.result
            })
          } else {
            console.warn("翻译失败", res)
          }
        },
        fail: function(res) {
          console.log("网络失败",res)
        }
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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