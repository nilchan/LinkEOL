var viewModel = function() {
	var self = this;
	var ID;

	self.activity = ko.observableArray([]);
	self.Thumbnail = ko.observable('');
	self.ActStatText=ko.observable('');//活动状态描述
	self.BuyText=ko.observable('');//是否在售票中的状态

	//分享的参数初始化
	var shareTitle = "";
	var shareContent = "";
	var shareUrl = common.gWebsiteUrl + "modules/activity/activityDetail.html?id=";
	var shareImg = "";
	var CustomPrice;

	self.getActivity = function() {
		mui.ajax(common.gServerUrl + "API/Activity/GetActivityInfoByID?ID=" + ID, {
			dataType: 'json',
			type: "GET",
			success: function(responseText) {
				//console.log(responseText.ActContent);
				self.activity(responseText);
				//console.log(JSON.stringify(self.activity()));
				CustomPrice=JSON.parse(self.activity().CustomPrice);
				if(common.StrIsNull(self.activity().ActStat)!=''){
					self.ActStatText(common.getTextByValue(common.gActivityStatus,self.activity().ActStat));
					//console.log(self.ActStatText());
				}
				if(self.activity().NeedBuyTicket){
					self.BuyText('售票中');
					if(self.activity().ActStat == common.gActivityStatus[0].value)	//准备中
					{
						self.ActStatText('');
					}
				}
				
				//console.log(self.activity().ActContent);
				self.Thumbnail(self.activity().Thumbnail);
				//console.log(common.getPhotoUrl2(self.activity().Thumbnail));
				self.sharevalue();
				var ah = 0;
				if (common.isIOS()) ah = 15;
				if(  window.screen.width == 768 ) ah = -15;
				var h = (document.body.clientWidth * 32.2 / 100 * 300 / 226 + 70) + ah + 'px';
				//console.log(document.body.clientWidth+'height:--'+h);
				document.getElementById("blurFar").style.height = h;
				document.getElementById("blurBack").style.height = h;
				
				common.showCurrentWebview();
				
				//分享
				var ul = document.getElementById("sharePopover");
				var lis = ul.getElementsByTagName("li");
				for (var i = 0; i < lis.length; i++) {
					lis[i].addEventListener('click', function() {
						Share.sendShare(this.id, shareTitle, shareContent, shareUrl + self.activity().ID , shareImg);
						mui('#sharePopover').popover('toggle');
					});
				}
			}
		})
	};

	//分享参数设置
	self.sharevalue = function() {
		shareImg = common.getPhotoUrl2(self.activity().Thumbnail);
		switch (self.activity().ActProperty) {
			case common.gJsonActivityActProperty.concert: //专场音乐会
				shareTitle = "听一场音乐会，品一次成长";
				break;
			case common.gJsonActivityActProperty.teacherLectures: //名师讲座
				shareTitle = "有一种情怀，叫名师崇拜";
				break;
			case common.gJsonActivityActProperty.CommunicationActivity: //交流与活动
				shareTitle = "漂洋过海，只为与你共觅音乐之爱";
				break;
			case common.gJsonActivityActProperty.orchestraRecruit: //乐团招募
				shareTitle = "音乐与朋友，同筑一个梦";
				break;
			default:
				break;
		}
		shareContent = self.activity().Title;
	}

	//关闭分享窗口
	self.closeShare = function() {
		mui('#sharePopover').popover('toggle');
	}

	self.gotoSchedule = function(data) {
		common.transfer('activitySchedule.html', false, {
			aid: data.ID
		});
	}

	self.gotoNews = function() {
		common.transfer('/modules/home/web.html', false, {
			url: 'http://mp.weixin.qq.com/s?__biz=MzIwOTA4MDMzOA==&mid=402038844&idx=1&sn=fd4e2026683d2c3aee0b4dbc76964c31#rd'
		});
	}

	self.gotoRehearsal = function(data) {
		common.transfer('activityRehearsal.html', false, {
			aid: data.ID
		});
	}

	self.gotoCalendar = function(data) {
		common.transfer('activityCalendar.html', false, {
			aid: data.ID
		});
	}
	
	self.gotoSaleTicket=function(){
		common.transfer('saleTicket.html',true,{
			ActivityID:self.activity().ID,
			CustomPrice:self.activity().CustomPrice,
			TicketUrl: self.activity().SeatsPreviewUrl
		});
	}

	self.gotoSignUp = function() {
		//console.log(self.activity().ActStat);
		if(self.activity().ActStat==common.gActivityStatus[0].value){
			mui.toast("还没到报名时间~");
			return ;
		}
		if(self.activity().ActStat!=common.gActivityStatus[1].value){
			mui.toast("活动报名时间已结束");
			return;
		}
		
		/*if (getLocalItem('UserType') == common.gDictUserType.teacher) {
			mui.toast('活动只允许学生报名！');
			return;
		}*/
		common.transfer('activityEnroll.html', true, {
			aid: ID
		});
	}

	//跳转到所有作品页面
	self.gotoAllWorks = function() {
		setLocalItem('tmp.activityWorkID', self.activity().ID);
		common.transfer("../works/worksListAllHeader.html", false, {}, false, false);
	}


	mui.back = function() {
		common.showIndexWebview(1);
	}

	mui.plusReady(function() {
		var web = plus.webview.currentWebview();
		if (typeof(web.aid) !== "undefined") {
			ID = web.aid;
		}
		//ID = 20;
		Share.updateSerivces(); //初始化分享服务
		self.getActivity();
	});

	var oldStyle = document.getElementById("hHead").style.cssText;
	window.addEventListener('refreshActivityInfo',function(){
		self.getActivity();
	})

	window.onscroll = function() {
		var t = document.documentElement.scrollTop || document.body.scrollTop;
		//		var h = document.body.scrollHeight - window.screen.height; 
		if (t > 0) {
			document.getElementById("hHead").style.cssText = oldStyle + "background: rgba(246,244,239,1)!important;";
			document.getElementById("hBack").style.color = "#000";
			document.getElementById("hTitle").style.color = "#000";
			document.getElementById("hShare").style.color = "#000";
		} else {
			document.getElementById("hHead").style.cssText = oldStyle + "background: rgba(246,244,239,0)!important;";
			document.getElementById("hBack").style.color = "#fff";
			document.getElementById("hTitle").style.color = "#fff";
			document.getElementById("hShare").style.color = "#fff";
		}
	}
};
ko.applyBindings(viewModel);