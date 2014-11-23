$(document).ready(function() {
  // SETUP
  var PS1 = '> ';
  var buffer = PS1;
  var terminal = $('#terminal');
  var lineHeight = parseInt(terminal.css('line-height'), 10);

  terminal.on('input', function() {
    var newBuffer = terminal.val();
    if(newBuffer.indexOf(buffer) !== 0){
      terminal.val(buffer);
      return;
    }
    var lastChar = newBuffer.slice(-1);
    if(lastChar === '\n'){
      var command = newBuffer.slice(buffer.length, -1).trim();
      if (command) {
        var output = processCommand(command);
        buffer = newBuffer + output + PS1;
      } else {
        buffer = newBuffer + PS1;
      }
      terminal.val(buffer);
    }
  });

  terminal.keydown(function(e){
    if(e.ctrlKey && e.keyCode == 76){
      clearScreen();
    }
  });

  var availableCommands = ['clear', 'help', 'projects', 'resume'];

  function processCommand(command) {
    var regex = /(".*"|'.*'|[^\s]+)+/g;
    var args = command.match(regex);
    var program = args.shift();
    switch(program) {
      case 'clear':
        clearScreen();
        return '';
      case 'help':
        return 'Welcome to Ben Shell.\nHeres a list of available commands:\n'
          + availableCommands.join('\n') + '\n';
      case 'projects':
        return 'List of projects go here.'
      case 'sudo':
        return 'Nice try.\n';
      default:
        return 'bensh: command not found: ' + command + '\n';
    }
  }

  function clearScreen(){
    terminal.scrollTop(Infinity);
  }

  function setPadding(){
    var fineTuning = 3;
    var padding = terminal.outerHeight() - lineHeight - fineTuning;
    terminal.css('padding-bottom', padding);
  }
  setPadding();
  $(window).resize(setPadding);

  terminal.val(buffer);
  terminal.focus();

});
