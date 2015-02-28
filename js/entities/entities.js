//this is a class
//game.PlayerEntity is a class that is why there both capital
//me.Entity is a class
game.PlayerEntity = me.Entity.extend({
	//this is a constructer function
	//melon js uses this contructer on most things for setutp
	//you need x y and settings
	//you're initializing the basic guy
	//super is reaching into the constructer of me.Entity you need settings
	//getShape function is returning a rectangle shape
	//the numbers of the width and height of the box
	//polygon is a method 
	init: function(x, y, settings){
		this.setSuper();
		this.setPlayerTimers();
		this.setAttributes();

		//choosing a velocity for the player
		//moving 5 units to the right
		//y is 20 so character is on the floor
		//me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH); makes it so the character is always being followed on the screen
		this.type = "PlayerEntity";
		this.setFlags();

		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

		this.addAnimation();

		//this.renderable.addAnimation adds animation(makes your character look like its walking standing or attacking) using the pictures
		//80 miliseconds is the speed you go through each picture
		//the number is what picture from orcSpear.png the program uses
	

		//this is the animation it starts at (facing the screen)
		this.renderable.setCurrentAnimation("idle");
	},
	//
	setSuper: function(){
			this._super(me.Entity, 'init', [x, y, {
			image: "player", 
			width: 64,
			height: 64,
			spritewidth: "64",
			spriteheight: "64",
			getShape: function(){
				return(new me.Rect(0, 0, 64, 64)).toPolygon();
			}
		}]);
	},

	setPlayerTimers: function(){
		this.now = new Date().getTime();
		this.lastHit = this.now;
		this.lastAttack = new Date().getTime(); //haven't used this
	},

    setAttributes: function(){
    	this.health = game.data.playerHealth;
		this.body.setVelocity(game.data.playerMoveSpeed, 20);
		this.attack = game.data.playerAttack;
    },

    setFlags: function(){
		this.facing = "right";
		this.dead = false;
		this.attacking = false;
    },

    setaddAnimation: function(){
    	this.renderable.addAnimation("idle", [78]);
		this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
		this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
    },


	update: function(delta){
		this.now = new Date().getTime();

		this.dead = checkIfDead();

		this.checkKeyPressesAndMove();

		this.setAnimation();

		me.collision.check(this, true, this.collideHandler.bind(this), true);
		//delta is the change of time its happened
		this.body.update(delta);

		//calling the parent class
		//this is updating the super class so the animations can update
		this._super(me.Entity, "update", [delta]);
		return true;
	},

	checkIfDead: function(){
		if (this.health <= 0){
			return true;
		}
		return false;
	},


checkKeyPressesAndMove: function(){
			//checking if the right key is pressed
		if(me.input.isKeyPressed("right")){
			this.moveRight();
		}
		//if you stop pressing the right key
		else if (me.input.isKeyPressed("left")){
			this.moveLeft();
		}
		else{
			//it wont move
			this.body.vel.x = 0;
		}

		if(me.input.isKeyPressed("jump") && !this.body.falling && !this.body.jumping){
			this.jump();
		} 

		this.attacking = me.input.isKeyPressed("attack")

},

moveRight: function(){
		//if the key is pressed this is what happens
		//adds the position of my x by the velocity defined above in
		//setVelocity() and multiplying it by me.timer.tick
		//me.timer.tick makes the movement look smooth
		this.body.vel.x += this.body.accel.x * me.timer.tick;			//this is so the character faces the right when moving to the right (if this isnt here the character faces the left when walking to the right)
		this.facing = "right";
		this.flipX(true);
},

moveLeft: function(){
		this.facing = "left";
		this.body.vel.x -=this.body.accel.x * me.timer.tick;
		this.flipX(false);
},

jump: function(){
		this.body.jumping = true;
		this.body.vel.y -= this.body.accel.y * me.timer.tick;
},

setAnimation: function(){
	if(this.attacking){
			//runs if your not attacking
			if(!this.renderable.isCurrentAnimation("attack")){
				//sets the current animation to attack and once that is over
				//goes back to the idle animation
				console.log(!this.renderable.isCurrentAnimation("attack"));
				this.renderable.setCurrentAnimation("attack", "idle");
				//makes it so that the next time we start the animation this sequence we begin
				//from the first animation, not wherever we left off when we
				//switched to another animation
				this.renderable.setAnimationFrame();
			}
		}
		//this will run only if the character is moving
		else if(this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")){
			//this if statement checks what happening with the character
			////if its not moving it'll walk
			//if it isnt it'll walk
			if(!this.renderable.isCurrentAnimation("walk")){
				this.renderable.setCurrentAnimation("walk");
			}
		}
		//this will run if the velocity is not 0
		//this will make the walking stop
		else if(!this.renderable.isCurrentAnimation("attack")){
			this.renderable.setCurrentAnimation("idle");
		}
},


	loseHealth: function(damage){
		this.health = this.health - damage;
		console.log(this.health);
	},

	collideHandler: function(response){
		if(response.b.type==='EnemyBaseEntity'){
			var ydif = this.pos.y - response.b.pos.y;
			var xdif = this.pos.x - response.b.pos.x;

			if(ydif<-40 && xdif< 70 && xdif>-35){
				this.body.falling = false;
				this.body.vel.y = -1;
			}
			else if(xdif>-35 && this.facing==='right' && (xdif<0)){
				this.body.vel.x = 0;
				this.pos.x = this.pos.x -1;
			}
			else if(xdif<70 && this.facing==='left' && xdif>0){
				this.body.vel.x = 0;
				this.pos.x = this.pos.x +1;
			}

			if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >=1000){
				this.lastHit = this.now;
				response.b.loseHealth();
			}

		}else if (response.b.type=== 'EnemyCreep') {
			var xdif = this.pos.x - response.b.pos.x;
			var ydif = this.pos.y - response.b.pos.y;
			if (xdif>0){
				this.pos.x = this.pos.x + 1;
				if(this.facing === "left"){
					this.body.vel.x = 0;
				}
			}else{
				this.pos.x = this.pos - 1;
				if(this.facing === "right"){
					this.body.vel.x = 0;
				}
			}

			if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttackTimer
					&& (Math.abs(ydif) <=40) && (((xdif>0 ) && this.facing==="left")
					 || ((xdif<0) && this.facing==="right"))){
				this.lastHit = this.now;
			//if the creeps health is less than our attack, execute code if in statement
			if(response.b.health <= game.data.playerAttack){
				//adds one gold for a creep kill
				game.data.gold += 1;
				console.log("Current gold: " + game.data.gold);
			}


				response.b.loseHealth(game.data.playerAttack);
			}
		}
	}
});




