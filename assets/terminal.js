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
      case 'welcome':
        var welcome_str = "" +
"Yb        dP       8\n" +
" Yb  db  dP  .d88b 8 .d8b .d8b. 8d8b.d8b. .d88b\n" +
"  YbdPYbdP   8.dP' 8 8    8' .8 8P Y8P Y8 8.dP'\n" +
"   YP  YP    `Y88P 8 `Y8P `Y8P' 8   8   8 `Y88P\n";
        return welcome_str;
      default:
        return 'bensh: command not found: ' + command + '\n';
    }
  }

  function clearScreen(){
    terminal.scrollTop(Infinity);
  }

  function setPadding(){
    var fineTuning = 2;
    var padding = terminal.outerHeight() - lineHeight + fineTuning;
    terminal.css('padding-bottom', padding);
  }
  setPadding();
  $(window).resize(setPadding);

  terminal.val(buffer);
  terminal.focus();

});
