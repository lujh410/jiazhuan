// pages/coursedetail/coursedetail.js
//在使用的View中引入WxParse模块
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titles:["介绍","章节"],
    tabcurrentIndex:1,
    course_list: [],
    chapters:[],
    currentIndex:"",
    video_src:"",
    video_poster:"https://productoss.lzdxedu.com/image/column/sKfyYsfKRk.jpg",
    autoplay:false,
    ischaptershow:true,
    html_div_instro:'<div>我是HTML代码</div>',
    isfaved:false,
    course_id:"",
    openid:"",
    protitle:""

  },
  favclick(){
    this.setData({
      isfaved:!this.data.isfaved
    })
    if (this.data.isfaved){
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        duration: 1000
      })
      this.addfav(this.data.course_id)
   }else{
      wx.showToast({
        title: '已删除收藏',
        icon: 'success',
        duration: 1000
      })
     this.removefav(this.data.course_id)
   }
  },
  addfav(course_id){
    const that = this
    const db = wx.cloud.database()
    // 2. 构造查询语句
    // collection 方法获取一个集合的引用
    // where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等），具体见文档查看支持列表
    // get 方法会触发网络请求，往数据库取数据
    db.collection('favcourse').add({
    // data 字段表示需新增的 JSON 数据
        data: {
          course_id:course_id
        },
        success: function(res) {
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
          console.log(res)
        }
      })
  },
  removefav(course_id){
    const that = this
    const db = wx.cloud.database()
    // 2. 构造查询语句
    // collection 方法获取一个集合的引用
    // where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等），具体见文档查看支持列表
    // get 方法会触发网络请求，往数据库取数据
    console.log(course_id,that.data.openid)
    wx.cloud.callFunction({
      // 云函数名称
      name: 'removefav',
      // 传给云函数的参数
      data: {
        dbname: 'favcourse',
        course_id: course_id,
        _openid:that.data.openid
      },
    })
    .then(res => {
      console.log('remove ok',res.result)
    })
    .catch(console.error)
  },
  get_openid(){
    wx.cloud.callFunction({
      // 云函数名称
      name: 'user',
    })
    .then(res => {
       this.setData({
         openid:res.result.openid
        })
    })
    .catch(console.error)
  },
  tapitemClick(e) {
    // 1.设置最新的index
    this.setData({
      tabcurrentIndex: e.currentTarget.dataset.index
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
  get_courses(id){
    // 1. 获取数据库引用
    const that = this
    const db = wx.cloud.database()
    // 2. 构造查询语句
    // collection 方法获取一个集合的引用
    // where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等），具体见文档查看支持列表
    // get 方法会触发网络请求，往数据库取数据
    db.collection('course').where({
      _openid: 'ossYw5aGvHZfhkd02Z91v-keAHLE',
      id: id
    }).get({
      success: function(res) {
        that.setData({
          course_list: res.data[0],
          chapters:res.data[0].chapters,
          // currentIndex:0,
          video_src:res.data[0].chapters[0].video_src,
          video_poster:res.data[0].video_poster,
          html_div_instro:res.data[0].html_div_instro,
          protitle:res.data[0].protitle
        })
        that.show_html_div_instro(that.data.html_div_instro)
    }
    })
  },
  get_favcourses(id){
    // 1. 获取数据库引用
    const that = this
    const db = wx.cloud.database()
    // 2. 构造查询语句
    // collection 方法获取一个集合的引用
    // where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等），具体见文档查看支持列表
    // get 方法会触发网络请求，往数据库取数据
    wx.cloud.callFunction({
      // 云函数名称
      name: 'user',
    })
    .then(res => {
       this.setData({
         openid:res.result.openid
        })
        //检查是否被收藏
        db.collection('favcourse').where({
          _openid: res.result.openid,
          course_id: id
        }).get({
          success: function(res) {
            that.setData({
              isfaved:res.data.length
            })
        }
        })
        //检查学习历史记录
        db.collection('learnhistory').where({
          _openid: res.result.openid,
          course_id: id
        }).get({
          success: function(res) {
            const currentIndex=res.data[0].currentIndex
            that.setData({
              currentIndex:currentIndex,
              video_src:that.data.chapters[currentIndex].video_src,
              autoplay:true
            })
        }
        })

    })
  },
  charpterclick(e){
    const current_index = e.currentTarget.dataset.index
    this.setData({
      currentIndex:current_index,
      video_src:this.data.chapters[current_index].video_src,
      autoplay:true
    })
    this.add_learnhistory(this.data.course_id,current_index)
  },
  add_learnhistory(course_id,currentIndex){
    const that = this
    const db = wx.cloud.database()
   
    wx.cloud.callFunction({
      // 云函数名称
      name: 'removefav',
      // 传给云函数的参数
      data: {
        dbname: 'learnhistory',
        course_id: course_id,
        _openid:that.data.openid
      },
    })
    .then(res => {
      console.log('remove ok',res.result)
      db.collection('learnhistory').add({
        // data 字段表示需新增的 JSON 数据
            data: {
              course_id:course_id,
              currentIndex:currentIndex,
              // currentIndex:0,
              // video_src:res.data[0].chapters[0].video_src,
              // video_poster:res.data[0].video_poster,
              // html_div_instro:res.data[0].html_div_instro,
              course_list:that.data.course_list
            },
            success: function(res) {
              // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
              console.log(res)
            }
          })
    })
    .catch(console.error)



  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_openid()
    this.get_courses(options.id)
    this.setData({
      course_id:options.id
    })
    this.get_favcourses(options.id)
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