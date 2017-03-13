var LIKES1 = 0;
var LIKES2 = 0;
var LIKES3 = 0;

var increaseLikeCount = function(likeElement, count) {
    likeElement.innerHTML = count;
}

document.onreadystatechange = function() {
    var container = document.getElementById('news-container');
    
    var firstLikeButton = document.getElementById('like-button-1');
    firstLikeButton.style.display = "inline";

    var secondLikeButton = document.getElementById('like-button-2');
    secondLikeButton.style.display = "inline";

    var thirdLikeButton = document.getElementById('like-button-3');
    thirdLikeButton.style.display = "inline";

    firstLikeButton.onclick = function(event) {
        increaseLikeCount(document.getElementById('like-count-1'), ++LIKES1);
    }
    secondLikeButton.onclick = function(event) {
        increaseLikeCount(document.getElementById('like-count-2'), ++LIKES2);
    }
    thirdLikeButton.onclick = function(event) {
        increaseLikeCount(document.getElementById('like-count-3'), ++LIKES3);
    }
}