// tips：核心部分是在本地完成base64 编码
// function OcrIdCard(access_token){
//   return new Promise(function(resolve,reject){
//     var that = this;
//     //识别身份证
//     wx.chooseImage({
//       count: 1,
//       sizeType: ['compressed'],
//       sourceType: ['album', 'camera'],
//       success: function (res) {
//         console.log(res.tempFilePaths)
//           //核心代码
//         wx.getFileSystemManager().readFile({
//           filePath: res.tempFilePaths[0],
//           encoding: 'base64', //编码格式
//           success(ans) {
//             // console.log(ans.data)
//             wx.showLoading({ title: '识别中' })
//             wx.request({
//               url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/idcard?access_token=' + access_token,
//               method: 'POST',
//               header: {
//                 'Content-Type': 'application/x-www-form-urlencoded'
//               },
//               data: {
//                 image: ans.data,
//                 id_card_side: 'front'
//               },
//               success(_res) {
//                 wx.hideLoading();
//                 resolve(_res)
                
//               }, fail(_res) {
//                 wx.hideLoading();
//                 wx.showToast({
//                   title: '请求出错',
//                 })
//                 reject(_res)
//               }
//             })
//           }
//         })
//       }
//     })
//   })
// }
function uploadimg(){
  //上转图片转成base64格式
  return new Promise(function(resolve,reject){
  wx.chooseImage({
    count: 1,
    sizeType: ['compressed'], // 指定只能为压缩图，首先进行一次默认压缩
    sourceType: ['album', 'camera'],// 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      //console.log(res.tempFilePaths)
        //核心代码
      wx.getFileSystemManager().readFile({
        filePath: res.tempFilePaths[0],
        encoding: 'base64', //编码格式
        success(res) {
          //console.log(ans.data)
          resolve(res.data)
        }
      })
    }
  })
})
}
function OcrCommon(access_token,imgdata) {
  //一般通用文字识别
  return new Promise(function(resolve,reject){
      var that = this;
      wx.showLoading({ title: '识别中' })
      //var base_url = 'https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic'
      //var base_url = 'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic'
      var base_url = 'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate'
      wx.request({
        url: base_url+'?access_token=' + access_token,
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          image: imgdata,
        },
        success(_res) {
          wx.hideLoading();
          resolve(_res)
          
        }, fail(_res) {
          wx.hideLoading();
          wx.showToast({
            title: '请求出错',
          })
          reject(_res)
        }
    })
  })
}
function OcrIdCard(access_token,imgdata) {
  return new Promise(function(resolve,reject){
      var that = this;
      wx.showLoading({ title: '识别中' })
      wx.request({
        url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/idcard?access_token=' + access_token,
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          image: imgdata,
          id_card_side: 'front'
        },
        success(_res) {
          wx.hideLoading();
          resolve(_res)
          
        }, fail(_res) {
          wx.hideLoading();
          wx.showToast({
            title: '请求出错',
          })
          reject(_res)
        }
    })
  })
}
function Ocrbankcard(access_token,imgdata) {
  return new Promise(function(resolve,reject){
      var that = this;
      var base_url='https://aip.baidubce.com/rest/2.0/ocr/v1/'
      var category='bankcard'
      wx.showLoading({ title: '识别中' })
      wx.request({
        url: base_url+category+'?access_token=' + access_token,
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          image: imgdata,
          detect_direction: 'true'
        },
        success(_res) {
          wx.hideLoading();
          resolve(_res)
          
        }, fail(_res) {
          wx.hideLoading();
          wx.showToast({
            title: '请求出错',
          })
          reject(_res)
        }
    })
  })
}
module.exports = {
  OcrIdCard: OcrIdCard,
  uploadimg: uploadimg,
  Ocrbankcard:Ocrbankcard,
  OcrCommon:OcrCommon
}