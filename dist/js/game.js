"use strict";function chooseNum(){event.preventDefault(),value=event.target.dataset.index,game.css("display","block"),gameValue.css("display","none"),createMine()}function createMine(){var e,a;switch(createFace(img=imageStart[0]),clearInterval(timer),seconds=0,value){case"1":e=10,minesNum=10;break;case"2":e=15,minesNum=50;break;case"3":e=20,minesNum=100}mapheight=mapwidth=30*e;var t=moz.height();stageWidth=mapwidth,stageHeight=mapheight=mapwidth>t?t-150:mapwidth,canvas.width=mapwidth,canvas.height=mapheight,a=mapheight/30,createTime(),createFlag(),createGrid(e,a),createSquare(e,a),addNum(e,a),timer=window.setInterval(function(){refreTime(++seconds,timeContext)},1e3)}function createFace(e){if(faceDraw.width=40,faceDraw.height=40,null==faceDraw)return!1;faceContext.drawImage(e,0,0,40,40,0,0,40,40)}function createGrid(e,a){for(var t=(canGrid=addCanvas()).getContext("2d"),r=1;r<e;r++)t.beginPath(),t.lineWidth=.1,t.fillStyle="#bcbbbb",t.moveTo(30*r,0),t.lineTo(30*r,mapheight),t.stroke();for(r=1;r<a;r++)t.beginPath(),t.lineWidth=.1,t.moveTo(0,30*r),t.lineTo(mapwidth,30*r),t.stroke();context.drawImage(canGrid,0,0)}function addCanvas(){var e=document.createElement("canvas");return e.width=mapwidth,e.height=mapheight,e}function randomNum(e){for(var a=[],t=0;t<minesNum;t++){var r=Math.round(Math.random()*e);repeat(a,r)?t--:a.push(r)}return sorting(a)}function repeat(e,a){for(var t=0;t<e.length;t++)if(e[t]==a)return!0}function sorting(e){for(var a=0;a<e.length;a++)for(var t=a+1;t<e.length;t++)if(e[a]>e[t]){var r=e[a];e[a]=e[t],e[t]=r}return e}function createSquare(e,a){for(var t=(squGrid=addCanvas()).getContext("2d"),r=randomNum(e*a),n=0;n<a;n++){mapList[n]=[];for(var o=0;o<e;o++){var i=30*o,c=30*n,m=!1;r[0]==n*e+o&&(m=!0,r.splice(0,1));var d={x:i,y:c,mine:m,There:!0,sign:!1};mapList[n][o]=d,t.drawImage(img,0,114,30,30,i,c,30,30)}}context.drawImage(squGrid,0,0)}function addNum(e,a){for(var t=0,r=0;r<a;r++)for(var n=0;n<e;n++)if(!mapList[r][n].mine){for(var o=mapList[r][n].x/30,i=mapList[r][n].y/30,c=[[i-1,o],[i,o-1],[i,o+1],[i+1,o],[i-1,o-1],[i-1,o+1],[i+1,o-1],[i+1,o+1]],m=0;m<8;m++)i=c[m][0],o=c[m][1],i<0||o<0||i>a-1||o>e-1||mapList[i][o].mine&&t++;mapList[r][n].num=t,t=0}}function getSomeCoord(e){var e=e||window.event,a=$(".map-body .demo")[0],t=e.pageY-a.offsetTop,r=e.pageX-a.offsetLeft;return!(t<0||r<0||r>stageWidth||t>stageHeight)&&(t=parseInt(t/30),r=parseInt(r/30),{x:t,y:r})}function restore(){var e=coorRecord.x,a=coorRecord.y;mapList[e][a].sign?context.drawImage(img,90,114,30,30,30*a,30*e,30,30):context.drawImage(img,60,114,30,30,30*a,30*e,30,30)}function createTime(){timeCanvas.width=60,timeCanvas.height=40,timeContext.drawImage(imageStart[0],0,180,20,20,0,0,20,40),timeContext.drawImage(imageStart[0],0,180,20,20,20,0,20,40),timeContext.drawImage(imageStart[0],0,180,20,20,40,0,20,40)}function refreTime(e,a){a.clearRect(0,0,60,40);var t,r=parseInt(e/100),n=parseInt((e-100*r)/10),o=parseInt(e-100*r-10*n);t=20*r,a.drawImage(imageStart[0],t,180,20,20,0,0,20,40),t=20*n,a.drawImage(imageStart[0],t,180,20,20,20,0,20,40),t=20*o,a.drawImage(imageStart[0],t,180,20,20,40,0,20,40)}function createFlag(){flagCanvas.width=60,flagCanvas.height=40,flagContext.drawImage(imageStart[0],0,180,20,20,0,0,20,40),flagContext.drawImage(imageStart[0],0,180,20,20,20,0,20,40),flagContext.drawImage(imageStart[0],0,180,20,20,40,0,20,40)}function refreScene(){context.clearRect(0,0,stageWidth,stageHeight),context.drawImage(canGrid,0,0,stageWidth,stageHeight),context.drawImage(squGrid,0,0,stageWidth,stageHeight),refreTime(yetSign,flagContext)}function GenerateMine(e,a){for(var t=0;t<mapList.length;t++)for(var r=0;r<mapList[t].length;r++)void 0===mapList[t][r].num&&mapList[t][r]!=a&&(mapList[t][r].There=!1,e.clearRect(30*r,30*t,30,30),e.drawImage(img,240,144,30,30,30*r,30*t,30,30));return GameOver(0)}function undefiAdjac(e){mapList[coorRecord.x][coorRecord.y].There=!1,e.clearRect(30*coorRecord.y,30*coorRecord.x,30,30);var a=[];a.push(coorRecord);for(var t=0;t<a.length;t++)for(var r=a[t].y,n=a[t].x,o=[[n-1,r],[n,r-1],[n,r+1],[n+1,r],[n-1,r-1],[n-1,r+1],[n+1,r-1],[n+1,r+1]],i=0;i<8;i++)n=o[i][0],r=o[i][1],n<0||r<0||r>stageWidth/30-1||n>stageHeight/30-1||0==mapList[n][r].There||(0==mapList[n][r].num?(a.push({x:n,y:r}),mapList[n][r].There=!1,e.clearRect(30*r,30*n,30,30)):isNaN(mapList[n][r].num)||(coorRecord={x:n,y:r},GenerateNum(e,mapList[n][r].num)))}function GenerateNum(e,a){mapList[coorRecord.x][coorRecord.y].There=!1,e.clearRect(30*coorRecord.y,30*coorRecord.x,30,30),e.drawImage(img,30*(a-1),144,30,30,30*coorRecord.y,30*coorRecord.x,30,30)}function rightClick(e,a,t){yetSign++,void 0===mapList[a][t].num&&mineNum_Seek++,mapList[a][t].sign=!0,e.clearRect(30*t,30*a,30,30),e.drawImage(img,30,114,30,30,30*t,30*a,30,30),coorRecord=null,refreScene(),mineNum_Seek==minesNum&&GameOver(1)}function clearSign(e,a,t){yetSign--,void 0===mapList[a][t].num&&mineNum_Seek--,mapList[a][t].sign=!1,e.clearRect(30*t,30*a,30,30),e.drawImage(img,0,114,30,30,30*t,30*a,30,30),coorRecord=null,refreScene()}function mouseDown(e){var a=getSomeCoord(e);a&&mapList[a.x][a.y].There&&(coorRecord={x:a.x,y:a.y},restore())}function mouseUp(e){if(null!=coorRecord){var a=getSomeCoord(e);if(!a)return refreScene();var t=squGrid.getContext("2d");if("0"==e.button){if(a.x==coorRecord.x&&a.y==coorRecord.y&&!mapList[coorRecord.x][coorRecord.y].sign){var r=mapList[coorRecord.x][coorRecord.y].num;void 0===r?(mapList[coorRecord.x][coorRecord.y].There=!1,t.clearRect(30*coorRecord.y,30*coorRecord.x,30,30),t.fillStyle="#c30700",t.fillRect(30*coorRecord.y,30*coorRecord.x,30,30),t.drawImage(img,240,144,30,30,30*coorRecord.y,30*coorRecord.x,30,30),GenerateMine(t,mapList[coorRecord.x][coorRecord.y])):0==r?undefiAdjac(t):r>0&&GenerateNum(t,r)}}else if("2"==e.button){if(yetSign<minesNum&&!mapList[coorRecord.x][coorRecord.y].sign)return rightClick(t,a.x,a.y);if(mapList[coorRecord.x][coorRecord.y].sign)return clearSign(t,a.x,a.y)}coorRecord=null,refreScene()}}function GameOver(e){0==e?(gameOver.find(".over-head").append($('<img src="/image/defeat.gif" alt="失败">')),gameOver.find(".over-body").append($('<div class="body-text">游戏失败........</div><div class="btn-2" onclick="window.location.reload(true)">返回菜单</div>')),$("body").css("background-color","#ccc"),clearInterval(timer),gameOver.css("display","block")):1==e&&(gameOver.find(".over-head").append($('<img src="/image/victory.gif" alt="成功">')),gameOver.find(".over-body").append($('<label for="userName">尊姓大名:<input id="userName" type="text" name="userName"></label><div class="btn-1">确定</div>')),$("body").css("background-color","#ccc"),clearInterval(timer),gameOver.css("display","block"),gameOver.find("#userName").on("change",function(e){e.preventDefault(),this.value.length>10&&(alert("输入名字太长, 限定10个字符以内"),this.value.length=10)}),document.onkeydown=function(e){var a=e||window.event;if(a&&13==a.keyCode){if(0==gameOver.find("#userName")[0].value.length)return confirm("输入不能为空"),!1;window.localStorage.setItem(gameOver.find("#userName")[0].value,parseInt(seconds)),alert("保存记录成功"),window.location.reload(!0)}},gameOver.find(".btn-1").on("click",function(e){if(e.preventDefault(),0==gameOver.find("#userName")[0].value.length)return confirm("输入不能为空"),!1;window.localStorage.setItem(gameOver.find("#userName")[0].value,seconds),alert("保存记录成功"),window.location.reload(!0)}))}document.oncontextmenu=function(){return!1},document.onselectstart=function(){return!1},document.onmousedown=mouseDown,document.onmouseup=mouseUp;var mapwidth=10,mapheight=10,minesNum=0,imageAddress=["/image/restart.png","/image/bg2.png","/image/defeat.gif","/image/victory.gif"],imageStart=[],imageId=0,mineNum_Seek=0,stageWidth=300,stageHeight=400,canGrid,squGrid,coorRecord=null,yetSign=0,img,mapList=[],canvas=$("#map")[0],context=map.getContext("2d");!function e(){var a=new Image;a.src=imageAddress[imageId],a.onload=function(){imageStart.push(a),++imageId<imageAddress.length&&e()}}();var moz={width:function(){return document.documentElement.clientWidth},height:function(){return document.documentElement.clientHeight}},gameValue=$(".game-alert"),game=$(".game"),gameRanking=$(".game-ranking"),gameOver=$(".game-over"),value,timer,seconds=0,faceDraw=$(".map-start #face")[0],faceContext=faceDraw.getContext("2d"),timeCanvas=$(".map-time #time")[0],timeContext=timeCanvas.getContext("2d"),flagCanvas=$(".map-flag #flag")[0],flagContext=flagCanvas.getContext("2d");gameValue.on("click",function(e){e.preventDefault(),value=e.target.dataset.index,game.css("display","block"),gameValue.css("display","none"),createMine()}),$(".map-start").on("mousedown",function(e){e.preventDefault(),faceContext.clearRect(0,0,40,40),faceContext.drawImage(imageStart[0],40,0,40,40,0,0,40,40)}).on("mouseup",function(e){e.preventDefault(),faceContext.clearRect(0,0,40,40),faceContext.drawImage(imageStart[0],0,0,40,40,0,0,40,40),context.clearRect(0,0,canvas.width,canvas.height),mineNum_Seek=0,stageWidth=300,stageHeight=400,coorRecord=null,yetSign=0,mapList=[],createMine()});var ranking=$(".ranking"),back=$(".back");ranking.on("click",function(e){e.preventDefault(),gameRanking.find("tbody")[0].innerHTML="";var a=new Object;a=$.extend({},localStorage);for(var t=0,r=new Array,n=localStorage.length,o=0;o<n;o++){t=0;for(var i in a)parseInt(a[i])>=t&&(t=a[i],r[o]=new Object,r[o].value=a[i],r[o].name=i);delete a[r[o].name]}for(var c="",m=n-1;m>=0;m--)c+='<tr><td scope="row">'+(n-m)+"</td><td>"+r[m].name+"</td><td>"+r[m].value+"</td>";gameRanking.find("tbody").append($(c)),gameRanking.css({display:"block",opacity:"1"}),gameValue.css({display:"none",opacity:"0"}),ranking.css("opacity","0"),back.css("opacity","1")}),back.on("click",function(e){e.preventDefault(),gameRanking.css({display:"none",opacity:"0"}),gameValue.css({display:"block",opacity:"1"}),ranking.css("opacity","1"),back.css("opacity","0")});