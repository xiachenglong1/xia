(function ($) {
    $.fn.game1 = function (options) {
        var mainDiv = $(this);
        var defaults = {
            speed:150,//速度
            leftSteps:50,
            topSteps:30
        };
        var opts = $.extend(defaults, options);
        //初始化身体方块个数
        var size = 5;
        //默认的第一个格子和最后一个格子 
        var topItem = 0, lastItem = size - 1;
        //坐标数组
        var itemLefts = new Array();
        var itemTops = new Array();
        //顺序数组 
        var itemIndex = new Array();
        //初始化食物位置
        var foodLeft = 0, foodTop = 0;
        //初始化尾巴的位置
        var tailLeft = 0,tailTop = 0;
        //初始化网格大小[px]
        var stepsWidth = $(window).width() / defaults.leftSteps;
        var stepsHeight = $(window).height() / defaults.topSteps;
        //初始化第一个格子位置
        var itemLeft = defaults.leftSteps / 2 * stepsWidth;
        var itemTop = defaults.topSteps / 2 * stepsHeight;
        //一些公用函数
        var mFun = {
            addFood: function () {
                foodLeft = (Math.floor(Math.random() * defaults.leftSteps)) * stepsWidth;
                foodTop = (Math.floor(Math.random() * defaults.topSteps)) * stepsHeight;
                if ($(".itemfood").length > 0)
                    $(".itemfood").css({ left: foodLeft, top: foodTop });
                else
                    mainDiv.append(mFun.getHtml("food", stepsWidth, stepsHeight, foodLeft, foodTop, "#000"));
            },
            getTopIndex: function () {
                var lastIndex = itemIndex[size - 1];
                for (var i = size - 1; i > 0 ; i--) {
                    itemIndex[i] = itemIndex[i - 1];
                }
                itemIndex[0] = lastIndex;
                return itemIndex[0];
            },
            getHtml: function (i, stepsWidth, stepsHeight, itemLeft, itemTop, borderColor) {
                var newItem = "<div class=\"item";
                newItem += i;
                newItem += "\" style=\"position:absolute;width:";
                newItem += stepsWidth - 3;
                newItem += "px; height:";
                newItem += stepsHeight - 3;
                newItem += "px;left:";
                newItem += itemLeft;
                newItem += "px; top:";
                newItem += itemTop;
                newItem += "px;border:1px solid ";
                newItem += borderColor;
                newItem += ";background-color:";
                newItem += borderColor;
                newItem += ";\">";
                newItem += "</div>";
                return newItem;
            },
            checkKill: function (_itemleft, _itemtop) {
                var fag = true;
                if (_itemleft < 0)
                    fag = false;
                else if (_itemleft > $(window).width())
                    fag = false;
                else if (_itemtop < 0)
                    fag = false;
                else if (_itemtop > $(window).height())
                    fag = false;

                if (!fag) {
                    alert("GAME OVER！");
                    location.reload();
                }

            }
        }
        //添加原始方格
        for (var i = 0; i < size; i++) {
            itemLefts[i] = itemLeft + (i * stepsWidth);
            itemTops[i] = itemTop;
            //添加一个原始方格
            //itemTops[i], i == 0 ? "red" : "#000"
            mainDiv.append(mFun.getHtml(i, stepsWidth, stepsHeight, itemLefts[i], itemTops[i], "#000"));
            itemIndex[i] = i;
        }
        tailLeft = itemLefts[size-1];
        tailTop = itemTops[size - 1];
        //添加一个食物
        mFun.addFood();
        //初始化方向
        var direction = "left";
        //绑定键盘按下事件 
        $("html").keydown(function (event) {
            switch (event.keyCode) {
                case 37://left
                    if (direction != "right") 
                    direction = "left";
                    break;
                case 39://right
                    if (direction != "left")
                    direction = "right";
                    break;
                case 38://top
                    if (direction != "bottom")
                    direction = "top";
                    break;
                case 40://bottom
                    if (direction != "top")
                    direction = "bottom";
                    break;
                default:
                    break;

            }
        });
        //移动
        var mobile = setInterval(function () {
            topItem = mFun.getTopIndex();
            //如果遇到食物要添加尾巴的位置
            tailLeft = itemLefts[topItem];
            tailTop = itemTops[topItem];
            switch (direction) {
                case "left":
                    itemLefts[topItem] = itemLeft - stepsWidth;
                    itemTops[topItem] = itemTop;
                    break;
                case "right":
                    itemLefts[topItem] = itemLeft + stepsWidth;
                    itemTops[topItem] = itemTop;
                    break;
                case "top":
                    itemLefts[topItem] = itemLeft;
                    itemTops[topItem] = itemTop - stepsHeight;
                    break;
                case "bottom":
                    itemLefts[topItem] = itemLeft ;
                    itemTops[topItem] = itemTop + stepsHeight;
                    break;
                default:
                    break;
            }
            itemLeft = itemLefts[topItem];
            itemTop = itemTops[topItem];
            mFun.checkKill(itemLeft, itemTop);
            $(".item" + topItem).css({ left: itemLefts[topItem], top: itemTops[topItem] });
            //碰到食物了
            if (Math.abs(itemLeft - foodLeft) < 1 && Math.abs(itemTop - foodTop) < 1) {
                size++;
                mainDiv.append(mFun.getHtml(size - 1, stepsWidth, stepsHeight, tailLeft, tailTop, "#000"));
                itemLefts[size - 1] = tailLeft;
                itemTops[size - 1] = tailTop;
                itemIndex[size - 1] = size - 1;
                mFun.addFood();
            }
        }, defaults.speed);
    };
})(jQuery);