// pages/hotel/hotel.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    imgUrls1: [
      // 'http://tj.ytsshop.com/img/huodong1.png',
      // 'http://tj.ytsshop.com/img/huodong2.png',
      // 'http://tj.ytsshop.com/img/huodong3.png',
      // 'http://tj.ytsshop.com/img/huodong4.png',
      // 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      // 'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      // 'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640',
      // 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      // 'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      // 'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    indicatorDots: false, //是否显示面板指示点
    autoplay: true, //是否自动播放
    interval: 5000, //停留时间间隔
    duration: 1000, //播放时长
    previousMargin: '100rpx', //前边距，可用于露出前一项的一小部分，接受 px 和 rpx 值
    nextMargin: '100rpx', //后边距，可用于露出后一项的一小部分，接受 px 和 rpx 值
    circular: true, //是否采用衔接滑动
    currentSwiperIndex: 0 //swiper当前索引
  },
  swiperBindchange(e) {
    this.setData({
      currentSwiperIndex: e.detail.current
    })
  },
  navClick(e) {
    let type = e.currentTarget.dataset.type
    let _id = ''
    if (e.currentTarget.dataset.id){
      _id = e.currentTarget.dataset.id
    }else{
      _id = 0
    }
    if (type === 1 && _id !== 0){
      wx.navigateTo({
        url: "/pages/house/house?id=" + _id
      })
    } else if (type === 2 && _id !== 0){
      wx.navigateTo({
        url: "/pages/detail/detail?id=" + _id
      })
    } else if (type === 3 && _id !== 0) {
      wx.navigateTo({
        url: "/pages/program_detail/program_detail?id=" + _id
      })
    } else if (type === 4 && _id !== 0) {
      wx.navigateTo({
        url: "/pages/activity/activity?id=" + _id
      })
    }
  },
  navClick1(e) {
    let _id = ''
    if (e.currentTarget.dataset.id) {
      _id = e.currentTarget.dataset.id
    } else {
      _id = 0
    }
    if (_id !== 0) {
      wx.navigateTo({
        url: "/pages/house/house?id=" + _id
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.stopPullDownRefresh()
    wx.hideTabBar()
    let that = this
    wx.request({
      url: 'https://ytspiao.ytsshop.com/api/Xiaohotel/hotel_index',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 1) {
          if (res.data.data.doings.length > 0){
            var strs = res.data.data.doings
          } else {
            var strs = [
              "http://tj.ytsshop.com/attachment/images/ban3.jpg",
              "http://tj.ytsshop.com/attachment/images/ban4.jpg",
              "http://tj.ytsshop.com/attachment/images/ban5.jpg"
            ];
          }
          if (res.data.data.hotel.length > 0) {
            var _hosList = res.data.data.hotel
          }
          if (res.data.data.list.length > 0) {
            var _imgUrls1 = res.data.data.list
          }
        }
        that.setData({
          imgUrls: strs,
          hosList: _hosList,
          imgUrls1: _imgUrls1
        })
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