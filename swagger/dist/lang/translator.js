'use strict';

/**
 * Translator for documentation pages.
 *
 * To enable translation you should include one of language-***REMOVED***les in your index.html
 * after <script src='lang/translator.js' type='text/javascript'></script>.
 * For example - <script src='lang/ru.js' type='text/javascript'></script>
 *
 * If you wish to translate some new texsts you should do two things:
 * 1. Add a new phrase pair ("New Phrase": "New Translation"***REMOVED*** into your language ***REMOVED***le (for example lang/ru.js***REMOVED***. It will be great if you add it in other language ***REMOVED***les too.
 * 2. Mark that text it templates this way <anyHtmlTag data-sw-translate>New Phrase</anyHtmlTag> or <anyHtmlTag data-sw-translate value='New Phrase'/>.
 * The main thing here is attribute data-sw-translate. Only inner html, title-attribute and value-attribute are going to translate.
 *
 */
window.SwaggerTranslator = {

    _words:[],

    translate: function(sel***REMOVED*** {
      var $this = this;
      sel = sel || '[data-sw-translate]';

      $(sel***REMOVED***.each(function(***REMOVED*** {
        $(this***REMOVED***.html($this._tryTranslate($(this***REMOVED***.html(***REMOVED******REMOVED******REMOVED***;

        $(this***REMOVED***.val($this._tryTranslate($(this***REMOVED***.val(***REMOVED******REMOVED******REMOVED***;
        $(this***REMOVED***.attr('title', $this._tryTranslate($(this***REMOVED***.attr('title'***REMOVED******REMOVED******REMOVED***;
      }***REMOVED***;
    },

    _tryTranslate: function(word***REMOVED*** {
      return this._words[$.trim(word***REMOVED***] !== unde***REMOVED***ned ? this._words[$.trim(word***REMOVED***] : word;
    },

    learn: function(wordsMap***REMOVED*** {
      this._words = wordsMap;
    }
};
