var canvas = document.getElementById('canvas')
	,context = canvas.getContext('2d')
	,download = document.getElementById('download')
	,uploadElem = document.getElementById('upload')
	,textElem = document.getElementById('text')
	,nameElem = document.getElementById('name')
	,twitterElem = document.getElementById('twitter')
	,textFields = document.getElementsByClassName('textfield')
	,quote = document.getElementById('quote')
	,overlay = document.getElementById('overlay')
	,checkboxes = document.getElementsByClassName('checkbox')
	,text = textElem.value
	,name = nameElem.value
	,twitterHandle = twitterElem.value
	,textColor = '#FFF'
	,canvasW = canvas.width
	,canvasH = canvas.height
	,img

var backgroundImg = new Image()

var LSLogo = new Image()
LSLogo.src = './LSLogo.png'

var drawToCanvas = function(){
	var bW = backgroundImg.width
		,bH = backgroundImg.height
		,shortest = Math.max(canvasW/bW, canvasH/bH)

	context.clearRect (0, 0, canvasW, canvasH)
	context.drawImage(backgroundImg, 0, 0, bW*shortest, bH*shortest)

	// Overlay
	if (overlay.checked) {
		context.fillStyle = "rgba(0,0,0,0.5)"
		context.fillRect(0,0,canvasW,canvasH)
	}

	// Logo
	var logoH = 200/4
		,logoW = 1075/4
		,logoOffsetH = canvasH - logoH - 25
		,logoOffsetW = canvasW - logoW - 25
	context.drawImage(LSLogo, logoOffsetW, logoOffsetH, logoW, logoH)

	context.fillStyle = textColor

	// Quote marks
	if (quote.checked) {
		text = textElem.value + ' ”'
		context.font = "150px Droid Serif"
		context.fillText('“', 25, 150)
	} else {
		text = textElem.value
	}

	// Main text
	context.font = "26px Droid Serif"
	wrapText(context, text, 103, 98, 400, 33)


	// Name
	context.font = "bold 24px Helvetica"
	context.fillText(nameElem.value, 103, 235)

	// Twitter
	context.fillStyle = "#d2232a"
	context.font = "bold 18px Helvetica"
	context.fillText('@'+twitterElem.value, 103, 258)

	img = canvas.toDataURL('image/png')
	download.href = img
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


var fileDraggedOver = function(e) {
	e.stopPropagation()
	e.preventDefault()
	e.dataTransfer.dropEffect = 'copy'
	upload.classList.add('upload--active')
}

var fileDragLeave = function(e) {
	upload.classList.remove('upload--active')
}

var fileDropped = function(e) {
	e.stopPropagation()
	e.preventDefault()

	var files = e.dataTransfer.files
		,f = files[0]
		,reader = new FileReader()

	reader.onload = (function(theFile) {
		return function(e) {
			backgroundImg.src = e.target.result
			drawToCanvas()
		}
	})(f)
	reader.readAsDataURL(f)

	upload.classList.remove('upload--active')
}

for (var i = 0; i < textFields.length; i++) {
	textFields[i].addEventListener('keyup', drawToCanvas)
}
for (var i = 0; i < checkboxes.length; i++) {
	checkboxes[i].addEventListener('change', drawToCanvas)
}

uploadElem.addEventListener('dragover', fileDraggedOver, false)
uploadElem.addEventListener('drop', fileDropped, false)
uploadElem.addEventListener('dragleave', fileDragLeave, false)

// Google font loading
this.setTimeout(drawToCanvas, 200)
