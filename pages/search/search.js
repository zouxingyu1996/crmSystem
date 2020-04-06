// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    hosList: [],
    list: [],
    showList: false
  },
  bindText: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  search: function(){
    let that = this
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: 'https://ytspiao.ytsshop.com/index.php/api/XiaoApi/grabble',
      data: {
        grabble: that.data.content
      },
      success: function (res) {
        console.log(res.data.msg)
        if(res.data.code == 1){
          that.setData({
            list: res.data.msg,
            showList: true
          })
          wx.hideLoading()
        }else{
          wx.hideLoading()
          wx.showToast({
            title: '没有相关搜索信息，请换一个关键字',
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
    wx.request({
      url: 'https://ytspiao.ytsshop.com/index.php/api/XiaoApi/hotGrabble',
      success: function (res) {
        console.log(res.data.msg)
        if (res.data.code == 1) {
          that.setData({
            hosList: res.data.msg
          })
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