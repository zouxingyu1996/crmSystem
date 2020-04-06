// pages/me/me.js
//获取应用实例
const app = getApp()
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //获取全局变量 导航栏的高度statusBarHeight
    statusBarHeight: getApp().globalData.statusBarHeight,
    city: '定位',
    loading: true,
    userInfo: {},
    imgUrls: [ //轮播图列表
    ],
    hosList: [

    ],
    sellList: [

    ],
    strategyList: [

    ]
  },
  navClick: function(e) {
    let _url = e.currentTarget.dataset.url
    if (_url){
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      })
    }
    // console.log(e.currentTarget.dataset.url)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.stopPullDownRefresh()
    wx.hideTabBar()
    qqmapsdk = new QQMapWX({
      key: 'A5YBZ-JEUW4-76EUK-XGYVV-ECY6F-ATBNZ' //自己的key秘钥 http://lbs.qq.com/console/mykey.html 在这个网址申请
    });
    let that = this
    wx.request({
      url: 'https://ytspiao.ytsshop.com/api/Xiaoapi/slideshow',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.code == 1 && res.data.data.length > 0) {
          var strs = res.data.data
        } else {
          var strs = [
            "http://tj.ytsshop.com/attachment/images/ban3.jpg",
            "http://tj.ytsshop.com/attachment/images/ban4.jpg",
            "http://tj.ytsshop.com/attachment/images/ban5.jpg"
          ];
        }
        that.setData({
          imgUrls: strs
        })
      }
    })
    wx.request({
      url: 'https://ytspiao.ytsshop.com/api/Xiaoapi/hotSpots',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.code == 1) {
          that.setData({
            hosList: res.data.data,
            loading: false
          })
        }
      }
    })
    wx.request({
      url: 'https://ytspiao.ytsshop.com/api/Xiaoapi/hotProject',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.code == 1) {
          that.setData({
            sellList: res.data.data
          })
        }
      }
    })
    wx.request({
      url: 'https://ytspiao.ytsshop.com/api/Xiaoapi/Strategylist',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 1) {
          that.setData({
            strategyList: res.data.data
          })
        }
      }
    })
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        that.getLocal(latitude, longitude)
      }
    })
  },
  // 获取当前地理位置
  getLocal: function (latitude, longitude) {
    let vm = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        let city = res.result.ad_info.city
        vm.setData({
          city: city
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        // console.log(res);
      }
    });
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
    this.onLoad()
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