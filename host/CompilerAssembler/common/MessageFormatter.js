var Translator    = require('./Translator');

function MessageFormatter(localePath, localeId, debug, info, warn, error)
{
    this.extDebug   = debug;
    this.extInfo    = info;
    this.extWarn    = warn;
    this.extError   = error;
    this.translator = new Translator(localePath, localeId);
}

MessageFormatter.prototype.translate =
    function (args)
    {
        return this.translator.translate.apply(this.translator, arguments);
    };

MessageFormatter.prototype.formatHighlightLine =
    function (line, tokenPos, tokenLength)
    {
        // Put a caret under each character of the token
        // Step through context line and copy, replacing non-whitespace
        // characters with a space until the token is reached. Then
        // add a caret for each token character.
        var str = "";
        for (var i = 0; i < tokenPos; i++)
            str += (line.charAt(i) == "\t") ? "\t" : " ";

        for (var i = 0; i < tokenLength; i++)
            str += "^";

        return str;
    };

MessageFormatter.prototype.formatMessage =
    function (highlight, text, contunuation, token, args)
    {
        var msg = "";
        var translateArgs = [];
        for (var i = 4; i < arguments.length; i++)
            translateArgs.push(arguments[i]);
        // Might not be a message to translate. (Might be happy with just
        // the context if we're listing a number of alternative culprits.)
        if (translateArgs.length > 0)
            msg = this.translator.translate.apply(this.translator, translateArgs);

        if (token)
        {
            var context = this.getContext(text, token);
            // If no message then no (row:col)
            if (translateArgs.length > 0)
                msg = "(" + (context.row + 1) + ":" + (context.col + 1) + ") " + msg + "\n";

            if (highlight)
            {
                // Add the line number to the beginning of the context line
                var lineNo = (context.row + 1) + ": ";
                msg += lineNo + context.line + "\n";
                msg += this.formatHighlightLine(lineNo + context.line, lineNo.length + context.col, token.value.length);
            }
        }
        return msg;
    };

MessageFormatter.prototype.getContext =
    function (text, token)
    {
        var context =
            {
                row: 0,
                col: 0,
                tabs: 0,    // Number of tabs before the token on the token's line
                line: ""
            };

        for (var i = 0; i < token.offset; i++)
        {
            var nextChar = text.charAt(i);
            if (nextChar == '\n')
            {
                context.row++;
                context.col = 0;
                context.tabs = 0;
            }
            else if (nextChar == '\t')
            {
                context.tabs++;
                context.col++;
            }
            else
            {
                context.col++;
            }
        }
        // Find the position of the end of the line so that we can copy
        // the whole line with the error.
        var lineEnd = token.offset;
        while ((lineEnd < text.length) && (text.charAt(lineEnd) != '\n'))
            lineEnd++;
        context.line = text.substring(token.offset - context.col, lineEnd);
        return context;
    };

MessageFormatter.prototype.rawDebug =
    function (args)
    {
        this.extDebug(this.translate.apply(this, arguments));
    };

MessageFormatter.prototype.rawInfo =
    function (args)
    {
        this.extInfo(this.translate.apply(this, arguments));
    };

MessageFormatter.prototype.rawWarn =
    function (args)
    {
        this.extWarn(this.translate.apply(this, arguments));
    };

MessageFormatter.prototype.rawError =
    function (args)
    {
        this.extError(this.translate.apply(this, arguments));
    };

MessageFormatter.prototype.debug =
    function (text, continuation, token, msg, args)
    {
        // Prepend highlight to arguments
        var formatArgs = [false]; // Don't highlight token
        for (var i = 0; i < arguments.length; i++)
            formatArgs.push(arguments[i]);

        var str = "";
        if (!continuation)
            str = this.translate("Debug") + ": ";
        str += this.formatMessage.apply(this, formatArgs);
        this.rawDebug(str);
    };

MessageFormatter.prototype.info =
    function (text, continuation, token, msg, args)
    {
        // Prepend highlight to arguments
        var formatArgs = [false]; // Don't highlight token
        for (var i = 0; i < arguments.length; i++)
            formatArgs.push(arguments[i]);

        var str = "";
        if (!continuation)
            str = this.translate("Info") + ": ";
        str += this.formatMessage.apply(this, formatArgs);
        this.rawInfo(str);
    };

MessageFormatter.prototype.warn =
    function (text, continuation, token, msg, args)
    {
        // Prepend highlight to arguments
        var formatArgs = [true]; // Highlight the token
        for (var i = 0; i < arguments.length; i++)
            formatArgs.push(arguments[i]);

        var str = "";
        if (!continuation)
            str = this.translate("Warning") + ": ";
        str += this.formatMessage.apply(this, formatArgs);
        this.rawWarn(str);
    };

MessageFormatter.prototype.error =
    function (text, continuation, token, msg, args)
    {
        // Prepend highlight to arguments
        var formatArgs = [true]; // Highlight the token
        for (var i = 0; i < arguments.length; i++)
            formatArgs.push(arguments[i]);

        var str = "";
        if (!continuation)
            str = this.translate("Error") + ": ";
        str += this.formatMessage.apply(this, formatArgs);
        this.rawError(str);

    };

module.exports = MessageFormatter;