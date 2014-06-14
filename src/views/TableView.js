define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var HandView      = require('views/HandView');
    var CakeView      = require('views/CakeView');

    function TableView() {
        View.apply(this, arguments);

        _setUpTable.call(this);
        _setUpHands.call(this);
        _addTheCake.call(this);
    }

    TableView.prototype = Object.create(View.prototype);
    TableView.prototype.constructor = TableView;

    TableView.DEFAULT_OPTIONS = {

    };

    // simple function to add the table (bg texture)
    function _setUpTable(){
        tableSurface = new Surface({
            size:[undefined, undefined],
            properties: {
                background:'url(img/wood.jpg) 0 0 repeat'
            }
        });

        tableModifier = new StateModifier({
            origin:[1, 1]
        });

        this.add(tableModifier).add(tableSurface);
    }

    // This function is called once to add the hands to the table
    function _setUpHands(){

        this.handModifiers = [];
        this.handProperties = [];
        this.hands = [];

        var factor = window.outerWidth / 2.5;

        // create a grid for where to put the hands on the screen
        this.handLocations = [
            [-factor, window.outerHeight],
            [-factor + window.outerWidth / 4, window.outerHeight],
            [-factor + (window.outerWidth / 4) * 2, window.outerHeight],
            [-factor +(window.outerWidth / 4) * 3, window.outerHeight],
            [-factor, -window.outerHeight],
            [-factor + window.outerWidth / 4, -window.outerHeight],
            [-factor + (window.outerWidth / 4) * 2, -window.outerHeight],
            [-factor + (window.outerWidth / 4) * 3, -window.outerHeight]
        ];

        // create another grid for the hand rotations
        handRotations = [
            [0.8],
            [0.3],
            [-0.3],
            [-0.8],
            [2.5],
            [2.9],
            [-2.9],
            [-2.5]
        ];

        // add all of the hands to the table
        for(var i = 0; i < 8; i ++){

            var hand = new HandView();

            var handModifier = new StateModifier({
                transform: Transform.translate(this.handLocations[i][0], this.handLocations[i][1], 0)
            });
            var rotationModifier = new StateModifier({
                transform: Transform.rotateZ(handRotations[i])
            });
        
            // add the hand modifiers to an accessable array as later we will transform them
            this.handModifiers.push(handModifier);
            this.handProperties.push(hand.handToUse);
            this.hands.push(hand);

            // when the hand outputs a clickHand event
            hand.on('clickHand', function(handclicked) {

                // first find the index of the hand that was clicked
                var index = this.hands.indexOf(handclicked);

                // move the hand back to where it came from
                this.handModifiers[index].halt();
                this.handModifiers[index].setTransform(
                    Transform.translate(this.handLocations[index][0], this.handLocations[index][1], 0), 
                    { curve: hand.handToUse.aniamtion, duration: 200 } 
                );
                // stopped the hand in time so clear the hand to cake timeout
                clearTimeout(cakeTimeouts[index]);
            }.bind(this, hand));

            this.add(handModifier).add(rotationModifier).add(hand);
        }
    }

    // this function is called to add one instance of the cake view to the table
    function _addTheCake(){
        this.cake = new CakeView();
        var cakeModifier = new StateModifier({
            origin: [0.5, 0.5]
        });

        this.add(cakeModifier).add(this.cake);
    }

    module.exports = TableView;
});
