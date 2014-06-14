define(function(require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ImageSurface  = require('famous/surfaces/ImageSurface');

    function EndView() {
        View.apply(this, arguments);

        _layoutView.call(this);
        _setUpEvents.call(this);
    }

    function _layoutView(){
        // create image bg and position it
        var boomSurface = new ImageSurface({
            content: 'img/boom.png'
        });
        var boomSurfaceModifier = new StateModifier({
            origin: [0.5, 0.5],
            size: [256, 256],
            transform: Transform.translate(0,0,1)
        })
        this.add(boomSurfaceModifier).add(boomSurface);

        // cerate the replay link and position it
        this.replaySurface = new ImageSurface({
            content: 'img/replay.png',
            properties: {
                cursor: 'pointer'
            }
        });
        var replaySurfaceModifier = new StateModifier({
            origin:[0.65, 0.7],
            size: [44, 44],
            transform: Transform.translate(0,0,2)
        })
        this.add(replaySurfaceModifier).add(this.replaySurface);

        // create the final score display
        this.scoreSurface = new Surface({
            content :'',
            properties: {
                color: 'black',
                fontFamily: 'Arial',
                fontSize: '20px',
                fontWeight: '700',
                textAlign: 'center'
            }
        });

        var scoreModifier = new StateModifier({
            size: [130, 40],
            origin: [0.5, 0.5],
            transform: Transform.translate(0, 0, 3)
        });

        this.add(scoreModifier).add(this.scoreSurface);

    }

    function _setUpEvents(){
        // emit the click on the replay icon
        this.replaySurface.on('touchstart', function() {
            this._eventOutput.emit('clickReplay');
        }.bind(this));
    }

    EndView.prototype = Object.create(View.prototype);
    EndView.prototype.constructor = EndView;

    EndView.DEFAULT_OPTIONS = {};

    module.exports = EndView;
});
