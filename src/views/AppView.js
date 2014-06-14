define(function(require, exports, module) {
    var View          = require('famous/core/View');
    var Surface       = require('famous/core/Surface');
    var Transform     = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var EventHandler  = require('famous/core/EventHandler');
    var TableView     = require('views/TableView');
    var EndView       = require('views/EndView');
    var Lightbox      = require('famous/views/Lightbox');


    function AppView() {
        View.apply(this, arguments);

        _setUpTable.call(this);
        _startTheScore.call(this);
        _startTheGame.call(this);

    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {
        handChooseSpeed: 700,
        timeToGetToCake: 1.3, //(whole seconds)
        lightboxOpts: {
            inOpacity: 1,
            outOpacity: 0,
            inOrigin: [0, 0],
            outOrigin: [0, 0],
            showOrigin: [0, 0],
            inTransform: Transform.scale(0.3, 0.3, 1),
            outTransform: Transform.scale(0, 0, 0),
            inTransition: { duration: 150, curve: 'easeIn' },
            outTransition: { duration: 100, curve: 'easeOut' }
        }
    };

    function _setUpTable(){

        this.tableView = new TableView();
        this.add(this.tableView);

        this.lightbox = new Lightbox(this.options.lightboxOpts);
        this.add(this.lightbox);
    }

    // this is the main wrapper for starting the game ticker 
    function _startTheGame(){

        // some vars used for keeping track of the current hand working on
        this.currentHand = null;
        this.currentHandProps = null;
        this.gameTicker = null;

        // flag to know if to still run the game
        this.gameStillRunning = true;

        // start the ticker baby
        this.tick.call(this);
    }

    function _startTheScore(){
        this.gameScore = 0;
        this.scoreTimer = null;

        this.scoreSurface = new Surface({
            content: 'Score: 0',
            properties: {
                fontSize: '20px',
                color: 'black',
                fontFamily: 'Arial'
            }
        });

        var scoreModifier = new StateModifier({
            size:[300, 20],
            origin: [0.05, 0.05]
        })

        this.add(scoreModifier).add(this.scoreSurface);

        this.scoreTimer = window.setInterval(function(){
            this.gameScore += 10;
            this.scoreSurface.setContent('Score: '+this.gameScore);
        }.bind(this), 100);
    }

    // tick function calls iteself and makes the time in between calls a little less each time
    AppView.prototype.tick = function(){

        this.getRandomHand();
        this.moveHandTowadsTarget();
        this.options.handChooseSpeed -= 3;

        if (this.gameStillRunning){
            this.gameTicker = window.setTimeout(this.tick.bind(this), this.options.handChooseSpeed);
        }
    }

    //restart the game function
    AppView.prototype.restart = function(){

        // reset the hands
        for (var i = 0; i < this.tableView.hands.length; i ++){
            this.tableView.handModifiers[i].setTransform(
                Transform.translate(this.tableView.handLocations[i][0], this.tableView.handLocations[i][1], 0)
            );
        };
        _startTheScore.call(this);
        _startTheGame.call(this);
    };

    // utils function to get a random hand (to move) then set it as active
    AppView.prototype.getRandomHand = function(){
        var hand = this.tableView.handModifiers[Math.floor(Math.random()*this.tableView.handModifiers.length)];
        
        if(hand !== this.currentHand){
            var indexChosen = this.tableView.handModifiers.indexOf(hand);
            this.currentHandProps = this.tableView.handProperties[indexChosen];
            this.currentHand = hand;

            // as we know how fast the hand is we can work out how long it will take to get to the cake,
            // if we get there before the hand is clicked then the cake is got (each hand has its own cake cakedown!)
            cakeTimeouts[indexChosen] = window.setTimeout(this.gotTheCake.bind(this), this.currentHandProps.speed / this.options.timeToGetToCake);
            return true;
        }else{
            this.getRandomHand();
        }
    }

    // move the hand towards the cake (using the props for the hand for the transition animation)
    AppView.prototype.moveHandTowadsTarget = function(){
        // move the hand using the speed and animation settings in the hand view
        this.currentHand.setTransform(Transform.translate(0,0,1), { curve: this.currentHandProps.aniamtion, duration: this.currentHandProps.speed } );
    }

    // function for when got to the cake
    AppView.prototype.gotTheCake = function(){
        this.gameStillRunning = false;
        // stop all of the hands
        for(var i = 0; i < this.tableView.handModifiers.length; i ++){
            this.tableView.handModifiers[i].halt();
            window.clearTimeout(cakeTimeouts[i]);
        }
        // clear all the hand timeouts
        cakeTimeouts = [];
        //clear the hand picker timeout
        window.clearTimeout(this.gameTicker);

        // stop the score
        window.clearInterval(this.scoreTimer);

        // reset the game speed
        this.options.handChooseSpeed = 700;

        this.scoreSurface.setContent('');

        // show the end score screen
        var endView = new EndView();
        this.lightbox.show(endView, function() {
            endView.scoreSurface.setContent('Final Score: '+this.gameScore);
            // reset the game score
            this.gameScore = 0;

        }.bind(this));

        endView.on('clickReplay', function(){
            endView.scoreSurface.setContent('');
            this.lightbox.hide(endView);
            this.restart();
        }.bind(this, endView));
    }



    module.exports = AppView;
});
