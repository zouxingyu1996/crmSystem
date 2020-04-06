// pages/discuss/discuss.js
//获取应用实例
const app = getApp()
import { $init, $digest } from '../../utils/common.util'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    wjx: 5,
    t_length: 0,
    cid: '',
    images: [],
    content: '',
    orderid: ''
  },
  // 评分点击
  pjwujiao: function (e) {
    var that = this;
    const wjx = e.currentTarget.dataset.wjx;
    that.setData({
      wjx: wjx
    })
  },
  bindText: function (e) {
    var t_text = e.detail.value.length;
    this.setData({
      t_length: t_text,
      content: e.detail.value
    })
  },
  // 图片上传
  chooseImage(e) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
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

  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images
    wx.previewImage({
      current: images[idx],  //当前预览的图片
      urls: images,  //所有要预览的图片
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    $init(this)
    let that = this
    console.log(options.orderid)
    that.setData({
      cid: options.id,
      orderid: options.orderid
    })
  },

  // 提交
  submit: function (e) {
    var that = this
    var openid = app.globalData.openid;
    //获取提问内容
    var content = that.data.content;
    //获取图片
    var imglist = that.data.images;
    // console.log(imglist);
    if (content == '') {
      wx.showToast({
        title: '内容不能为空',
        icon: 'loading',
        duration: 1000,
        mask: true
      })
    } else {
      wx.showLoading({
        title: '上传中',
      })
      if (imglist == '') {
        wx.request({
          url: 'https://ytspiao.ytsshop.com/index.php/api/XiaoApi/get_content',
          data: {
            comment: content,
            openid: openid,
            cid: that.data.cid,
            star: that.data.wjx,
            orderid: that.data.orderid
          },
          success: function () {
            wx.hideLoading()
            wx.navigateBack()
          }
        })
      } else {
        wx.uploadFile({
          url: 'https://ytspiao.ytsshop.com/index.php/api/XiaoApi/file_comment',
          filePath: imglist[0],
          name: 'commentimg',
          formData: {
            comment: content,
            openid: openid,
            cid: that.data.cid,
            mid: '',
            star: that.data.wjx,
            orderid: that.data.orderid
          },
          success: function (res) {
            if (imglist.length > 1) {
              var jsonda = JSON.parse(res.data);
              that.scfile(jsonda.data, imglist, 1, imglist.length)
            } else {
              wx.hideLoading()
              wx.navigateBack()
            }
          }
        })
      }
    }
  },

  // 递归
  scfile: function (jsonid, imglist, i, dq) {
    var that = this;
    wx.uploadFile({
      url: 'https://ytspiao.ytsshop.com/index.php/api/XiaoApi/file_comment',
      filePath: imglist[i],
      name: 'commentimg',
      formData: {
        mid: jsonid
      },
      success: function (res) {
        i++;
        if (i < dq) {
          that.scfile(jsonid, imglist, i, imglist.length)
        } else {
          wx.hideLoading()
          wx.navigateBack()
        }
      }
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