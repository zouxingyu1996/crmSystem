// pages/reserve/reserve.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    id: '',
    arr1: [],
    arr2: [],
    arr3: []
  },

  delorder: function (e) {
    var that = this
    wx.showLoading({
      title: '请稍后'
    })
    wx.request({
      url: 'https://ytspiao.ytsshop.com/index.php/api/Xiaohotel/delOrder',
      data: {
        id: e.currentTarget.dataset.orderid
      },
      success: function (res) {
        if (res.data.code == 1) {
          wx.hideLoading()
          that.testorders()
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '取消失败，请稍后重试',
            icon: "none",
            duration: 2000
          })
        }
      }
    })
  },

// 取消预订
  cancelOrder: function (e) {
    var that = this
    wx.showLoading({
      title: '请稍后'
    })
    wx.request({
      url: 'https://ytspiao.ytsshop.com/index.php/api/Xiaohotel/cancelOrder',
      data: {
        id: e.currentTarget.dataset.orderid
      },
      success: function (res) {
        if (res.data.code == 1) {
          wx.hideLoading()
          that.testorders()
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '删除失败，请稍后重试',
            icon: "none",
            duration: 2000
          })
        }
      }
    })
  },

  testorders: function () {
    var that = this
    wx.request({
      url: 'https://ytspiao.ytsshop.com/api/Xiaohotel/orderlist',
      data: {
        openid: app.globalData.openid
      },
      success: function (res) {
        let arr1 = []
        let arr2 = []
        let arr3 = []
        let data = res.data.data
        if (res.data.code == 1) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].is_confirm == 0) {
              arr1.push(data[i])
            } else if (data[i].is_confirm == 1) {
              arr2.push(data[i])
            }else if (data[i].is_confirm == 2) {
              arr3.push(data[i])
            } 
          }
          that.setData({
            arr1: arr1,
            arr2: arr2,
            arr3: arr3
          })
        }
      }
    })
  },

  onConfirm: function () {
    this.setData({
      showModal: false
    });
    wx.navigateTo({
      url: '../../pages/order/order?id=' + this.data.orderid
    })

  },
  /**
 * 隐藏模态对话框
 */
  // hideModal: function () {
  //   console.log(1241)
  //   this.setData({
  //     showModal: false
  //   });
  // },
  preventTouchMove: function () {
  },
  //滑动切换
  swiperTab: function (e) {
    var that = this;
    var current = e.detail.current
    that.setData({
      currentTab: current
    });
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    var current = e.target.dataset.current
    if (this.data.currentTab === current) {
      return false;
    } else {
      that.setData({
        currentTab: current
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if (options) {
      var id = options.id;
      if (id == "undefined" || id == "null" || id == undefined || id == null) {
        id = 0;
      }
      that.setData({
        currentTab: id
      })
    }
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
    this.testorders()
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