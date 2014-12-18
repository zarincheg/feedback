/**
 * Plugin that provides a simple pop-up feedback form.
 * @param options
 */
$.fn.feedback = function (options) {
    "use strict";

    var settings = $.extend({
            toggle: '#toggle-feedback',
            target: this,
            direction: 'left'
        }, options),
        animations = {
            left: [{left: '50%'}, {left: '-50%'}],
            right: [{right: '50%'}, {right: '-50%'}],
            top: [{top: '50%'}, {top: '-50%'}],
            bottom: [{bottom: '50%'}, {bottom: '-50%'}]
        },
        statusWait = settings.target.find('.wait'),
        statusSuccess = settings.target.find('.success'),
        statusFail = settings.target.find('.fail'),
        handlers = {
            toggle: function () {
                if (settings.target.hasClass('active')) {
                    settings.target.animate(animations[settings.direction][1], function () {
                        settings.target.find('.status').hide();
                        settings.target.removeClass('active');
                    });
                } else {
                    settings.target.addClass('active');
                    settings.target.animate(animations[settings.direction][0]);
                }

                return false;
            },

            send: function (e) {
                var form = $(e.currentTarget),
                    data = form.serializeArray();

                statusWait.show();

                $.ajax({
                    method: 'POST',
                    url: form.attr('action'),
                    data: data,
                    success: function (data) {
                        statusSuccess.find('.message').text(data.message);
                        statusWait.hide();
                        statusSuccess.show();

                        setTimeout(function () {
                            statusSuccess.hide();
                            handlers.toggle();
                            settings.target.removeClass('active');
                            form.find('input, textarea').val('');
                        }, 1000);
                    },
                    error: function (data) {
                        statusFail.find('.message').text(data.message);
                        statusWait.hide();
                        statusFail.show();

                        setTimeout(function () {
                            statusFail.hide();
                            handlers.toggle();
                            form.find('input[type="text"], textarea').val('');
                        }, 1500);
                    }
                });

                return false;
            }
        };

    $(settings.toggle).click(handlers.toggle);
    settings.target.find('.close a').click(handlers.toggle);
    this.find('form').submit(handlers.send);
};