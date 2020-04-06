// pages/order/order.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    list: [],
    img: '',
    orderid: 0,
    openid: ''
  },
  /**
* 对话框取消按钮点击事件
*/
  onCancel: function () {
    this.setData({
      showModal: false
    });
  },
  preventTouchMove: function(){

  },
  refund: function () {
    this.setData({
      showModal: true,
    });
  },
  onConfirm: function(){
    let that = this
    wx.request({
      url: 'https://ytspiao.ytsshop.com/index.php/api/XiaoApi/requestRefund',
      data: {
        orderid: that.data.orderid
      },
      success: function (res) {
        if (res.data.code == 1) {
          wx.navigateBack()
        } else {
          wx.showToast({
            title: '申请失败，请稍后重试',
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
  onLoad: function (options) {
    let that = this
    that.setData({
      orderid: options.id,
      openid: app.globalData.openid
    })
    wx.request({
      url: 'https://ytspiao.ytsshop.com/index.php/api/XiaoApi/orderDetail',
      data: {
        order_id: options.id
      },
      success: function (res) {
        if (res.data.code == 1) {
          that.setData({
            list: res.data.data[0]
          })
        } else {
          console.log('创建订单失败')
        }
      }
    })
    wx.request({
      url: 'https://ytspiao.ytsshop.com/index.php/api/XiaoApi/qrcode',
      data: {
        orderid: options.id,
        openid: app.globalData.openid
      },
      success: function (res) {
        that.setData({
          img: res.data
        })
        // if (res.data.code == 1) {
          
        // } else {
        //   console.log('创建订单失败')
        // }
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