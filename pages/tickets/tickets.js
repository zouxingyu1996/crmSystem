// pages/tickets/tickets.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    list: [

    ],
    loading: true,
    autoplay: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.stopPullDownRefresh()
    wx.hideTabBar()
    let that = this
    wx.request({
      url: 'https://ytspiao.ytsshop.com/api/Xiaoapi/spots',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 1) {
          that.setData({
            list: res.data.data,
            loading: false
          })
        }
      }
    })
  },
  //点击切换
  clickTab: function (e) {
    // console.log(e)
    var that = this;
    var current = e.target.dataset.current
    if (this.data.currentTab === current) {
      return false;
    } else {
      // this.orders(current)
      that.setData({
        currentTab: current
      })
    }
  },
  //滑动切换
  swiperTab: function (e) {
    var that = this;
    var current = e.detail.current
    // this.orders(current)
    that.setData({
      currentTab: current
    });
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
    this.onLoad()
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