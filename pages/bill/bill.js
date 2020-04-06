// pages/bill/bill.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    orderid: 0,
    arr1: [],
    arr2: [],
    arr3: [],
    arr4: []
  },
  redelete: function (e) {
    var that = this
    wx.showLoading({
      title: '请稍后'
    })
    wx.request({
      url: 'https://ytspiao.ytsshop.com/index.php/api/Xiaoapi/redelete',
      data: {
        orderid: e.currentTarget.dataset.orderid
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
  delorder: function (e) {
    var that = this
    wx.showLoading({
      title: '请稍后'
    })
    wx.request({
      url: 'https://ytspiao.ytsshop.com/index.php/api/Xiaoapi/closeOrder',
      data: {
        id: e.currentTarget.dataset.orderid
      },
      success: function (res) {
        if (res.data.code == 1) {
          wx.hideLoading()
          that.testorders()
        }else{
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
      url: 'https://ytspiao.ytsshop.com/index.php/api/Xiaoapi/getUserOrder',
      data: {
        open_id: app.globalData.openid
      },
      success: function (res) {
        let arr1 = []
        let arr2 = []
        let arr3 = []
        let arr4 = []
        let data = res.data.data
        if(res.data.code == 1){
          for (let i = 0; i <data.length;i++){
            if (data[i].status == 1){
              arr1.push(data[i])
            } else if (data[i].status == 2){
              arr2.push(data[i])
            } else if (data[i].status == 3) {
              arr3.push(data[i])
            } else if (data[i].status == 5) {
              arr4.push(data[i])
            }
          }
          that.setData({
            arr1: arr1,
            arr2: arr2,
            arr3: arr3,
            arr4: arr4
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