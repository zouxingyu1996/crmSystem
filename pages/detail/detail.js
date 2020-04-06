// pages/detail/detail.js
//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    num: 1,
    minusStatus: 'disable',
    numprice: 0,
    cate: 'detail_top',
    scrollTop: 0,
    active: 1,
    list: {},
    autoplay: true,
    cid: '',
    loading: true,
    commentList: [],
    dianp: [],
    total: 0,
    page: 1,
    screen: 1,
    type: '',
    collection: 0,
    been: 0,
    fee: 0,
    currentTab: null,
    specId: '',
    spec_moren: '',
    statusBarHeight: getApp().globalData.statusBarHeight,
    showModal: false
  },
    //点击返回上一级
    back() {
      wx.navigateBack({
        delta: 1
      })    
    },
  /**
* 对话框取消按钮点击事件
*/
  onCancel: function () {
    this.setData({
      showModal: false
    });
  },
  onConfirm: function () {
    let that = this
    wx.request({
      url: 'https://ytspiao.ytsshop.com/index.php/api/XiaoApi/order',
      data: {
        actid: that.data.cid,
        openid: app.globalData.openid,
        total: that.data.num,
        tfee: that.data.numprice,
        spec: that.data.specId
      },
      success: function (res) {
        if (res.data.code == 1) {
          wx.navigateTo({
            url: '../../pages/pay/pay?orderid=' + res.data.orderid + '&pid=' + that.data.cid
          })
        } else if (res.data.code == 2) {
          wx.showModal({
            title: '温馨提示',
            content: '请先登录或重新购票',
            success(res) {
              if (res.confirm) {
                if (app.globalData.openid && app.globalData.userInfo) {
                  wx.request({
                    url: 'https://ytspiao.ytsshop.com/index.php/api/Xiaoapi/userinfo',
                    data: {
                      openid: app.globalData.openid,
                      user: app.globalData.userInfo
                    },
                    success: function (res) {
                    }
                  })
                }
                wx.switchTab({
                  url: '../../pages/me/me'
                })
              } else if (res.cancel) {

              }
            }
          })
        }
      }
    })
  },
  handleImagePreview1(e){
    const idx1= e.target.dataset.idx
    const images1 = e.target.dataset.item
    // console.log(images1.length)
    const arr = []
    for (var i = 0; i < images1.length;i++){
      // console.log(images1[i])
      arr.push(images1[i])
    }
    wx.previewImage({
      current: arr[idx1],  //当前预览的图片
      urls: arr,  //所有要预览的图片
    })
  },
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.list.img
    wx.previewImage({
      current: images[idx],  //当前预览的图片
      urls: images,  //所有要预览的图片
    })
  },
  clickTab: function(e) {
    var that = this;
    var current = e.target.dataset.current
    var _fee = e.target.dataset.price
    var _id = e.target.dataset.id
    if (this.data.currentTab === current) {
      return false;
    } else {
      // this.orders(current)
      that.setData({
        currentTab: current,
        fee: _fee,
        numprice: that.data.num * _fee,
        specId: _id,
        spec_moren: null
      })
    }
  },
  // 生成订单后跳转订单详情页面
  weixinpay: function () {
    var that = this
    if (app.globalData.userInfo){
      if (that.data.num <= 0 || that.data.num%1 !== 0){
        wx.showToast({
          title: '数量不能小于1',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (that.data.numprice <= 0) {
        wx.showToast({
          title: '免费景点不需要购票',
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (that.data.list.remarks) {
        that.setData({
          showModal: true
        });
      } else {
        wx.request({
          url: 'https://ytspiao.ytsshop.com/index.php/api/XiaoApi/order',
          data: {
            actid: that.data.cid,
            openid: app.globalData.openid,
            total: that.data.num,
            tfee: that.data.numprice,
            spec: that.data.specId
          },
          success: function (res) {
            if (res.data.code == 1) {
              wx.navigateTo({
                url: '../../pages/pay/pay?orderid=' + res.data.orderid + '&pid=' + that.data.cid
              })
            } else if (res.data.code == 2) {
              wx.showModal({
                title: '温馨提示',
                content: '请先登录或重新购票',
                success(res) {
                  if (res.confirm) {
                    if (app.globalData.openid && app.globalData.userInfo) {
                      wx.request({
                        url: 'https://ytspiao.ytsshop.com/index.php/api/Xiaoapi/userinfo',
                        data: {
                          openid: app.globalData.openid,
                          user: app.globalData.userInfo
                        },
                        success: function (res) {
                        }
                      })
                    }
                    wx.switchTab({
                      url: '../../pages/me/me'
                    })
                  } else if (res.cancel) {

                  }
                }
              })
            }
          }
        })
      }
    }else{
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
    }
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
      numprice: num * this.data.fee,
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
      numprice: num * this.data.fee,
      minusStatus: minusStatus
    })
  },
  /*数量输入框事件*/
  bindManual: function (e) {
    var num = e.detail.value;
    var minusStatus = num > 1 ? 'normal' : 'disable';
    this.setData({
      num: num,
      numprice: num * this.data.fee,
      minusStatus: minusStatus
    })
  },
  userCollection:function() {
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://ytspiao.ytsshop.com/api/Xiaoapi/UserCollection',
      header: {
        'content-type': 'application/json'
      },
      data: {
        collection: that.data.collection,
        activity_id: that.data.cid,
        open_id: app.globalData.openid
      },
      success: function (res) {
        if (res.data.code == 1) {
          let _c = that.data.collection
          if (_c == 0){
            _c = 1
          }else{
            _c = 0
          }
          that.setData({
            collection: _c
          })
          wx.hideLoading()
        }else{
          wx.showToast({
            title: '请求失败，请稍后重试',
            icon: 'none',
            duration: 2000
          })
          wx.hideLoading()
        }
      },
      fail: function (erro) {
        wx.showToast({
          title: '请求失败，请稍后重试',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  userBeen: function () {
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://ytspiao.ytsshop.com/api/Xiaoapi/UserBeen',
      header: {
        'content-type': 'application/json'
      },
      data: {
        been: that.data.been,
        activity_id: that.data.cid,
        open_id: app.globalData.openid
      },
      success: function (res) {
        if (res.data.code == 1) {
          let _c = that.data.been
          if (_c == 0) {
            _c = 1
          } else {
            _c = 0
          }
          that.setData({
            been: _c
          })
          wx.hideLoading()
        } else {
          wx.showToast({
            title: '请求失败，请稍后重试',
            icon: 'none',
            duration: 2000
          })
          wx.hideLoading()
        }
      },
      fail: function (erro) {
        wx.showToast({
          title: '请求失败，请稍后重试',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  clickMenu: function(e) {
    this.setData({
      cate: e.currentTarget.dataset.cate,
      active: e.currentTarget.dataset.active
    })
  },
  screen: function(e) {
    let that = this
    this.setData({
      page: 1
    })
    let val = e.currentTarget.dataset.val;
    let type = ''
    switch (val) {
      case '1':
        type = "comment"
        this.setData({
          type: 'comment'
        })
        break;
      case '2':
        type = "NewComment"
        this.setData({
          type: 'NewComment'
        })
        break;
      default:
        type = "imgComment"
        this.setData({
          type: 'imgComment'
        })
    } 
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://ytspiao.ytsshop.com/api/Xiaoapi/' + type,
      header: {
        'content-type': 'application/json'
      },
      data: {
        activity_id: that.data.cid,
        page: that.data.page
      },
      success: function (res) {
        if (res.data.code == 1) {
          let total = 0
          if (res.data.list) {
            total = Math.ceil(res.data.list / 10)
          }
          that.setData({
            commentList: res.data.data,
            total: total,
            page: that.data.page + 1
          })
          wx.hideLoading()
        }else{
          wx.hideLoading()
        }
      }
    })
    this.setData({
      screen: e.currentTarget.dataset.val
    })
  },
  scroll(e) {
    let that = this
    wx.createSelectorQuery().selectAll('.fruit').boundingClientRect(function(rects) {
      rects.forEach(function(rect, index) {
        if (rect.top <= 100 && rect.top >= -rect.height) {
          that.setData({
            active: index + 1
          })
        } 
      })
      // console.log(rect.height )
      // if (rect.top <= 0 && rect.top >= -rect.height){
      //   that.setData({
      //   active: 2
      // })
      // }else {
      //   that.setData({
      //     active: 1
      //   })
      // }
    }).exec()
    if(e.detail.scrollTop <= 200){
      that.setData({
        active: 1
      })
    }
    this.setData({
      scrollTop: e.detail.scrollTop
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      cid: options.id,
      screen: 1
    })
    wx.request({
      url: 'https://ytspiao.ytsshop.com/api/Xiaoapi/findByActivityId',
      header: {
        'content-type': 'application/json'
      },
      data: {
        activity_id: options.id,
        open_id: app.globalData.openid
      },
      success: function (res) {
        if (res.data.code == 1) {
          let been = res.data.data.been
          let collection = res.data.data.collection
          if (res.data.data.spec && res.data.data.spec.length > 0){
            for (let i = 0; i < res.data.data.spec.length;i++){
              // console.log(res.data.data.spec[i])
              if (res.data.data.spec[i].spec_sort == 1){
                that.setData({
                  spec_moren: res.data.data.spec[i].id,
                  specId: res.data.data.spec[i].id
                })
              }
            }
          }
          that.setData({
            list: res.data.data,
            loading: false,
            been: been,
            collection: collection,
            numprice: res.data.data.default_spec.spec_price,
            fee: res.data.data.default_spec.spec_price
          })
        }
      }
    })
    // let that = this
    // that.setData({
    //   screen: 1
    // })
    wx.request({
      url: 'https://ytspiao.ytsshop.com/api/Xiaoapi/comment',
      header: {
        'content-type': 'application/json'
      },
      data: {
        activity_id: that.data.cid,
        page: 1
      },
      success: function (res) {
        if (res.data.code == 1) {
          let total = 0
          if (res.data.list) {
            total = Math.ceil(res.data.list / 10)
          }
          that.setData({
            commentList: res.data.data,
            total: total,
            page: that.data.page + 1
          })
        }
      }
    })
  },
// 分页
  lower() {
    var that = this //注意一定要定义变量，不然下面回调函数用setdata会报错
    var result = that.data.commentList
    if (that.data.total >= that.data.page){
    wx.request({
      url: 'https://ytspiao.ytsshop.com/api/Xiaoapi/comment',
      header: {
        'content-type': 'application/json'
      },
      data: {
        activity_id: that.data.cid,
        page: that.data.page
      },
      success: function (res) {
        if(res.data.code == 1){
          let arr = []
          arr = result.concat(res.data.data)
          that.setData({
            commentList: arr,
            page: that.data.page + 1
          })
        }
      }
    })
    }
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