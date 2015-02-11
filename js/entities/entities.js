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

		//choosing a velocity for the player
		//moving 5 units to the right
		//y is 20 so character is on the floor
		//me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH); makes it so the character is always being followed on the screen
		this.body.setVelocity(5, 20);
		this.facing = "right";
		this.now = new Date().getTime();
		this.lastHit = this.now;
		this.lastAttack = new Date().getTime(); //haven't used this
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

		//this.renderable.addAnimation adds animation(makes your character look like its walking standing or attacking) using the pictures
		//80 miliseconds is the speed you go through each picture
		//the number is what picture from orcSpear.png the program uses
		this.renderable.addAnimation("idle", [78]);
		this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
		this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);

		//this is the animation it starts at (facing the screen)
		this.renderable.setCurrentAnimation("idle");
	},

	update: function(delta){
		this.now = new Date().getTime();
		//checking if the right key is pressed
		if(me.input.isKeyPressed("right")){
			//if the key is pressed this is what happens
			//adds the position of my x by the velocity defined above in
			//setVelocity() and multiplying it by me.timer.tick
			//me.timer.tick makes the movement look smooth
			this.body.vel.x += this.body.accel.x * me.timer.tick;
			//this is so the character faces the right when moving to the right (if this isnt here the character faces the left when walking to the right)
			this.facing = "right";
			this.flipX(true);
		}
		//if you stop pressing the right key
		else if (me.input.isKeyPressed("left")){
			this.facing = "left";
			this.body.vel.x -=this.body.accel.x * me.timer.tick;
			this.flipX(false);
		}
		else{
			//it wont move
			this.body.vel.x = 0;
		}

		if(me.input.isKeyPressed("jump") && !this.body.falling && !this.body.jumping){
			this.body.jumping = true;
			this.body.vel.y -= this.body.accel.y * me.timer.tick;
		} 

		//checking if attack is pressed
		if(me.input.isKeyPressed("attack")){
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


		me.collision.check(this, true, this.collideHandler.bind(this), true);
		//delta is the change of time its happened
		this.body.update(delta);


		//calling the parent class
		//this is updating the super class so the animations can update
		this._super(me.Entity, "update", [delta]);
		return true;
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

		}
	}
});

//this is a class
//making a constructor with ._super
//setting the picture and size
//getShape is returning a rectangle
//toPolygon is there so you can use it
game.PlayerBaseEntity = me.Entity.extend({
	init : function (x, y, settings){
		this._super(me.Entity, 'init', [x, y, {
			image : "tower",
			width : 100,
			height : 100,
			spritewidth : "100",
			spriteheight : "100",
			getShape: function(){
				return (new me.Rect (0, 0, 70, 70)).toPolygon();
			}
		}]);
		//this variable is saying the tower isnt broken
		this.broken = false;
		//this variable is setting the health to 10
		this.health = 10;
		//this variable is saying it'll always update whether or not your looking at it
		this.alwaysUpdate = true;
		//this variable is so if somebody runs into the tower you can collide with it
		this.body.onCollision = this.onCollision.bind(this);

		//the type allows you to use it when doing other collisions and you can check what your running into
		this.type = "PlayerBaseEntity";

		//0 because is the not burning animation
		//1 is another animation
		//this.renderable.setCurrentAnimation("idle"); sets the animation when the tower is broken
		this.renderable.addAnimation("idle", [0]);
		this.renderable.addAnimation("broken", [1]);
		this.renderable.setCurrentAnimation("idle");
	},


	update:function(delta) {
		//this runs when the health is less than or equal to zero
		if(this.health<=0){
			//if its true your character is dead 
			this.broken = true;
			this.renderable.setCurrentAnimation("broken");
		}
		//then it updates delta (the time)
		this.body.update(delta);

		//calling the super
		//updating and returning
		this._super(me.Entity, "update", [delta]);
		return true;
	},

	//for colliding 
	onCollision: function(){

	}

});

//this is a class for the enemy base
//almost the same the class above
game.EnemyBaseEntity = me.Entity.extend({
	init : function (x, y, settings){
		this._super(me.Entity, 'init', [x, y, {
			image : "tower",
			width : 100,
			height : 100,
			spritewidth : "100",
			spriteheight : "100",
			getShape: function(){
				return (new me.Rect (0, 0, 70, 70)).toPolygon();
			}
		}]);
		this.broken = false;
		this.health = 10;
		this.alwaysUpdate = true;
		this.body.onCollision = this.onCollision.bind(this);

		this.type = "EnemyBaseEntity";

		//0 because is the not burning animation
		//1 is another animation
		//this.renderable.setCurrentAnimation("idle"); sets the animation when the tower is broken
		this.renderable.addAnimation("idle", [0]);
		this.renderable.addAnimation("broken", [1]);
		this.renderable.setCurrentAnimation("idle");

	},

	update:function(delta) {
		if(this.health<=0){
			this.broken = true;
			this.renderable.setCurrentAnimation("broken");
		}
		this.body.update(delta);

		this._super(me.Entity, "update", [delta]);
		return true;
	},



	onCollision: function(){

	},

	loseHealth: function(){
		this.health--;
	}

});
game.EnemyCreep = me.Entity.extend({
	init: function(x,y,settings){
		this._super(me.Entity, 'init', [x,y, {
			image: "creep1", 
			width: 32,
			height: 64, 
			spritewidth: "32",
			spriteheight: "64", 
			getShape: function(){
				return (new me.Rect(0,0,32,64)).toPolygon();
			}
		}]);
		this.health = 10;
		this.alwaysUpdate = true;
		this.body.setVelocity(3,20);
		this.type = "EnemyCreep";
		this.renderable.addAnimation("walk", [3,4,5], 80);
		this.renderable.setCurrentAnimation("walk");
	},
	update: function(delta){
		this.body.vel.x -= this.body.accel.x * me.timer.tick;
		this.body.update(delta);

		this._super(me.Entity, "update", [delta]);
		return true;
	}
});

	game.GameManager = Object.extend({
		init: function(x, y, settings) {
		this.now = new Date().getTime();
		this.lastCreep = new Date().getTime();

		this.alwaysUpdate = true;
	},
			update: function(){
				this.now = new Date().getTime();

				if(Math.round(this.now/1000) % 10 ===0 && (this.now - this.lastCreep >= 1000)){
					this.lastCreep = this.now;
					var creepe = me.pool.pull("EnemyCreep", 1000, 0, {});
					me.game.world.addChild(creepe, 5);
				}

				return true;
			}
	});