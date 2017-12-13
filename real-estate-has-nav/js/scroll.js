var zScroll = {
	boxWidth:window.innerWidth,
	init:function(el) {
		document.addEventListener("DOMContentLoaded",function () {
			zScroll.bindTouchEvent(el);
		}.bind(zScroll),false);
	},
	transform:function(translate) {
		this.style.webkitTransform = "translate3d("+translate+"px,0,0)";
	},
	setMainClass:function(el) {
		var self = this;
		el.addEventListener("webkitTransitionEnd",function() {
			el.className = "s-item s-current";
			el.style.webkitTransform = "";
			siblings(el).forEach(function(item){
				item.className= "s-item s-other";
				item.style.webkitTransform = "";
			})
			self.bindTouchEvent(el);
		})
	},
	bindTouchEvent:function(el) {
		var startX,startY;
		var initialPos = 0; //手指按下的屏幕距离
		var moveLen = 0; //手指当前滑动的距离
		var direction = "left"; //滑动方向
		var isMove = false; //是否发生左右滑动
		var startT = 0; //记录手指按下去的时间
		var isTouchEnd = true; //标记当前滑动是否结束（手指已离开屏幕）
		var pageWidth = this.boxWidth;
		el.addEventListener("touchstart",function(e) {
			e.preventDefault();
			var prevNode = el.previousElementSibling;
            var nextNode = el.nextElementSibling;		
            if(e.touches.length == 1 || isTouchEnd){
				var touch = e.touches[0];
				startX = touch.pageX;
				startY = touch.pageY;
				initialPos = 0; //滑动前的初始位置都为0，因为划完后会重置
				el.style.webkitTransform = "";
				replaceClass(prevNode,"s-prev","s-other");
	            replaceClass(nextNode,"s-next","s-other");
	            prevNode.style.WebkitTransform = "translate3d(" + (- pageWidth)+"px,0,0)";
	            nextNode.style.WebkitTransform = "translate3d(" + pageWidth + "px,0,0)";	
				startT = new Date().getTime();
				isMove = false; //是否产生滑动
                isTouchEnd = false; //当前滑动开始
			}
		}.bind(this),false);

		el.addEventListener("touchmove",function(e) {
			e.preventDefault();
			var prevNode = document.querySelector(".s-prev");
            var nextNode = document.querySelector(".s-next");		
			if(isTouchEnd) return;

			var touch = e.touches[0];
			var deltaX = touch.pageX - startX;
			var deltaY = touch.pageY - startY;

			// 若x方向位移>y方向位移，认为左右滑动
			if(Math.abs(deltaX) > Math.abs(deltaY)){
				moveLen = deltaX;
				var translate = initialPos + deltaX;
				var prevTrans = deltaX - pageWidth;
				var nextTrans = deltaX + pageWidth;
				//超出边界判断，这里需要修改
				/**   */
				// if (translate <=0 && translate >= maxWidth){
                       this.transform.call(el,translate);
                       this.transform.call(prevNode,prevTrans);
                       this.transform.call(nextNode,nextTrans);
                       isMove = true;
                   // }
				// 滑动方向
				direction = deltaX >0?"right":"left";
			}
		}.bind(this),false);

		el.addEventListener("touchend",function(e) {
			e.preventDefault();
			var prevNode = document.querySelector(".s-prev");
            var nextNode = document.querySelector(".s-next");	
			var translate = 0;
			var prevTrans = 0;
			var nextTrans = 0;
			//计算手指在屏幕上停留时间
			var deltaT = new Date().getTime() - startT;
			//发生了滑动，并且滑动事件未结束
			if(isMove && !isTouchEnd){
				isTouchEnd = true;
				el.style.webkitTransition = "0.3s ease -webkit-transform";
				prevNode.style.webkitTransition = "0.3s ease -webkit-transform";
				nextNode.style.webkitTransition = "0.3s ease -webkit-transform";
				if(deltaT < 300){
					if(direction == "left"){
						translate = -pageWidth;
						prevTrans = -2*pageWidth;
						nextTrans = 0;
						this.setMainClass(nextNode);
					}else{
						translate = pageWidth;
						prevTrans = 0;
						nextTrans = 2*pageWidth;
						this.setMainClass(prevNode);
					}
				}else{
					if(Math.abs(moveLen)/pageWidth < 0.5){
						translate = 0;
						prevTrans = -pageWidth;
						nextTrans = pageWidth;
					}else{
						//如果滑动距离大于屏幕的50%，则滑动到下一页
                        // translate = direction == 'left'?
                        // currentPosition-(pageWidth+moveLen):currentPosition+pageWidth-moveLen;
                        if(direction == "left"){
							translate = -pageWidth;
							prevTrans = -2*pageWidth;
							nextTrans = 0;
							this.setMainClass(nextNode);

						}else{
							translate = pageWidth;
							prevTrans = 0;
							nextTrans = 2*pageWidth;
							this.setMainClass(prevNode);
						}
					}	
				}

				this.transform.call(el,translate);
				this.transform.call(prevNode,prevTrans);
				this.transform.call(nextNode,nextTrans);
			}
		}.bind(this),false);
	}	
}

zScroll.init(document.querySelector(".s-current"));