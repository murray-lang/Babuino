var locale = require('locale-js');

function Translator(i18nPath, localeId)
{
    this.init(i18nPath);
    this.to(localeId);
}

Translator.prototype.init =
    function (i18nPath)
    {
            // Load JSON files describing available languages
        //locale.init(i18nPath);
            // Create i18n for base language (English)
        this.i18n = new locale.i18n('');
    };

Translator.prototype.to =
    function (localeId)
    {
        this.i18n.to(localeId);
    };

Translator.prototype.translate =
    function (args)
    {
        return this.i18n.__.apply(this.i18n, arguments);
    };

module.exports = Translator;