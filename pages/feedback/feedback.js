// pages/feedback/feedback.js
const app = getApp()
import {
  $init,
  $digest
} from '../../utils/common.util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: [],
    t_length: 0,
    content: '',
    tel: '',
    title: '',
    videoSrc: ''
  },
  bindText: function(e) {
    var t_text = e.detail.value.length;
    this.setData({
      t_length: t_text,
      content: e.detail.value
    })
  },
  bindTitle: function(e) {
    var t_title = e.detail.value;
    this.setData({
      title: t_title
    })
  },
  bindTel: function(e) {
    var t_tel = e.detail.value;
    this.setData({
      tel: t_tel
    })
  },
  // 图片上传
  chooseImage(e) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const images = this.data.images.concat(res.tempFilePaths)
        // 限制最多只能留下3张照片
        this.data.images = images.length <= 9 ? images : images.slice(0, 9)
        $digest(this)
      }
    })
  },
  removeImage(e) {
    const idx = e.target.dataset.idx
    this.data.images.splice(idx, 1)
    $digest(this)
  },
  removeVideo() {
    this.setData({
      videoSrc: ''
    })
  },
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images
    wx.previewImage({
      current: images[idx], //当前预览的图片
      urls: images, //所有要预览的图片
    })
  },
  chooseVideo() {
    let that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success(res) {
        that.setData({
          videoSrc: res.tempFilePath
        })
      }
    })
  },
  // 提交
  submit: function(e) {
    var that = this
    var openid = app.globalData.openid;
    //获取提问内容
    var content = that.data.content;
    var title = that.data.title;
    var tel = that.data.tel;
    //获取图片
    var imglist = that.data.images;
    if (!content || !tel || !title) {
      wx.showToast({
        title: '请填写完整后提交',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.showLoading({
        title: '上传中',
      })
      if (imglist == '') {
        if (!that.data.videoSrc) {
          wx.request({
            url: 'https://ytspiao.ytsshop.com/index.php/api/XiaoApi/opinion',
            data: {
              content: content,
              tel: tel,
              title: title
            },
            success: function(res) {
              if (res.data.code == 1) {
                wx.showToast({
                  title: '提交成功',
                  icon: 'success',
                  duration: 2000
                })
                wx.hideLoading()
                wx.navigateBack()
              } else {
                wx.showToast({
                  title: '提交失败，请重试',
                  icon: 'none',
                  duration: 2000
                })
                wx.hideLoading()
                wx.navigateBack()
              }
            }
          })
        } else {
          wx.uploadFile({
            url: 'https://ytspiao.ytsshop.com/index.php/api/XiaoApi/opinion',
            filePath: that.data.videoSrc,
            name: 'videourl',
            formData: {
              content: content,
              tel: tel,
              title: title
            },
            success: function(res) {
              var jsonda = JSON.parse(res.data);
              if (jsonda.code == 1) {
                wx.showToast({
                  title: '提交成功',
                  icon: 'success',
                  duration: 2000
                })
                wx.hideLoading()
                wx.navigateBack()
              } else {
                wx.showToast({
                  title: '提交失败，请重试',
                  icon: 'none',
                  duration: 2000
                })
                wx.hideLoading()
                wx.navigateBack()
              }
            }
          })
        }
      } else {
        wx.uploadFile({
          url: 'https://ytspiao.ytsshop.com/index.php/api/XiaoApi/opinion',
          filePath: imglist[0],
          name: 'files',
          formData: {
            content: content,
            tel: tel,
            title: title
          },
          success: function(res) {
            var jsonda = JSON.parse(res.data);
            if (jsonda.code == 1) {
                if (imglist.length > 1) {
                  that.scfile(jsonda.data, imglist, 1, imglist.length)
                } else {
                  if (that.data.videoSrc) {
                    wx.uploadFile({
                      url: 'https://ytspiao.ytsshop.com/index.php/api/XiaoApi/videoFile',
                      filePath: that.data.videoSrc,
                      name: 'voideurl',
                      formData: {
                        mid: jsonda.data
                      },
                      success: function() {
                        wx.showToast({
                          title: '提交成功',
                          icon: 'success',
                          duration: 2000
                        })
                        wx.hideLoading()
                        wx.navigateBack()
                      }
                    })
                  } else {
                    wx.showToast({
                      title: '提交失败，请稍后重试',
                      icon: 'none',
                      duration: 2000
                    })
                    wx.hideLoading()
                    wx.navigateBack()
                  }
                }
            }else{
              wx.showToast({
                title: '提交失败，请稍后重试',
                icon: 'none',
                duration: 2000
              })
              wx.hideLoading()
              wx.navigateBack()
            }
          }
        })
      }
    }
  },

  // 递归
  scfile: function(jsonid, imglist, i, dq) {
    var that = this;
    wx.uploadFile({
      url: 'https://ytspiao.ytsshop.com/index.php/api/XiaoApi/opinion',
      filePath: imglist[i],
      name: 'files',
      formData: {
        mid: jsonid
      },
      success: function(res) {
        var jsonda = JSON.parse(res.data);
        if (jsonda.code == 1) {
          i++;
          if (i < dq) {
            that.scfile(jsonid, imglist, i, imglist.length)
          } else {
            if (that.data.videoSrc) {
              wx.uploadFile({
                url: 'https://ytspiao.ytsshop.com/index.php/api/XiaoApi/videoFile',
                filePath: that.data.videoSrc,
                name: 'voideurl',
                formData: {
                  mid: jsonid
                },
                success: function(res) {
                  var jsonda = JSON.parse(res.data);
                  if (jsonda.code == 1) {
                    wx.hideLoading()
                    wx.navigateBack()
                    wx.showToast({
                      title: '提交成功',
                      icon: 'success',
                      duration: 2000
                    })
                  } else {
                    wx.hideLoading()
                    wx.navigateBack()
                    wx.showToast({
                      title: jsonda.msg,
                      icon: 'none',
                      duration: 2000
                    })
                  }
                }
              })
            } else {
              wx.hideLoading()
              wx.navigateBack()
              wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 2000
              })
            }
          }
        } else {
          wx.hideLoading()
          wx.navigateBack()
          wx.showToast({
            title: jsonda.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    $init(this)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})