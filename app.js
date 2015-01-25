var canvas = document.getElementById('canvas')
	,context = canvas.getContext('2d')
	,download = document.getElementById('download')
	,upload = document.getElementById('upload')
	,scale = document.getElementById('image-scale')
	,textElem = document.getElementById('text')
	,text = textElem.value
	,name = document.getElementById('name')
	,twitter = document.getElementById('twitter')
	,textFields = document.getElementsByClassName('textfield')
	,quote = document.getElementById('quote')
	,overlay = document.getElementById('overlay')
	,checkboxes = document.getElementsByClassName('checkbox')
	,textColor = '#FFF'
	,hammertime = new Hammer(canvas)

var bg = {
	img: new Image()
	,x: 0
	,y: 0
	,startX: 0
	,startY: 0
	,multiplier: 1
}

bg.img.src = './scrn.png'

var logo = {
	img: new Image()
	,h: 50
	,w: 268.5
}
logo.img.src = './LSLogo.png'

var drawToCanvas = function(){
	if (scale.value == 1) {
		bg.multiplier = Math.max(canvas.width/bg.img.width, canvas.height/bg.img.height)
		scale.value = bg.multiplier
	} else {
		bg.multiplier = scale.value
	}

	bg.w = bg.img.width*bg.multiplier
	bg.h = bg.img.height*bg.multiplier

	context.clearRect (0, 0, canvas.width, canvas.height)
	context.drawImage(bg.img, bg.x, bg.y, bg.w, bg.h)

	// Overlay
	if (overlay.checked) {
		context.fillStyle = "rgba(0,0,0,0.5)"
		context.fillRect(0,0,canvas.width,canvas.height)
	}

	// Logo
	var logoOffsetH = canvas.height - logo.h - 25
		,logoOffsetW = canvas.width - logo.w - 25
	context.drawImage(logo.img, logoOffsetW, logoOffsetH, logo.w, logo.h)

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
	context.fillText(name.value, 103, 235)

	// Twitter
	context.fillStyle = "#d2232a"
	context.font = "bold 18px Helvetica"
	context.fillText('@'+twitter.value, 103, 258)

	download.href = canvas.toDataURL('image/png')
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
			bg.img.src = e.target.result
			scale.value = 1
			bg.x = 0
			bg.y = 0
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

scale.addEventListener('change', drawToCanvas)
upload.addEventListener('dragover', fileDraggedOver, false)
upload.addEventListener('drop', fileDropped, false)
upload.addEventListener('dragleave', fileDragLeave, false)

hammertime.on('panstart', function(ev) {
	bg.startX = bg.x
	bg.startY = bg.y
})

hammertime.on('pan', function(ev) {
    bg.x = ev.deltaX + bg.startX
    bg.y = ev.deltaY + bg.startY
    drawToCanvas()
})

drawToCanvas()
