//可独立引用版本
//新增可选择动画曲线，是否循环

  	//设置弹幕高宽和body对齐
  	// $(".barrage").attr({
  	// 	width: $(document.body).width(),
  	// 	height: $(document.body).height()
  	// });
  	// 
  		var that = this;
			//舞台是全局变量
			var stage = $('#Barrage');
			//弹幕的总时间
			var totalTime = 9000;
			//检测时间间隔
			var checkTime = 1000;
			//总场数
			var playCount = Math.ceil(totalTime / checkTime);
			
			//是否循环播放
			var circle = false;	


			//构造一个单独的弹幕
			var BarrageItem = function(config){
				//保存配置
				this.config = config;
				//设置样式
				this.outward = this.mySelf();
				//准备弹出去
				this.outward.hide().appendTo(stage);
			}

			//单个弹幕样式,从config中提取配置
			BarrageItem.prototype.mySelf = function(){
				var outward = $('<div style="min-width:400px;font-size:'+this.config.size +'px;color:'+this.config.color+';">'+this.config.text+'</div>');
	    	return outward;
			}

			//定义弹的过程
			
			BarrageItem.prototype.move = function(){
				var that = this;
				var outward = that.outward;
				var myWidth = outward.width();
				//用jq自带animate来让它运动
				outward.animate({
					left: -myWidth
				},that.config.duration,that.config.easeType,function(){
					outward.hide();
				});
			}

			//开始弹弹弹

			BarrageItem.prototype.start = function(){
				var that = this;
	    	var outward = that.outward;
				//开始之前先隐藏自己
				outward.css({
					position: 'absolute',
					left: stage.width() + 'px', //隐藏在右侧
					top:that.config.top || 0 , //如果有定义高度就从配置中取，否则就置顶
					zIndex:10,//展示到前列
					display: 'block'
				});

				//延迟时间由配置的开始时间减去队列中该弹幕所处的位置所需要等检测位置
				var delayTime = that.config.time - (that.config.queue - 1) * checkTime;
				setTimeout(function(){
					that.move();
				},delayTime);

			}

			//设置一个支持事件机制的对象，也就是弹幕们的驱使者，它来驱使弹幕弹弹弹
			var diretor = $({});

			//对舞台进行样式设置，其实可以直接写到css里面
			stage.css({
			    position:'relative',
			    overflow:'hidden'
			});

			//遍历每一个弹幕获取参数配置并赋予监听
			
			$.each(that.messages,function(k,config){
				//确认弹出的时间
				var queue = Math.ceil(config.time / checkTime);
				config.queue = queue;

				//新建一个对象给它配置
				var go = new BarrageItem(config);
				//驱动者监听驱使动作
				diretor.on(queue+'start',function(){
					go.start();
				})
			});

			var currentQueue = 0;
			setInterval(function(){
			    //从队列中取第n个开始弹
			    diretor.trigger(currentQueue+'start');
			    //如果都弹完了 循环来一遍
			    if (currentQueue === playCount && circle) {
			        currentQueue = 0;
			    }else{
			        currentQueue++;
			    }

			},checkTime);



  
 