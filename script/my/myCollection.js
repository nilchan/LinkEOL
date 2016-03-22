var myUserAttented = function() {
	var self = this;
	self.worksCollectionList = ko.observableArray([]); //关注我的人列表
	self.PageWorks = ko.observable(1); //作品页码
	//mui.init();

	self.workCollection = function() {
		//未做分页，因此第一页显示999个
		var ajaxUrl = common.gServerUrl + 'API/Action?userId=' + getLocalItem('UserID') + '&targetType=' + 
			common.gDictActionTargetType.Works + '&page=' + self.PageWorks() + '&pageSize=999';
		mui.ajax(ajaxUrl, {
			type: 'GET',
			success: function(responseText) {
				var favWorks = JSON.parse(responseText);
				self.worksCollectionList(favWorks);
				//console.log(JSON.stringify(self.worksCollectionList()));
				common.showCurrentWebview();
			}
		});
	}

	self.gotoWorkInfo = function(data) {//作品详情
		console.log(JSON.stringify(data));
		common.transfer("../works/WorksDetails.html", false, {
			works: data
		}, false, false);
	}
	
	self.goMyDownloads = function() { //下载
		common.transfer('../works/mydownloadHeader.html', true);
	}

	//跳转至所有作品
	self.gotoAllWorks = function() {
		common.transfer("../works/worksListAllHeader.html");
	};
	
	self.goDownload=function(){
		common.transfer('../works/mydownloadHeader.html');
	}

	mui.plusReady(function() {
		self.workCollection();
	})
}
ko.applyBindings(myUserAttented);