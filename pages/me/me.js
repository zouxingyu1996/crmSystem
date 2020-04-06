// pages/me/me.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collection: 0,
    order: 0,
    show_info: false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  move(){

  },
  hideInfo: function() {
    this.setData({
      show_info: false
    })
  },
  showInfo: function() {
    this.setData({
      show_info: true
    })
  },
  getUserInfo: function (e) {
    let that = this
    app.globalData.userInfo = e.detail.userInfo
    if (app.globalData.userInfo) {
      wx.request({
        url: 'https://ytspiao.ytsshop.com/index.php/api/Xiaoapi/userinfo',
        data: {
          openid: app.globalData.openid,
          user: app.globalData.userInfo
        },
        success: function (res) {
          if (res.data.code == 1 || res.data.code == 5 || res.data.code == 4) {
            that.setData({
              show_info: false,
              userInfo: e.detail.userInfo,
              hasUserInfo: true
            })
          } else{
            wx.showToast({
              title: '用户信息获取失败，请重试',
              icon: "none",
              duration: 2000
            })
            that.setData({
              show_info: false,
              userInfo: {},
              hasUserInfo: false
            })
          }
        }
      })
      // this.setData({
      //   userInfo: e.detail.userInfo,
      //   hasUserInfo: true
      // })
    }
  },
  //联系客服
  calling: function () {
    wx.makePhoneCall({
      phoneNumber: '073189729627',
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.stopPullDownRefresh()
    wx.hideTabBar()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        lang: "zh_CN",
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  userNum(){
    let that = this
    wx.request({
      url: 'https://ytspiao.ytsshop.com/index.php/api/XiaoApi/userNum',
      data: {
        openid: app.globalData.openid
      },
      success: function (res) {
        if (res.data.code == 1) {
          that.setData({
            order: res.data.order,
            collection: res.data.collection
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.userNum()
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