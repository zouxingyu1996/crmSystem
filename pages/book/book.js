// pages/book/book.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseid:'',
    h_id:'',
    dateStart: '',//默认起始时间  
    dateEnd: '',//默认结束时间 
    day:'',
    key:'',
    radioId: "",
    num:1,
    price:'',
    numprice: '',
  },

  find(){
    // console.log(app.globalData.openid)
    let that = this;
    wx.request({
      url: 'https://ytspiao.ytsshop.com/index.php/api/Xiaohotel/house_find',
      header: {
        'content-type': 'application/json'
      },
      data: {
        id: that.data.houseid,
      },
      success: function (res) {
        if (res.data.code == 1) {
          wx.hideLoading()
          for (var i = 0; i < res.data.data.length; i++) {
            res.data.data[i].hiddenName = true;
          }
          that.setData({
            roomname: res.data.data.roomname,
            price: res.data.data.money,
            numprice: res.data.data.money
          })
        } else {
          wx.hideLoading()
        }
      }
    })

  },


  // 日期段选择  
  bindDateChange(e) {
    let that = this;
    var start_date = new Date(e.detail.value.replace(/-/g, "/"));
    var end_date = new Date(that.data.dateEnd.replace(/-/g, "/"));
    var days = end_date.getTime() - start_date.getTime();
    var day = parseInt(days / (1000 * 60 * 60 * 24));
    that.setData({
      dateStart: e.detail.value,
      day: day,
      numprice: day * that.data.num * that.data.price,
    })
  },

  bindDateChange2(e) {
    let that = this;
    var start_date = new Date(that.data.dateStart.replace(/-/g, "/"));
    var end_date = new Date(e.detail.value.replace(/-/g, "/"));
    var days = end_date.getTime() - start_date.getTime();
    var day = parseInt(days / (1000 * 60 * 60 * 24));
    that.setData({
      dateEnd: e.detail.value,
      day:day,
      numprice: day * that.data.num * that.data.price,
    })
  },

  radio: function (e) {
    this.setData({
      key: e.currentTarget.dataset.id
    })
    console.log(e.currentTarget.dataset.id)
  },

  //单选按钮事件
  updataRadio: function (e) {
    var Id = e.value.id
    this.setData({
      radioId: Id
    })
  },

  /*点击减号*/
  bindMinus: function () {
    var num = this.data.num;
    if (num > 1) {
      num--;
    }
    var minusStatus = num > 1 ? 'normal' : 'disable';
    this.setData({
      num: num,
      numprice: this.data.day*num * this.data.price,
      minusStatus: minusStatus
    })
  },
  /*点击加号*/
  bindPlus: function () {
    var num = this.data.num;
    num++;
    var minusStatus = num > 1 ? 'normal' : 'disable';
    this.setData({
      num: num,
      numprice: this.data.day*num *this.data.price,
      minusStatus: minusStatus
    })
  },
  /*数量输入框事件*/
  bindManual: function (e) {
    var num = e.detail.value;
    var minusStatus = num > 1 ? 'normal' : 'disable';
    this.setData({
      num: num,
      numprice: this.data.day*num * this.data.price,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      houseid: options.houseid,
      h_id: options.h_id
    })
    that.find();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    // 获取当前时间
    wx.request({
      url: 'https://ytspiao.ytsshop.com/api/xiaoapi/servertime',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 1) {
          wx.hideLoading();
          var start_date = new Date(res.data.time.today.replace(/-/g, "/"));
          var end_date = new Date(res.data.time.tomorrow.replace(/-/g, "/"));
          var days = end_date.getTime() - start_date.getTime();
          var day = parseInt(days / (1000 * 60 * 60 * 24));
          that.setData({
            dateStart: res.data.time.today,
            dateEnd: res.data.time.tomorrow,
            day:day
          })
        } else {
          wx.hideLoading()
        }
      }
    })
  },

  formSubmit: function (e) {
    if (e.detail.value.tenantname=='' || e.detail.value.telphone==''){
      wx.showModal({
        title: '提示',
        content: '请真写姓名和手机号！',
      })
    }else{
      wx.request({
        url: 'https://ytspiao.ytsshop.com/index.php/api/Xiaohotel/house_order',
        data: {
          'starttime': e.detail.value.dateStart,
          'endtime': e.detail.value.dateEnd,
          'sex': e.detail.value.sex,
          'tenantname': e.detail.value.tenantname,
          'telphone': e.detail.value.telphone,
          'roomsnum': e.detail.value.roomsnum,
          'pricenum': this.data.numprice,
          'remark': e.detail.value.remark,
          'houseid': this.data.houseid,
          'hid': this.data.h_id,
          'openid': app.globalData.openid
        },
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          // console.log(res.data)
          if(res.data.code==1){
            wx.showToast({
              title: '预订成功',
              icon: 'success', 
              duration: 3000, 
            })
            wx.navigateTo({
              url: '../../pages/reserve/reserve'
            })
          }
        }
      })
    }
  
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