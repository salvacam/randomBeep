document.addEventListener('DOMContentLoaded', function () {
  	app.init();
});

var app = {
  
  	play: document.getElementById('play'),
  	pause: document.getElementById('pause'),
  	reset: document.getElementById('reset'),

  	resetWorkTimeElement: document.getElementById('resetWorkTime'),
  	workTimeElement: document.getElementById('workTime'),
  	workTime: 0,

  	setDiv: document.getElementById('setDiv'),
  	chronoDiv: document.getElementById('chronoDiv'),

  	workValue: document.getElementById('workValue'),
  	workValueInt: 60,

  	minValue: document.getElementById('minValue'),
  	minValueInt: 2,
  	
  	maxValue: document.getElementById('maxValue'),
  	maxValueInt: 4,

  	state: 1, // 1 -> config, 2 -> chrono
  	timeRest: document.getElementById('timeRest'),
  	timeRestInt: 0,

  	interval: null,
  	intervalButton: null,
  	timeBeep: null,
  	audio: new Audio(),
  	isPaused: false,
  	modalPause: document.getElementById('modalPause'),
  	modalReset: document.getElementById('modalReset'),

  	numberBeepElement: document.getElementsByName('numberBeep'),
  	numberBeep: 1,
	
	timeReset: 3000,
	initTime: -3,

	noSleepVideo: document.getElementById('noSleepVideo'),	

	intervalShow: null,
	gongDiv: document.getElementById('gong'),
	randomSound1Div: document.getElementById('randomSound1'),
	randomSound2Div: document.getElementById('randomSound2'),
	randomSound3Div: document.getElementById('randomSound3'),

  	playSound: function(srcSound){
		app.audio.src = "./sound/" + srcSound + ".ogg";
		app.audio.play();
  	},
  
  	init: function() {
		app.noSleepVideo.pause();

    	app.play.addEventListener('click', app.initChrono);
    	app.reset.addEventListener('click', app.resetChrono);
    	app.pause.addEventListener('click', app.pauseChrono);

		app.resetWorkTimeElement.addEventListener('click', app.resetWorkTime);    	

    	let classnameLess = document.getElementsByClassName('lessBtn');
    	for (var i = 0; i < classnameLess.length; i++) {
    		classnameLess[i].addEventListener('click', app.lessValue);
    		classnameLess[i].addEventListener('mousedown', app.lessValueCont);
    		classnameLess[i].addEventListener('touchstart', app.lessValueCont);
    		classnameLess[i].addEventListener('mouseup', app.contEnd);
    		classnameLess[i].addEventListener('touchend', app.contEnd);    		
		}

    	let classnameMore = document.getElementsByClassName('moreBtn');
    	for (var i = 0; i < classnameMore.length; i++) {
    		classnameMore[i].addEventListener('click', app.moreValue);
    		classnameMore[i].addEventListener('mousedown', app.moreValueCont);
    		classnameMore[i].addEventListener('touchstart', app.moreValueCont);
    		classnameMore[i].addEventListener('mouseup', app.contEnd);
    		classnameMore[i].addEventListener('touchend', app.contEnd);
		}

	    if ('serviceWorker' in navigator) {
      		navigator.serviceWorker
        		.register('service-worker.js')
        		.then(function() {
          		//console.log('Service Worker Registered');
        	});
    	}    	
  	},

	initChrono: function() {

		app.noSleepVideo.play();

		for(var i = 0; i < app.numberBeepElement.length; i++){
    		if(app.numberBeepElement[i].checked){
        		app.numberBeep = app.numberBeepElement[i].value;
    		}
		}

		setDiv.classList.add("hide");
		chronoDiv.classList.remove("hide");

		app.state = 2;

		//init clock

		/* TODO refactorizar */
		document.getElementsByTagName("html")[0].classList.add('work');
		document.getElementsByClassName("jumbotron")[0].classList.add('work');
		/* TODO refactorizar */

		let restTime = app.workValueInt;
		let initTime = app.initTime;

		app.timeRestInt = restTime;
		app.timeRest.innerText = app.formatTime(app.initTime);

		if (app.numberBeep != 0) {
			app.timeBeep = Math.floor(Math.random() * (app.maxValueInt - app.minValueInt + 1)) + app.minValueInt;
		}
		
		app.interval = setInterval(function() {
			if (initTime < 0) {
				initTime +=1;
				app.timeRestInt = initTime;
			}
			app.timeRest.innerText = app.formatTime(app.timeRestInt);

			if (initTime >= 0 && !app.isPaused) {
				if (restTime == app.workValueInt) {
					app.timeRestInt = restTime;
					app.timeRest.innerText = app.formatTime(app.timeRestInt);				
					app.playSound('gong');
				}
				if (app.numberBeep != 0 && app.timeBeep == 0) {
	  				if (app.numberBeep == 1) {
						app.playSound('alert');
						app.gongDiv.classList.remove('hide');
						clearInterval(app.intervalShow);
						app.intervalShow = setInterval( function() {
							app.gongDiv.classList.add('hide');
						}, 1000);
					} else {
	  					let randomSound = Math.floor(Math.random() * app.numberBeep) + 1;
	  					app.audio.src = "./sound/" + randomSound + ".mp3";
						switch (randomSound) {
							case 1:
								app.randomSound1Div.classList.remove('hide');
  								break;
							case 2:								
								app.randomSound2Div.classList.remove('hide');
  								break;
							case 3:
								app.randomSound3Div.classList.remove('hide');
  								break;
							}
						clearInterval(app.intervalShow);
						app.intervalShow = setInterval( function() {
							app.randomSound1Div.classList.add('hide');
							app.randomSound2Div.classList.add('hide');
							app.randomSound3Div.classList.add('hide');
						}, 1000);
						app.audio.play();
	  				}
					app.timeBeep = Math.floor(Math.random() * (app.maxValueInt - app.minValueInt + 1)) + app.minValueInt;
				} else if (app.numberBeep != 0) {
					app.timeBeep -= 1;
				}
	  			if (restTime === 0) {
					//Sumar el tiempo total trabajado
					app.workTime += app.workValueInt;
	  				clearInterval(app.interval);
					app.playSound('gong');
					clearInterval(app.interval);
					restTime = 0;	
					setTimeout(function () {
						app.showConfig();
					}, app.timeReset);									
	  			} else {
					restTime -=1;
				}
				app.timeRestInt = restTime;
  			}
		}, 1000);
	},

	resetChrono: function() {
		app.isPaused = true;
		app.modalReset.classList.remove('hide');

		document.getElementById('okReset').addEventListener('click', () => {  				
			app.isPaused = false;
			app.modalReset.classList.add('hide');
			document.getElementById('okReset').removeEventListener('click', ()=> {});
			clearInterval(app.interval);
			app.showConfig();
		});

		document.getElementById('closeReset').addEventListener('click', () => {  				
			app.isPaused = false;
			app.modalReset.classList.add('hide');
			document.getElementById('closeReset').removeEventListener('click', ()=> {});
		});		
	},

	resetWorkTime: function() {
		app.modalReset.classList.remove('hide');

		document.getElementById('okReset').addEventListener('click', () => {
			app.modalReset.classList.add('hide');
			document.getElementById('okReset').removeEventListener('click', ()=> {});
			//borrar el tiempo trabajado
			app.workTime = 0;
			app.workTimeElement.innerText = app.formatTime(app.workTime);
		});

		document.getElementById('closeReset').addEventListener('click', () => {  
			app.modalReset.classList.add('hide');
			document.getElementById('closeReset').removeEventListener('click', ()=> {});
		});		
	},

	showConfig: function() {

		app.noSleepVideo.pause();

		 /* TODO refactorizar */
		document.getElementsByTagName("html")[0].classList.remove('work');
		document.getElementsByClassName("jumbotron")[0].classList.remove('work');
		document.getElementsByTagName("html")[0].classList.remove('rest');
		document.getElementsByClassName("jumbotron")[0].classList.remove('rest');
		 /* TODO refactorizar */
		app.setDiv.classList.remove("hide");
		app.chronoDiv.classList.add("hide");
		app.state = 1;

		app.workTimeElement.innerText = app.formatTime(app.workTime);
	},

	pauseChrono: function() {
		app.isPaused = true;
		app.modalPause.classList.remove('hide');
			document.getElementById('closePause').addEventListener('click', () => {  				
			app.isPaused = false;
			app.modalPause.classList.add('hide');
			document.getElementById('closePause').removeEventListener('click', ()=> {});
			});		
	},

	lessValue: function(type) {
		if (typeof type === "object"){
			type = type.target.getAttribute('data-type');
		}
		switch(type) {
    		case 'sets':
    			app.setsValue.innerText = parseInt(app.setsValue.innerText) - 1;
				if (parseInt(app.setsValue.innerText) < 1) {
					app.setsValue.innerText = 1;
				}
  				break;
  			case 'work':
				if (parseInt(app.workValueInt) < 60) {
					app.workValueInt = parseInt(app.workValueInt) - 5;
				} else if (parseInt(app.workValueInt) < 120) {
					app.workValueInt = parseInt(app.workValueInt) - 10;
				} else if (parseInt(app.workValueInt) < 180) {
					app.workValueInt = parseInt(app.workValueInt) - 15;
				} else if (parseInt(app.workValueInt) <= 300) {
					app.workValueInt = parseInt(app.workValueInt) - 30;
				}
				if (parseInt(app.workValueInt) < 30) {
					app.workValueInt = 30;
				}
				app.workValue.innerText = app.formatTime(app.workValueInt);
  				break;
			case 'min':
				app.minValueInt = parseInt(app.minValueInt) - 1;
				if (parseInt(app.minValueInt) < 2) {
					app.minValueInt = 2;
				}
				app.minValue.innerText = app.formatTime(app.minValueInt);
  				break;
			case 'max':
				app.maxValueInt = parseInt(app.maxValueInt) - 1;
				if (parseInt(app.maxValueInt) < 4) {
					app.maxValueInt = 4;
				}
				app.maxValue.innerText = app.formatTime(app.maxValueInt);
  				break;
		}
	},

	lessValueCont: function(type) {		
		if (typeof type === "object"){
			type = type.target.getAttribute('data-type');
		}
		app.intervalButton = setInterval( function() {
			switch(type) {
	    		case 'sets':
	    			app.setsValue.innerText = parseInt(app.setsValue.innerText) - 1;
					if (parseInt(app.setsValue.innerText) < 1) {
						app.setsValue.innerText = 1;
					}
	  				break;
	  			case 'work':
					if (parseInt(app.workValueInt) < 60) {
						app.workValueInt = parseInt(app.workValueInt) - 5;
					} else if (parseInt(app.workValueInt) < 120) {
						app.workValueInt = parseInt(app.workValueInt) - 10;
					} else if (parseInt(app.workValueInt) < 180) {
						app.workValueInt = parseInt(app.workValueInt) - 15;
					} else if (parseInt(app.workValueInt) <= 300) {
						app.workValueInt = parseInt(app.workValueInt) - 30;
					}
					if (parseInt(app.workValueInt) < 30) {
						app.workValueInt = 30;
					}
					app.workValue.innerText = app.formatTime(app.workValueInt);
	  				break;
				case 'min':
					app.minValueInt = parseInt(app.minValueInt) - 1;
					if (parseInt(app.minValueInt) < 2) {
						app.minValueInt = 2;
					}
					app.minValue.innerText = app.formatTime(app.minValueInt);
	  				break;
				case 'max':
					app.maxValueInt = parseInt(app.maxValueInt) - 1;
					if (parseInt(app.maxValueInt) < 4) {
						app.maxValueInt = 4;
					}
					app.maxValue.innerText = app.formatTime(app.maxValueInt);
	  				break;
				}
		}, 250);
	},

	contEnd: function() {
		for (var i = 0; i <= app.intervalButton; i ++) {
			clearInterval(i);
		}
	},

	moreValue: function(type) {
		if (typeof type === "object"){
			type = type.target.getAttribute('data-type');
		}
		switch(type) {
    		case 'sets':
				if (parseInt(app.setsValue.innerText) < 30) {
					app.setsValue.innerText = parseInt(app.setsValue.innerText) + 1;
					if (parseInt(app.setsValue.innerText) < 1) {
						app.setsValue.innerText = 1;
					}
				}
  				break;
  			case 'work':
				if (parseInt(app.workValueInt) < 300) {
					if (parseInt(app.workValueInt) < 60) {
						app.workValueInt = parseInt(app.workValueInt) + 5;
					} else if (parseInt(app.workValueInt) < 120) {
						app.workValueInt = parseInt(app.workValueInt) + 10;
					} else if (parseInt(app.workValueInt) < 180) {
						app.workValueInt = parseInt(app.workValueInt) + 15;
					} else if (parseInt(app.workValueInt) < 300) {
						app.workValueInt = parseInt(app.workValueInt) + 30;
					}
					if (parseInt(app.workValueInt) < 5) {
						app.workValueInt = 5;
					}
					app.workValue.innerText = app.formatTime(app.workValueInt);
				}
				break;
			case 'min':
				if (parseInt(app.minValueInt) < 9) {
					app.minValueInt = parseInt(app.minValueInt) + 1;
					if (parseInt(app.minValueInt) < 2) {
						app.minValueInt = 2;
					}
				}
				app.minValue.innerText = app.formatTime(app.minValueInt);
				break;
			case 'max':
				if (parseInt(app.maxValueInt) < 20) {
					app.maxValueInt = parseInt(app.maxValueInt) + 1;
					if (parseInt(app.maxValueInt) < 4) {
						app.maxValueInt = 4;
					}
				}
				app.maxValue.innerText = app.formatTime(app.maxValueInt);
				break;
		}
	},

	moreValueCont: function(type) {		
		if (typeof type === "object"){
			type = type.target.getAttribute('data-type');
		}
		app.intervalButton = setInterval( function() {
			switch(type) {
	    		case 'sets':
					if (parseInt(app.setsValue.innerText) < 30) {
						app.setsValue.innerText = parseInt(app.setsValue.innerText) + 1;
						if (parseInt(app.setsValue.innerText) < 1) {
							app.setsValue.innerText = 1;
						}
					}
	  				break;
	  			case 'work':
					if (parseInt(app.workValueInt) < 300) {
						if (parseInt(app.workValueInt) < 60) {
							app.workValueInt = parseInt(app.workValueInt) + 5;
						} else if (parseInt(app.workValueInt) < 120) {
							app.workValueInt = parseInt(app.workValueInt) + 10;
						} else if (parseInt(app.workValueInt) < 180) {
							app.workValueInt = parseInt(app.workValueInt) + 15;
						} else if (parseInt(app.workValueInt) < 300) {
							app.workValueInt = parseInt(app.workValueInt) + 30;
						}
						if (parseInt(app.workValueInt) < 5) {
							app.workValueInt = 5;
						}
						app.workValue.innerText = app.formatTime(app.workValueInt);
					}
					break;
				case 'min':
					if (parseInt(app.minValueInt) < 9) {
						app.minValueInt = parseInt(app.minValueInt) + 1;
						if (parseInt(app.minValueInt) < 2) {
							app.minValueInt = 2;
						}
					}
					app.minValue.innerText = app.formatTime(app.minValueInt);
					break;
				case 'max':
					if (parseInt(app.maxValueInt) < 20) {
						app.maxValueInt = parseInt(app.maxValueInt) + 1;
						if (parseInt(app.maxValueInt) < 4) {
							app.maxValueInt = 4;
						}
					}
					app.maxValue.innerText = app.formatTime(app.maxValueInt);
					break;
			}
		}, 250);
	},

  	formatTime: function(time) {
  		if (time < 0) {
  			return "-0:0" + Math.abs(time);
  		} else {
		  	let seg = time%60;
			if (seg < 10) {
				seg = "0" + seg;
			}
			let min = parseInt(time/60);
		  	return min+":"+seg;
	  	}
  	}
};
