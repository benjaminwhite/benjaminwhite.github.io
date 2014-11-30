$(document).ready(function() {
  var terminal = $('#terminal');
  var projects = { name: 'projects', type: 'dir', parent: root, children: []};
  var root = { name: '', type: 'dir', parent: null, children: [projects]};
  var benshrc = { name: '.benshrc', type: 'file', parent: root, content:'welcome'};
  var favorites = { name: '/favorites', type: 'dir', parent: root, children: []};
  var currentDir = root;

  function ps1() {
    var directoryString = "";
    var directory = currentDir;
    while (directory !== null) {
      directoryString = directory.name + directoryString;
      directory = directory.parent;
    }
    if (directoryString === '') {
      directoryString = '/';
    }
    return "<span style='color: #1B8EA2'>" + directoryString+ "</span><span style='color: #DB4C30'> $</span> "
  }

  var command = "";

  terminal.keypress(function(e) {
    var key = String.fromCharCode(e.which);
    if(e.which == 13) {
      processCommand(command);
    } else {
      command += key;
      echo();
    }
  });

  terminal.keydown(function(e){
    if (e.keyCode == 8){
      e.preventDefault();
      command = command.slice(0, -1);
      echo();
    }
  });

  function processCommand(stdin) {
    var regex = /(".*"|'.*'|[^\s]+)+/g;
    var words = command.match(regex);
    switch(words[0]) {
      case 'ls':
        var directories = "";
        for (var i = 0; i < currentDir.children.length; i++){
          directories += (currentDir.children[i].name + "<br>");
        }
        output(directories);
        break;
      case 'hack':
        output('HACK THE PLANET!');
        break;
      case 'sudo':
        output('Nice try.');
        break;
      case 'welcome':
        output('bensh v0.1<br><br>Enjoy.');
        break;
      default:
        output('<span style="color: #DB4C30"> bensh: command not found:</span> ' + command);
    }

      command = "";
      newInput();
  }

  function newInput() {
    terminal.append($('<li>', { class: 'stdin', html: ps1()}))
  }

  function echo() {
    var target = $('.stdin').last();
    target.html(ps1() + $('<span>', {text: command}).html());
  }

  function output(htmlOut) {
    terminal.append($('<li>', { class: 'stdout', html: htmlOut}))
  }

  $(window).load(function() {
    newInput();
  });
});
