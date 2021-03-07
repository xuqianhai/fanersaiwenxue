const app = getApp()
Page({
  data: {
    userInfo: {},
    usergender: "",
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    cutstatus: "开启"
  },
  GetUserInfo() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
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
  login(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    if (app.globalData.userInfo.gender === 1) {
      this.setData({
        usergender: "帅气的小哥哥"
      })
    } else if (app.globalData.userInfo.gender === 2) {
      this.setData({
        usergender: "美丽的小姐姐"
      })
    }
  },
  GetCutStatus() {
    let that = this
    wx.getStorage({
      key: "cutlisten",
      success: function (res) {
        if (res.data == "开启") {
          that.setData({
            cutstatus: "关闭"
          })
        } else {
          that.setData({
            cutstatus: "开启"
          })
        }
      },
      fail: function (e) {
        wx.setStorage({
          key: "cutlisten",
          data: "关闭"
        })
        that.setData({
          cutstatus: "开启"
        })
      }
    })
  },
  linkQQ() {
    wx.showModal({
      title: "提示",
      content: "开发者交流群：787775018",
      confirmText: "复制",
      success: (res) => {
        if (res.confirm) {
          wx.setClipboardData({
            data: '1787775018',
            success() {
              wx.showToast({
                title: 'QQ号已复制，请自行搜索添加',
                icon: 'none'
              })
            }
          })
        } else {

        }
      },
    })

  },
  MustSee() {
    wx.navigateTo({
      url: 'mustsee/mustsee',
    })
  },
  AboutMe() {
    wx.navigateTo({
      url: 'aboutme/aboutme',
    })
  },
  AboutIt() {
    wx.navigateTo({
      url: 'aboutit/aboutit',
    })
  },
  listencut() {
    let that = this
    wx.getStorage({
      key: "cutlisten",
      success: function (res) {
        if (res.data == "开启") {
          that.setData({
            cutstatus: "开启"
          })
          wx.setStorage({
            key: "cutlisten",
            data: "关闭"
          })
          wx.showToast({
            title: "关闭剪切板监控成功",
            icon: "none"
          })
        } else {
          that.setData({
            cutstatus: "关闭"
          })
          wx.setStorage({
            key: "cutlisten",
            data: "开启"
          })
          wx.showToast({
            title: "开启剪切板监控成功",
            icon: "none"
          })
        }
      },
      fail: function (e) {
        wx.setStorage({
          key: "cutlisten",
          data: "开启"
        })
        that.setData({
          cutstatus: "关闭"
        })
        wx.showToast({
          title: "开启剪切板监控成功",
          icon: "none"
        })
      }
    })


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.GetUserInfo();
    this.GetCutStatus();
    // this.GetConfig();
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