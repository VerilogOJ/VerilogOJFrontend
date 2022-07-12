// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE
import { keyword_tree } from "./keywords";
(function (mod) {
    mod(require("codemirror/lib/codemirror"));
  })(function(CodeMirror) {
    "use strict";
  
    var WORD = /[\w$]+/, RANGE = 500;
    
    CodeMirror.registerHelper("hint", "anyword", function (editor, options) {
      var word = options && options.word || WORD;
      var range = options && options.range || RANGE;
      var cur = editor.getCursor(), curLine = editor.getLine(cur.line);
      var end = cur.ch, start = end;
      while (start && word.test(curLine.charAt(start - 1))) --start;
      var curWord = start != end && curLine.slice(start, end);
  
      var list = options && options.list || [], seen = {};
      var re = new RegExp(word.source, "g");
      
      var res = keyword_tree.search(curWord);
      var added = new Map();
      if (res[0]) {
          list = list.concat(list, keyword_tree.get_candidate(res[1], curWord));
          for (var w of list) {
              added[w] = 1;
          }
      }
      for (var dir = -1; dir <= 1; dir += 2) {
        var line = cur.line, endLine = Math.min(Math.max(line + dir * range, editor.firstLine()), editor.lastLine()) + dir;
        for (; line != endLine; line += dir) {
          var text = editor.getLine(line), m;
          m = re.exec(text);
          while (m) {
            if (line == cur.line && m[0] === curWord) {
              m = re.exec(text); continue;
            }
            if ((!curWord || m[0].lastIndexOf(curWord, 0) == 0) && !Object.prototype.hasOwnProperty.call(seen, m[0])) {
              seen[m[0]] = true;
              if(!added[m[0]])
                list.push(m[0]);
                
            }
            m = re.exec(text);
          }
          
        }
      }
      list.sort(function (a, b) {
        return a.length > b.length ? 1 : -1;
      })
      console.log(list);
      return {list: list, from: CodeMirror.Pos(cur.line, start), to: CodeMirror.Pos(cur.line, end)};
    });
  });
  