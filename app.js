var app = 
{
    initialize: function()
    {
        document.addEventListener('deviceready', app.onDeviceReady, false);
    },

    onDeviceReady: function()
    {
        document.getElementById('scan').addEventListener('click', app.scan, false);
        document.getElementById('encode').addEventListener('click', app.encode, false);
        document.getElementById('browser').addEventListener('click', app.openInBrowser, false);
        document.getElementById('clipboard').addEventListener('click', app.copyToClipboard, false);

        app.toggleInfoBox(true);
        app.toggleResultButtons('[none]');
        document.getElementById('data-format').innerHTML = '[none]';

        app.scan();
    },

    toggleResultButtons: function(result)
    {
        document.getElementById('data-result').innerHTML = result;

        if (app.validateURL(result))
        {
            document.getElementById('browser').removeAttribute('disabled');
        }
        else
        {
            document.getElementById('browser').setAttribute('disabled', 'diabled');
        }

        if ((result !== '[none]' && result !== ''))
        {
            document.getElementById('clipboard').removeAttribute('disabled');
        }
        else
        {
            document.getElementById('clipboard').setAttribute('disabled', 'diabled');
        }
    },

    toggleInfoBox: function(hide)
    {
        var
            hide = hide || false,
            hideString = (hide) ? 'none' : 'block';

        document.getElementById('info').style.display = hideString;
    },

    copyToClipboard: function()
    {
        var
            code = document.getElementById('data-result').innerHTML,
            disabled = document.getElementById('clipboard').hasAttribute('disabled');

        if (code === '[none]' || code === '' || disabled) return false;

        alert('copying "' + code + '" to clipboard!');
    },

    openInBrowser: function()
    {
        var
            code = document.getElementById('data-result').innerHTML,
            disabled = document.getElementById('browser').hasAttribute('disabled');

        if (code === '[none]' || code === '' || disabled) return false;

        alert('pening "' + code + '" in browser!');
    },

    scan: function()
    {
        navigator.vibrate(100);

        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan(function (result)
        {
            if(!result.cancelled)
            {
                document.getElementById('data-format').innerHTML = result.format;

                app.toggleResultButtons(result.text);
                app.toggleInfoBox();
            }
            else app.toggleInfoBox(true);

        }, function (error)
        {
            app.toggleInfoBox(true);

            alert("Scanning failed! Reason: ", error); 
        });
        
        return false;
    },

    encode: function()
    {
        app.toggleInfoBox(true);

        var
            result = window.prompt('Encode what?'),
            scanner = cordova.require("cordova/plugin/BarcodeScanner");

        /**
         * Cancel encoding if user hit 'Cancel' button or entered an empty string.
         */
        if (result === null || typeof result === 'object' || result === '') return false;

        scanner.encode(scanner.Encode.TEXT_TYPE, result, function(success)
        {
            /**
             * Do nothing...
             */
        }, function(fail)
        {
            alert("Encoding failed! Reason: " + fail);
        });
        
        return false;
    },

    /**
     * Used regular expression from:
     * 
     * http://blog.mattheworiordan.com/post/13174566389/url-regular-expression-for-links-with-or-without
     * 
     * http://stackoverflow.com/a/17726973/1469208
     * http://stackoverflow.com/a/9284473/1469208
     * http://stackoverflow.com/a/17714711/1469208
     * http://stackoverflow.com/a/2015516/1469208
     * http://stackoverflow.com/a/14582229/1469208
     */
    validateURL: function(url)
    {
        var urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

        return urlRegex.test(url);
    }
};
