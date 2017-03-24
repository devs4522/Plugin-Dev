EkstepEditor.WordcardPluginWord = function(wordDetails) {
    this.details = wordDetails;
}
EkstepEditor.WordcardPluginWord.prototype.getMeaning = function() {
    return this.details.meaning == undefined ? "Meaning not available.Click to add." : this.details.meaning;
}
EkstepEditor.WordcardPluginWord.prototype.getAudio = function() {
    var audio;
    if (this.details.pronunciations.length > 0) {
        audio = {};
        var tempAudURL = this.details.pronunciations[0].split("/");
        audio.audioId = tempAudURL[tempAudURL.length - 1];
        audio.src = this.details.pronunciations[0];
    }
    return audio;
}

EkstepEditor.WordcardPluginWord.prototype.getName = function() {
    return this.details.lemma;

}

EkstepEditor.WordcardPluginWord.prototype.getPicture = function() {
    var picture = {},
        tempURL;
    if (this.details.pictures && this.details.pictures.length > 0) {
        tempURL = this.details.pictures[0].split("/");
        picture.imageId = tempURL[tempURL.length - 1];
        picture.src = this.details.pictures[0];
    } else {
        picture.src = EkstepEditor.config.absURL + instance.relativeURL("assets/noimageavailable.png");
        tempURL = picture.src.split("/");
        picture.imageId = tempURL[tempURL.length - 1];
    }
    return picture;

}

// this.getExamples = function() {

// }

//# sourceURL=word.js
