window.onload = function() {
	var canvas = document.getElementById('canvas')
		,context = canvas.getContext('2d')
		,download = document.getElementById('download')
		,textElem = document.getElementById('text')
		,nameElem = document.getElementById('name')
		,twitterElem = document.getElementById('twitter')
		,textFields = [textElem, nameElem, twitterElem]
		,quote = document.getElementById('quote')
		,overlay = document.getElementById('overlay')
		,checkboxes = [quote, overlay]
		,text = textElem.value
		,name = nameElem.value
		,twitterHandle = twitterElem.value
		,textColor = '#FFF'
		,img


	var backgroundImg = new Image();
	backgroundImg.src = './feature.jpg';
	// backgroundImg.src = './card.png';

	var LSLogo = new Image();
	LSLogo.src = './LSLogo.png';

	var drawToCanvas = function(){
		context.drawImage(backgroundImg, 0, 0);

		// Overlay
		if (overlay.checked) {
			context.fillStyle = "rgba(0,0,0,0.5)";
			context.fillRect(0,0,canvas.width,canvas.height)
		}

		// Logo
		var logoH = 200/4
			,logoW = 1075/4
			,logoOffsetH = canvas.height - logoH - 25
			,logoOffsetW = canvas.width - logoW - 25
		context.drawImage(LSLogo, logoOffsetW, logoOffsetH, logoW, logoH);

		context.fillStyle = textColor

		// Quote marks
		if (quote.checked) {
			text = textElem.value + ' ”'
			context.font = "150px Droid Serif";
			context.fillText('“', 25, 150)
		} else {
			text = textElem.value
		}

		// Main text
		context.font = "26px Droid Serif";
		wrapText(context, text, 103, 98, 400, 33);


		// Name
		context.font = "bold 24px Helvetica";
		context.fillText(nameElem.value, 103, 235)

		// Twitter
		context.fillStyle = "#d2232a";
		context.font = "bold 18px Helvetica";
		context.fillText('@'+twitterElem.value, 103, 258)


		img = canvas.toDataURL('image/png');
		download.href = img
	}

	for (var i = 0; i < textFields.length; i++) {
		textFields[i].addEventListener('keyup', drawToCanvas)
	}
	for (var i = 0; i < checkboxes.length; i++) {
		checkboxes[i].addEventListener('change', drawToCanvas)
	}
	backgroundImg.onload = drawToCanvas

	// Google font loading
	this.setTimeout(drawToCanvas, 200)
}

// From http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
var wrapText = function(context, text, x, y, maxWidth, lineHeight) {
	var words = text.split(' ')
		,line = ''

	for(var n = 0; n < words.length; n++) {
		var testLine = line + words[n] + ' '
			,metrics = context.measureText(testLine)
			,testWidth = metrics.width
		if (testWidth > maxWidth && n > 0) {
			context.fillText(line, x, y)
			line = words[n] + ' '
			y += lineHeight
		}
		else {
			line = testLine
		}
	}
	context.fillText(line, x, y)
	// Check last character isn't a quote
	// return bottom bound?
}


