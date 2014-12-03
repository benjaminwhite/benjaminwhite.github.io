function Directory(name, parent) {
  this.name = name;
  this.parent = parent;
  this.children = [];
  if (parent){
    parent.children.push(this);
  }
}

function File(name, parent, content) {
  this.name = name;
  this.parent = parent;
  this.content = content;
  if (parent) {
    parent.children.push(this);
  }
}

$(document).ready(function() {
  var terminal = $('#terminal');

  /* FILE SYSTEM */
  var root = new Directory('');
  var projects = new Directory('projects', root);
  var favorites = new Directory('favorites', root);
  var benshrc = new File('.benshrc', root, 'welcome');
  var haddaway = new File('haddaway.yt', root, '<iframe width="420" height="315" src="//www.youtube.com/embed/xhrBDcQq2DM?rel=0&autoplay=1&amp;controls=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>');
  var resume = new File('resume.pdf', root, '<embed src="assets/resume.pdf" width="100%" height="800px">');

  var gtasks = new File('gtasks.txt', projects, '**Gtasks**<br>Gtasks is a project I recently completed and open sourced. It\'s a complete redesign of the Google Tasks python library.<br>Check out more information by visiting the Github Repo: <a href="https://github.com/benjaminwhite/Gtasks">benjaminwhite/Gtasks</a>');
  var illum = new File('illum.txt', projects, '**Illum**<br>This is a project I am currently working on for my CS164 final project. Its a program which uses natural language processing to control home automation (specifically philips hues).');
  var website = new File('benwhite.info.txt', projects, '**benwhite.info**<br>Well isn\'t this meta. This very website is another project I\'m continuously working on. A lot of love, sweat, and javascript was poured into making this website, so enjoy!');
  var movies = new File('movies.txt', favorites, ' - Lawrence of Arabia<br> - Children of Men<br> - Star Wars V: The Empire Strikes Back<br> - True Lies<br> - Galaxy Quest');
  var whiskies = new File('whiskies.txt', favorites, ' - Ardbeg 10 years old<br> - Highland Park 15 years old<br> - Four Roses Small Batch<br> - Yamazaki 12 years old')

  var currentDir = root;
  var command = "";

  function clearScreen(){
    terminal.scrollTop(Infinity);
  }

  function pwd() {
    var dirString = '';
    var dir = currentDir;
    do {
      dirString = '/' + dir.name + dirString;
      dir = dir.parent;
    } while(dir && dir !== root);
    return dirString;
  }

  function stringToNode(nodePath) {
    var nodes = nodePath.split('/');
    if (nodes[0] !== '') {
      var node = currentDir;
    } else {
      var node = root;
      nodes.shift();
    }
    for (var n = 0; n < nodes.length; n++) {
      var step = nodes[n];
      if (step === '..') {
        if (node.parent) {
          node = node.parent;
        } else {
          node = node;
        }
      } else if (step === '.') {
        node = node;
      } else if (!node.children) {
        return null;
      } else {
        var childrenLen = node.children.length;
        for (var c = 0; c < childrenLen; c++) {
          var child = node.children[c];
          if (step == child.name) {
            node = child;
            break;
          } else if (c == childrenLen-1) {
            return null;
          }
        }
      }
    }
    return node;
  }

  function ps1() {
    return "<span style='color: #1B8EA2'>" + pwd() + "</span><span style='color: #DB4C30'> $</span> "
  }

  /* START PATH */
  var path = {
    welcome: function() {
               var ascii = '\\    / _ | _ _  _ _  _<br> \\/\\/ (/_|(_(_)| | |(/_<br>'
               var message = "Welcome to bensh.<br>My name is Benjamin White. I'm a 4th year Computer Science major at UC berkeley. Enjoy my shell.";
               output(ascii + message);
             },
    help: function() {
            var available = Object.keys(path).join(', ');
            var message = "Looks like you need some help.<br>Don't fret.<br>" +
                          "Here are some commands you can try out:<br>" + available;;
            output(message);
          },
    clear: function(){ clearScreen(); },
    pwd: function(){ output(pwd()); },
    hack: function(){ output('HACK THE PLANET!'); },
    sudo: function(){ output('Nice try.'); },
    ls: function(args) {
          var children = currentDir.children;
          var all = args[0] === '-a';
          var nodes = [];
          for (var i = 0; i < children.length; i++) {
            var node = children[i];
            if (node.name[0] !== '.' || all) {
              if (node.constructor == Directory) {
                var nodeString = '<span style="color: #80D0DE">' + node.name + '/</span>';
              } else {
                var nodeString = node.name;
              }
              nodes.push(nodeString);
            }
          }
          output(nodes.join('<br>'));
        },
    cd: function(args){
          var dirString = args[0];
          var dir = stringToNode(dirString);
          if (!dir || dir.constructor !== Directory) {
            output('<span style="color: #DB4C30"> bensh: Directory not found:</span> ' + dirString);
          } else {
            currentDir = dir;
          }
        },
    cat: function(args){
        var fileString = args[0];
        var file = stringToNode(fileString);
        if (!file || file.constructor !== File) {
          output('<span style="color: #DB4C30"> bensh: File not found:</span> ' + fileString);
        } else {
          output(file.content);
        }
    }
  }
  /* END PATH */

  terminal.keypress(function(e) {
    e.preventDefault();
    var key = String.fromCharCode(e.which);
    if(e.which == 13) {
      echo(true);
      processCommands(command);
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
    } else if (e.ctrlKey && e.keyCode == 76){
      clearScreen();
    }
  });

  function processCommands(stdin) {
    var regex = /(".*"|'.*'|[^\s]+)+/g;
    var commands = stdin.split(';');
    for(var i = 0; i < commands.length; i++) {
      var cmd = commands[i];
      var args = cmd.match(regex);
      if (args && args.length > 0) {
        var program = args.shift();
      } else {
        var program = '';
      }
      if (path.hasOwnProperty(program)) {
        path[program](args);
      } else if (program !== '') {
        output('<span style="color: #DB4C30"> bensh: command not found:</span> ' + cmd);
      }
    }
      command = "";
      newInput();
      echo();
  }

  function newInput() {
    terminal.append($('<li>', { class: 'stdin'}))
  }

  function echo(suppressCursor) {
    var target = $('.stdin').last();
    if (suppressCursor){
      var cursor = '';
    } else {
      var cursor = '<span class="cursor"></span>';
    }
    target.html(ps1() + $('<span>', {text: command}).html() + cursor);
  }

  function output(htmlOut) {
    terminal.append($('<li>', { class: 'stdout', html: htmlOut}))
  }

  $(window).load(function() {
    processCommands(benshrc.content);
  });
});
