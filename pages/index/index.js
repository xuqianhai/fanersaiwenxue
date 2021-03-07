const app = getApp();
Page({
  data: {
    status: 1, //全程状态
    showRes: false, //显示结果集
    HiddenAd1: false, //隐藏广告1
    HiddenAd2: false, //隐藏广告2
    searchdcss: '', //动画效果
    resfade: "fade_out", //动画效果
    question: "", //绑定问题
    reslen: 0, //结果数组长度
    toptips: "", //顶部提示内容
    topicShow: false, //显示顶部提示信息
    toptipstype: "error", //顶部提示类型
    token: "6a17eb58468a893ccc8aacf23c7f2f10f90872f2", //搜题token
    modeltips: {}, //远程弹窗
    showad: false, //显示广告
    res: null,
    ad1unit: "", //广告1
    ad2unit: "", //广告2
    // 遮罩问题详情
    CoverisShow: false,
    nowquestion: "问题测试",
    nowanswer: "答案测试",
    nowmore: ""
  },
  // 获取开始数据
  GetStartInfo: function () {
    let that = this;
    wx.request({
      url: 'https://www.lqqsh.top/wk.json',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        that.setData({
          status: result.data.status,
          token: result.data.token,
          modeltips: result.data.msg,
          ad1unit: result.data.ad1unit,
          ad2unit: result.data.ad2unit,
          showad: result.data.showad,
        })
        that.CheckModelTips()
      },
      fail: () => {
        wx.showModal({
          title: "提示",
          content: "获取网络数据失败,您可能无法使用完整功能,请检查网络后重试！",
        })
      },
      complete: () => {}
    });
  },
  // 关闭问题遮罩
  closecover: function () {
    let that = this;
    that.setData({
      CoverisShow: false
    })
  },
  // 复制答案
  copyanswer: function () {
    let that = this;
    wx.setClipboardData({
      data: that.data.nowanswer,
      success: (res) => {},
      fail: () => {
        that.setData({
          toptips: "复制到剪切板失败！请重试",
          topicShow: true,
          toptipstype: "error"
        })
      }
    })
  },
  // 检测弹出框
  CheckModelTips: function () {
    let that = this;
    wx.getStorage({
      key: "tip" + that.data.modeltips.version.toString(),
      success: function (res) {
        if (res.data != that.data.modeltips.content) {
          wx.showModal({
            title: that.data.modeltips.title,
            content: that.data.modeltips.content
          })
        }
      },
      fail: (res) => {
        // 设置缓存数据
        wx.setStorage({
          key: "tip" + that.data.modeltips.version.toString(),
          data: that.data.modeltips.content,
          success: (res) => {
            console.log("存储本地信息成功", res)
          },
          fail: (e) => {
            console.log("存储本地信息失败", e)
          },
          complete: () => {
            if (that.data.modeltips.status) {
              wx.showModal({
                title: that.data.modeltips.title,
                content: that.data.modeltips.content
              })
            }
          }
        })

      }
    })
  },
  // 前往帮助页面
  gohelp: function () {
    wx.navigateTo({
      url: '/pages/index/help/help',
    })
  },
  // 设置logo向上偏移
  SetLogoPosition: function () {
    let that = this;
    if (that.data.searchdcss == "main_res") {
      that.setData({
        searchdcss: ""
      })
    } else {
      that.setData({
        searchdcss: "main_res"
      })
    }
  },
  // 设置是否显示结果集
  SetShowRes: function () {
    this.setData({
      showRes: !this.data.showRes
    })
  },
  // 设置fade效果
  SetFade: function () {
    let that = this;
    if (that.data.resfade == "fade_in") {
      that.setData({
        resfade: "fade_out"
      })
    } else {
      that.setData({
        resfade: "fade_in"
      })
    }
  },
  // 监控输入框内容
  qinput: function (e) {
    this.setData({
      question: e.detail.value
    })
  },
  // 发起搜素
  search() {
    let that = this;
    if (that.CheckQuestionEmpty()) {
      that.setData({
        toptips: "问题不能为空！",
        topicShow: true,
        toptipstype: "error"
      })
    } else {
      that.GetAnswer();
    }
  },
  // 检测问题是否为空
  CheckQuestionEmpty: function () {
    if (this.data.question == "") {
      return true;
    } else {
      return false;
    }
  },
  // 获取数据
  GetAnswer: function () {
    let that = this;
    wx.showLoading({
      title: '搜索中...',
      mask: true
    })
    wx.request({
      url: 'https://sou.mmifx.com/api.php',
      data: {
        token: that.data.token,
        question: that.data.question
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        if (result.data.code != 200) {
          that.setData({
            toptips: result.data.msg.title,
            topicShow: true,
            toptipstype: "error"
          })
        } else {
          that.setData({
            toptips: result.data.msg.title,
            topicShow: true,
            toptipstype: "success",
            res: result.data.data,
            reslen: result.data.data.length
          })
          if (!that.data.showRes) {
            that.SetLogoPosition();
            that.SetShowRes();
            that.SetFade();
          }
        }
      },
      fail: () => {
        wx.showModal({
          title: "提示",
          content: "网络链接失败！请检查网络后重试",
        })
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },
  inputfocus: function () {
    let that = this;
    if (that.data.showRes) {
      that.SetLogoPosition();
      that.SetShowRes();
      that.SetFade();
    }
  },
  // 清除问题
  clearques: function () {
    let that = this;
    that.setData({
      question: "",
      res: null,
    })
    if (that.data.showRes) {
      that.SetLogoPosition();
      that.SetShowRes();
      that.SetFade();
    }
  },
  // 获取问题详细信息
  GetDetail: function (e) {
    let that = this;
    let info = e.target.dataset;
    that.setData({
      CoverisShow: true,
      nowquestion: info.question,
      nowanswer: info.answer,
      nowmore: info.more
    })
  },
  getvoice: function () {
    let that = this;
    that.setData({
      toptips: "语音搜索将在下一个版本开放，敬请期待！",
      topicShow: true,
      toptipstype: "info"
    })
  },
  getphoto: function () {
    let that = this;
    that.setData({
      toptips: "拍照识别将在下一个版本开放，敬请期待！",
      topicShow: true,
      toptipstype: "info"
    })
  },
  // 监控剪切板
  listencut: function () {
    let that = this;
    wx.getStorage({
      key: "cutlisten",
      success: (res) => {
        if (res.data == "开启") {
          wx.getClipboardData({
            success(res) {
              if (res.data !== '') {
                wx.showModal({
                  title: '检测到剪切板内容，是否搜索？',
                  content: res.data,
                  cancelText: '取消',
                  confirmText: '搜索',
                  success(resyes) {
                    if (resyes.confirm) {
                      that.setData({
                        question: res.data
                      })
                      that.search();
                    } else if (resyes.cancel) {
                      console.log('用户点击了取消按钮');
                    }
                  }
                })
              }
            }
          })
        }
      },
      fail: (res) => {

      }
    })

  },
  // 广告部分函数
  // 广告位1加载成功
  ad1load() {
    let that = this;
    that.setData({
      HiddenAd1: false
    })
  },
  // 广告位2加载成功
  ad2load() {
    let that = this;
    that.setData({
      HiddenAd2: false
    })
  },
  // 广告位1加载失败
  ad1error(err) {
    let that = this;
    that.setData({
      HiddenAd1: true
    })
  },
  // 广告2加载失败
  ad2error(err) {
    let that = this;
    that.setData({
      HiddenAd2: true
    })
  },
  // 广告1被关闭
  ad1close() {
    let that = this;
    that.setData({
      HiddenAd1: true
    })
  },
  // 广告1被关闭
  ad2close() {
    let that = this;
    that.setData({
      HiddenAd2: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.GetStartInfo();
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
    this.listencut()

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