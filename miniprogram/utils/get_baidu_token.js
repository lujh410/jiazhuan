const client_id ="XKH7mBLePPi0bP2KaLTT0BGP"
const client_secret = "6hc8dQErnS7flkFz0r5hQLlICrLS82N0"
function get_token(){
  return new Promise(function (resolve, reject) {
    wx.request({
            url: "https://aip.baidubce.com/oauth/2.0/token",
            method: 'POST',
            data: {
              grant_type: "client_credentials",
              client_id: client_id,
              client_secret: client_secret
            },
            header:{
              "content-type": "application/x-www-form-urlencoded" 
            },
            success:function(res){
              resolve(res.data)
            },
            fail: function (res) {
              // 回调失败时
              if (typeof reject == 'function') {
                reject(res);
              } else {
                console.log(res);
              }
            },
    })
  })
}
module.exports = {
  get_token: get_token
}