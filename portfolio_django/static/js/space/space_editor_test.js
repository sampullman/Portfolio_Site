var editorEnemies=[], staticEnemies=[], selectedEnemies=[], sliders=[], editorActiveEnemies=[];
var dragging=false, activating, activeSlider, editPlay=false, showHelp=true, togglePlay, mainButton;
var showHelpButton, showEnemyOptions=false, healthSlider, shotFreqSlider, speedSlider;
var editorPlayerLives=3, playerLivesSlider, editorPlayerMissiles=2, playerMissilesSlider;
var prevX=0, prevY=0;

var selRegion = { active: false, x: 0, y: 0, width: 0, height: 0,
		  x1: 0, x2: 0, y1: 0, y2: 0 };

// TODO -- Separate into one time setup and return setup
function setupEditor() {
    keydownFns.del = deleteSelected;
    keydownFns.c = copyEnemy;
    keydownFns.a = activateEnemies;
    staticEnemies = [];
    var x = 0, y = BOUNDARY+10;
    for(var i=0;i<enemyObjList.length;i+=1) {
	var obj = enemyObjList[i];
	var e = obj.instantiate(x, y, obj.sprite.width, obj.sprite.height, 0, randomVerticalInit);
	e.click = staticEnemyClick(obj, e);
	staticEnemies.push(e);
	x += e.sprite.width + 10;
    }
    enemies = staticEnemies.slice(0, staticEnemies.length).concat(editorEnemies.slice(0, editorEnemies.length));
    c.font = "16px Arial Black";
    var s1 = "MAIN".size(c.font);
    mainButton = new Button("MAIN", C_WIDTH-(s1[0]+10), C_HEIGHT-(s1[1]+15), s1, c.font);
    mainButton.setClickListener(function() {
	teardownEditor();
	showStart();
    });
    var s2 = "PLAY".size(c.font);
    togglePlay = new Button("PLAY", C_WIDTH-(s2[0]+10), C_HEIGHT-(s1[1]+s2[1]+30), s2, c.font);
    togglePlay.setClickListener(playCustom);
    c.font = "14px Arial Black";
    var s3 = "HIDE".size(c.font);
    showHelpButton = new Button("HIDE", C_WIDTH-(s3[0]+10), BOUNDARY-(s3[1]+50), s3, c.font);
    showHelpButton.setClickListener(function(e) {
	showHelpButton.text = (showHelpButton.text == "HIDE") ? "HELP" : "HIDE";
	showHelp = !showHelp;
	editorDraw();
    });
    buttons = [mainButton, togglePlay, showHelpButton];
    attackFreqSlider = new Slider("Time between Attacks", "sec.", 20, C_HEIGHT-35, 110, 14, 0, 3, 0, true, null);
    attackFreqSlider.setToVal(1.5);
    playerLivesSlider = new Slider("Player Health", "", 160, C_HEIGHT-35, 80, 14, 1, 10, 1, true, null);
    playerLivesSlider.setToVal(editorPlayerLives);
    playerMissilesSlider = new Slider("Player Missiles", "", 260, C_HEIGHT-35, 90, 14, 0, 20, 1, true, null);
    playerMissilesSlider.setToVal(editorPlayerMissiles);
    sliders = [attackFreqSlider, playerLivesSlider, playerMissilesSlider];
    var healthUpdate = function(val) {
	selectedEnemies.forEach(function(enemy) { enemy.health = Math.round(val); });
    };
    var shotFreqUpdate = function(val) {
	selectedEnemies.forEach(function(enemy) {
	    enemy.shotFreq = val * FPS;
	    if(enemy.hoverActionFn) enemy.hoverAction = enemy.hoverActionFn(enemy, enemy.shotFreq);
	    enemy.shoot = enemy.shootFn(enemy, enemy.shotFreq);
	})};
    var speedUpdate = function(val) {
	selectedEnemies.forEach(function(enemy) { enemy.speed = val; });
    };
    var sliderWidth = 75;
    healthSlider = new Slider("Health", "", 0, 0, sliderWidth, 12, 1, 10, 1, true, healthUpdate);
    shotFreqSlider = new Slider("Shot Freq.", "sec.", 0, 0, sliderWidth, 12, 0, 3, 0, true, shotFreqUpdate);
    speedSlider = new Slider("Speed", "", 0, 0, sliderWidth, 12, 0.1, 3, 0.1, true, speedUpdate);
    editorDraw();
}

function playCustom() {
    editPlay = true;
    level = levels.custom;
    level.attack_freq = function () { return FPS * attackFreqSlider.val; };
    attackTimer = level.attack_freq(0);
    setupLives(playerLivesSlider.val);
    numMissiles = Math.round(playerMissilesSlider.val);
    buttons = [togglePlay];
    togglePlay.text = "STOP";
    togglePlay.setClickListener(stopCustom);
    enemies = editorEnemies.slice(0, editorEnemies.length);
    enemies.forEach(function(e) {
	e.editX = e.x;
	e.editY = e.y;
	e.editHealth = e.health;
	e.initPath = new e.initPathFn(e).instantiate();
	e.initPath.init();
	e.mode = EnemyMode.INIT;
    });
    level.load();
    player.visible = true;
    startGame();
}

function stopCustom() {
    clearInterval(gameEventId);
    editPlay = false;
    isGameOver = false;
    clearEntities();
    playerLives = [];
    explosions = [];
    buttons = [mainButton, togglePlay, showHelpButton];
    togglePlay.text = "PLAY";
    togglePlay.setClickListener(playCustom);
    editorEnemies.forEach(function(e) {
	e.x = e.editX;
	e.y = e.editY;
	e.health = e.editHealth;
	e.active = true;
    });
    enemies = staticEnemies.slice(0, staticEnemies.length).concat(editorEnemies.slice(0, editorEnemies.length));
    player.visible = false;
    window.keydown = {};
    editorDraw();
}

function teardownEditor() {
    buttons = [];
    enemies = [];
    keydownFns.del = null;
    keydownFns.c = null;
    keydownFns.a = null;
    gameMode = GameMode.MENU;
}

function staticEnemyClick(enemyObj, enemy) {
    return function() {
	var e = enemyObj.instantiate(enemy.x, enemy.y, enemyObj.sprite.width, enemyObj.sprite.height, 30);
	e.initPathFn = randomVerticalInit;
	e.shootFn = enemyObj.shootFn;
	e.hoverActionFn = enemyObj.hoverActionFn;
	e.attackPathFn = enemyObj.attackPath;
	e.wanderFn = enemyObj.wanderFn;
	e.shotFreq = 30;
	e.type = enemyObj.type;
	return e;
    }
}
function deleteSelected() {
    selectedEnemies.forEach(function(e) {
	e.active = false;
    });
    editorUpdate();
    editorDraw();
}

function updateEnemySliders() {
    var show = true;
    if(selectedEnemies.length > 0) {
	id = selectedEnemies[0].type;
	selectedEnemies.forEach(function(e) {
	    show = show && (id == e.type);
	});
    }
    if(selectedEnemies.length == 0 || !show) {
	sliders = sliders.slice(0, 3);
	showEnemyOptions = false;
	return;
    } else if(!showEnemyOptions) {
	showEnemyOptions = true;
	sliders.push(healthSlider);
	sliders.push(shotFreqSlider);
	sliders.push(speedSlider);
    }
    var e = selectedEnemies[0];
    error = e.health;
    var sliderWidth = 75;
    var xPos = e.x + (e.x < C_WIDTH-120 ? e.width+10 : -1*sliderWidth-5);
    var yPos = e.y + e.height;
    healthSlider.setToVal(e.health);
    healthSlider.setPos(xPos, yPos);
    shotFreqSlider.setToVal(e.shotFreq / FPS);
    shotFreqSlider.setPos(xPos, yPos+40);
    speedSlider.setToVal(e.speed);
    speedSlider.setPos(xPos, yPos+80);
}

function editorUpdate() {
    selectedEnemies = selectedEnemies.filter(function(e) {
	return e.active;
    });
    //updateEnemySliders();
    enemies = enemies.filter(function(e) {
	return e.active;
    });
    editorEnemies = editorEnemies.filter(function(e) {
	if(e.x + e.width < 0) e.x = 0;
	else if(e.x > C_WIDTH) e.x = C_WIDTH - e.width;
	if(e.y < 0) e.y = 0;
	else if(e.y > C_HEIGHT) e.y = C_HEIGHT - e.height;
	return e.active;
    });
}

function editorDraw() {
    draw();
    if(selRegion.active) {
	c.strokeStyle = "#DDD";
	c.strokeRect(selRegion.x, selRegion.y, selRegion.width, selRegion.height);
    } else if(activating) {
	c.strokeStyle = "#0F0";
	c.beginPath();
	c.moveTo(activating.x+activating.width/2, activating.y+activating.height/2);
	c.lineTo(prevX, prevY);
	c.closePath();
	c.stroke();
    }
    if(showHelp) {
	c.font = "14px Arial";
	c.fillText("-Click and drag from a template below to create a new enemy.", 10, BOUNDARY-160);
	c.fillText("-Shift click or click and drag to select multiple enemies.", 10, BOUNDARY-140);
	c.fillText("-Type 'c' to copy an enemy or 'shift-c' to fill a row with copies.", 10, BOUNDARY-120);
	c.fillText("-Hit the delete key to remove selected enemies.", 10, BOUNDARY-100);
	c.fillText("-Type 'a' to set selected enemies as attackers.", 10, BOUNDARY-80);
	c.fillText("-Control click and drag from one enemy to another to make the", 10, BOUNDARY-60);
	c.fillText("second enemy attack after the first is destroyed.", 30, BOUNDARY-40);
	c.fillText("-Use sliders to modify values. Values are copied along with enemies.", 10, BOUNDARY-20);
    }
    sliders.forEach(function(slider) {
	slider.draw();
    });
}

function clickHit(x, y, E) {
    return x > E.x && x < E.x + E.width && y > E.y && y < E.y + E.height;
}

function clearSelectedEnemies() {
    selectedEnemies.forEach(function(e) { e.squared = false; });
    selectedEnemies = [];
}

function pushNewSelectedEnemy(newE) {
    editorEnemies.push(newE);
    enemies.push(newE);
    selectedEnemies.push(newE);
    newE.squared = true;
}

function activateEnemies() {
    var allActive = true;
    selectedEnemies.forEach(function(e) { allActive = allActive && e.editorActive; });
    selectedEnemies.forEach(function(e) {
	if(allActive) {
	    e.editorActive = false;
	} else if(editorActiveEnemies.indexOf(e) == -1) {
	    editorActiveEnemies.push(e);
	    e.editorActive = true;
	}
    });
    editorActiveEnemies = editorActiveEnemies.filter(function(e) { return e.editorActive; });
    editorDraw();
}

function copyEnemy() {
    if(selectedEnemies.length == 0) return;
    var e = selectedEnemies[selectedEnemies.length-1];
    var xDiff = e.width + 15;
    var xPos = e.x - xDiff;
    if(keydown.shift) {
	var newE;
	selectedEnemies = [e];
	while(xPos > 0) {
	    newE = e.clone(xPos, e.y);
	    pushNewSelectedEnemy(newE);
	    xPos -= xDiff;
	}
	xPos = e.x + xDiff;
	while(xPos < C_WIDTH - e.width) {
	    newE = e.clone(xPos, e.y);
	    pushNewSelectedEnemy(newE);
	    xPos += xDiff;
	}
    } else {
	var newX = (e.x > C_WIDTH) ? e.x-e.width/2 : e.x+e.width/2;
	var newE = e.clone(newX, e.y+e.width/2);
	pushNewSelectedEnemy(newE);
    }
    editorDraw();
}

function editMouseDown(x, y) {
    if(editPlay) return;
    prevX = x;
    prevY = y;
    for(var i=0;i<sliders.length;i+=1) {
	if(sliders[i].hit(x, y)) {
	    activeSlider = sliders[i];
	    dragging = true;
	    editorDraw();
	    return;
	}
    }
    for(var i=editorEnemies.length-1;i>=0;i-=1) {
	var e = editorEnemies[i];
	if(clickHit(x, y, e)) {
	    if(keydown.ctrl) {
		activating = e;
	    } else if(!e.squared) {
		e.squared = true;
		if(keydown.shift) {
		    selectedEnemies.push(e);
		} else {
		    clearSelectedEnemies();
		    selectedEnemies = [e];
		}
	    } else if(keydown.shift) {
		selectedEnemies.splice(selectedEnemies.indexOf(e), 1);
		e.squared = false;
	    }
	    dragging = true;
	    updateEnemySliders();
	    editorDraw();
	    return;
	}
    }
    for(var i=0;i<staticEnemies.length;i+=1) {
	var e = staticEnemies[i];
	if(clickHit(x, y, e)) {
	    clearSelectedEnemies()
	    var clickedEnemy = e.click();
	    clickedEnemy.x = x;
	    clickedEnemy.y = y;
	    dragging = true;
	    pushNewSelectedEnemy(clickedEnemy);
	    updateEnemySliders();
	    editorDraw();
	    return;
	}
    }
    if(!keydown.shift) clearSelectedEnemies();
    selRegion.active = true;
    selRegion.x1 = x; selRegion.y1 = y;
    selRegion.width = 0; selRegion.height = 0;
    updateEnemySliders();
    editorUpdate();
    editorDraw();
}

function editMouseUp(x, y) {
    if(editPlay) return;
    if(activeSlider) activeSlider.clicked = false;
    activeSlider = null;
    if(activating) {
	var parentChosen = false;
	editorEnemies.forEach(function(e) {
	    if(clickHit(x, y, e) && e != activating) {
		var cycle = false, parent = e.parent;
		parentChosen = true;
		while(parent) {
		    if(parent == activating) {
			cycle = true;
			break;
		    }
		    parent = parent.parent;
		}
		if(!cycle) activating.parent = e;
	    }
	});
	if(!parentChosen) activating.parent = null;
	activating = null;
    }
    editorUpdate();
    selRegion.active = false;
    dragging = false;
    editorDraw();
}

function editMouseMove(x, y) {
    if(editPlay) return;
    if(dragging && !activating) {
	if(activeSlider) {
	    activeSlider.slide(x - prevX, y - prevY);
	} else {
	    selectedEnemies.forEach(function(e) {
		var xDiff = x - prevX;
		var yDiff = y - prevY;
		if(showEnemyOptions) {
		    healthSlider.move(xDiff, yDiff);
		    shotFreqSlider.move(xDiff, yDiff);
		    speedSlider.move(xDiff, yDiff);
		    updateEnemySliders();
		}
		e.x += xDiff;
		e.y += yDiff;
	    });
	}
    } else if(selRegion.active) {
	selRegion.x2 = x; selRegion.y2 = y;
	selRegion.x = Math.min(selRegion.x1, selRegion.x2);
	selRegion.y = Math.min(selRegion.y1, selRegion.y2);
	selRegion.width = Math.abs(selRegion.x1 - selRegion.x2);
	selRegion.height = Math.abs(selRegion.y1 - selRegion.y2);
	selectedEnemies = [];
	editorEnemies.forEach(function(e) {
	    if(entityCollision(selRegion, e)) {
		selectedEnemies.push(e);
		e.squared = true;
	    } else {
		e.squared = false;
	    }
	});
    }
    prevX = x; prevY = y;
    editorUpdate();
    editorDraw();
}

function editMouseClick(x, y) {
    
}