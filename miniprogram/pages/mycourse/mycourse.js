// pages/mycourse/mycourse.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    course_list:[],
    institutename:""
  },
  coursebtn(e){
    wx.navigateTo({
      url: "/pages/coursedetail/coursedetail?id=" + e.currentTarget.dataset.id
    })
  },
  get_courses(course_id){
    // 1. 获取数据库引用
    const that = this
    const db = wx.cloud.database()
    // 2. 构造查询语句
    // collection 方法获取一个集合的引用
    // where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等），具体见文档查看支持列表
    // get 方法会触发网络请求，往数据库取数据
    const _ = db.command
    db.collection('course').where({
      _openid: 'ossYw5aGvHZfhkd02Z91v-keAHLE',
      id: _.in(course_id),
      auth:'True'
    }).get({
      success: function(res) {
        that.setData({
          course_list: res.data
        })  
    }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
   

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
        db.collection('favcourse').where({
          _openid: res.result.openid,
        }).get({
          success: function(res) {
            const course_id_list=[]
            for (var i=0;i< res.data.length;i++){
              course_id_list.push(res.data[i].course_id)
            }
            that.get_courses(course_id_list)
        }
        })
    })
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
    this.get_data()
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