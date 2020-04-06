// pages/house/house.js
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clientHeight: '',
    clientTop: '',
    h_id: '',
    imglist: [],
    list: [],
    tel: '',
    id: '',
    commentList: [],
    arr: ['房型', '酒店介绍', '交通', '点评'],
    currentTab: 0,
    winHeight: '',
    dateStart: '', //默认起始时间  
    dateEnd: '', //默认结束时间 
    statusBarHeight: getApp().globalData.statusBarHeight,
    latitude: '',
    longitude: '',
    speed: 0,
    accuracy: 0,
    total: 0,
    page: 1,
    screen: '',
    type: ''
  },
  //点击返回上一级
  back() {
    wx.navigateBack({
      delta: 1
    })    
  },
  imglist() {
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://ytspiao.ytsshop.com/index.php/api/Xiaohotel/swiper_image',
      header: {
        'content-type': 'application/json'
      },
      data: {
        hotelid: that.data.h_id,
      },
      success: function(res) {
        if (res.data.code == 1) {
          wx.hideLoading()
          that.setData({
            imglist: res.data.data.fileurl
          })
        } else {
          wx.hideLoading()
        }
      }
    })
  },

  list() {
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://ytspiao.ytsshop.com/index.php/api/Xiaohotel/house_list/page/' + that.data.page,
      header: {
        'content-type': 'application/json'
      },
      data: {
        hotelid: that.data.h_id,
      },
      success: function(res) {
        if (res.data.code == 1) {
          WxParse.wxParse('article', 'html', res.data.data[0].content, that);
          wx.hideLoading()
          var list = that.data.list;
          var _tel = ''
          for (var i = 0; i < res.data.data.length; i++) {
            res.data.data[i].hiddenName = true;
            list.push(res.data.data[i]);
            if(i == 0){
              _tel = res.data.data[i].phone
            }
          }
          that.setData({
            list: list,
            tel: _tel
          })
        } else {
          wx.hideLoading()
        }
      }
    })
  },

  //联系客服
  tel: function () {
    let that = this
    wx.showModal({
      title: '温馨提示',
      content: '是否拨打酒店前台电话？',
      success(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: that.data.tel,
            success: function () {
              console.log("拨打电话成功！")
            },
            fail: function () {
              console.log("拨打电话失败！")
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  click: function(e) {
    let that = this;
    let id = e.currentTarget.dataset['id'];
    let index = e.currentTarget.dataset.index; //当前数组的索引下标
    let list = that.data.list;
    if (list[index].hiddenName == true) { //如果当前数组下标的状态为true
      for (var i = 0; i < list.length; i++) {
        if (i == index) {
          list[i].hiddenName = false;
        } else {
          list[i].hiddenName = true;
        }
      }
    } else { //反之
      for (var i = 0; i < list.length; i++) {
        if (i == index) {
          list[i].hiddenName = true;
        } else {
          list[i].hiddenName = true;
        }
      }
    }
    that.setData({
      id: id,
      list: list
    })

  },

  calling: function(e) {
    let that = this;
    if (!app.globalData.userInfo) {
      wx.showModal({
        title: '温馨提示',
        content: '请先登录后购票',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../../pages/me/me'
            })
          } else if (res.cancel) {

          }
        }
      })
      return
    }
    let h_id = that.data.h_id;
    let id = e.currentTarget.dataset['id'];
    wx.navigateTo({
      url: "../../pages/book/book?houseid=" + id + "&h_id=" + h_id　　 // 预订页面
    })
  },

  // 第一步先完成导航tab切换样式
  swichNav(e) {
    var current = e.currentTarget.dataset.current
    this.setData({
      currentTab: current
    })
  },
  bindChange(e) {
    var current = e.detail.current
    this.setData({
      currentTab: current
    })
  },

  // 日期段选择  
  bindDateChange(e) {
    let that = this;
    // console.log(e.detail.value)
    that.setData({
      dateStart: e.detail.value,
    })
  },

  bindDateChange2(e) {
    let that = this;
    that.setData({
      dateEnd: e.detail.value,
    })
  },

  handleImagePreview1(e) {
    const idx1 = e.target.dataset.idx
    const images1 = e.target.dataset.item
    const arr = []
    for (var i = 0; i < images1.length; i++) {
      arr.push('http://ytspiao.ytsshop.com/' + images1[i])
    }
    wx.previewImage({
      current: arr[idx1], //当前预览的图片
      urls: arr, //所有要预览的图片
    })
  },

  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = e.target.dataset.item
    wx.previewImage({
      current: images[idx], //当前预览的图片
      urls: images, //所有要预览的图片
    })
  },

  changemap: function() {
    wx.openLocation({
      latitude: 28.374310,
      longitude: 111.236250,
      scale: 18
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    const query = wx.createSelectorQuery()
    query.select('.swiper').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function(res) {
      that.setData({
        clientTop: res[0].top
      })
    })
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    })
    that.setData({
      h_id: options.id,
      screen: 1
    })
    that.imglist();
    that.list();
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winHeight: res.windowHeight - 193 //减去上面轮图等其他的高度
        });
      }
    });

    wx.request({
      url: 'https://ytspiao.ytsshop.com/api/xiaohotel/list_content',
      header: {
        'content-type': 'application/json'
      },
      data: {
        hid: that.data.h_id,
        page: that.data.page
      },
      success: function(res) {
        if (res.data.code == 1) {
          let total = 0
          if (res.data.list) {
            total = Math.ceil(res.data.list / 5)
          }
          that.setData({
            commentList: res.data.data,
            total: total,
            page: that.data.page + 1,
          })
        }
      }
    })

  },

  screen: function(e) {
    let that = this
    this.setData({
      page: 1
    })
    let val = '';
    let ctype = ''
    if (val = e.currentTarget.dataset.val) {
      switch (val) {
        case '2':
          ctype = "1"
          break;
        case '3':
          ctype = "2"
          break;
        default:
          ctype = ""
      }
    } else {
      ctype = that.data.ctype
    }

    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://ytspiao.ytsshop.com/api//xiaohotel/list_content',
      header: {
        'content-type': 'application/json'
      },
      data: {
        hid: that.data.h_id,
        ctype: ctype,
        page: that.data.page
      },
      success: function(res) {
        var contentlistTem = that.data.commentList
        if (res.data.code == 1) {
          let total = 0
          if (res.data.list) {
            total = Math.ceil(res.data.list / 10)
          }
          if (that.data.page == 1) {
            contentlistTem = []
          }
          that.setData({
            commentList: contentlistTem.concat(res.data.data),
            total: total,
            page: that.data.page + 1
          })
          wx.hideLoading()
        } else {
          wx.hideLoading()
        }
      }
    })
    this.setData({
      screen: e.currentTarget.dataset.val
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    // 获取当前的经纬度
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        that.setData({
          latitude: latitude,
          longitude: longitude
        })
      }
    })

    // 获取当前时间
    wx.request({
      url: 'https://ytspiao.ytsshop.com/api/xiaoapi/servertime',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.code == 1) {
          wx.hideLoading()
          that.setData({
            dateStart: res.data.time.today,
            dateEnd: res.data.time.tomorrow
          })
        } else {
          wx.hideLoading()
        }
      }
    })

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log('我是上拉')

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})