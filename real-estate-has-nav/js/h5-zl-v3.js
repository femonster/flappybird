var oMaskBox = document.querySelector(".mask-box");
var oImgNums = document.querySelector(".img-nums");
var oImgsBox = document.querySelector(".my-img-com");
var oOtherImgsBoxs = document.querySelector(".other-img-com");
var oBody = document.body;
var oSliderBox = document.querySelector(".slider-box");
var oBack = document.querySelector(".i-back");
var navBox = document.querySelector(".img-nav-box");

var slider = {
    mySliderNum: function() {
        var tmp = Number(getQueryString("m"));
        if (tmp > 9) {
            return 9;
        } else {
            return tmp;
        }
    },
    othSliderNum: function() {
        var tmp = Number(getQueryString("o"));
        if (tmp > 9) {
            return 9;
        } else {
            return tmp;
        }
    },
    newImgWaH: function(cw, ch, imgw, imgh) {
        var rate1 = 0;
        var rate2 = 0;
        if (ch > 0) {
            rate1 = cw / ch;
        }
        if (imgh > 0) {
            rate2 = imgw / imgh
        }
        if (rate1 > rate2) {
            return { width: ch * rate2, height: ch }
        } else {
            return { width: cw, height: cw / rate2 }
        }
    },
    scroll: null,
    imgArr: [], //{w:1,h:1,url:1}
    aSliderLi: [],
    mainIndex: 0,
    _render: function(index, p, sArr) {
        var self = this;
        var str = "";
        var navStr = "";
        var count = 0;
        var boxW = document.documentElement.clientWidth || document.body.clientWidth;
        var boxH = document.querySelector(".show-img").clientHeight;
        var navW = ((boxW - 10) / p) > navBox.clientHeight ? navBox.clientHeight - 10 : ((boxW - 10) / p);
        for (var i = 0; i < p; i++) {
            var isloaded = sArr[i].isload;
            console.log(isloaded);
            if (isloaded == 1) {
                var tempw = sArr[i].width,
                    temph = sArr[i].height;
                var newWaH = self.newImgWaH(boxW, boxH, tempw, temph);
                str += '<li class="s-item s-other" data-s-index=' + i + '><img src="' + sArr[i].url + '" style="width:' + newWaH.width + 'px;height:' + newWaH.height + 'px" class="s-img"/></li>';
            } else {
                str += '<li class="s-item s-other" data-s-index=' + i + ' data-isload="0"><img class="loading" src="http://a.xnimg.cn/wap/mobile/2017activity/real-estate/img/loading.gif" width="30" height="30"/></li>';
            }
            navStr += '<div class="img-nav" data-originUrl=' + sArr[i].url + ' style="width:' + navW + 'px;height:' + navW + 'px;background-image:url(' + sArr[i].url + ')" data-index=' + i + '></div>';
        }
        oSliderBox.innerHTML = str;
        navBox.innerHTML = navStr;
        var aSliderLi = document.querySelectorAll(".s-item");
        replaceClass(aSliderLi[index], 's-current', 's-other');
        this.setSliderWidth(aSliderLi);
        var aLi = Array.prototype.slice.call(aSliderLi);
        aLi.forEach(function(item, index) {
            console.log(item.dataset.isload);
            if (item.dataset.isload == 0) {
                var url = item.dataset.url;
                var oimg = new Image();
                oimg.style.opacity = 0;
                oimg.onload = function() {
                    var w = oimg.width;
                    var h = oimg.height;
                    item.querySelector(".loading").style.display = "none";
                    var newWaH = self.newImgWaH(boxW, boxH, w, h);
                    oimg.style.width = newWaH.width + "px";
                    oimg.style.height = newWaH.height + "px";
                    oimg.className = "s-img";
                    item.appendChild(oimg);
                    oimg.style.opacity = 1;
                }
                oimg.src = url;
            }
            var disX, moveX;
            item.addEventListener("touchstart", function(e) {
                disX = e.changedTouches[0].pageX;
                console.log(disX);
            });
            item.addEventListener("touchmove", function(e) {
                // self._touchMove(this, e, disX);
                var boxW = document.documentElement.clientWidth || document.body.clientWidth;
                moveX = e.changedTouches[0].pageX - disX;
                if (hasClass(this, "s-current")) {
                    if (this.dataset.sIndex > 0) {
                        var prevNode = this.previousElementSibling;
                        var nextNode = this.nextElementSibling;
                        this.style.WebkitTransform = "translate3d(" + moveX + "px,0,0)";
                        prevNode.style.WebkitTransform = "translate3d(" + (moveX - boxW) + "px,0,0)";
                        nextNode.style.WebkitTransform = "translate3d(" + (moveX + boxW) + "px,0,0)";
                        replaceClass(prevNode, "s-prev", "s-other");
                        replaceClass(nextNode, "s-next", "s-other");
                    }
                }
            });
            item.addEventListener("touchend", function(e) {
                if (this.dataset.sIndex > 0) {

                    // var prevNode = this.previousElementSibling;
                    // var nextNode = this.nextElementSibling;
                    // this.style.WebkitTransform = "translate3d(" + moveX + "px,0,0)";
                    // prevNode.style.WebkitTransform = "translate3d(" + (moveX - boxW) + "px,0,0)";
                    // nextNode.style.WebkitTransform = "translate3d(" + (moveX + boxW) + "px,0,0)";
                    // replaceClass(prevNode, "s-prev", "s-other");
                    // replaceClass(nextNode, "s-next", "s-other");
                }
            })

        });
        self._initSlider(index, p, sArr);
    },
    _touchStart: function(e) {
        // var disX = e.changedTouches[0].pageX;
    },
    _touchMove: function(_this, e, disX) {
        // var boxW = document.documentElement.clientWidth || document.body.clientWidth;
        // var moveX = e.changedTouches[0].pageX - disX;
        // if (hasClass(_this, "s-current")) {
        //     if (_this.dataset.sIndex > 0) {
        //         var prevNode = _this.previousElementSibling;
        //         var nextNode = _this.nextElementSibling;
        //         _this.style.WebkitTransform = "translate3d(" + moveX + "px,0,0)";
        //         prevNode.style.WebkitTransform = "translate3d(" + (moveX - boxW) + "px,0,0)";
        //         nextNode.style.WebkitTransform = "translate3d(" + (moveX + boxW) + "px,0,0)";
        //         replaceClass(prevNode, "s-prev", "s-other");
        //         replaceClass(nextNode, "s-next", "s-other");
        //     }
        // }
        // console.log(moveX);
    },
    _touchend: function(e) {
        var endX = e.changedTouches[0].pageX;
        // if ()
    },
    setSliderWidth: function(aSliderItem) {
        var oSliderBox = document.querySelector(".slider-box");
        var width = 0;
        var i;
        var len = aSliderItem.length;
        var sliderWidth = document.documentElement.clientWidth || document.body.clientWidth;
        for (i = 0; i < len; i++) {
            aSliderItem[i].style.width = sliderWidth + "px";
        }
    },
    // 显示图片展示mask
    showMask: function(i, len, _this) {
        oMaskBox.style.display = "block";
        document.body.className = "lock";
        oImgNums.innerText = (Number(i) + 1) + "/" + len;
        var achild = _this.children;
        for (var j = 0; j < achild.length; j++) {
            var temp = achild[j].children[0];
            this.imgArr.push({
                "index": temp.dataset.i,
                "url": temp.dataset.echoBackground,
                "isload": temp.dataset.isload,
                "width": temp.dataset.w,
                "height": temp.dataset.h
            })
        }
        this._render(i, len, this.imgArr);
        // this._initSlider(i, len, this.imgArr);
    },
    // 隐藏mask
    hideMask: function() {
        oMaskBox.style.display = 'none';
        document.body.className = "";
        this.imgArr = [];
        // this.scroll.destroy();
    },
    // 初始化slider
    _initSlider: function(i, len, sArr) {

    }


}

window.addEventListener("DOMContentLoaded", function() {

    document.addEventListener("click", function(e) {
        if (hasClass(e.target, "download")) {
            e.stopPropagation();
            alert("请前往APP store下载");
        }
    })

    // 点击我的相册照片
    oImgsBox.addEventListener("click", function(e) {
        var _this = this;
        if (e.target.className == "img-item") {
            var index = e.target.dataset.i;
            slider.showMask(index, slider.mySliderNum(), _this);
        }
        if (e.target.className == "more-mask") {
            e.stopPropagation();
            alert("请前往APP store下载");
        }
    })


    // 点击别人的相册照片
    oOtherImgsBoxs.addEventListener("click", function(e) {
        var _this = this;
        if (e.target.className == "img-item") {
            var index = e.target.dataset.i;
            slider.showMask(index, slider.othSliderNum(), _this);
        }
        if (e.target.className == "more-mask") {
            e.stopPropagation();
            alert("请前往APP store下载");
        }
    })

    // document.querySelector(".s-current").addEventListener("touchstart", function(e) {
    //     console.log(e);
    //     if (hasClass(e.target, "s-current")) {
    //         var disX = e.touches[0].clientX;
    //         console.log(disX);
    //     }
    // })

    navBox.addEventListener("click", function(e) {

        })
        // oMaskBox.addEventListener("click", function(e) {
        //     if (e.target.nodeName != 'IMG' && !hasClass(e.target, "img-nav")) {
        //         slider.hideMask();
        //     }
        // })
})