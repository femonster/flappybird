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
]

var zScroll = {
    currentPosition: 0, //记录当前页面位置	
    boxWidth: window.innerWidth,
    navBox: document.querySelector(".img-nav-box"),
    // setSliderWidth: function(aSliderItem) {
    //     var oSliderBox = document.querySelector(".slider-box");
    //     var width = 0;
    //     var i;
    //     var len = aSliderItem.length;
    //     var sliderWidth = document.documentElement.clientWidth || document.body.clientWidth;
    //     for (i = 0; i < len; i++) {
    //         aSliderItem[i].style.width = sliderWidth + "px";
    //         width += sliderWidth;
    //     }
    //     oSliderBox.style.width = width + "px";
    // },
    init: function(el) {
        // this.setSliderWidth(el.children);
        document.addEventListener("DOMContentLoaded", function() {
            zScroll.bindTouchEvent(el);
            zScroll.setNav(el);
        });
    },
    transform: function(translate) {
        this.style.webkitTransform = "translate3d(" + translate + "px,0,0)";
        // currentPosition = translate;
    },
    setNav: function(el) {
        // var navBox = document.querySelector(".img-nav-box");
        var boxW = this.boxWidth;
        var navStr = "";
        for (var i = 0; i < tempImgs.length; i++) {
            navStr += '<div class="img-nav" style="width:' + 45 + 'px;height:' + 45 + 'px;background-image:url(' + tempImgs[i] + ')" data-index=' + i + '></div>';
        }
        this.navBox.innerHTML = navStr;
    },
    bindTouchEvent: function(el) {

        var self = this;
        var startX, startY;
        var initialPos = 0; //手指按下的屏幕距离
        var moveLen = 0; //手指当前滑动的距离
        var direction = "left"; //滑动方向
        var isMove = false; //是否发生左右滑动
        var startT = 0; //记录手指按下去的时间
        var isTouchEnd = true; //标记当前滑动是否结束（手指已离开屏幕）
        var pageWidth = this.boxWidth;
        var currentItem = null;
        var tmpBox = null;
        var currImgIndex = 0;
        var tmpImgIndex = 0;
        var maxLen = tempImgs.length - 1;
        el.addEventListener("touchstart", function(e) {
            currentItem = el.querySelector(".s-current");
            tmpBox = el.querySelector(".s-tmp-box");
            currImgIndex = Number(currentItem.dataset.sIndex);
            tmpBox.dataset.isCurr = 0;
            e.preventDefault();

            if (e.touches.length == 1 || isTouchEnd) {
                var touch = e.touches[0];
                startX = touch.pageX;
                startY = touch.pageY;
                initialPos = 0; //滑动前的初始位置都为0，因为划完后会重置
                currentItem.style.webkitTransform = "";
                startT = new Date().getTime();
                isMove = false; //是否产生滑动
                isTouchEnd = false; //当前滑动开始
            }
        });

        el.addEventListener("touchmove", function(e) {
            e.preventDefault();
            // var prevNode = document.querySelector(".s-prev");
            // var nextNode = document.querySelector(".s-next");
            if (isTouchEnd) return;

            var touch = e.touches[0];
            var deltaX = touch.pageX - startX;
            var deltaY = touch.pageY - startY;
            direction = deltaX > 0 ? "right" : "left";
            var tmpChildImg = tmpBox.children[0];
            // var tmpImgIndex = Number(tmpBox.dataset.sIndex);
            // console.log(direction);
            tmpBox.style.webkitTransition = "";
            currentItem.style.webkitTransition = "";
            if (direction == "right") {
                if (typeof tmpBox.dataset.dirc == 'undefined' || tmpBox.dataset.dirc != "right") {
                    tmpBox.dataset.dirc = "right";
                    tmpImgIndex = currImgIndex - 1;
                    if (tmpImgIndex >= 0) {
                        self.transform.call(tmpBox, deltaX - pageWidth);
                        tmpChildImg.src = tempImgs[tmpImgIndex];
                        tmpBox.dataset.isborder = 0;
                        // tmpChildImg.style.width = "";
                        // tmpBox.style.webkitTransform = "translate3d(" + -pageWidth + deltaX + "px,0,0)";
                        tmpBox.style.opacity = 1;
                    } else {
                        tmpBox.style.opacity = 0;
                        tmpBox.dataset.isborder = 1;
                        // tmpImgIndex = 1;
                    }

                }
            } else {
                if (typeof tmpBox.dataset.dirc == 'undefined' || tmpBox.dataset.dirc != "left") {
                    tmpBox.dataset.dirc = "left";
                    tmpImgIndex = currImgIndex + 1;
                    if (tmpImgIndex <= maxLen) {
                        self.transform.call(tmpBox, pageWidth + deltaX);
                        tmpChildImg.src = tempImgs[tmpImgIndex];
                        tmpBox.dataset.isborder = 0;
                        // tmpBox.style.webkitTransform = "translate3d(" + pageWidth - deltaX + "px,0,0)";
                        tmpBox.style.opacity = 1;
                    } else {
                        tmpBox.style.opacity = 0;
                        tmpBox.dataset.isborder = 1;
                        // tmpImgIndex = maxLen - 1;
                    }

                }
            }
            console.log("tmpImgIndex", tmpImgIndex);
            // 若x方向位移>y方向位移，认为左右滑动
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                moveLen = deltaX;
                var translate = initialPos + deltaX;
                var prevTrans = deltaX - pageWidth;
                var nextTrans = pageWidth + deltaX;
                if (direction == "right") {
                    self.transform.call(tmpBox, prevTrans);
                } else {
                    self.transform.call(tmpBox, nextTrans);
                }
                // if (translate <= 0 && translate >= maxWidth) {
                self.transform.call(currentItem, translate);
                // this.transform.call(prevNode, prevTrans);
                // this.transform.call(nextNode, nextTrans);
                isMove = true;
                // }
                // 滑动方向
            }
        });

        el.addEventListener("touchend", function(e) {
            e.preventDefault();
            // 主屏滑动距离
            var translate = 0;
            //tmp容器滑动距离
            var tmpTrans = 0;
            //计算手指在屏幕上停留时间
            var deltaT = new Date().getTime() - startT;
            //发生了滑动，并且滑动事件未结束
            if (isMove && !isTouchEnd) {
                isTouchEnd = true;
                currentItem.style.webkitTransition = "0.3s ease -webkit-transform";
                tmpBox.style.webkitTransition = "0.3s ease -webkit-transform";
                // 如果手指停留时间小于300ms,则滑动到下一页
                if (deltaT < 300) {
                    // translate = direction == 'left' ? -pageWidth : pageWidth;
                    // translate = self.canmove(tmpImgIndex) ? translate : 0;

                    // translate = translate > 0 ? 0 : translate;
                    console.log("end", "tmpIndex", tmpImgIndex);
                    if (direction == "left") {
                        translate = -pageWidth;
                        if (tmpImgIndex > maxLen) {
                            translate = 0;
                            tmpImgIndex = maxLen;
                        }
                    } else {
                        translate = pageWidth;
                        if (tmpImgIndex < 0) {
                            translate = 0;
                            tmpImgIndex = 0;
                        }
                    }
                    tmpBox.dataset.isCurr = 1;
                    tmpBox.dataset.sIndex = tmpImgIndex;
                    tmpBox.dataset.dirc = "";
                    if (tmpBox.dataset.isCurr == 1 && tmpBox.dataset.isborder == 0) {
                        replaceClass(tmpBox, "s-current", "s-tmp-box");
                        replaceClass(currentItem, "s-tmp-box", "s-current");
                    }
                } else {
                    if (Math.abs(moveLen) / pageWidth < 0.5) {
                        translate = 0;
                        tmpTrans = direction == "left" ? pageWidth : -pageWidth;
                    } else {
                        //如果滑动距离大于屏幕的50%，则滑动到下一页
                        // translate = direction == 'left' ? -pageWidth : pageWidth;
                        // translate = self.canmove(tmpImgIndex) ? translate : 0;
                        if (direction == "left") {
                            translate = -pageWidth;
                            if (tmpImgIndex > maxLen) {
                                translate = 0;
                                tmpImgIndex = maxLen;
                            }
                        } else {
                            translate = pageWidth;
                            if (tmpImgIndex < 0) {
                                translate = 0;
                                tmpImgIndex = 0;
                            }
                        }
                        tmpBox.dataset.isCurr = 1;
                        tmpBox.dataset.sIndex = tmpImgIndex;
                        tmpBox.dataset.dirc = "";
                        if (tmpBox.dataset.isCurr == 1 && tmpBox.dataset.isborder == 0) {
                            replaceClass(tmpBox, "s-current", "s-tmp-box");
                            replaceClass(currentItem, "s-tmp-box", "s-current");
                        }
                    }
                }

                self.transform.call(currentItem, translate);
                self.transform.call(tmpBox, tmpTrans);


            }
            // tmpBox.addEventListener("transitionend", function() {
            //     tmpBox.style.webkitTransition = "";
            //     currentItem.style.webkitTransition = "";
            //     tmpBox.dataset.sIndex = tmpImgIndex;
            //     tmpBox.dataset.dirc = "";
            //     if (tmpBox.dataset.isCurr == 1 && tmpBox.dataset.isborder == 0) {
            //         replaceClass(tmpBox, "s-current", "s-tmp-box");
            //         replaceClass(currentItem, "s-tmp-box", "s-current");
            //     }
            // })
        });

        this.navBox.addEventListener("click", function(e) {
            var tmpTrans = 0;
            var translate = 0;
            if (hasClass(e.target, "img-nav")) {
                var toIndex = Number(this.dataset.index);
                var cItem = document.querySelector(".s-current");
                var tItem = document.querySelector(".s-tmp-box");
                cItem.style.webkitTransition = "0.3s ease -webkit-transform";
                tItem.style.webkitTransition = "0.3s ease -webkit-transform";
                var nowIndex = Number(cItem.dataset.sIndex);
                if (toIndex == nowIndex) {
                    return;
                } else if (toIndex < nowIndex) { //right
                    translate = pageWidth;
                } else { //left
                    translate = -pageWidth;
                }
                self.transform.call(cItem, translate);
                self.transform.call(tItem, tmpTrans);
            }
        })
    }
}

zScroll.init(document.querySelector(".slider-box"));