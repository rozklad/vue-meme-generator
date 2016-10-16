/**
 * @credits http://stackoverflow.com/questions/5026961/html5-canvas-ctx-filltext-wont-do-line-breaks
 *
 * @param text
 * @param x
 * @param y
 * @param maxWidth
 * @param lineHeight
 */
CanvasRenderingContext2D.prototype.wrapFillText = function (text, x, y, maxWidth, lineHeight) {

  var lines = text.split("\n");

  for (var i = 0; i < lines.length; i++) {

    var words = lines[i].split(' ');
    var line = '';

    for (var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = this.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        this.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      }
      else {
        line = testLine;
      }
    }

    this.fillText(line, x, y);
    y += lineHeight;
  }
}

/**
 * @credits http://stackoverflow.com/questions/5026961/html5-canvas-ctx-filltext-wont-do-line-breaks
 *
 * @param text
 * @param x
 * @param y
 * @param maxWidth
 * @param lineHeight
 */
CanvasRenderingContext2D.prototype.wrapStrokeText = function (text, x, y, maxWidth, lineHeight) {

  var lines = text.split("\n");

  for (var i = 0; i < lines.length; i++) {

    var words = lines[i].split(' ');
    var line = '';

    for (var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = this.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        this.strokeText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      }
      else {
        line = testLine;
      }
    }

    this.strokeText(line, x, y);
    y += lineHeight;
  }
}

new Vue({
  el: '#meme',
  data: {
    canvasElementId: 'canvas',
    width: 600,
    height: 400,
    image: '',
    presets: [
        'assets/meme1.jpg',
        'assets/meme2.jpg'
    ],
    text: '',
    textMaxWidth: 250,
    textStrokeStyle: '#000000',
    textFillStyle: '#FFFFFF',
    textLineWidth: 2,
    textPosition: {
      x: 20,
      y: 60
    },
    textFont: '48px "Impact", sans-serif',
    textLineHeight: 60
  },
  methods: {

    onFileChange: function(event) {
      var files = event.target.files || event.dataTransfer.files;

      if (!files.length)
        return;

      this.createImage(files[0]);
    },

    onTextChange: function(event) {

      this.repaint();

    },

    createImage: function(file) {
      var image = new Image();
      var reader = new FileReader();
      var vm = this;

      reader.onload = function(event) {
        vm.image = event.target.result;
        vm.repaint();
      };

      reader.readAsDataURL(file);
    },

    setImage: function(url) {

      this.image = url;

      this.repaint();

    },

    setImageToCanvas: function(url, callback) {

      var ctx = this.getContext();
      var background = new Image();
      background.src = url;
      background.onload = function() {
        ctx.drawImage(background, 0, 0);
        if ( typeof callback == 'function' ) {
          callback();
        }
      };
    },

    setTextToCanvas: function(text) {

      var context = this.getContext();
      context.font = this.textFont;
      context.fillStyle = this.textFillStyle;
      context.wrapFillText(text, this.textPosition.x, this.textPosition.y, this.textMaxWidth, this.textLineHeight);
      context.strokeStyle = this.textStrokeStyle;
      context.lineWidth = this.textLineWidth;
      context.wrapStrokeText(text, this.textPosition.x, this.textPosition.y, this.textMaxWidth, this.textLineHeight);

    },

    getContext: function() {

      return document.getElementById(this.canvasElementId).getContext("2d");

    },

    repaint: function() {

      var vm = this;

      if ( this.image == '' )
        this.setTextToCanvas(this.text);

      this.setImageToCanvas(this.image, function(){
        vm.setTextToCanvas(vm.text);
      });

    },

    reset: function (event) {
      this.image = '';
      this.text = '';
      this.width = 600;
      this.height = 450;
      this.textStrokeStyle = '#000000';
      this.textFillStyle = '#FFFFFF';
      this.repaint();
      this.getContext().clearRect(0, 0, this.width, this.height);
    },

    download: function(event) {

      var dt = document.getElementById(this.canvasElementId).toDataURL('image/png');

      /* Change MIME type to trick the browser to download the file instead of displaying it */
      dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');

      /* In addition to <a>'s "download" attribute, you can define HTTP-style headers */
      dt = dt.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Meme.png');

      document.getElementById('download').href = dt;
    }
  }
})
