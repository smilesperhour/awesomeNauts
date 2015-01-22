game.PlayerEntinty.extend({
	init: function(x, y, settings){
		this_super(me.Entity, 'init', [x, y, {
			image: "player",
			width: 64,
			height: 64, 
		}]);
	},

});