// JavaScript Document
$(function() {
	function resetWin() {
		var winH = $(document).height();
		var winW = $(document).width();
		
		$(".wrapOutter, .container").css({"width":winW, "height":winH});
	}
	resetWin();




var game = {
	//初始化
	init: function() {
		this.point = 0;
		this.pointList = [1,2,3,4,5,6];
		this.diceList = [1,1,1,1,1];
		this.player = 1;
		this.count = 0;
		this.rounds = 0;
		this.finalList = [0,0,0,0,0];
		$(".userScore").text(this.point);
		$(".dice").css({"transform":'rotateX(0deg) rotateY(0deg)'});
		$(".dicePosList li").attr("class","dicePos");
		this.playerHeadChange(this.player);
		this.resetBind(this.player);
		this.roll();
		this.scoreBind(this.player);
		this.taskBind();
	},
	
	pointSet: {
		't1': {'name':'×1', 'type':1, 'score':1},
		't2': {'name':'×2', 'type':1, 'score':2},
		't3': {'name':'×3', 'type':1, 'score':3},
		't4': {'name':'×4', 'type':1, 'score':4},
		't5': {'name':'×5', 'type':1, 'score':5},
		't6': {'name':'×6', 'type':1, 'score':6},
		't7': {'name':'同4', 'type':2},
		't8': {'name':'3加2', 'type':3},
		't9': {'name':'连4', 'type':4, 'score':20},
		't10': {'name':'连5', 'type':4, 'score':25},
		't11': {'name':'豹子', 'type':4, 'score':50},
		't12': {'name':'自由组合', 'type':5},
	},
	
	//加分
	scoreAdd: function(player, score) {
		var s = parseInt($('#p'+player).children(".userScore").text()) + score;
		$('#p'+player).children(".userScore").text(s);
	},
	//开始--随机骰子集(随机骰子)--骰子动画--单击骰子--骰子移出(data-point-0)--骰子移入
	//绑定开始按钮
	roll: function() {
		var This = this;
		
		$("#roll").on("click", this, function() {
			//this.count > 3 ? function(){alert('三次机会已经使用完')} : this.count++;
			if(This.count>2) {
				alert('3次机会已经用完');
				return;
			}else {
				This.count++;	
			}
			//单击后随机骰子集
			This.diceListRandom();
		})
		This.diceBind(This.player);
		This.dicePosRemoveBind(This.player);
	},
	
	taskBind: function() {
		$.each(this.pointSet, function(i, v) {
			$('.'+i).find(".task").text(v.name);
			//console.log(i);
		})
	},
	
	//绑定骰子,每个骰子点击后会进入预留位
	diceBind: function(player) {
		var This = this;
		//点击骰子下的ul,获取index即点数,并加入预留位
		$(".diceDetail").on("click", this, function() {
			var index = $(this).data('pos');
			var i = index-1;
			This.diceClick(player, i);
		})
	},
	
	//骰子点击--加入预留位
	diceClick: function(player, index) {
		//先获得点数--data-point, 把骰子集的相应位置变成0, 添加进预留位, 
		//var point = $('#dice'+index).attr('data-point');
		var point = $('.diceDetail').eq(index).attr('data-point');
		var pos = $('.diceDetail').eq(index).attr('data-pos');
		if(point == 0) {
			return;	
		}else {
			//alert(index);
			//this.diceList[index] = 0;
			this.dicePosAdd(this.player, point, pos);
			//this.diceBind(player);
			//var point = this.diceRandom();
			$("#dice"+index).attr('data-point', 0);
			$(".diceDetail").eq(index).attr('data-point', 0);
			var i = index-1;
			this.diceList[index] = 0;
		}
	},
	
	//骰子预留位添加
	dicePosAdd: function(player, point, pos) {
		//var arr = $('#p'+player).find('.dicePos');
		var count = 0;
		for(var i=0; i<5; i++) {
			//arr[1].data('dice');
			var arr = $('#p'+player).find('.dicePos:eq('+i+')');
			if(arr.attr('data-dice') != 0) {
				count++;
			}else {
				$('#p'+player).find('.dicePos:eq('+count+')').addClass('diceBG'+point).attr({'data-dice':point, 'data-pos':pos});
				return;
			}
		}
		
		//$('#p'+player).find('.dicePos:eq('+count+')').addClass('diceBG'+point).attr({'data-dice':point, 'data-pos':pos});
		
		//var string = player + count + point;
	},
	
	//随机点数
	diceRandom: function() {
		var point = Math.ceil(Math.random()*6);
		return point;
	},
	
	//骰子集随机
	diceListRandom: function() {
		//listObj = [0,0,0,0,0];
		//循环一次骰子集, 如果point是0, 说明已经被放进骰子集,不参与再次随机
		var This = this;
		$.each(This.diceList, function(i,v) {
			if(v == 0) {
				
			}else {
				This.point = This.diceRandom();
				This.diceList[i] = This.point;
				//console.log(This.diceList);
				var i2 = i+1;
				$('#dice'+i2).attr('data-point', This.point);
				$('.diceDetail').eq(i).attr('data-point', This.point);
				This.diceBGSet(i, This.point);
			}
		})
	},
	
	//骰子的变化
	diceNoBG: function(num) {
		switch(num) {
			case 1:
				return {x:'270', y:'0'};
				break;
			case 2:
				return {x:'90', y:'0'};
				break;
			case 3:
				return {x:'0', y:'270'};
				break;
			case 4:
				return {x:'0', y:'90'};
				break;
			case 5:
				return {x:'180', y:'0'};
				break;
			case 6:
				return {x:'0', y:'0'};
				break;
		}
	},
	
	//绑定骰子变化, 变会转
	diceBGSet: function(index, point) {
		var setStyle = this.diceNoBG(point);
		var times = (Math.round(Math.random()*9)+1)*360;
		var x = times+parseInt(setStyle.x) + 'deg';
		var y = times+parseInt(setStyle.y) + 'deg';
		var styleString = 'rotateX('+x+') rotateY('+y+')';
		$('.dice').eq(index).css({'transform':styleString});	
	},
		
	dicePosRemoveBind: function(player) {
		var This = this;
		$('#p'+player+' .dicePos').on("click", this, function() {
			//var index = $(this).index();
			
			var pos = $(this).attr('data-pos');
			var point = $(this).attr('data-dice');
			$(this).removeClass('diceBG'+point);
			$(this).attr({'data-dice':0, 'data-pos':0});
			$('.diceDetail').eq(pos-1).attr('data-point', point);
			This.diceList[pos-1] = point;
			//console.log(this);
			$('#d'+pos).attr('data-point', point);
		})
	},
	
	dicePosRemoveAll: function() {
		$('.dicePos').removeClass("diceBG1 diceBG2 diceBG3 diceBG4 diceBG5 diceBG6");
	},
	
	scoreBind: function(player) {
		var This = this;

		$(".tt").on("mouseover", this, function() {
			if($(this).parent().parent(".player").index()+1 != This.player) {
				return;
			}
			if($(this).find(".score").hasClass("scoreSetLeft") || $(this).find(".score").hasClass("scoreSetRight")) {
				
			}else {
				var score = This.finalDice(This.player);
				if(This.player == 1 || This.player == 4) {
					$(this).find(".score").css("width",40);
				}else if(This.player == 2 || This.player == 3) {
					$(this).find(".score").css({"width":40, "left":-43});	
				}
				var index = $(this).index()+1;
				var score = This.scoreCount(index);
				$(this).find(".score").text(score);
			}
			//console.log('1');
		})
		$(".tt").on("mouseout", this, function() {
			if($(this).parent().parent(".player").index()+1 != This.player) {
				return;
			}
			if($(this).find('.score').hasClass("scoreSetLeft") || $(this).find(".score").hasClass("scoreSetRight")) {
				return;	
			}else {
				if(This.player == 1 || This.player == 4) {
					$(this).find(".score").css("width",20);
				}else if(This.player == 2 || This.player == 3) {
					$(this).find(".score").css({"width":20, "left":-23});	
				}
				
				$(this).find(".score").text('');
			}
		})
		$(".tt").on("click", this, function() {
			if($(this).parent().parent(".player").index()+1 != This.player) {
				return;
			}
			var index = $(this).index()+1;
			var score = This.scoreCount(index);
			if(This.player == 2 || This.player == 3) {
				$(this).find('.score').addClass('scoreSetRight');
			}else if(This.player == 1 || This.player == 4) {
				$(this).find('.score').addClass('scoreSetLeft');
			}
			$(this).find('score').text(score);
			This.scoreAdd(This.player, score);
			This.playerChange(This.player);
		})
	},
	
	finalDice: function(player) {
		var judge = $('#dice1').attr('data-point') + $('#p1 dicePos:eq(1)').attr('data-dice');
		var flag = 0;
		if(judge == 0) {
			return;
		}else {
			for(var i=0; i<=4; i++) {
				var point = $(".diceDetail").eq(i).attr('data-point');
				if(point != 0) {
					this.finalList[flag] = point;
					flag++;
				}
			}
			for(var j=0; j<=4; j++) {
				var point = $('#p'+player).find('.dicePos').eq(j).attr('data-dice');
				if(point != 0) {
					this.finalList[flag] = point;
					flag++;
				}
			}
			//console.log(this.finalList + ' ' + flag);
		}
	},
	
	scoreCount: function(index) {
		//var type = this.pointSet.get(index).type;
		var This = this;
		var count = 0;
		
		var bpx = this.finalList;
		//console.log(this.finalList);
		for(var nn=0; nn<4; nn++) {
			for(var mm=0; mm<4; mm++) {
				if(bpx[mm] > bpx[mm+1]) {
					var before = bpx[mm];
					bpx[mm] = bpx[mm+1];
					bpx[mm+1] = before;
					//console.log(bpx);
				}
			}
		}
		var diceString = bpx.toString();
		//console.log(diceString);
		//console.log(bpx);
		switch(index) {
			case 1:
				$.each(This.finalList, function(i, v) {
					if(v == 1) {
						count++;	
					}
				})
				return count * 1;
				break;
			case 2:
				$.each(This.finalList, function(i, v) {
					if(v == 2) {
						count++;	
					}
				})
				return count * 2;
				break;
			case 3:
				$.each(This.finalList, function(i, v) {
					if(v == 3) {
						count++;	
					}
				})
				return count * 3;
				break;
			case 4:
				$.each(This.finalList, function(i, v) {
					if(v == 4) {
						count++;	
					}
				})
				return count * 4;
				break;
			case 5:
				$.each(This.finalList, function(i, v) {
					if(v == 5) {
						count++;	
					}
				})
				return count * 5;
				break;
			case 6:
				$.each(This.finalList, function(i, v) {
					if(v == 6) {
						count++;	
					}
				})
				return count * 6;
				break;
			case 7:
				if((bpx[0]==bpx[1]&&bpx[0]==bpx[2]&&bpx[0]==bpx[3])||(bpx[0]==bpx[2]&&bpx[0]==bpx[3]&&bpx[0]==bpx[4])||(bpx[0]==bpx[1]&&bpx[0]==bpx[3]&&bpx[0]==bpx[4])||(bpx[0]==bpx[1]&&bpx[0]==bpx[2]&&bpx[0]==bpx[4])) {
					return bpx[0]*4;
				}else if((bpx[1]==bpx[2]&&bpx[1]==bpx[3]&&bpx[1]==bpx[4])) {
					return bpx[1]*4;
				}else {
					return 0;
				}
				//return count * 1;
				break;
			case 8:
				if(bpx[0]==bpx[1]&&bpx[0]==bpx[2]&&bpx[3]==bpx[4]) {
					return parseInt(bpx[0])*3+parseInt(bpx[3])*2;
				}else if(bpx[0]==bpx[1]&&bpx[2]==bpx[3]&&bpx[2]==bpx[4]) {
					return parseInt(bpx[0])*2+parseInt(bpx[3])*3;
				}else {
					return 0;	
				}
				break;
			case 9:
			//12345 11234 12234 12334 12344 22345 23345 23445 23455  12346 23456 13456 34566 33456 34456 34556 
				/*if(diceString.match('1,2,3,4,5') || diceString.match('2,2,3,4,5') || diceString.match('2,3,3,4,5') || diceString.match('2,3,4,4,5') || diceString.match('2,3,4,5,5') || diceString.match('1,1,2,3,4') || diceString.match('1,2,2,3,4') || diceString.match('1,2,3,3,4') || diceString.match('1,2,3,4,4') || diceString.match('1,2,3,4,6') || diceString.match('2,3,4,5,6') || diceString.match('1,3,4,5,6') || diceString.match('3,4,5,6,6') || diceString.match('3,3,4,5,6') || diceString.match('3,4,4,5,6') || diceString.match('3,4,5,5,6')) {*/
				if(($.inArray(1,bpx)&&$.inArray(2,bpx)&&$.inArray(3,bpx)&&$.inArray(4,bpx))||($.inArray(5,bpx)&&$.inArray(2,bpx)&&$.inArray(3,bpx)&&$.inArray(4,bpx))||($.inArray(5,bpx)&&$.inArray(6,bpx)&&$.inArray(3,bpx)&&$.inArray(4,bpx))) {
					return 20;	
				}else {
					return 0;	
				}
				break;
			case 10:
				if(diceString.match('1,2,3,4,5') || diceString.match('2,3,4,5,6')) {
					return 25;	
				}else {
					return 0;	
				}
				break;
			case 11:
				if(bpx[1]==bpx[2]&&bpx[1]==bpx[3]&&bpx[1]==bpx[4]&&bpx[1]==bpx[0]&&bpx[0]!=0) {
					return 50;	
				}else {
					return 0;	
				}
				break;
			case 12:
				return parseInt(bpx[1])+parseInt(bpx[2])+parseInt(bpx[3])+parseInt(bpx[4])+parseInt(bpx[0]);
				//return bpx[0]+bpx[1]+bpx[2]+bpx[3]+bpx[4];
				break;
		}
	},
	
	playerChange: function(player) {
		this.playerInfoReset(player);
		this.diceBind(this.player);
		this.count = 0;
		//this.dicePosRemoveBind(this.player);
		if(this.player == 4){this.player = 1}else{this.player += 1};
		//this.player = 4 ? this.player += 1 : this.player = 1;
		this.dicePosRemoveBind(this.player);
		this.playerHeadChange(this.player);
		//this.diceBind(this.player);
		//console.log(this.player);
	},
	
	playerInfoReset: function(player) {
		$('.dicePos').attr({'data-dice':0, 'data-pos':0});
		this.diceList = [1,1,1,1,1];
		this.finalList = [0,0,0,0,0];
		for(var i=0; i<5; i++) {
			this.diceBGSet(i, 6);
		}
		this.dicePosRemoveAll();
		this.rounds++;
		if(this.rounds == 48) {
			var p1 = $('#p1 .userScore').text();
			var p2 = $('#p2 .userScore').text();
			var p3 = $('#p3 .userScore').text();
			var p4 = $('#p4 .userScore').text();
			var pointArr = [p1,p2,p3,p4];
			var winArr;
			for(var i=0; i<4; i++) {
				if(pointArr[0]<=pointArr[i]) {
					pointArr[0] = pointArr[i];
					winArr = i;
				}
			}
			var winner = winArr + 1;
			if(confirm('第一名是玩家'+winner+', 点击确定后重新开始游戏')) {
				this.gameReset();
			}
		}
	},
	
	playerHeadChange: function(player) {
		$(".player .head").removeClass("headActive");
		$('#p'+player+' .head').addClass("headActive");
	},
	
	gameReset: function() {
		$(".userScore").text(0);
		$(".score").text(' ').removeClass("scoreSetLeft scoreSetRight");
		$('.dicePos').attr({'data-dice':0, 'data-pos':0});
		$('.diceDetail').attr({'data-point':0});
		$(".dice").attr({'data-point':1});
		$(".scoreSetLeft. .scoreSetRight").removeClass("scoreSetLeft scoreSetRight");
		this.diceList = [1,1,1,1,1];
		this.finalList = [0,0,0,0,0];
		this.player = 1;
		this.count = 0;
		this.rounds =0;
		for(var i=0; i<5; i++) {
			this.diceBGSet(i, 6);	
		}
		This.dicePosRemoveAll();
	},
	
	resetBind: function(player) {
		var This = this;
		$("#restart").on("click", this, function() {
			if(confirm('确定重新开始游戏?')) {
				This.gameReset();
			}
		})
	}
}

game.init();
$(".head").click(function() {
	
	
})


})


















