// pages/collect/collect.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    total: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getUserCollection(){
    let that = this
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: 'https://ytspiao.ytsshop.com/index.php/api/XiaoApi/getUserCollection',
      data: {
        open_id: app.globalData.openid
      },
      success: function (res) {
        if (res.data) {
          let total = res.data.data.length
          that.setData({
            list: res.data.data,
            total: total
          })
          wx.hideLoading()
        } else {
          wx.hideLoading()
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
    this.getUserCollection()
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