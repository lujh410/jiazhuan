// pages/idcard/idcard.js
const cwx = require('../../utils/ocr.js'); //在小程序页面引入该js 文件
const get_baidu_token = require('../../utils/get_baidu_token.js'); //在小程序页面引入该js 文件
const compressimg = require('../../utils/compressimg.js'); //在小程序页面引入该js 文件
Page({

  /**
   * 页面的初始数据
   */
  data: {
    access_token: '',
    name:'',
    idcard:'',
    userloc:'',
    imgurl:'../../images/icon/car.svg',
    cWidth:0,
    cHeight:0,
    bankcardinfo:{},
    outputdata:[]

  },
  upload_copress_img(){
    compressimg.uploadcompressimg('canvas',this).then((res)=>{
      this.setData({
        imgurl:res.tempFilePath
      })
    })
  },
  upload_copress_imgdata(){
    const that = this
    compressimg.uploadcompressimgdata('canvas',that).then((imgdata)=>{
      get_baidu_token.get_token().then((res)=>{
        that.setData({
          access_token: res.access_token   
        })
        cwx.OcrIdCard(that.data.access_token,imgdata).then(function(_res){
          var trdata = _res.data.words_result;
          that.setData({
            name: trdata['姓名'].words,
            idcard: trdata['公民身份号码'].words,
            userloc: trdata['住址'].words
          })
        })
      })
  
    })
  },
  scanidcard_baidu(){
    const that = this
    get_baidu_token.get_token().then((res)=>{
      that.setData({
        access_token: res.access_token   
      })
      cwx.uploadimg().then(imgdata=>{
        cwx.OcrIdCard(that.data.access_token,imgdata).then(function(_res){
          var trdata = _res.data.words_result;
          console.log(11,trdata)
          that.setData({
            name: trdata['姓名'].words,
            idcard: trdata['公民身份号码'].words,
            userloc: trdata['住址'].words
          })
          console.log(222)
        })  
      })
    }).catch( (errMsg)=>{
      console.log(errMsg);
    })
  },

  scanbankcard_baidu(){
    const that = this
    get_baidu_token.get_token().then((res)=>{
      that.setData({
        access_token: res.access_token   
      })
      cwx.uploadimg().then(imgdata=>{
        cwx.Ocrbankcard(that.data.access_token,imgdata).then(function(_res){
          var trdata = _res.data.result;
          that.setData({
            bankcardinfo:trdata
          })
        })  
      })
    }).catch( (errMsg)=>{
      console.log(errMsg);
    })
  },
  scancommon_baidu(){
    const that = this
    get_baidu_token.get_token().then((res)=>{
      that.setData({
        access_token: res.access_token   
      })
      cwx.uploadimg().then(imgdata=>{
        cwx.OcrCommon(that.data.access_token,imgdata).then(function(_res){
          console.log(_res)
          var trdata = _res.data.words_result;
          that.setData({
            outputdata:trdata
          })
        })  
      })
    }).catch( (errMsg)=>{
      console.log(errMsg);
    })
  },
uploadimgbase64(){
    cwx.uploadimg().then(res=>{
      console.log(res)
    })
  },
//   ocridcard(){
//     var that = this;
//     cwx.OcrIdCard(that.data.access_token).then(function(_res){
//       var trdata = _res.data.words_result;
//       console.log(trdata)
//       that.setData({
//         name: trdata['姓名'].words,
//         idcard: trdata['公民身份号码'].words,
//         userloc: trdata['住址'].words
//       })
//     })      
//   },
    //身份证
    shenfenzheng() {
      this.photo("shenfenzheng")
    },
    //银行卡
    yinhangka() {
      this.photo("yinhangka")
    },
    //行驶证
    xingshizheng() {
      this.photo("xingshizheng")
    },
     //拍照或者从相册选择要识别的照片
  photo(type) {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        let imgUrl = res.tempFilePaths[0];
        that.uploadImg(type, imgUrl)
      }
    })
  },
  scanidcard(){
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths[0])
        wx.cloud.callFunction({
          // 云函数名称
          name: 'idcard',
          // 传给云函数的参数
          data: {
            imgUrl:tempFilePaths[0]
          },
        })
        .then(res => {
          console.log(res.result) // 3
        })
        .catch(console.error)
      }
    })
  },
    // 上传图片到云存储
    uploadImg(type, imgUrl) {
      let that = this
      wx.cloud.uploadFile({
        cloudPath: 'ocr/' + type + '.png',
        filePath: imgUrl, // 文件路径
        success: res => {
          console.log("上传成功", res.fileID)
          that.getImgUrl(type, res.fileID)
        },
        fail: err => {
          console.log("上传失败", err)
        }
      })
    },
      //获取云存储里的图片url
  getImgUrl(type, imgUrl) {
    let that = this
    wx.cloud.getTempFileURL({
      fileList: [imgUrl],
      success: res => {
        let imgUrl = res.fileList[0].tempFileURL
        console.log("获取图片url成功", imgUrl)
        that.shibie(type, imgUrl)
      },
      fail: err => {
        console.log("获取图片url失败", err)
      }
    })
  },

  //调用云函数，实现OCR识别
  shibie(type, imgUrl) {
    var that = this
    wx.cloud.callFunction({
      name: "ocr",
      data: {
        type: type,
        imgUrl: imgUrl
      },
      success(res) {
        console.log("识别成功", res)
        that.data.bankcardinfo['bank_card_number']=res.result.number
        that.setData({
         bankcardinfo: that.data.bankcardinfo
        })
      },
      fail(res) {
        console.log("识别失败", res)
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
    // wx.cloud.callFunction({
    //   // 云函数名称
    //   name: 'add',
    //   // 传给云函数的参数
    //   data: {
    //     a: 1,
    //     b: 2,
    //   },
    // })
    // .then(res => {
    //   console.log(1,res.result) // 3
    // })
    // .catch(console.error)
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