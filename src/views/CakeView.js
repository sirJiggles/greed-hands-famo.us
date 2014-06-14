define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ImageSurface  = require('famous/surfaces/ImageSurface');

    function CakeView() {
        View.apply(this, arguments);

        _createCake.call(this);
    }

    CakeView.prototype = Object.create(View.prototype);
    CakeView.prototype.constructor = CakeView;

    CakeView.DEFAULT_OPTIONS = {};

    // function to create the cake surface image
    function _createCake(){

        var cake = new ImageSurface({
            size: [50, 50],
            content: 'img/cupcake.png'
        });

        this.add(cake);
    }

    module.exports = CakeView;
});
