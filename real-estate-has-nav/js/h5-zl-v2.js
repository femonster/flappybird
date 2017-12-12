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
    render: function(index, p, sArr) {
        if (index == 0) {
            index = 1;
        } else if (index == (p - 1)) {
            index = p - 2;
        }
        var self = this;
        var str = "";
        var navStr = "";
        var count = 0;
        var left = Number(index) - 1 < 0 ? 0 : Number(index) - 1;
        var right = Number(index) + 1 > p ? p : Number(index) + 1;
        console.log("渲染：当前", index, "左", left, "右", right, "总数", p);
        var boxW = document.documentElement.clientWidth || document.body.clientWidth;
        var boxH = document.querySelector(".show-img").clientHeight;
        var navW = ((boxW - 10) / p) > navBox.clientHeight ? navBox.clientHeight - 10 : ((boxW - 10) / p);
        for (var i = left; i <= right; i++) {
            var isloaded = sArr[i].isload;
            // console.log(isloaded);
            if (isloaded == 1) {
                var tempw = sArr[i].width,
                    temph = sArr[i].height;
                var newWaH = self.newImgWaH(boxW, boxH, tempw, temph);
                str += '<li class="s-item"><img src="' + sArr[i].url + '" style="width:' + newWaH.width + 'px;height:' + newWaH.height + 'px"/></li>';
            } else {
                str += '<li class="s-item" data-isload="0"><img class="loading" src="http://a.xnimg.cn/wap/mobile/2017activity/real-estate/img/loading.gif" width="30" height="30"/></li>';
            }
        }
        for (var k = 0; k < p; k++) {
            navStr += '<div class="img-nav" data-originUrl=' + sArr[k].url + ' style="width:' + navW + 'px;height:' + navW + 'px;background-image:url(' + sArr[k].url + ')" data-index=' + k + '></div>';
        }
        oSliderBox.innerHTML = str;
        navBox.innerHTML = navStr;
        this.aSliderLi = document.querySelectorAll(".s-item");
        // console.log(self.aSliderLi);
        addClass(self.aSliderLi[0], 'left');
        addClass(self.aSliderLi[1], 'main');
        addClass(self.aSliderLi[2], 'right');
        self.aSliderLi[0].dataset.originIndex = left;
        self.aSliderLi[1].dataset.originIndex = index;
        self.aSliderLi[2].dataset.originIndex = right;
        this.setSliderWidth(this.aSliderLi);
        // this.aSliderLi = Array.prototype.slice.call(aSliderLi);
    },
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
        this._initSlider(i, len, this.imgArr);
    },
    // 隐藏mask
    hideMask: function() {
        oMaskBox.style.display = 'none';
        document.body.className = "";
        this.imgArr = [];
        this.scroll.destroy();
    },
    // 初始化slider
    _initSlider: function(i, len, sArr) {
        var self = this;
        var i = Number(i);
        self.render(i, len, sArr);
        self.mainIndex = i;
        console.log("一进入mainindex", self.mainIndex);
        var oSliderWrap = document.querySelector(".show-img");
        self.scroll = new BScroll(oSliderWrap, {
            scrollX: true,
            scrollY: false,
            momentum: false,
            snap: {
                loop: false,
                threshold: 0.3,
                speed: 400
            },
            click: true
        });
        if (self.mainIndex == 0) {
            self.scroll.goToPage(0, 0, 0);
        } else if (self.mainIndex == len - 1) {
            self.scroll.goToPage(2, 0, 0);
        } else {
            self.scroll.goToPage(1, 0, 0);
        }
        var sliderX = self.scroll.x;
        self.scroll.on("scrollEnd", function(endxy) {
            console.log("endxy", endxy);
            console.log("sliderX", sliderX);
            console.log("滑动方向", self.scroll.movingDirectionX);
            console.log("scrollEnd后,当前slider页数", self.scroll.getCurrentPage().pageX);
            // if (endxy.x != sliderX) {

            // 如果有判断手势的进入，则else
            if (self.scroll.movingDirectionX) {
                if (self.scroll.movingDirectionX == -1) {
                    if (self.mainIndex != 0) {
                        self.mainIndex = self.mainIndex - 1 < 0 ? 0 : self.mainIndex - 1;
                        if (self.mainIndex != len - 2) {
                            prependChild(oSliderBox, oSliderBox.lastChild);
                        }
                    }
                } else if (self.scroll.movingDirectionX == 1) {
                    if (self.mainIndex != len - 1) {
                        self.mainIndex = self.mainIndex + 1 > Number(len) - 1 ? Number(len) - 1 : self.mainIndex + 1;
                        if (self.mainIndex != 1) {
                            oSliderBox.appendChild(oSliderBox.firstChild);
                        }
                    }
                } else if (self.scroll.movingDirectionX == 0) {
                    return;
                }
            } else {
                console.log("nav点击", self.mainIndex);
            }

            var leftNum = self.mainIndex - 1 < 0 ? 0 : self.mainIndex - 1;
            var rightNum = self.mainIndex + 1 > len - 1 ? len - 1 : self.mainIndex + 1;
            if (self.mainIndex != 0 || self.mainIndex != len - 1) {
                oSliderBox.children[0].className = "s-item left";
                oSliderBox.children[1].className = "s-item main";
                oSliderBox.children[2].className = "s-item right";
                oSliderBox.children[0].dataset.originIndex = leftNum;
                oSliderBox.children[1].dataset.originIndex = self.mainIndex;
                oSliderBox.children[2].dataset.originIndex = rightNum;
            }
            if (self.mainIndex == 0) {
                self.scroll.goToPage(0, 0, 0);
            } else if (self.mainIndex == len - 1) {
                self.scroll.goToPage(2, 0, 0);
            } else {
                self.scroll.goToPage(1, 0, 0);
            }
            console.log("scrollEnd后再改变,当前slider页数", self.scroll.getCurrentPage().pageX);

            console.log("self.mainIndex", self.mainIndex, "leftNum", leftNum, "rightNum", rightNum);
            if (self.mainIndex == 0) {
                oSliderBox.children[0].firstChild.src = navBox.children[0].dataset.originurl;
                oSliderBox.children[1].firstChild.src = navBox.children[1].dataset.originurl;
                oSliderBox.children[2].firstChild.src = navBox.children[2].dataset.originurl;
            } else if (self.mainIndex == len - 1) {
                oSliderBox.children[0].firstChild.src = navBox.children[len - 3].dataset.originurl;
                oSliderBox.children[1].firstChild.src = navBox.children[len - 2].dataset.originurl;
                oSliderBox.children[2].firstChild.src = navBox.children[len - 1].dataset.originurl;
            } else {
                oSliderBox.children[0].firstChild.src = navBox.children[leftNum].dataset.originurl;
                oSliderBox.children[1].firstChild.src = navBox.children[self.mainIndex].dataset.originurl;
                oSliderBox.children[2].firstChild.src = navBox.children[rightNum].dataset.originurl;
            }
            oImgNums.innerText = (self.mainIndex + 1) + "/" + len;
            // }

        })
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

    navBox.addEventListener("click", function(e) {
        // slider.scroll.refresh();
        var beforeNum = parseInt(document.querySelector('.img-nums').innerText) - 1;
        var _this = e.target;
        var len = navBox.children.length;
        if (hasClass(_this, "img-nav")) {
            e.stopPropagation();
            var page = Number(_this.dataset.index);
            slider.mainIndex = page;
            var leftNum = slider.mainIndex - 1 < 0 ? 0 : slider.mainIndex - 1;
            var rightNum = slider.mainIndex + 1 > len - 1 ? len - 1 : slider.mainIndex + 1;
            console.log("navBox里面点击后", "mainIndex", slider.mainIndex, page);
            if (page > beforeNum) {
                if (!!slider.scroll) {
                    slider.scroll.next();
                }
            } else if (page < beforeNum) {
                if (!!slider.scroll) {
                    slider.scroll.prev();
                }
            }
            var nb = Array.prototype.slice.call(navBox.children);
            nb.forEach(function(item) {
                item.className = "img-nav";
            })
            addClass(_this, "active");
            oImgNums.innerText = (page + 1) + "/" + nb.length;
        }
    })
    oMaskBox.addEventListener("click", function(e) {
        if (e.target.nodeName != 'IMG' && !hasClass(e.target, "img-nav")) {
            slider.hideMask();
        }
    })
})