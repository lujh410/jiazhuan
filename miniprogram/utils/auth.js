
async function checkSession(){
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success() {
        return resolve(true)
      },
      fail() {
        return resolve(false)
      }
    })
  })
}

// 检测登录状态，返回 true / false
async function checkHasLogined() {
  const userInfo = wx.getStorageSync('userInfo')
  if (!userInfo) {
    return false
  }
}
//   const loggined = await checkSession()
//   if (!loggined) {
//     wx.removeStorageSync('token')
//     return false
//   }
//   return true
// }
async function wxaCode(){
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        return resolve(res.code)
      },
      fail() {
        wx.showToast({
          title: '获取code失败',
          icon: 'none'
        })
        return resolve('获取code失败')
      }
    })
  })
}

async function getUserInfo() {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success: res => {
        return resolve(res)
      },
      fail: err => {
        console.error(err)
        return resolve()
      }
    })
  })
}

async function login(page) {
  let that = page
  wx.login({
    success: function (res) {
      let code = res.code
      wx.setStorage({
        data: code,
        key: 'code',
      })
      wx.getUserInfo({
        success: function (res) {
           wx.setStorage({
            data: res.userInfo,
            key: 'userInfo',
          })
          that.setData({
            wxlogin : true,
            userInfo: res.userInfo
          })
        }
      })
    }
  })
}

function loginOut(){
  wx.removeStorageSync('token')
  wx.removeStorageSync('uid')
}

async function checkAndAuthorize (scope) {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res) {
        if (!res.authSetting[scope]) {
          wx.authorize({
            scope: scope,
            success() {
              resolve() // 无返回参数
            },
            fail(e){
              console.error(e)
              // if (e.errMsg.indexof('auth deny') != -1) {
              //   wx.showToast({
              //     title: e.errMsg,
              //     icon: 'none'
              //   })
              // }
              wx.showModal({
                title: '无权操作',
                content: '需要获得您的授权',
                showCancel: false,
                confirmText: '立即授权',
                confirmColor: '#e64340',
                success(res) {
                  wx.openSetting();
                },
                fail(e){
                  console.error(e)
                  reject(e)
                },
              })
            }
          })
        } else {
          resolve() // 无返回参数
        }
      },
      fail(e){
        console.error(e)
        reject(e)
      }
    })
  })  
}


module.exports = {
  checkHasLogined: checkHasLogined,
  wxaCode: wxaCode,
  getUserInfo: getUserInfo,
  login: login,
  loginOut: loginOut,
  checkAndAuthorize: checkAndAuthorize
}