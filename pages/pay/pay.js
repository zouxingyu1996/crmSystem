const app = getApp()
const time = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderid: '',
    id: '',
    actid: '',
    outtradeno: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var t = time
    if (options.orderid > 0) {
      wx.request({
        url: 'https://ytspiao.ytsshop.com/index.php/api/XiaoApi/indexorder',
        data: {
          openid: app.globalData.openid,
          orderid: options.orderid
        },
        success: function (res) {
          //  console.log(res.data)
          if (res.data) {
            that.setData({
              title: res.data.title,
              outtradeno: res.data.outtradeno,
              orderid: res.data.orderid,
              createtime: t.formatTimeTwo(res.data.createtime, 'Y/M/D h:m:s'),
              placedetail: res.data.placedetail,
              total: res.data.total,
              tfee: res.data.tfee,
              fee: res.data.fee,
              discount: res.data.discount,
              //  numfee: res.data.tfee * res.data.total
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '获取订单信息失败，请稍后重试',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../../pages/index/index'
            })
          }
        }
      })
    }
  },
  pay: function (e) {
    var that = this
      wx.request({
        url: 'https://ytspiao.ytsshop.com/index.php/api/WeiXinpay/pay',//先统一下单
        data: {
          openid: app.globalData.openid,
          numprice: that.data.tfee,
          outtradeno: that.data.outtradeno
        },
        success: function (res) {
          //调起小程序微信支付
          wx.requestPayment({
            'timeStamp': res.data.timeStamp,
            'nonceStr': res.data.nonceStr,
            'package': res.data.package,
            'signType': 'MD5',
            'paySign': res.data.paySign,
            'success': function (res) {
              wx.request({
                url: 'https://ytspiao.ytsshop.com/index.php/api/Xiaoapi/updateOrder',
                data: {
                  orderid: that.data.orderid
                },
                success: function (res) {
                  if (res.data.code == 1) {
                    wx.showModal({
                      title: '温馨提示',
                      content: '微信支付成功',
                      showCancel: false,
                      success(res) {
                        if (res.confirm) {
                          wx.switchTab({
                            url: '../me/me'
                          })
                        }
                      }
                    })
                  }
                }
              })
            },
            'fail': function (res) {
              console.log('支付失败')
            }
          })
        }
      })
  }
})