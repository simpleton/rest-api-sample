/**
 * marked - a markdown parser
 * Copyright (c***REMOVED*** 2011-2014, Christopher Jeffrey. (MIT Licensed***REMOVED***
 * https://github.com/chjj/marked
 */

;(function(***REMOVED*** {

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n****REMOVED***+/,
  fences: noop,
  hr: /^( *[-*_]***REMOVED***{3,} *(?:\n+|$***REMOVED***/,
  heading: /^ *(#{1,6}***REMOVED*** *([^\n]+?***REMOVED*** *#* *(?:\n+|$***REMOVED***/,
  nptable: noop,
  lheading: /^([^\n]+***REMOVED***\n *(=|-***REMOVED***{2,} *(?:\n+|$***REMOVED***/,
  blockquote: /^( *>[^\n]+(\n(?!def***REMOVED***[^\n]+***REMOVED****\n****REMOVED***+/,
  list: /^( ****REMOVED***(bull***REMOVED*** [\s\S]+?(?:hr|def|\n{2,}(?! ***REMOVED***(?!\1bull ***REMOVED***\n*|\s*$***REMOVED***/,
  html: /^ *(?:comment *(?:\n|\s*$***REMOVED***|closed *(?:\n{2,}|\s*$***REMOVED***|closing *(?:\n{2,}|\s*$***REMOVED******REMOVED***/,
  def: /^ *\[([^\]]+***REMOVED***\]: *<?([^\s>]+***REMOVED***>?(?: +["(]([^\n]+***REMOVED***["***REMOVED***]***REMOVED***? *(?:\n+|$***REMOVED***/,
  table: noop,
  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def***REMOVED******REMOVED***+***REMOVED***\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.***REMOVED***/;
block.item = /^( ****REMOVED***(bull***REMOVED*** [^\n]*(?:\n(?!\1bull ***REMOVED***[^\n]****REMOVED****/;
block.item = replace(block.item, 'gm'***REMOVED***
  (/bull/g, block.bullet***REMOVED***
  (***REMOVED***;

block.list = replace(block.list***REMOVED***
  (/bull/g, block.bullet***REMOVED***
  ('hr', '\\n+(?=\\1?(?:[-*_] ****REMOVED***{3,}(?:\\n+|$***REMOVED******REMOVED***'***REMOVED***
  ('def', '\\n+(?=' + block.def.source + '***REMOVED***'***REMOVED***
  (***REMOVED***;

block.blockquote = replace(block.blockquote***REMOVED***
  ('def', block.def***REMOVED***
  (***REMOVED***;

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img***REMOVED***\\b***REMOVED***\\w+(?!:/|[^\\w\\s@]*@***REMOVED***\\b';

block.html = replace(block.html***REMOVED***
  ('comment', /<!--[\s\S]*?-->/***REMOVED***
  ('closed', /<(tag***REMOVED***[\s\S]+?<\/\1>/***REMOVED***
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">]***REMOVED****?>/***REMOVED***
  (/tag/g, block._tag***REMOVED***
  (***REMOVED***;

block.paragraph = replace(block.paragraph***REMOVED***
  ('hr', block.hr***REMOVED***
  ('heading', block.heading***REMOVED***
  ('lheading', block.lheading***REMOVED***
  ('blockquote', block.blockquote***REMOVED***
  ('tag', '<' + block._tag***REMOVED***
  ('def', block.def***REMOVED***
  (***REMOVED***;

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block***REMOVED***;

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,}***REMOVED*** *(\S+***REMOVED***? *\n([\s\S]+?***REMOVED***\s*\1 *(?:\n+|$***REMOVED***/,
  paragraph: /^/
}***REMOVED***;

block.gfm.paragraph = replace(block.paragraph***REMOVED***
  ('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2'***REMOVED*** + '|'
    + block.list.source.replace('\\1', '\\3'***REMOVED*** + '|'***REMOVED***
  (***REMOVED***;

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.****REMOVED***\n *([-:]+ *\|[-| :]****REMOVED***\n((?:.*\|.*(?:\n|$***REMOVED******REMOVED*******REMOVED***\n*/,
  table: /^ *\|(.+***REMOVED***\n *\|( *[-:]+[-| :]****REMOVED***\n((?: *\|.*(?:\n|$***REMOVED******REMOVED*******REMOVED***\n*/
}***REMOVED***;

/**
 * Block Lexer
 */

function Lexer(options***REMOVED*** {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm***REMOVED*** {
    if (this.options.tables***REMOVED*** {
      this.rules = block.tables;
    } ***REMOVED*** {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options***REMOVED*** {
  var lexer = new Lexer(options***REMOVED***;
  return lexer.lex(src***REMOVED***;
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src***REMOVED*** {
  src = src
    .replace(/\r\n|\r/g, '\n'***REMOVED***
    .replace(/\t/g, '    '***REMOVED***
    .replace(/\u00a0/g, ' '***REMOVED***
    .replace(/\u2424/g, '\n'***REMOVED***;

  return this.token(src, true***REMOVED***;
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top, bq***REMOVED*** {
  var src = src.replace(/^ +$/gm, ''***REMOVED***
    , next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src***REMOVED*** {
    // newline
    if (cap = this.rules.newline.exec(src***REMOVED******REMOVED*** {
      src = src.substring(cap[0].length***REMOVED***;
      if (cap[0].length > 1***REMOVED*** {
        this.tokens.push({
          type: 'space'
        }***REMOVED***;
      }
    }

    // code
    if (cap = this.rules.code.exec(src***REMOVED******REMOVED*** {
      src = src.substring(cap[0].length***REMOVED***;
      cap = cap[0].replace(/^ {4}/gm, ''***REMOVED***;
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? cap.replace(/\n+$/, ''***REMOVED***
          : cap
      }***REMOVED***;
      continue;
    }

    // fences (gfm***REMOVED***
    if (cap = this.rules.fences.exec(src***REMOVED******REMOVED*** {
      src = src.substring(cap[0].length***REMOVED***;
      this.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3]
      }***REMOVED***;
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src***REMOVED******REMOVED*** {
      src = src.substring(cap[0].length***REMOVED***;
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      }***REMOVED***;
      continue;
    }

    // table no leading pipe (gfm***REMOVED***
    if (top && (cap = this.rules.nptable.exec(src***REMOVED******REMOVED******REMOVED*** {
      src = src.substring(cap[0].length***REMOVED***;

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, ''***REMOVED***.split(/ *\| */***REMOVED***,
        align: cap[2].replace(/^ *|\| *$/g, ''***REMOVED***.split(/ *\| */***REMOVED***,
        cells: cap[3].replace(/\n$/, ''***REMOVED***.split('\n'***REMOVED***
      };

      for (i = 0; i < item.align.length; i++***REMOVED*** {
        if (/^ *-+: *$/.test(item.align[i]***REMOVED******REMOVED*** {
          item.align[i] = 'right';
        } ***REMOVED*** if (/^ *:-+: *$/.test(item.align[i]***REMOVED******REMOVED*** {
          item.align[i] = 'center';
        } ***REMOVED*** if (/^ *:-+ *$/.test(item.align[i]***REMOVED******REMOVED*** {
          item.align[i] = 'left';
        } ***REMOVED*** {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++***REMOVED*** {
        item.cells[i] = item.cells[i].split(/ *\| */***REMOVED***;
      }

      this.tokens.push(item***REMOVED***;

      continue;
    }

    // lheading
    if (cap = this.rules.lheading.exec(src***REMOVED******REMOVED*** {
      src = src.substring(cap[0].length***REMOVED***;
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      }***REMOVED***;
      continue;
    }

    // hr
    if (cap = this.rules.hr.exec(src***REMOVED******REMOVED*** {
      src = src.substring(cap[0].length***REMOVED***;
      this.tokens.push({
        type: 'hr'
      }***REMOVED***;
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src***REMOVED******REMOVED*** {
      src = src.substring(cap[0].length***REMOVED***;

      this.tokens.push({
        type: 'blockquote_start'
      }***REMOVED***;

      cap = cap[0].replace(/^ *> ?/gm, ''***REMOVED***;

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top, true***REMOVED***;

      this.tokens.push({
        type: 'blockquote_end'
      }***REMOVED***;

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src***REMOVED******REMOVED*** {
      src = src.substring(cap[0].length***REMOVED***;
      bull = cap[2];

      this.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      }***REMOVED***;

      // Get each top-level item.
      cap = cap[0].match(this.rules.item***REMOVED***;

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++***REMOVED*** {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.***REMOVED*** +/, ''***REMOVED***;

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n '***REMOVED******REMOVED*** {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'***REMOVED***, ''***REMOVED***
            : item.replace(/^ {1,4}/gm, ''***REMOVED***;
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this.options.smartLists && i !== l - 1***REMOVED*** {
          b = block.bullet.exec(cap[i + 1]***REMOVED***[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1***REMOVED******REMOVED*** {
            src = cap.slice(i + 1***REMOVED***.join('\n'***REMOVED*** + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n***REMOVED***(?! ***REMOVED***[^\n]+\n\n(?!\s*$***REMOVED***/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$***REMOVED***/.test(item***REMOVED***;
        if (i !== l - 1***REMOVED*** {
          next = item.charAt(item.length - 1***REMOVED*** === '\n';
          if (!loose***REMOVED*** loose = next;
        }

        this.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        }***REMOVED***;

        // Recurse.
        this.token(item, false, bq***REMOVED***;

        this.tokens.push({
          type: 'list_item_end'
        }***REMOVED***;
      }

      this.tokens.push({
        type: 'list_end'
      }***REMOVED***;

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src***REMOVED******REMOVED*** {
      src = src.substring(cap[0].length***REMOVED***;
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style',
        text: cap[0]
      }***REMOVED***;
      continue;
    }

    // def
    if ((!bq && top***REMOVED*** && (cap = this.rules.def.exec(src***REMOVED******REMOVED******REMOVED*** {
      src = src.substring(cap[0].length***REMOVED***;
      this.tokens.links[cap[1].toLowerCase(***REMOVED***] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm***REMOVED***
    if (top && (cap = this.rules.table.exec(src***REMOVED******REMOVED******REMOVED*** {
      src = src.substring(cap[0].length***REMOVED***;

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, ''***REMOVED***.split(/ *\| */***REMOVED***,
        align: cap[2].replace(/^ *|\| *$/g, ''***REMOVED***.split(/ *\| */***REMOVED***,
        cells: cap[3].replace(/(?: *\| ****REMOVED***?\n$/, ''***REMOVED***.split('\n'***REMOVED***
      };

      for (i = 0; i < item.align.length; i++***REMOVED*** {
        if (/^ *-+: *$/.test(item.align[i]***REMOVED******REMOVED*** {
          item.align[i] = 'right';
        } ***REMOVED*** if (/^ *:-+: *$/.test(item.align[i]***REMOVED******REMOVED*** {
          item.align[i] = 'center';
        } ***REMOVED*** if (/^ *:-+ *$/.test(item.align[i]***REMOVED******REMOVED*** {
          item.align[i] = 'left';
        } ***REMOVED*** {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++***REMOVED*** {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, ''***REMOVED***
          .split(/ *\| */***REMOVED***;
      }

      this.tokens.push(item***REMOVED***;

      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src***REMOVED******REMOVED******REMOVED*** {
      src = src.substring(cap[0].length***REMOVED***;
      this.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1***REMOVED*** === '\n'
          ? cap[1].slice(0, -1***REMOVED***
          : cap[1]
      }***REMOVED***;
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src***REMOVED******REMOVED*** {
      // Top-level should never reach here.
      src = src.substring(cap[0].length***REMOVED***;
      this.tokens.push({
        type: 'text',
        text: cap[0]
      }***REMOVED***;
      continue;
    }

    if (src***REMOVED*** {
      throw new
        Error('In***REMOVED***nite loop on byte: ' + src.charCodeAt(0***REMOVED******REMOVED***;
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\](***REMOVED***#+\-.!_>]***REMOVED***/,
  autolink: /^<([^ >]+(@|:\/***REMOVED***[^ >]+***REMOVED***>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">]***REMOVED****?>/,
  link: /^!?\[(inside***REMOVED***\]\(href\***REMOVED***/,
  reflink: /^!?\[(inside***REMOVED***\]\s*\[([^\]]****REMOVED***\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]]***REMOVED*******REMOVED***\]/,
  strong: /^__([\s\S]+?***REMOVED***__(?!_***REMOVED***|^\*\*([\s\S]+?***REMOVED***\*\*(?!\****REMOVED***/,
  em: /^\b_((?:__|[\s\S]***REMOVED***+?***REMOVED***_\b|^\*((?:\*\*|[\s\S]***REMOVED***+?***REMOVED***\*(?!\****REMOVED***/,
  code: /^(`+***REMOVED***\s*([\s\S]*?[^`]***REMOVED***\s*\1(?!`***REMOVED***/,
  br: /^ {2,}\n(?!\s*$***REMOVED***/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$***REMOVED***/
};

inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]***REMOVED******REMOVED****/;
inline._href = /\s*<?([\s\S]*?***REMOVED***>?(?:\s+['"]([\s\S]*?***REMOVED***['"]***REMOVED***?\s*/;

inline.link = replace(inline.link***REMOVED***
  ('inside', inline._inside***REMOVED***
  ('href', inline._href***REMOVED***
  (***REMOVED***;

inline.reflink = replace(inline.reflink***REMOVED***
  ('inside', inline._inside***REMOVED***
  (***REMOVED***;

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline***REMOVED***;

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S***REMOVED***([\s\S]*?\S***REMOVED***__(?!_***REMOVED***|^\*\*(?=\S***REMOVED***([\s\S]*?\S***REMOVED***\*\*(?!\****REMOVED***/,
  em: /^_(?=\S***REMOVED***([\s\S]*?\S***REMOVED***_(?!_***REMOVED***|^\*(?=\S***REMOVED***([\s\S]*?\S***REMOVED***\*(?!\****REMOVED***/
}***REMOVED***;

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace(inline.escape***REMOVED***(']***REMOVED***', '~|]***REMOVED***'***REMOVED***(***REMOVED***,
  url: /^(https?:\/\/[^\s<]+[^<.,:;"'***REMOVED***\]\s]***REMOVED***/,
  del: /^~~(?=\S***REMOVED***([\s\S]*?\S***REMOVED***~~/,
  text: replace(inline.text***REMOVED***
    (']|', '~]|'***REMOVED***
    ('|', '|https?://|'***REMOVED***
    (***REMOVED***
}***REMOVED***;

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace(inline.br***REMOVED***('{2,}', '*'***REMOVED***(***REMOVED***,
  text: replace(inline.gfm.text***REMOVED***('{2,}', '*'***REMOVED***(***REMOVED***
}***REMOVED***;

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options***REMOVED*** {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer;
  this.renderer.options = this.options;

  if (!this.links***REMOVED*** {
    throw new
      Error('Tokens array requires a `links` property.'***REMOVED***;
  }

  if (this.options.gfm***REMOVED*** {
    if (this.options.breaks***REMOVED*** {
      this.rules = inline.breaks;
    } ***REMOVED*** {
      this.rules = inline.gfm;
    }
  } ***REMOVED*** if (this.options.pedantic***REMOVED*** {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options***REMOVED*** {
  var inline = new InlineLexer(links, options***REMOVED***;
  return inline.output(src***REMOVED***;
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src***REMOVED*** {
  var out = ''
    , link
    , text
    , href
    , cap;

  while (src***REMOVED*** {
    // escape
    if (cap = this.rules.escape.exec(src***REMOVED******REMOVED*** {
      src = src.substring(cap[0].length***REMOVED***;
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src***REMOVED******REMOVED*** {
      src = src.substring(cap[0].length***REMOVED***;
      if (cap[2] === '@'***REMOVED*** {
        text = cap[1].charAt(6***REMOVED*** === ':'
          ? this.mangle(cap[1].substring(7***REMOVED******REMOVED***
          : this.mangle(cap[1]***REMOVED***;
        href = this.mangle('mailto:'***REMOVED*** + text;
      } ***REMOVED*** {
        text = escape(cap[1]***REMOVED***;
        href = text;
      }
      out += this.renderer.link(href, null, text***REMOVED***;
      continue;
    }

    // url (gfm***REMOVED***
    if (!this.inLink && (cap = this.rules.url.exec(src***REMOVED******REMOVED******REMOVED*** {
      src = src.substring(cap[0].length***REMOVED***;
      text = escape(cap[1]***REMOVED***;
      href = text;
      out += this.renderer.link(href, null, text***REMOVED***;
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src***REMOVED******REMOVED*** {
      if (!this.inLink && /^<a /i.test(cap[0]***REMOVED******REMOVED*** {
        this.inLink = true;
      } ***REMOVED*** if (this.inLink && /^<\/a>/i.test(cap[0]***REMOVED******REMOVED*** {
        this.inLink = false;
      }
      src = src.substring(cap[0].length***REMOVED***;
      out += this.options.sanitize
        ? escape(cap[0]***REMOVED***
        : cap[0];
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src***REMOVED******REMOVED*** {
      src = src.substring(cap[0].length***REMOVED***;
      this.inLink = true;
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      }***REMOVED***;
      this.inLink = false;
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src***REMOVED******REMOVED***
        || (cap = this.rules.nolink.exec(src***REMOVED******REMOVED******REMOVED*** {
      src = src.substring(cap[0].length***REMOVED***;
      link = (cap[2] || cap[1]***REMOVED***.replace(/\s+/g, ' '***REMOVED***;
      link = this.links[link.toLowerCase(***REMOVED***];
      if (!link || !link.href***REMOVED*** {
        out += cap[0].charAt(0***REMOVED***;
        src = cap[0].substring(1***REMOVED*** + src;
        continue;
      }
      this.inLink = true;
      out += this.outputLink(cap, link***REMOVED***;
      this.inLink = false;
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src***REMOVED******REMOVED*** {
      src = src.substring(cap[0].length***REMOVED***;
      out += this.renderer.strong(this.output(cap[2] || cap[1]***REMOVED******REMOVED***;
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src***REMOVED******REMOVED*** {
      src = src.substring(cap[0].length***REMOVED***;
      out += this.renderer.em(this.output(cap[2] || cap[1]***REMOVED******REMOVED***;
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src***REMOVED******REMOVED*** {
      src = src.substring(cap[0].length***REMOVED***;
      out += this.renderer.codespan(escape(cap[2], true***REMOVED******REMOVED***;
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src***REMOVED******REMOVED*** {
      src = src.substring(cap[0].length***REMOVED***;
      out += this.renderer.br(***REMOVED***;
      continue;
    }

    // del (gfm***REMOVED***
    if (cap = this.rules.del.exec(src***REMOVED******REMOVED*** {
      src = src.substring(cap[0].length***REMOVED***;
      out += this.renderer.del(this.output(cap[1]***REMOVED******REMOVED***;
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src***REMOVED******REMOVED*** {
      src = src.substring(cap[0].length***REMOVED***;
      out += escape(this.smartypants(cap[0]***REMOVED******REMOVED***;
      continue;
    }

    if (src***REMOVED*** {
      throw new
        Error('In***REMOVED***nite loop on byte: ' + src.charCodeAt(0***REMOVED******REMOVED***;
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link***REMOVED*** {
  var href = escape(link.href***REMOVED***
    , title = link.title ? escape(link.title***REMOVED*** : null;

  return cap[0].charAt(0***REMOVED*** !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]***REMOVED******REMOVED***
    : this.renderer.image(href, title, escape(cap[1]***REMOVED******REMOVED***;
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text***REMOVED*** {
  if (!this.options.smartypants***REMOVED*** return text;
  return text
    // em-dashes
    .replace(/--/g, '\u2014'***REMOVED***
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s]***REMOVED***'/g, '$1\u2018'***REMOVED***
    // closing singles & apostrophes
    .replace(/'/g, '\u2019'***REMOVED***
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s]***REMOVED***"/g, '$1\u201c'***REMOVED***
    // closing doubles
    .replace(/"/g, '\u201d'***REMOVED***
    // ellipses
    .replace(/\.{3}/g, '\u2026'***REMOVED***;
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text***REMOVED*** {
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++***REMOVED*** {
    ch = text.charCodeAt(i***REMOVED***;
    if (Math.random(***REMOVED*** > 0.5***REMOVED*** {
      ch = 'x' + ch.toString(16***REMOVED***;
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 */

function Renderer(options***REMOVED*** {
  this.options = options || {};
}

Renderer.prototype.code = function(code, lang, escaped***REMOVED*** {
  if (this.options.highlight***REMOVED*** {
    var out = this.options.highlight(code, lang***REMOVED***;
    if (out != null && out !== code***REMOVED*** {
      escaped = true;
      code = out;
    }
  }

  if (!lang***REMOVED*** {
    return '<pre><code>'
      + (escaped ? code : escape(code, true***REMOVED******REMOVED***
      + '\n</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPre***REMOVED***x
    + escape(lang, true***REMOVED***
    + '">'
    + (escaped ? code : escape(code, true***REMOVED******REMOVED***
    + '\n</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote***REMOVED*** {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html***REMOVED*** {
  return html;
};

Renderer.prototype.heading = function(text, level, raw***REMOVED*** {
  return '<h'
    + level
    + ' id="'
    + this.options.headerPre***REMOVED***x
    + raw.toLowerCase(***REMOVED***.replace(/[^\w]+/g, '-'***REMOVED***
    + '">'
    + text
    + '</h'
    + level
    + '>\n';
};

Renderer.prototype.hr = function(***REMOVED*** {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function(body, ordered***REMOVED*** {
  var type = ordered ? 'ol' : 'ul';
  return '<' + type + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text***REMOVED*** {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.paragraph = function(text***REMOVED*** {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body***REMOVED*** {
  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content***REMOVED*** {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags***REMOVED*** {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' style="text-align:' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text***REMOVED*** {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text***REMOVED*** {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text***REMOVED*** {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function(***REMOVED*** {
  return this.options.xhtml ? '<br/>' : '<br>';
};

Renderer.prototype.del = function(text***REMOVED*** {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text***REMOVED*** {
  if (this.options.sanitize***REMOVED*** {
    try {
      var prot = decodeURIComponent(unescape(href***REMOVED******REMOVED***
        .replace(/[^\w:]/g, ''***REMOVED***
        .toLowerCase(***REMOVED***;
    } catch (e***REMOVED*** {
      return '';
    }
    if (prot.indexOf('javascript:'***REMOVED*** === 0***REMOVED*** {
      return '';
    }
  }
  var out = '<a href="' + href + '"';
  if (title***REMOVED*** {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text***REMOVED*** {
  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title***REMOVED*** {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

/**
 * Parsing & Compiling
 */

function Parser(options***REMOVED*** {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer;
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options, renderer***REMOVED*** {
  var parser = new Parser(options, renderer***REMOVED***;
  return parser.parse(src***REMOVED***;
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src***REMOVED*** {
  this.inline = new InlineLexer(src.links, this.options, this.renderer***REMOVED***;
  this.tokens = src.reverse(***REMOVED***;

  var out = '';
  while (this.next(***REMOVED******REMOVED*** {
    out += this.tok(***REMOVED***;
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function(***REMOVED*** {
  return this.token = this.tokens.pop(***REMOVED***;
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function(***REMOVED*** {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function(***REMOVED*** {
  var body = this.token.text;

  while (this.peek(***REMOVED***.type === 'text'***REMOVED*** {
    body += '\n' + this.next(***REMOVED***.text;
  }

  return this.inline.output(body***REMOVED***;
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function(***REMOVED*** {
  switch (this.token.type***REMOVED*** {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr(***REMOVED***;
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text***REMOVED***,
        this.token.depth,
        this.token.text***REMOVED***;
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped***REMOVED***;
    }
    case 'table': {
      var header = ''
        , body = ''
        , i
        , row
        , cell
        , flags
        , j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++***REMOVED*** {
        flags = { header: true, align: this.token.align[i] };
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]***REMOVED***,
          { header: true, align: this.token.align[i] }
        ***REMOVED***;
      }
      header += this.renderer.tablerow(cell***REMOVED***;

      for (i = 0; i < this.token.cells.length; i++***REMOVED*** {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++***REMOVED*** {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]***REMOVED***,
            { header: false, align: this.token.align[j] }
          ***REMOVED***;
        }

        body += this.renderer.tablerow(cell***REMOVED***;
      }
      return this.renderer.table(header, body***REMOVED***;
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next(***REMOVED***.type !== 'blockquote_end'***REMOVED*** {
        body += this.tok(***REMOVED***;
      }

      return this.renderer.blockquote(body***REMOVED***;
    }
    case 'list_start': {
      var body = ''
        , ordered = this.token.ordered;

      while (this.next(***REMOVED***.type !== 'list_end'***REMOVED*** {
        body += this.tok(***REMOVED***;
      }

      return this.renderer.list(body, ordered***REMOVED***;
    }
    case 'list_item_start': {
      var body = '';

      while (this.next(***REMOVED***.type !== 'list_item_end'***REMOVED*** {
        body += this.token.type === 'text'
          ? this.parseText(***REMOVED***
          : this.tok(***REMOVED***;
      }

      return this.renderer.listitem(body***REMOVED***;
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next(***REMOVED***.type !== 'list_item_end'***REMOVED*** {
        body += this.tok(***REMOVED***;
      }

      return this.renderer.listitem(body***REMOVED***;
    }
    case 'html': {
      var html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text***REMOVED***
        : this.token.text;
      return this.renderer.html(html***REMOVED***;
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text***REMOVED******REMOVED***;
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText(***REMOVED******REMOVED***;
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode***REMOVED*** {
  return html
    .replace(!encode ? /&(?!#?\w+;***REMOVED***/g : /&/g, '&amp;'***REMOVED***
    .replace(/</g, '&lt;'***REMOVED***
    .replace(/>/g, '&gt;'***REMOVED***
    .replace(/"/g, '&quot;'***REMOVED***
    .replace(/'/g, '&#39;'***REMOVED***;
}

function unescape(html***REMOVED*** {
  return html.replace(/&([#\w]+***REMOVED***;/g, function(_, n***REMOVED*** {
    n = n.toLowerCase(***REMOVED***;
    if (n === 'colon'***REMOVED*** return ':';
    if (n.charAt(0***REMOVED*** === '#'***REMOVED*** {
      return n.charAt(1***REMOVED*** === 'x'
        ? String.fromCharCode(parseInt(n.substring(2***REMOVED***, 16***REMOVED******REMOVED***
        : String.fromCharCode(+n.substring(1***REMOVED******REMOVED***;
    }
    return '';
  }***REMOVED***;
}

function replace(regex, opt***REMOVED*** {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val***REMOVED*** {
    if (!name***REMOVED*** return new RegExp(regex, opt***REMOVED***;
    val = val.source || val;
    val = val.replace(/(^|[^\[]***REMOVED***\^/g, '$1'***REMOVED***;
    regex = regex.replace(name, val***REMOVED***;
    return self;
  };
}

function noop(***REMOVED*** {}
noop.exec = noop;

function merge(obj***REMOVED*** {
  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++***REMOVED*** {
    target = arguments[i];
    for (key in target***REMOVED*** {
      if (Object.prototype.hasOwnProperty.call(target, key***REMOVED******REMOVED*** {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}


/**
 * Marked
 */

function marked(src, opt, callback***REMOVED*** {
  if (callback || typeof opt === 'function'***REMOVED*** {
    if (!callback***REMOVED*** {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {}***REMOVED***;

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt***REMOVED***
    } catch (e***REMOVED*** {
      return callback(e***REMOVED***;
    }

    pending = tokens.length;

    var done = function(err***REMOVED*** {
      if (err***REMOVED*** {
        opt.highlight = highlight;
        return callback(err***REMOVED***;
      }

      var out;

      try {
        out = Parser.parse(tokens, opt***REMOVED***;
      } catch (e***REMOVED*** {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err***REMOVED***
        : callback(null, out***REMOVED***;
    };

    if (!highlight || highlight.length < 3***REMOVED*** {
      return done(***REMOVED***;
    }

    delete opt.highlight;

    if (!pending***REMOVED*** return done(***REMOVED***;

    for (; i < tokens.length; i++***REMOVED*** {
      (function(token***REMOVED*** {
        if (token.type !== 'code'***REMOVED*** {
          return --pending || done(***REMOVED***;
        }
        return highlight(token.text, token.lang, function(err, code***REMOVED*** {
          if (err***REMOVED*** return done(err***REMOVED***;
          if (code == null || code === token.text***REMOVED*** {
            return --pending || done(***REMOVED***;
          }
          token.text = code;
          token.escaped = true;
          --pending || done(***REMOVED***;
        }***REMOVED***;
      }***REMOVED***(tokens[i]***REMOVED***;
    }

    return;
  }
  try {
    if (opt***REMOVED*** opt = merge({}, marked.defaults, opt***REMOVED***;
    return Parser.parse(Lexer.lex(src, opt***REMOVED***, opt***REMOVED***;
  } catch (e***REMOVED*** {
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || marked.defaults***REMOVED***.silent***REMOVED*** {
      return '<p>An error occured:</p><pre>'
        + escape(e.message + '', true***REMOVED***
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt***REMOVED*** {
  merge(marked.defaults, opt***REMOVED***;
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: false,
  silent: false,
  highlight: null,
  langPre***REMOVED***x: 'lang-',
  smartypants: false,
  headerPre***REMOVED***x: '',
  renderer: new Renderer,
  xhtml: false
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

if (typeof module !== 'unde***REMOVED***ned' && typeof exports === 'object'***REMOVED*** {
  module.exports = marked;
} ***REMOVED*** if (typeof de***REMOVED***ne === 'function' && de***REMOVED***ne.amd***REMOVED*** {
  de***REMOVED***ne(function(***REMOVED*** { return marked; }***REMOVED***;
} ***REMOVED*** {
  this.marked = marked;
}

}***REMOVED***.call(function(***REMOVED*** {
  return this || (typeof window !== 'unde***REMOVED***ned' ? window : global***REMOVED***;
}(***REMOVED******REMOVED***;