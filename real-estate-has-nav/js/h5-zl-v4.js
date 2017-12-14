var oMaskBox = document.querySelector(".mask-box");
var oImgNums = document.querySelector(".img-nums");
var oImgsBox = document.querySelector(".my-img-com");
var oOtherImgsBoxs = document.querySelector(".other-img-com");
var oSliderBox = document.querySelector(".slider-box");
var oBack = document.querySelector(".i-back");
var navBox = document.querySelector(".img-nav-box");

var slider = {
    imgArr:[],
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
    _render:function(){

    },
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
                "width": temp.dataset.w||30,
                "height": temp.dataset.h||30
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
}

window.addEventListener("DOMContentLoaded", function() {
    //点击下载
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

        })
        // oMaskBox.addEventListener("click", function(e) {
        //     if (e.target.nodeName != 'IMG' && !hasClass(e.target, "img-nav")) {
        //         slider.hideMask();
        //     }
        // })
})