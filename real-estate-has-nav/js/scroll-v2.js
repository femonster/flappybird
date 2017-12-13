var tempImgs = [
    'http://upload-images.jianshu.io/upload_images/3888445-cb101354c9f627bf.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/700',
    'http://upload-images.jianshu.io/upload_images/9472808-e5198d54b4613b57.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/700',
    'http://upload-images.jianshu.io/upload_images/9472808-309a14d9429de532.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/700',
    'http://upload-images.jianshu.io/upload_images/9472808-9ac32abd840be7c5.JPG?imageMogr2/auto-orient/strip%7CimageView2/2/w/700',
    'http://upload-images.jianshu.io/upload_images/9472808-e8076ee468834ff8.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/700',
    'http://upload-images.jianshu.io/upload_images/9472808-64165b9c86278f7d.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/700',
    'http://upload-images.jianshu.io/upload_images/3812307-d1849b94d6ce0ae3.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/700',
    'http://upload-images.jianshu.io/upload_images/3888445-8e46cccb893cf8bd.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/700',
    'http://upload-images.jianshu.io/upload_images/3888445-1de0c2b804291de4.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/700',
    'http://upload-images.jianshu.io/upload_images/3888445-e94b9c270d90e0b3.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/700',
    'http://upload-images.jianshu.io/upload_images/3888445-b19e5de2f6e8ad3b.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/700',
    'http://upload-images.jianshu.io/upload_images/3888445-cb101354c9f627bf.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/700'
]

var zScroll = {
    currentPosition: 0, //记录当前页面位置	
    boxWidth: window.innerWidth,
    maxWidth: 3 * window.innerWidth,
    setSliderWidth: function(aSliderItem) {
        var oSliderBox = document.querySelector(".slider-box");
        var width = 0;
        var i;
        var len = aSliderItem.length;
        var sliderWidth = document.documentElement.clientWidth || document.body.clientWidth;
        for (i = 0; i < len; i++) {
            aSliderItem[i].style.width = sliderWidth + "px";
            width += sliderWidth;
        }
        oSliderBox.style.width = width + "px";
    },
    init: function(el) {
        this.setSliderWidth(el.children[0].children);
        document.addEventListener("DOMContentLoaded", function() {
            zScroll.bindTouchEvent(el);
        }.bind(zScroll), false);
    },
    transform: function(translate) {
        this.style.webkitTransform = "translate3d(" + translate + "px,0,0)";
        this.currentPosition = translate;
    },
    bindTouchEvent: function(el) {
        var startX, startY;
        var initialPos = 0; //手指按下的屏幕距离
        var moveLen = 0; //手指当前滑动的距离
        var direction = "left"; //滑动方向
        var isMove = false; //是否发生左右滑动
        var startT = 0; //记录手指按下去的时间
        var isTouchEnd = true; //标记当前滑动是否结束（手指已离开屏幕）
        var pageWidth = this.boxWidth;
        var currentPosition = this.currentPosition;
        var maxWidth = 3 * pageWidth; //页面滑动最后一页的位置
        document.addEventListener("touchstart", function(e) {
            e.preventDefault();
            if (e.touches.length == 1 || isTouchEnd) {
                var touch = e.touches[0];
                startX = touch.pageX;
                startY = touch.pageY;
                initialPos = currentPosition;
                el.style.webkitTransform = "";
                startT = new Date().getTime();
                isMove = false; //是否产生滑动
                isTouchEnd = false; //当前滑动开始
            }
        }.bind(this), false);

        document.addEventListener("touchmove", function(e) {
            e.preventDefault();
            if (isTouchEnd) return;
            var touch = e.touches[0];
            var deltaX = touch.pageX - startX;
            var deltaY = touch.pageY - startY;
            // 若x方向位移>y方向位移，认为左右滑动
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                moveLen = deltaX;
                var translate = initialPos + deltaX;

                if (translate <= 0 && translate >= maxWidth) {
                    this.transform.call(el, translate);
                    isMove = true;
                }
                // 滑动方向
                direction = deltaX > 0 ? "right" : "left";
            }
        }.bind(this), false);

        document.addEventListener("touchend", function(e) {
            e.preventDefault();
            var translate = 0;
            //计算手指在屏幕上停留时间
            var deltaT = new Date().getTime() - startT;
            //发生了滑动，并且滑动事件未结束
            if (isMove && !isTouchEnd) {
                isTouchEnd = true;
                el.style.webkitTransition = "0.3s ease -webkit-transform";

                if (deltaT < 300) {
                    translate = direction == 'left' ?
                        this.currentPosition - (pageWidth + moveLen) : this.currentPosition + pageWidth - moveLen;
                    //如果最终位置超过边界位置，则停留在边界位置 

                    translate = translate > 0 ? 0 : translate; //左边界
                    translate = translate < maxWidth ? maxWidth : translate; //右边界
                } else {
                    if (Math.abs(moveLen) / pageWidth < 0.5) {
                        translate = 0;
                        prevTrans = -pageWidth;
                        nextTrans = pageWidth;
                    } else {
                        //如果滑动距离大于屏幕的50%，则滑动到下一页
                        translate = direction == 'left' ?
                            this.currentPosition - (pageWidth + moveLen) : this.currentPosition + pageWidth - moveLen;
                    }
                }

                this.transform.call(el, translate);
            }
        }.bind(this), false);
    }
}

zScroll.init(document.querySelector(".slider-box"));