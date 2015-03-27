

	

	game.ExperienceManager = Object.extend({
		init: function(x, y, settings){
			this.alwaysUpdate = true;
			this.gameover = false;
		},

		update: function(){
			if (game.data.win === true && !this.gameover){
				this.gameOver(true);
			}else if(game.data.win === false && !this.gameover){
				
				this.gameOver(false);
			}
			

			return true;
		},

		gameOver: function(win){
			if (win){
				game.data.exp += 10;
			}else{
				game.data.exp += 1;
			}
			console.log(game.data.exp);
			this.gameover = true;
			me.save.exp = game.data.exp;
			me.save.exp2 = 4;
		}

	});

	
me.game.world.addChild(game.data.buytext, 35);
		},

		stopBuying: function(){
			this.buying = false;
			me.state.resume(me.state.PLAY);
			game.data.player.body.setVelocity(game.data.playerMoveSpeed, 20);
			me.game.world.removeChild(game.data.buyscreen);
			me.input.unbindKey(me.input.KEY.F1, "F1", true);
			me.input.unbindKey(me.input.KEY.F2, "F2", true);
			me.input.unbindKey(me.input.KEY.F3, "F3", true);
			me.input.unbindKey(me.input.KEY.F4, "F4", true);
			me.input.unbindKey(me.input.KEY.F5, "F5", true);
			me.input.unbindKey(me.input.KEY.F6, "F6", true);
			me.game.world.removeChild(game.data.buytext);

		},

		checkBuyKeys: function(){
			if(me.input.isKeyPressed("F1")){
				if(this.checkCost(1)){
					this.makePurchase(1);
				}
			}else if(me.input.isKeyPressed("F2")){
				if(this.checkCost(2)){
					this.makePurchase(2);
				}
			}else if(me.input.isKeyPressed("F3")){
				if(this.checkCost(3)){
					this.makePurchase(3);
				}
			}else if(me.input.isKeyPressed("F4")){
				if(this.checkCost(4)){
					this.makePurchase(4);
				}
			}else if(me.input.isKeyPressed("F5")){
				if(this.checkCost(5)){
					this.makePurchase(5);
				}
			}else if(me.input.isKeyPressed("F6")){
				if(this.checkCost(6)){
					this.makePurchase(6);
				}
			}
		},

		checkCost: function(skill1){
			if(skill===1 && (game.data.gold >= ((game.data.skill1+1)*10))){
				return true;
			}		else if(skill===2 && (game.data.gold >= ((game.data.skill2+1)*10))){
				return true;
			}		else if(skill===3 && (game.data.gold >= ((game.data.skill3+1)*10))){
				return true;
			}			  else if(skill===4 && (game.data.gold >= ((game.data.ability1+1)*10))){
				return true;
			}		else if(skill===5 && (game.data.gold >= ((game.data.ability2+1)*10))){
				return true;
			}			else if(skill===6 && (game.data.gold >= ((game.data.ability3+1)*10))){
				return true;
			}else{
				return false;
			}
		},

		makePurchase: function(skill){
			if(skill === 1){
			game.data.gold -= ((game.data.skill1 +1)* 10);
			game.data.skill1 += 1;
			game.data.playerAttack += 1;
		}else if(skill ===2){
			game.data.gold -= ((game.data.skill2 +1)* 10);
			game.data.skill2 += 1;
		}else if(skill ===3){
			game.data.gold -= ((game.data.skill3 +1)* 10);
			game.data.skill3 += 1;
		}else if(skill ===4){
			game.data.gold -= ((game.data.ability1 +1)* 10);
			game.data.ability1 += 1;
		}else if(skill ===5){
			game.data.gold -= ((game.data.ability2 +1)* 10);
			game.data.ability2 += 1;
		}else if(skill ===6){
			game.data.gold -= ((game.data.ability3 +1)* 10);
			game.data.ability3 += 1;
		}
	  }

	});


