game.MiniMap = me.Entity.extend({//launches and shows the minimap on the website
	init: function(x, y, settings) {
		this._super(me.Entity, 'init', [x, y, {
			image: "minimap",
			width: 715,
			height: 127,
			spritewidth: "715",
			spriteheight: "127",
			getShape: function(){
				return (new me.Rect(0, 0, 715, 127)).toPolygon();
			}
			}]);
			this.floating = true;

	}
});