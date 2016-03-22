chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('awindow.html', {
    'outerBounds': {
      'width': 400,
      'height': 500
    }
  });
});