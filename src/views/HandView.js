define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ImageSurface  = require('famous/surfaces/ImageSurface');

    function HandView() {
        View.apply(this, arguments);

        _init.call(this);
        _setUp.call(this);
    }

    HandView.prototype = Object.create(View.prototype);
    HandView.prototype.constructor = HandView;

    HandView.DEFAULT_OPTIONS = {
        width: 128,
        height: 291
    };

    function _init(){
        // set up the possible hands that we might use for this instance of a hand
        this.possibleHands = [
            {
                file: 'lady.png',
                speed: 2000,
                aniamtion: 'linear'
            },
            {
                file: 'man.png',
                speed: 2000,
                aniamtion: 'linear'
            },
            {
                file: 'muscle-man.png',
                speed: 2500,
                aniamtion: 'linear'
            },
            {
                file: 'old-lady.png',
                speed: 3000,
                aniamtion: 'linear'
            }
        ];
    }

    function _setUp(){
        // pick a random hand (we need to add it to an array for external use so use this)
        this.handToUse = this.possibleHands[Math.floor(Math.random()*this.possibleHands.length)];

        // set up the image
        var hand = new ImageSurface({
            content: 'img/'+this.handToUse.file
        });

        // set the origin to the center so when we rotate, we rotate arround the middle
        var handModifier = new StateModifier({
            size:[this.options.width, this.options.height],
            origin: [0.5, 0.5]
        });

        // when the user clicks the hand output and event emmiter
        hand.on('touchstart', function() {
            this._eventOutput.emit('clickHand');
        }.bind(this));


        this.add(handModifier).add(hand);
    }

    module.exports = HandView;
});
