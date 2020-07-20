function uploadcompressimg(canvasId,that){
  return new Promise(function(resolve,reject){
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], // 指定只能为压缩图，首先进行一次默认压缩
      sourceType: ['album', 'camera'],// 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        //console.log(res.tempFilePaths)
          //核心代码
        // wx.getFileSystemManager().readFile({
        //   filePath: res.tempFilePaths[0],
        //   encoding: 'base64', //编码格式
        //   success(res) {
        //     //console.log(ans.data)
        //     resolve(res.data)
        //   }
        // })

        //打印未处理的图片信息
        wx.getFileInfo({
          filePath: res.tempFilePaths[0],
          success: function (res) {
            console.log(res);
          }
        })
        //-----压缩图片开始 (像素不超过750*1334)
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success: function (res) {
            console.log(res);
            let cW = res.width, cH = res.height;
            let cWidth = cW,cHeight= cH;

            if ((cW / cH)<0.56){ //说明 要依高为缩放比例--0.56是 750/1334的结果
              if (cH>1334){
                cHeight = 1334;
                cWidth = (cW * 1334) / cH;
              }

            } else {//要依宽为缩放比例
              if (cW > 750) {
                cWidth = 750;
                cHeight = (cH * 750) / cW;
              }
            }
            console.log(parseInt(cWidth));//计算出缩放后的宽
            console.log(parseInt(cHeight));//计算出缩放后的高
             that.setData({ cWidth: cWidth, cHeight: cHeight});//让canvas大小和要缩放的图片大小一致
            let imageW = cWidth, imageH = cHeight, imagePath = res.path;
            const ctx = wx.createCanvasContext(canvasId);
            ctx.drawImage(imagePath, 0, 0, cW, cH, 0, 0, imageW, imageH);
            ctx.draw(false, setTimeout(function () { // 一定要加定时器，因为ctx.draw()应用到canvas是有个时间的
              wx.canvasToTempFilePath({
                canvasId: canvasId,
                x: 0,
                y: 0,
                width: imageW,
                height: imageH,
    　　　　　　　　destWidth: imageW,
    　　　　　　　　destHeight: imageH,
                quality: 1,
                success: function (res) {
                  console.log(res);
                  resolve(res)

                    //打印处理后的图片信息
                    wx.getFileInfo({
                      filePath: res.tempFilePath,
                      success: function (res) {
                        console.log(res);
                      }
                    })

                },
              });
            }, 200));
          }
        });
        //-----压缩图片结束

        }
    })
})
}
function uploadcompressimgdata(canvasId,that){
  return new Promise(function(resolve,reject){
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], // 指定只能为压缩图，首先进行一次默认压缩
      sourceType: ['album', 'camera'],// 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        //console.log(res.tempFilePaths)
          //核心代码
        // wx.getFileSystemManager().readFile({
        //   filePath: res.tempFilePaths[0],
        //   encoding: 'base64', //编码格式
        //   success(res) {
        //     //console.log(ans.data)
        //     resolve(res.data)
        //   }
        // })

        //打印未处理的图片信息
        wx.getFileInfo({
          filePath: res.tempFilePaths[0],
          success: function (res) {
            console.log(res);
          }
        })
        //-----压缩图片开始 (像素不超过750*1334)
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success: function (res) {
            console.log(res);
            let cW = res.width, cH = res.height;
            let cWidth = cW,cHeight= cH;

            if ((cW / cH)<0.56){ //说明 要依高为缩放比例--0.56是 750/1334的结果
              if (cH>1334){
                cHeight = 1334;
                cWidth = (cW * 1334) / cH;
              }

            } else {//要依宽为缩放比例
              if (cW > 750) {
                cWidth = 750;
                cHeight = (cH * 750) / cW;
              }
            }
            console.log(parseInt(cWidth));//计算出缩放后的宽
            console.log(parseInt(cHeight));//计算出缩放后的高
             that.setData({ cWidth: cWidth, cHeight: cHeight});//让canvas大小和要缩放的图片大小一致
            let imageW = cWidth, imageH = cHeight, imagePath = res.path;
            const ctx = wx.createCanvasContext(canvasId);
            ctx.drawImage(imagePath, 0, 0, cW, cH, 0, 0, imageW, imageH);
            ctx.draw(false, setTimeout(function () { // 一定要加定时器，因为ctx.draw()应用到canvas是有个时间的
              wx.canvasToTempFilePath({
                canvasId: canvasId,
                x: 0,
                y: 0,
                width: imageW,
                height: imageH,
　　　　　 　　　destWidth: imageW,
　　　　　　 　　destHeight: imageH,
                quality: 0.6,
                success: function (res) {
                  console.log(res);
                  //打印处理后的图片信息
                  wx.getFileInfo({
                    filePath: res.tempFilePath,
                    success: function (res) {
                      console.log(res);
                    }
                  })
                  wx.getFileSystemManager().readFile({
                    filePath: res.tempFilePath,
                    encoding: 'base64', //编码格式
                    success(res) {
                      console.log("生成Base64完成")
                      resolve(res.data)
                    }
                  })
                },
              });
            }, 200));
          }
        });
        //-----压缩图片结束

        }
    })
})
}
module.exports = {
  uploadcompressimg: uploadcompressimg,
  uploadcompressimgdata:uploadcompressimgdata
}