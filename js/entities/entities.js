// BASIC PLAYER CLASS
// init: function is our function constructor
// init: function initializes player
// this._super means reaching to the constructor of the entity
// spriteheight and spritewidth are telling us what the size of the image is.
// new me.Rect is the rectangle the player can walk into
game.PlayerBaseEntity = me.Entity.extend({
	init: function(x, y, settings){
		this._super(me.Entity, 'init', [x, y, {
			image: "tower",
			width: 100,
			height: 100,
			spritewidth: "100",
			sprtiteheight: "100",
			getShape: function() {
				return (new me.Rect(0, 0, 100, 70)).toPolygon();
			}
		}]);
		this.broken = false;
		this.health = 10;
		this.alwaysUpdate = true;
		this.body.onCollision = this.onCollision.bind(this);

		this.type = "PlayerBase";

		//sets the towers to not be on fire from the start
		//also allows it to swtich to an on fire tower when attacked
		this.renderable.addAnimation("idle", [0]);
		this.renderable.addAnimation("broken", [1]);
		this.renderable.setCurrentAnimation("idle");
	},
	update:function(delta){
		if (this.health<=0) {
			//sets the tower to an on fire position
			this.broken = true;
			this.renderable.addAnimation("broken");

		}
		this.body.update(delta);
		this._super(me.Entity, "update", [delta]);
		return true;
	},
	onCollision: function(){

	}
});


game.EnemyBaseEntity = me.Entity.extend({
	init: function(x, y, settings){
		this._super(me.Entity, 'init', [x, y, {
			image: "tower",
			width: 100,
			height: 100,
			spritewidth: "100",
			sprtiteheight: "100",
			getShape: function() {
				return (new me.Rect(0, 0, 100, 70)).toPolygon();
			}
		}]);
		this.broken = false;
		this.health = 10;
		this.alwaysUpdate = true;
		this.body.onCollision = this.onCollision.bind(this);

		this.type = "EnemyBase";

		//sets the towers to not be on fire from the start
		//also allows it to swtich to an on fire tower when attacked
		this.renderable.addAnimation("idle", [0]);
		this.renderable.addAnimation("broken", [1]);
		this.renderable.setCurrentAnimation("idle");
	},
	update:function(delta){
		if (this.health<=0) {
			this.broken = true;
			//sets the tower to an on fire position 
			this.renderable.addAnimation("broken");
		}
		this.body.update(delta);
		this._super(me.Entity, "update", [delta]);
		return true;
	},
	onCollision: function(){
		
	}
});




game.PlayerEntity = me.Entity.extend({
	init: function(x, y, settings){
		this._super(me.Entity, 'init', [x, y, {
			image: "player",
			width: 64,
			height: 64,
			sprtiteheight: "64",
			spritewidth: "64",
			getShape: function() {
				return(new me.Rect(0, 0, 64, 64)).toPolygon();
			}
		}]);

		this.body.setVelocity(5, 20);
		//makes the screen follow the player on both axis x and y
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);	
		
		this.renderable.addAnimation("idle", [78]);
		this.renderable.addAnimation("walk",[117, 118, 119 ,120, 121, 122, 123 , 124 , 125], 80);
		this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
		this.renderable.setCurrentAnimation("idle");
	},

	update: function(delta){
		if (me.input.isKeyPressed("right")){
			//adds to the position of my x by the velocity defined above in
			//setVelocity() and multiplying it by me.timer.tick.
			//me.timer.tick makes the movement look smooth
			this.body.vel.x += this.body.accel.x * me.timer.tick;
			this.flipX(true);
		}
		//allows player to move left
		else if (me.input.isKeyPressed("left")){
				this.body.vel.x -= this.body.accel.x * me.timer.tick;
		//filp x allows the player to turn the oppisite side of the orc sprites.
				this.flipX(false);
			}else{
			this.body.vel.x = 0;
		}
		//allows the player to jump
		if(me.input.isKeyPressed("jump")){
			if(!this.body.jumping && !this.body.falling){
				this.body.jumping = true;
				this.body.vel.y -= this.body.accel.y * me.timer.tick;
			}
		}


		if (me.input.isKeyPressed("attack")){
			if (!this.renderable.isCurrentAnimation("attack")){
				//sets the current animation to attack and oce that
				//is over it goes back to the idle position.
				this.renderable.setCurrentAnimation("attack", "idle");
				//makes it so that the next time we start this sequence we begin
				//from the first animation, not wherever we left off when we
				//switched to another animation.
				this.renderable.setAnimationFrame();
			}
		}


		else if(this.body.vel.x !== 0){
			if (!this.renderable.isCurrentAnimation("walk")){
				 this.renderable.setCurrentAnimation("walk");
}			//sets player to idle or zero when not moving
			}else{
				this.renderable.setCurrentAnimation("idle");
			}
		
		this.body.update(delta);
		//it is updating the code so the animations run smooth
		this._super(me.Entity, "update", [delta]);
		return true;
	}

});