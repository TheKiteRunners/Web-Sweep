/*
* @Author: Charles
* @Date:   2017-06-11 15:19:39
* @Last Modified by:   Charles
* @Last Modified time: 2017-06-14 16:13:17
*/

document.oncontextmenu = function () { return false; }//菜单禁用
document.onselectstart = function () { return false; }//选择禁用
document.onmousedown = mouseDown;
document.onmouseup = mouseUp;

var mapwidth = 10, mapheight = 10;//画布的宽高

var minesNum = 0;//地雷数

//需要加载的图像
var imageAddress = ['/image/restart.png', '/image/bg2.png', '/image/defeat.gif', '/image/victory.gif'];

//已加载好的图像
var imageStart = [];

//当前加载的图像ID
var imageId = 0;

//发现的地雷数
var mineNum_Seek = 0;

//场景宽度
var stageWidth = 300;

//场景高度
var stageHeight = 400;

var canGrid,//网格
    squGrid;//方块

//临时坐标
var coorRecord = null;

//已标记数
var yetSign = 0;
var img;
var mapList = [];//方块列表

var canvas = $('#map')[0];
var context = map.getContext("2d");
(function loadImag() {
    var imageObj = new Image();
    imageObj.src = imageAddress[imageId];
    imageObj.onload = function () {
        imageStart.push(imageObj);
        imageId++;
        if (imageId < imageAddress.length) {
            loadImag();
        }
    }
})()

//浏览器属性
var moz = {
    width: function () { return document.documentElement.clientWidth; },
    height: function () { return document.documentElement.clientHeight; }
}

var gameValue = $('.game-alert');
var game = $('.game');
var gameRanking = $('.game-ranking');
var gameOver = $('.game-over');

var value;
var timer, seconds = 0;//时间
var faceDraw = $('.map-start #face')[0];
var faceContext = faceDraw.getContext("2d");
var timeCanvas = $('.map-time #time')[0];
var timeContext = timeCanvas.getContext('2d');
var flagCanvas = $('.map-flag #flag')[0];
var flagContext = flagCanvas.getContext('2d');



gameValue.on('click', function(event) {
    event.preventDefault();//取消默认事件
    value = event.target.dataset.index;
    game.css('display', 'block');
    gameValue.css('display', 'none');
    createMine();
});

function chooseNum(){
    event.preventDefault();//取消默认事件
    value = event.target.dataset.index;
    game.css('display', 'block');
    gameValue.css('display', 'none');
    createMine();
}

function createMine() {//开始游戏
    img = imageStart[0];
    var listNumx, listNumy;
    createFace(img);
    clearInterval(timer);
    seconds = 0;
    switch(value){
    case "1": listNumx = 10; minesNum = 10; break;
    case "2": listNumx = 15; minesNum = 50; break;
    case "3": listNumx = 20; minesNum = 100; break;
    }

    mapheight = mapwidth = listNumx * 30;
    var cHeight = moz.height();
    mapheight = mapwidth > cHeight ? cHeight - 150 : mapwidth;
    stageWidth = mapwidth;//场景宽高
    stageHeight = mapheight;
    canvas.width = mapwidth;//画布宽高
    canvas.height = mapheight;
    listNumy = mapheight/30;
    createTime();//生成时间
    createFlag();//生成标记数
    createGrid(listNumx, listNumy);//生成网格
    createSquare(listNumx, listNumy);//生成方快
    addNum(listNumx, listNumy);
    timer = window.setInterval(function(){
        seconds++;
        refreTime(seconds, timeContext);
    }, 1000);
}




//生成笑脸
function createFace(image) {

    faceDraw.width = 40;
    faceDraw.height = 40;
    if(faceDraw == null){
        return false;
    }

    faceContext.drawImage(image, 0, 0, 40, 40, 0, 0, 40, 40);
}

//更改笑脸, 重新开始游戏
$('.map-start').on('mousedown',function(event) {
    event.preventDefault();
    /* Act on the event */

    faceContext.clearRect(0, 0, 40, 40);
    faceContext.drawImage(imageStart[0], 40, 0, 40, 40, 0, 0, 40, 40);
}).on('mouseup', function(event) {
    event.preventDefault();
    /* Act on the event */

    faceContext.clearRect(0, 0, 40, 40);
    faceContext.drawImage(imageStart[0], 0, 0, 40, 40, 0, 0, 40, 40);
    context.clearRect(0, 0, canvas.width, canvas.height);
    mineNum_Seek = 0;
    stageWidth = 300;
    stageHeight = 400;
    coorRecord = null;
    yetSign = 0;
    mapList = [];

    createMine();
});

//生成网格
function createGrid(listNumx, listNumy) {
    canGrid = addCanvas();
    var GridText = canGrid.getContext('2d');

    for (var i = 1; i < listNumx; i++) {
        GridText.beginPath();
        GridText.lineWidth = 0.1;
        GridText.fillStyle = '#bcbbbb';
        GridText.moveTo(i * 30, 0);
        GridText.lineTo(i * 30, mapheight);
        GridText.stroke();
    }
    for (var i = 1; i < listNumy; i++) {
        GridText.beginPath();
        GridText.lineWidth = 0.1;
        GridText.moveTo(0, i * 30);
        GridText.lineTo(mapwidth, i * 30);
        GridText.stroke();
    }
    context.drawImage(canGrid, 0, 0);
}


//生成画布
function addCanvas() {
    var can = document.createElement('canvas');
    can.width = mapwidth;
    can.height = mapheight;
    return can;
}
//随机生成炸弹
function randomNum(max) {
    var ranNum = [];
    for (var i = 0; i < minesNum; i++) {
        var Num = Math.round(Math.random() * (max));
        if (repeat(ranNum, Num)) {
            i--;
            continue;
        }
        ranNum.push(Num);
    }
    return sorting(ranNum);
}
//判断是否有重复
function repeat(ranNum, Num) {
    for (var i = 0; i < ranNum.length; i++) {
        if (ranNum[i] == Num) {
            return true;
        }
    }
}
//排序
function sorting(array) {
    for (var i = 0; i < array.length; i++) {
        for(var j = i+1; j < array.length; j++)
        {
            if (array[i] > array[j]) {
                var c = array[i];
                array[i] = array[j];
                array[j] = c;
            }

        }
    }
    return  array;
}


//生成方快
function createSquare(listNumx, listNumy) {
    squGrid = addCanvas();
    var squText = squGrid.getContext('2d');
    var mpl = randomNum(listNumx * listNumy);

    for (var i = 0; i < listNumy; i++) {
        mapList[i] = [];
        for (var j = 0; j < listNumx; j++) {
            var x = j * 30;
            var y = i * 30;
            var mine = false;
            if (mpl[0] == i * listNumx + j) {
                mine = true;
                mpl.splice(0, 1);//没次完成后删除一项
            }
            var square = { x: x, y: y, mine: mine, There: true, sign: false };

            mapList[i][j] = square;

            squText.drawImage(img, 0, 114, 30, 30, x, y, 30, 30);
        }
    }
    context.drawImage(squGrid, 0, 0);
}

//添加数字标记
function addNum(Lx, Ly) {
    var num = 0;
    for (var i = 0; i < Ly; i++) {
        for (var z = 0; z < Lx; z++) {
            if (mapList[i][z].mine) continue;
            var list = mapList[i][z].x / 30;//列
            var line = mapList[i][z].y / 30;//行

            var X8 = [
                [line - 1, list],
                [line, list - 1],
                [line, list + 1],
                [line + 1, list],
                [line - 1, list - 1],
                [line - 1, list + 1],
                [line + 1, list - 1],
                [line + 1, list + 1]
            ];//当前格子的上下左右

            for (var j = 0; j < 8; j++) {
                line = X8[j][0];
                list = X8[j][1];
                if (line < 0 || list < 0 || line > Ly - 1 || list > Lx - 1) continue;
                if (mapList[line][list].mine) {
                    num++;
                }
            }
            mapList[i][z].num = num;
            num = 0;
        }
    }
}

//获取点击位置的横竖坐标
function getSomeCoord(e) {
    var e = e || window.event;
    var div = $('.map-body .demo')[0]
    var x = e.pageY - div.offsetTop;
    var y = e.pageX - div.offsetLeft;
    if (x < 0 || y < 0 || y > stageWidth || x > stageHeight) return false;
    x = parseInt(x / 30);
    y = parseInt(y / 30);
    return { x: x, y: y }//返回第几个格子坐标
}

//还原状态
function restore() {
    var x = coorRecord.x;
    var y = coorRecord.y;

    if (mapList[x][y].sign)
        context.drawImage(img, 90, 114, 30, 30, y * 30, x * 30, 30, 30);
    else
        context.drawImage(img, 60, 114, 30, 30, y * 30, x * 30, 30, 30);
}


function createTime() {
    timeCanvas.width = 60;
    timeCanvas.height = 40;
    timeContext.drawImage(imageStart[0], 0, 180, 20, 20, 0, 0, 20, 40);
    timeContext.drawImage(imageStart[0], 0, 180, 20, 20, 20, 0, 20, 40);
    timeContext.drawImage(imageStart[0], 0, 180, 20, 20, 40, 0, 20, 40);
}
//刷新时间
function refreTime(seconds, timeContext){
    timeContext.clearRect(0, 0, 60, 40);

    var hour = parseInt(seconds / 100);
    var minute = parseInt((seconds - hour*100) / 10);
    var second = parseInt((seconds - hour*100 - minute*10));
    var x;

    //large Number
    x = hour * 20;
    timeContext.drawImage(imageStart[0], x, 180, 20, 20, 0, 0, 20, 40);

    //middle Number
    x = minute * 20;
    timeContext.drawImage(imageStart[0], x, 180, 20, 20, 20, 0, 20, 40);

    //least Number
    x = second * 20;
    timeContext.drawImage(imageStart[0], x, 180, 20, 20, 40, 0, 20, 40);
}

function createFlag(){
    flagCanvas.width = 60;
    flagCanvas.height = 40;
    flagContext.drawImage(imageStart[0], 0, 180, 20, 20, 0, 0, 20, 40);
    flagContext.drawImage(imageStart[0], 0, 180, 20, 20, 20, 0, 20, 40);
    flagContext.drawImage(imageStart[0], 0, 180, 20, 20, 40, 0, 20, 40);
}

//刷新场景
function refreScene() {
    context.clearRect(0, 0, stageWidth, stageHeight);
    context.drawImage(canGrid, 0, 0, stageWidth, stageHeight);
    context.drawImage(squGrid, 0, 0, stageWidth, stageHeight);
    //yetSign
    refreTime(yetSign, flagContext);
}

//绘制地雷
function GenerateMine(squText, mines) {
    for (var i = 0; i < mapList.length; i++) {
        for (var z = 0; z < mapList[i].length; z++) {
            if (typeof mapList[i][z].num == 'undefined' && mapList[i][z] != mines) {

                mapList[i][z].There = false;
                squText.clearRect(z * 30, i * 30, 30, 30);
                squText.drawImage(img, 240, 144, 30, 30, z * 30, i * 30, 30, 30);
            }
        }
    }
    return GameOver(0);
}

//返回相邻空格
function undefiAdjac(squText) {
    mapList[coorRecord.x][coorRecord.y].There = false;
    squText.clearRect(coorRecord.y * 30, coorRecord.x * 30, 30, 30);

    var map = [];
    map.push(coorRecord);
    for (var z = 0; z < map.length; z++) {

        var list = map[z].y;//列
        var line = map[z].x;//行
        var X8 = [
            [line - 1, list],
            [line, list - 1],
            [line, list + 1],
            [line + 1, list],
            [line - 1, list - 1],
            [line - 1, list + 1],
            [line + 1, list - 1],
            [line + 1, list + 1]
        ];
        for (var i = 0; i < 8; i++) {
            line = X8[i][0];
            list = X8[i][1];
            if (line < 0 || list < 0 || list > stageWidth / 30 - 1 || line > stageHeight / 30 - 1 || mapList[line][list].There == false) continue;

            if (mapList[line][list].num == 0) {

                map.push({ x: line, y: list });
                mapList[line][list].There = false;
                squText.clearRect(list * 30, line * 30, 30, 30);
            }
            else if (!isNaN(mapList[line][list].num)) {
                coorRecord = { x: line, y: list };
                GenerateNum(squText, mapList[line][list].num);
            }
        }
    }
}

//绘制数字
function GenerateNum(squText, num) {
    mapList[coorRecord.x][coorRecord.y].There = false;
    squText.clearRect(coorRecord.y * 30, coorRecord.x * 30, 30, 30);
    squText.drawImage(img, (num - 1) * 30, 144, 30, 30, coorRecord.y * 30, coorRecord.x * 30, 30, 30);
}

//绘制标记
function rightClick(squText, x, y) {

    yetSign++;

    if (typeof mapList[x][y].num == 'undefined') mineNum_Seek++;

    mapList[x][y].sign = true;
    squText.clearRect(y * 30, x * 30, 30, 30);
    squText.drawImage(img, 30, 114, 30, 30, y * 30, x * 30, 30, 30);
    coorRecord = null;
    refreScene();
    if (mineNum_Seek == minesNum) GameOver(1);
}

//清除标记
function clearSign(squText, x, y) {

    yetSign--;

    if (typeof mapList[x][y].num == 'undefined') mineNum_Seek--;

    mapList[x][y].sign = false;
    squText.clearRect(y * 30, x * 30, 30, 30);
    squText.drawImage(img, 0, 114, 30, 30, y * 30, x * 30, 30, 30);
    coorRecord = null;
    refreScene();
}

//鼠标按下
function mouseDown(e) {

    var sc = getSomeCoord(e);
    if (!sc  || !mapList[sc.x][sc.y].There) return;

    coorRecord = { x: sc.x, y: sc.y };

    restore();
}

//鼠标抬起
function mouseUp(e) {
    if (coorRecord == null) return;

    var sc = getSomeCoord(e);
    if (!sc) return refreScene();

    var squText = squGrid.getContext('2d');

    if (e.button == '0') {
        if (sc.x == coorRecord.x && sc.y == coorRecord.y && !mapList[coorRecord.x][coorRecord.y].sign) {
            var num = mapList[coorRecord.x][coorRecord.y].num;
            if (typeof num == 'undefined') {

                mapList[coorRecord.x][coorRecord.y].There = false;
                squText.clearRect(coorRecord.y * 30, coorRecord.x * 30, 30, 30);
                squText.fillStyle = "#c30700";
                squText.fillRect(coorRecord.y * 30, coorRecord.x * 30, 30, 30);

                squText.drawImage(img, 240, 144, 30, 30, coorRecord.y * 30, coorRecord.x * 30, 30, 30);

                GenerateMine(squText, mapList[coorRecord.x][coorRecord.y]);

            } else if (num == 0) {

                undefiAdjac(squText);

            } else if (num > 0) {
                GenerateNum(squText, num);
            }
        }
    } else if (e.button == '2') {
        if (yetSign < minesNum && !mapList[coorRecord.x][coorRecord.y].sign) {

            return rightClick(squText, sc.x, sc.y);

        } else if (mapList[coorRecord.x][coorRecord.y].sign) {

            return clearSign(squText, sc.x, sc.y);

        }
    }

    coorRecord = null;
    refreScene();
}



//游戏结束
function GameOver(num) {
    if (num == 0) {
       // alert('失败了!!!');
       gameOver.find('.over-head').append($('<img src="/image/defeat.gif" alt="失败">'));
       gameOver.find('.over-body').append($('<div class="body-text">游戏失败........</div><div class="btn-2" onclick="window.location.reload(true)">返回菜单</div>'));
       $('body').css('background-color', '#ccc');
       clearInterval(timer);
       gameOver.css('display', 'block');

    } else if (num == 1) {
       // alert('成功了!!!');
       gameOver.find('.over-head').append($('<img src="/image/victory.gif" alt="成功">'))
       gameOver.find('.over-body').append($('<label for="userName">尊姓大名:<input id="userName" type="text" name="userName"></label><div class="btn-1">确定</div>'));
       $('body').css('background-color', '#ccc');
       clearInterval(timer);
       gameOver.css('display', 'block');

       gameOver.find('#userName').on('change', function(event) {
           event.preventDefault();
           if(this.value.length > 10) {
              alert('输入名字太长, 限定10个字符以内');
              this.value.length = 10;
           }
       });
       document.onkeydown = function(event){
            var e = event || window.event;
            if(e && e.keyCode==13){ // enter 键
                if(gameOver.find('#userName')[0].value.length == 0){
                    confirm('输入不能为空');
                    return false;
                }
                window.localStorage.setItem(gameOver.find('#userName')[0].value, parseInt(seconds));
                alert('保存记录成功');
                window.location.reload(true);
            }
       }
       gameOver.find('.btn-1').on('click', function(event) {
           event.preventDefault();
           /* Act on the event */
           if(gameOver.find('#userName')[0].value.length == 0){
                    confirm('输入不能为空');
                    return false;
            }
           window.localStorage.setItem(gameOver.find('#userName')[0].value, seconds);
           alert('保存记录成功');
           window.location.reload(true);
       });
    }
}



var ranking = $('.ranking');
var back = $('.back');
//排行榜
ranking.on('click', function(event) {
    event.preventDefault();
    /* Act on the event */
    gameRanking.find('tbody')[0].innerHTML = '';
    var newSrc = new Object();
    newSrc =$.extend({},localStorage);//深拷贝
    var min = 0;
    var obj = new Array();
    var length = localStorage.length;

    for(let j = 0; j < length; j++){
        min = 0;
       for(let i in newSrc){
            if(parseInt(newSrc[i]) >= min){
                min = newSrc[i];
                obj[j] = new Object();
                obj[j].value = newSrc[i];
                obj[j].name = i;
            }
        }
        delete newSrc[obj[j].name];
    }

    var str = '';
    for(var k = length-1; k >= 0; k--){
        str += '<tr><td scope="row">'+ (length-k) + '</td><td>' +
        obj[k].name + '</td><td>' + obj[k].value + '</td>';
    }

    gameRanking.find('tbody').append($(str));
    gameRanking.css({'display': 'block', 'opacity':'1'});
    gameValue.css({'display': 'none', 'opacity': '0'});
    ranking.css('opacity', '0');
    back.css('opacity', '1');
});

back.on('click', function(event) {
    event.preventDefault();
    /* Act on the event */
    gameRanking.css({'display':'none','opacity': '0'});
    gameValue.css({'display': 'block', 'opacity': '1'});
    ranking.css('opacity', '1');
    back.css('opacity', '0');
});
