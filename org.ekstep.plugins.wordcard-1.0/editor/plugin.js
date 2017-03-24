/**
 *
 * Simple plugin to create wordcards
 * @class wordcard
 * @extends EkstepEditor.basePlugin
 *
 * @author Daipayan Roy<roy.d@goodworklabs.com>
 *
 */
EkstepEditor.WordcardPlugin = EkstepEditor.basePlugin.extend({
    type: "org.ekstep.plugins.wordcard",
    imageId: "",
    audioId: "",
    wordInfo: {},

    initialize: function() {
        EkstepEditorAPI.addEventListener("org.ekstep.plugins.wordcard:showpopup", this.loadHtml, this);
        setTimeout(function() {
            var templatePath = "https://localhost:8081" + '/org.ekstep.plugins.wordcard-1.0/editor/wordcardeditorconfig.html';
            var controllerPath = "https://localhost:8081" + '/org.ekstep.plugins.wordcard-1.0/editor/wordcardeditorapp.js';
            EkstepEditorAPI.getService(ServiceConstants.POPUP_SERVICE).loadNgModules(templatePath, controllerPath);

        }, 1000);

    },
    /**
     * New instance of wordcard. Process the word data and display everything as individual elements on the stage.
     * @returns {void}
     */
    newInstance: function() {
        delete this.configManifest;
        var wordInfo = {};
        // var audioId = "";
        var instance = this;
        //don't need a parent
        // this.parent = undefined;
        var wordData = this.data;
        var wordCardConfig = this.config;
        var wordInfoNew = new EkstepEditor.WordcardPluginWord(wordData);

        wordInfo.name = wordInfoNew.getName(); //Name
        var textPropeties = {
            "x": 10,
            "y": 40,
            "w": 45,
            "fontSize": 25
        };
        this.addText(wordInfo.name, textPropeties);
        if (wordCardConfig.meaning) {
            wordInfo.meaning = wordInfoNew.getMeaning(); //Meaning
            var textPropeties = {
                "x": 10,
                "y": 50,
                "w": 35,
                "fontSize": 20
            };
            this.addText(wordInfo.meaning, textPropeties);
        }

        if (wordCardConfig.picture) {
            wordInfo.image = wordInfoNew.getPicture(); ////Image
            var imagePropeties = {
                "x": 54,
                "y": 8,
                "w": 22,
                "h": 38,
                "stretch": false
            };
            this.addImage(wordInfo.image, imagePropeties);
        }

        wordInfo.audio = wordInfoNew.getAudio(); //Audio

        //Example sentences
        if (wordInfo.exampleSentences != undefined) {
            if (wordInfo.exampleSentences.length < 2) {
                wordInfo.exampleSentences[1] = "Example not available.Click to add";
            }
        } else if (wordInfo.exampleSentences == undefined) {
            wordInfo.exampleSentences = [];
            wordInfo.exampleSentences[0] = "Example not available.Click to add.";
            wordInfo.exampleSentences[1] = "Example not available.Click to add.";
        }


        instance.displayReceivedData(wordInfo);

    },
    /**
     *  Show browser to search for words.
     *  @param {object} parentInstance Parent class for this plugin
     *  @param {object} attrs Attributes of this plugin
     *  @returns {Class} instace or attrs
     */
    loadHtml: function(parentInstance, attrs) {
        var instance = this;
        console.log("THIS IS PARENT : ", parentInstance);
        console.log("THIS IS attrs : ", attrs);
        EkstepEditorAPI.getService(ServiceConstants.POPUP_SERVICE).open({
            template: 'wordcard',
            controller: 'wordcardEditorController',
            controllerAs: '$ctrl',
            resolve: {
                'instance': function() {
                    //console.log("THIS IS THE VALUE OF INSTANCE : ", instance);
                    return instance;
                },
                'attrs': function() {
                    // console.log("THIS IS THE VALUE OF attrs : ", attrs);
                    return attrs;
                }
            },
            width: 900,
            showClose: false,
        });


    },

    /**
     *   Function to build the data and invoke Text and Image plugins to put the word data on stage
     *   @param {object} wordDetails Object containg info about a word
     *   @returns {void}
     */
    addText: function(wordText, textProps) {
        var textConfig = {
            "__text": wordText,
            "x": textProps.x,
            "y": textProps.y,
            "fontFamily": "Verdana",
            "fontSize": textProps.fontSize,
            "minWidth": 20,
            "w": textProps.w,
            "maxWidth": 500,
            "fill": "#000000",
            "fontStyle": "normal",
            "fontWeight": "normal",
            "stroke": "rgba(255, 255, 255, 0)",
            "strokeWidth": 1,
            "opacity": 1,
            "editable": false,
        };
        var textprops = this.convertToFabric(textConfig);
        EkstepEditorAPI.instantiatePlugin('org.ekstep.text', textprops, EkstepEditorAPI.getCurrentStage());

    },

    addImage: function(imageObject, imageProps) {
        var imageConfig = {
            "x": 54,
            "y": 8,
            "h": 38,
            "stretch": false,
            "asset": imageObject.imageId,
            "assetMedia": {
                "id": imageObject.imageId,
                "assetId": imageObject.imageId,
                "src": imageObject.src,
                "type": "image"
            }
        };
        var imageprops = this.convertToFabric(imageConfig);
        EkstepEditorAPI.instantiatePlugin('org.ekstep.image', imageprops, EkstepEditorAPI.getCurrentStage());

    },

    displayReceivedData: function(wordDetails) {
        //Example sentences
        var exampleOneConfig = {
            "__text": "Example1: " + '\n' + wordDetails.exampleSentences[0] + '\n' + '\n' + "Example2: " + '\n' + wordDetails.exampleSentences[1],
            "x": 50,
            "y": 55,
            "fontFamily": "Verdana",
            "fontSize": 18,
            "minWidth": 20,
            "w": 40,
            "maxWidth": 500,
            "fill": "#000000",
            "fontStyle": "normal",
            "fontWeight": "normal",
            "stroke": "rgba(255, 255, 255, 0)",
            "strokeWidth": 1,
            "opacity": 1,
            "editable": false,
        };


        if (wordDetails.audio != undefined) {
            var audioConfig = { //audio. To be executed only if audio is available.
                "x": 54,
                "y": 10,
                "w": 30,
                "h": 30,
                "autoplay": true,
                "asset": wordDetails.audio.audioId,
                "assetMedia": {
                    "id": wordDetails.audio.audioId,
                    "src": wordDetails.audio.src,
                    "type": "audio"
                }
            };

            var audioprops = this.convertToFabric(audioConfig);
            console.log("THIS IS AUDIO PROPS : ", audioprops);

            EkstepEditorAPI.instantiatePlugin("org.ekstep.audio", audioprops, EkstepEditorAPI.getCurrentStage());
            EkstepEditorAPI.dispatchEvent('org.ekstep.config:toggleStageEvent', { 'flag': audioprops.autoplay, 'id': wordDetails.audio.audioId });

        }
        var exampleoneprops = this.convertToFabric(exampleOneConfig);


        /*Instantiate plugins*/
        EkstepEditorAPI.instantiatePlugin('org.ekstep.text', exampleoneprops, EkstepEditorAPI.getCurrentStage());
    },

    /**
     *
     *   get config data plugin instance
     *   @returns {Object}
     *   config object
     *   @memberof wordcard
     */
    getConfig: function() {
        var config = this._super();

        return config;
    },
    getConfigManifest: function() {
        console.log("THis is getconfig maifest method");
    }



});
//# sourceURL=wordcard.js
