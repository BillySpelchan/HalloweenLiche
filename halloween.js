HalloweenLichImg = new Image();
HalloweenLichImg.src = 'res/halloweenLich/Halloween.png';
HalloweenLicheExplosionSound = new Audio('res/halloweenLich/explosion.mp3');
HalloweenLicheClickSound = new Audio('res/halloweenLich/click.mp3');
HalloweenLicheWinSound = new Audio('res/halloweenLich/win.mp3');

HalloweenLichAtlas = {
"Backdrop" : {"x":956,"y":132,"w":641,"h":482},
"Boom" : {"x":0,"y":618,"w":752,"h":544},
"ContinueButton" : {"x":0,"y":0,"w":527,"h":42, "over_x":531,"over_y":0, "down_x":1062,"down_y":0},
"EnergyBall" : {"x":964,"y":618,"w":203,"h":210, "frames":[
		{"x":964,"y":618},{"x":1171,"y":618},{"x":1378,"y":618},{"x":1585,"y":618},
		{"x":1792,"y":618},{"x":0,"y":1166},{"x":207,"y":1166},{"x":414,"y":1166},
		{"x":621,"y":1166},{"x":828,"y":1166},{"x":1035,"y":1166},{"x":1242,"y":1166},
		{"x":1449,"y":1166},{"x":1656,"y":1166},{"x":0,"y":1380},{"x":207,"y":1380},
		{"x":414,"y":1380},{"x":621,"y":1380},{"x":828,"y":1380},{"x":964,"y":618} ] },
"Lich" : {"x":1035,"y":1380,"w":286,"h":408},
"PlayGame" : {"x":531,"y":46,"w":350,"h":82, "over_x":885,"over_y":46, "down_x":1239,"down_y":46},
"TextBallon" : {"x":1325,"y":1380,"w":76,"h":41},

"letters" : "1234567890ABCEHILNOPSTUVWY",
"bloodLetters" : [
{"x":1947,"y":46,"w":24,"h":50},{"x":1975,"y":46,"w":40,"h":48},{"x":0,"y":132,"w":34,"h":48},
{"x":38,"y":132,"w":40,"h":48},{"x":82,"y":132,"w":30,"h":48},{"x":116,"y":132,"w":32,"h":48},
{"x":152,"y":132,"w":36,"h":48}, {"x":192,"y":132,"w":32,"h":46},{"x":228,"y":132,"w":32,"h":50},
{"x":581,"y":132,"w":50,"h":46},{"x":264,"y":132,"w":50,"h":50}, {"x":318,"y":132,"w":35,"h":46},
{"x":357,"y":132,"w":40,"h":50}, {"x":401,"y":132,"w":30,"h":49}, {"x":435,"y":132,"w":42,"h":50},
{"x":481,"y":132,"w":12,"h":46}, {"x":497,"y":132,"w":30,"h":48}, {"x":531,"y":132,"w":46,"h":46},
{"x":581,"y":132,"w":50,"h":46}, {"x":635,"y":132,"w":32,"h":46}, {"x":671,"y":132,"w":24,"h":50},
{"x":913,"y":132,"w":39,"h":47}, {"x":699,"y":132,"w":48,"h":46}, {"x":751,"y":132,"w":46,"h":48},
{"x":801,"y":132,"w":64,"h":46}, {"x":869,"y":132,"w":40,"h":46} ]
}

HLButtons = {"BUTTON_UP" : 0, "BUTTON_OVER" : 1,	"BUTTON_DOWN" :  2}

function drawBloodText(ctx, s, x, y, scale) {
	var cur_x = x
	for (var cntr = 0; cntr < s.length; ++cntr) {
		letter = HalloweenLichAtlas.letters.indexOf(s.charAt(cntr));
		//console.log("letter " + cntr + " is " + letter + " " + s.charAt(cntr));
		if (letter < 0)
			cur_x = cur_x + 32 * scale;
		else {
			r = HalloweenLichAtlas.bloodLetters[letter];
			ctx.drawImage(HalloweenLichImg, r.x, r.y, r.w, r.h,
				Math.floor(cur_x), y, Math.floor(r.w * scale), Math.floor(r.h * scale));
			cur_x += Math.floor(r.w * scale)
		}
	}
}


class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Button {

	constructor(owner, bid, atlasInfo, x, y) {
		this.owner = owner;
		this.bid = bid;
		this.atlasInfo = atlasInfo;
		this.x = x;
		this.y = y;
		this.x2 = x + atlasInfo.w;
		this.y2 = y + atlasInfo.h;
		this.state = HLButtons.BUTTON_UP;
	}

	isInside(x,y) {
		if ((x >= this.x) && (x <= this.x2) && (y >= this.y) && (y <= this.y2))
			return true;
		else
			return false;
	}
	
	mouseDown(x, y) {
		if (this.isInside(x,y))
			this.state = HLButtons.BUTTON_DOWN;
	}

	mouseMove(x, y) {
		if (this.isInside(x, y)){
			if (this.state == HLButtons.BUTTON_UP)
				this.state = HLButtons.BUTTON_OVER;
		} else {
			if (this.state == HLButtons.BUTTON_OVER)
				this.state = HLButtons.BUTTON_UP;
		}
	}

	mouseUp(x, y) {
		if ((this.state == HLButtons.BUTTON_DOWN) && (this.isInside(x,y)))
			this.owner.buttonClicked(this.bid);
		this.state = HLButtons.BUTTON_UP;
	}

	render(ctx) {
		var rx = this.atlasInfo.x;
		var ry = this.atlasInfo.y;
		var w = this.atlasInfo.w;
		var h = this.atlasInfo.h;
		if (this.state == HLButtons.BUTTON_OVER) {
			rx = this.atlasInfo.over_x;
			ry = this.atlasInfo.over_y;
		}
		else if (this.state == HLButtons.BUTTON_DOWN) {
			rx = this.atlasInfo.down_x;
			ry = this.atlasInfo.down_y;
		}
		
		ctx.drawImage(HalloweenLichImg, rx, ry, w,h,
							this.x, this.y, w, h);
	}
}

class SoundToggle {
	constructor(owner, bid, x, y) {
		this.owner = owner;
		this.bid = bid;
		this.soundEnabled = true;
		this.x = x;
		this.y = y;
		this.w = 400;
		this.h = 50;
		this.x2 = this.x + this.w;
		this.y2 = this.y + this.h;
		this.textX = x + 200;
		this.textY = y + 25;
		this.state = HLButtons.BUTTON_UP;
	}

	isInside(x,y) {
		if ((x >= this.x) && (x <= this.x2) && (y >= this.y) && (y <= this.y2))
			return true;
		else
			return false;
	}
	
	mouseDown(x, y) {
		if (this.isInside(x,y))
			this.state = HLButtons.BUTTON_DOWN;
	}

	mouseMove(x, y) {
		if (this.isInside(x, y)){
			if (this.state == HLButtons.BUTTON_UP)
				this.state = HLButtons.BUTTON_OVER;
		} else {
			if (this.state == HLButtons.BUTTON_OVER)
				this.state = HLButtons.BUTTON_UP;
		}
	}

	mouseUp(x, y) {
		if ((this.state == HLButtons.BUTTON_DOWN) && (this.isInside(x,y))) {
			this.soundEnabled = !this.soundEnabled;
			this.owner.buttonClicked(this.bid);
		}
		this.state = HLButtons.BUTTON_UP;
	}

	render(ctx) {
		if (this.state == HLButtons.BUTTON_OVER) {
			ctx.fillStyle = "#0000CC";
			ctx.beginPath()
			ctx.rect(this.x,this.y,this.w,this.h);
			ctx.fill();
		}
		else if (this.state == HLButtons.BUTTON_DOWN) {
			ctx.fillStyle = "#CC0000";
			ctx.beginPath()
			ctx.rect(this.x,this.y,this.w,this.h);
			ctx.fill();
		}

		var message = "Sound is Enabled!";
		if ( ! this.soundEnabled)
			message = "Sound is NOT enabled!";
		
		ctx.font = "20px serif";
		ctx.fillStyle = "#CCCC00";
		ctx.textAlign = "center";
		ctx.fillText (message, this.textX, this.textY);

	}
}

class EnergyBall {
	constructor(start_x, start_y, target_x, target_y) {
		this.alive = true;
		this.hitTarget = false;
		this.x = start_x;
		this.y = start_y;
		this.target_x = target_x;
		this.target_y = target_y;
		this.width = 5;
		this.height = 5;
		this.velocity_x = (target_x - start_x) / 195;
		this.velocity_y = (target_y - start_y) / 195;
		this.last_frame_time = performance.now();
		this.start_time = this.last_frame_time;
		this.ttl = this.last_frame_time + 10000;
		this.curFrame = 0;
	}
		
	tick(timestamp)
	{
		if (timestamp > this.ttl) {
			this.alive = false;
			return;
		}
		if ((!this.alive) || (this.hitTarget)) return;
		
		this.curFrame = Math.floor((timestamp - this.start_time) / 33) % 20;
		if (this.curFrame < 0) this.curFrame = 0;
		var delta = (timestamp - this.last_frame_time) / 100.0//1000.0;
		//console.log("timestamp " + timestamp + " d " + delta);
		this.last_frame_time = timestamp;
		var units = this.width / 20 + 1;
		this.width += (units * delta);
		this.height += (units * delta);
		this.x += (units * this.velocity_x * delta);
		this.y += (units * this.velocity_y * delta);
		// check for reach target
		
		if (this.width >= 200) {
			this.hitTarget = true;
			//this.alive = false;
			console.log("Energy ball reached target");
		}
	}	
	
	render(ctx) {
		if ( ! this.alive ) return;
		var bx = Math.floor(this.x - this.width / 2)
		var by = Math.floor(this.y - this.height / 2)
		var p = HalloweenLichAtlas.EnergyBall.frames[this.curFrame];
		var spw = HalloweenLichAtlas.EnergyBall.w;
		var sph = HalloweenLichAtlas.EnergyBall.h;
		ctx.drawImage(HalloweenLichImg, p.x, p.y, spw,sph,
							bx, by, Math.floor(this.width),Math.floor(this.height));
	}

	checkIfDestroyed(x, y) {
		var x1 = Math.floor(this.x - this.width / 2)
		var y1 = Math.floor(this.y - this.height / 2)
		var x2 = x1 + this.width;
		var y2 = y1 + this.height;
		if ((x >= x1) && (x <= x2) && (y >= y1) && (y <= y2)) {
			this.alive = false;
			return true;
		}
		return false;
	}
}

class ScreenHandler {
	constructor(game) { 
		this.game = game;
	}
	
	restart() {
	}
	
	mouseDown(x, y) {
		return false;
	}

	mouseMove(x, y) {
		return false;
	}

	mouseUp(x, y) {
		return false;
	}
	
	tick(timestamp) {	}
	
	render(ctx) {	}
}

class LoadingScreen extends ScreenHandler {
	constructor(game) { 
		super(game);
		this.last_frame_time = performance.now();
		this.loadingMessage = "Loading..."
	}
	
	tick(timestamp) {	
	}
	
	render(ctx) {
		// check for finished loaded
		var loaded = HalloweenLichImg.complete;

		// display loading message
		var messageLen = Math.floor(performance.now() / 100) % 10 + 1;
		ctx.fillStyle = "#000055";
		ctx.beginPath()
		ctx.rect(0,0,640,480);
		ctx.fill();
		ctx.font = "50px serif";
		ctx.fillStyle = "#CCCC00";
		ctx.textAlign = "center";
		ctx.fillText (this.loadingMessage.substring(0, messageLen), 320, 240);

		if (loaded)
			this.game.switchScreen(this.game.MODE_TITLE);
	}
}

class TitleScreen extends ScreenHandler {
	constructor(game) { 
		super(game);
		this.playButton = new Button(this, 1, HalloweenLichAtlas.PlayGame, 150, 300);
		this.soundToggle = new SoundToggle(this, 2, 120, 400);
	}

	mouseDown(x, y) {
		this.playButton.mouseDown(x,y);
		this.soundToggle.mouseDown(x,y);
	}

	mouseMove(x, y) {
		this.playButton.mouseMove(x,y);
		this.soundToggle.mouseMove(x,y);
	}

	mouseUp(x, y) {
		this.playButton.mouseUp(x,y);
		this.soundToggle.mouseUp(x,y);
	}
	
	tick(timestamp) {	}
	
	render(ctx) {
		var r = HalloweenLichAtlas.Backdrop;
		ctx.drawImage(HalloweenLichImg, r.x, r.y, r.w,r.h, 0, 0, 640,480);

		drawBloodText(ctx, "HALLOWEEN", 20,50, 1.6);
		drawBloodText(ctx, "LICHE", 180,150, 2);

		this.playButton.render(ctx);
		this.soundToggle.render(ctx);
		
		ctx.font = "15px serif";
		ctx.fillStyle = "#CCCC00";
		ctx.textAlign = "center";
		ctx.fillText ("Copyright © 2004-2019 Billy D. Spelchan. All rights reserved.", 320, 460);		
	}
	
	buttonClicked(bid) {
		if (bid == 1)
			this.game.switchScreen(this.game.MODE_GAME);
		else
			this.game.setSound(this.soundToggle.soundEnabled);
	}
}

class LoseScreen extends ScreenHandler {
	constructor(game) { 
		super(game);
		this.switchTime = performance.now() + 5000;
	}
	
	restart() {
		this.switchTime = performance.now() + 5000;
	}
	
	render(ctx) {
		var r = HalloweenLichAtlas.Backdrop;
		ctx.drawImage(HalloweenLichImg, r.x, r.y, r.w,r.h, 0, 0, 640,480);

		r = HalloweenLichAtlas.Boom;
		ctx.drawImage(HalloweenLichImg, r.x, r.y, r.w,r.h, 0, 0, 640,480);
		
		drawBloodText(ctx, "OOPS", 200,200, 1.6);

		if (performance.now() > this.switchTime)
			game.switchScreen(this.game.MODE_TITLE);
	}
}

class WinScreen extends ScreenHandler {
	constructor(game) { 
		super(game);
		this.switchTime = performance.now() + 8000;
	}
	
	restart() {
		this.switchTime = performance.now() + 8000;
	}
	
	render(ctx) {
		var r = HalloweenLichAtlas.Backdrop;
		ctx.drawImage(HalloweenLichImg, r.x, r.y, r.w,r.h, 0, 0, 640,480);
		
		drawBloodText(ctx, "HAVE", 200,50, 1.6);
		drawBloodText(ctx, "A", 300,150, 1.6);
		drawBloodText(ctx, "HAPPY", 175,250, 1.6);
		drawBloodText(ctx, "HALLOWEEN", 20,350, 1.6);

		if (performance.now() > this.switchTime)
			game.switchScreen(this.game.MODE_TITLE);
	}
}

class GameScreen extends ScreenHandler {
	
	constructor(game) {
		super(game);
		this.balls = [];
		this.liche = new Point(320,220);
		this.atlasLich = HalloweenLichAtlas.Lich
		this.startLevel(1);
	}

	restart() {
		this.startLevel(1);	
		this.liche.x = 320;
		this.lastTick = performance.now();
	}

	mouseDown(x, y) {
		for (var cntr = 0; cntr < this.balls.length; ++cntr)
			if (this.balls[cntr].checkIfDestroyed(x, y)) {
				this.game.playClickSound();
				break;
			}
		return false;
	}
	
	tick(timestamp) {
		var removingBalls = true;
		while ((this.balls.length >= 1) && (removingBalls)) {
			if (this.balls[this.balls.length-1].alive) {
				removingBalls = false;
			} else {
				this.balls.pop();
			}
		}
		var lost = false;
		for (var cntr = 0; cntr < this.balls.length; ++cntr) { 
			this.balls[cntr].tick(timestamp);
			if (this.balls[cntr].hitTarget)
				lost = true;
		}
		this.moveLich(timestamp);
		if (lost) {
			this.game.playExplosionSound();
			this.game.switchScreen(this.game.MODE_LOSE);
		}
		if ((this.balls.length <= 0) && (this.ballsRemaining <= 0))
			this.startLevel(this.currentLevel + 1);
			
	}
	
	render(ctx) {
		var r = HalloweenLichAtlas.Backdrop;
		ctx.drawImage(HalloweenLichImg, r.x, r.y, r.w,r.h, 0, 0, 640,480);
		
		ctx.drawImage(HalloweenLichImg, this.atlasLich.x, this.atlasLich.y, this.atlasLich.w,this.atlasLich.h, 
				Math.floor(this.liche.x), this.liche.y, 58,82);

		for (var cntr = 0; cntr < this.balls.length; ++cntr) {
			this.balls[cntr].render(ctx);
		}
		if (performance.now() < this.showLevelEnd)
			drawBloodText(ctx, "LEVEL " + this.currentLevel, 200,150, 1);
	}

	moveLich(timestamp) {
		//console.log("should move liche");
		var delta = (timestamp - this.lastTick) / 1000.0;
		this.lastTick = timestamp;
		var reachedTarget = false;
		if (this.licheTarget < this.liche.x) {
			this.liche.x -= (this.licheSpeed * delta);
			reachedTarget = this.licheTarget >= this.liche.x;
		} else {
			this.liche.x += (this.licheSpeed * delta);
			reachedTarget = this.licheTarget <= this.liche.x;
		}
			
		if (reachedTarget)
		{
			this.licheTarget = Math.random() * 620;
		}
		this.handleLaunch(timestamp);
	}
	
	startLevel(lvl) {
		while (this.balls.length > 0) this.balls.pop();
		this.currentLevel = lvl;
		this.licheTarget = 320;
		this.licheSpeed = lvl * 25;
		this.chanceLaunch = lvl * 5;
		this.ballsRemaining = lvl * 5 + 5;
		this.launchDelay = 500 - 25 * lvl;
		if (lvl >= 14) {
			this.game.playWinSound();
			this.game.switchScreen(this.game.MODE_WIN);
		}
		this.showLevelEnd = performance.now() + 3000;
		this.nextLaunch = this.showLevelEnd + this.launchDelay;
	}
	
	handleLaunch(timestamp) {
		// first see if can launch
		if (timestamp < this.nextLaunch) return;
		if (this.ballsRemaining <= 0) return;		
		var bx = Math.random() * (640 - 40) + 20;
		var by = Math.random() * (480 - 40) + 20;
		var ball = new EnergyBall(this.liche.x+5,this.liche.y+10, bx,by);
		this.balls.unshift(ball);
		--this.ballsRemaining;
		this.nextLaunch = Math.random() * this.launchDelay * 3 + this.launchDelay + timestamp;
	}

}

class Game {

	constructor() { 
	// screen modes
		this.MODE_LOADER = 0;
		this.MODE_TITLE = 1;
		this.MODE_GAME = 2;
		this.MODE_LOSE = 3;
		this.MODE_WIN = 4;
		this.DIR_LEFT = 0;
		this.DIR_RIGHT = 1;
		
		this.game_mode = Game.MODE_TITLE;
		this.loading = new LoadingScreen(this);
		this.game = new GameScreen(this);
		this.title = new TitleScreen(this);
		this.over = new LoseScreen(this);
		this.win = new WinScreen(this);
		this.curScreen = this.loading;
		this.screens = [this.loading, this.title, this.game, this.over, this.win]
		this.soundEnabled = true;
	}
	
	mouseDown(x, y) {
		return this.curScreen.mouseDown(x,y);
	}

	mouseMove(x, y) {
		return this.curScreen.mouseMove(x,y);
	}

	mouseUp(x, y) {
		return this.curScreen.mouseUp(x,y);
	}
	
	tick(timestamp) {
		this.curScreen.tick(timestamp);
	}
	
	render(ctx) {
		this.curScreen.render(ctx);
	}
	
	switchScreen(mode) {
		this.curScreen = this.screens[mode];
		this.curScreen.restart();
	}
	
	setSound(enabled) {
		this.soundEnabled = enabled;
	}
	
	playExplosionSound() {
		if (this.soundEnabled)
			HalloweenLicheExplosionSound.play();
	}
	
	playClickSound() {
		if (this.soundEnabled)
			HalloweenLicheClickSound.play();
	}
	
	playWinSound() {
		if (this.soundEnabled)
			HalloweenLicheWinSound.play();
	}
}
