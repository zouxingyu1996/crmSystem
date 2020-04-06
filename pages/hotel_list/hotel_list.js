// pages/hotel/hotel.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },
  //联系客服
  calling: function (e) {
    if (e.target.dataset.mobile) {
      wx.makePhoneCall({
        phoneNumber: e.target.dataset.mobile,
        success: function () {
          console.log("拨打电话成功！")
        },
        fail: function () {
          console.log("拨打电话失败！")
        }
      })
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '酒店暂未提供电话',
        showCancel: false,
        success: function (res) {
        },
        fail: function (res) {
        }
      })
    }

  },
  list() {
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://ytspiao.ytsshop.com/index.php/api/Xiaohotel/hotel_list',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 1) {
          wx.hideLoading()
          that.setData({
            list: res.data.data
          })
        } else {
          wx.hideLoading()
        }
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.stopPullDownRefresh()
    wx.hideTabBar()
    this.list()
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