$(document).ready(function () {
    // variables
    let size = [920, 1920];
    let count = [15, 10];
    let items = ['fruits', 10];
    // starting app
    function zoom() {
        let zoom = Math.min(window.innerHeight / size[0], window.innerWidth / size[1]);
        $('body').css('zoom', zoom);
        $('body').css('-moz-transform', `scale(${zoom})`);
        $('body').css('-moz-transform-origin', '50% 0');
    };
    $(window).resize(function () { zoom() }), zoom();
    $(document).on('contextmenu', function () { return false });
    let cards = Array(count[0] * count[1] / items[1]).fill([...Array(items[1]).keys()]).flat().sort(() => .5 - Math.random());
    let selected = [];
    let isGrey = false;
    // making cards
    $('.cols').append('<div class="col"></div>'.repeat(count[0]));
    $('.col').each(function () {
        for (i = 0; i < count[1]; i++) {
            let card = cards.shift();
            let grey = '';
            if (random(1, Math.round(count[0] * count[1] / 2.5)) == 1) grey = ' grey';
            $(this).append(`<div class="card${grey}" card="${card}"><img src="img/${items[0]}/${card}.png"></div>`);
        }
    });
    // card click
    $(document).on('mousedown', '.card:last-child:not([used])', function (e) {
        e = e || window.event;
        if (e.which == 1) {
            // element codes
            let element = this;
            $(element).attr('used', '');
            $(element).css('transform', 'scale(.8)');
            $(element).fadeOut(300);
            setTimeout(function () { $(element).remove() }, 300);
            selected.push($(element).attr('card'));
            if ($(element).hasClass('grey')) isGrey = true;
            // box codes (update card attr)
            $('.card-select').removeAttr('card');
            selected.forEach((card, index) => {
                let element = `.card-select:nth-child(${index + 1})`;
                $(element).html(`<img src="img/${items[0]}/${card}.png">`);
                $(element).attr('card', card);
            });
            // win or lose
            if (selected.length == 3) {
                if (selected.every(item => item === selected[0])) {
                    selected = [];
                    setTimeout(function () {
                        if (isGrey) {
                            isGrey = false;
                            let card = $('.card-select').attr('card');
                            card = `<div class="card grey-added" card="${card}"><img src="img/${items[0]}/${card}.png"></div>`;
                            for (i = 0; i < 3; i++) { $($('.card:not(:last-child)')[random(0, $('.card:not(:last-child)').length - 1)]).after(card) }
                        }
                        if (selected.length == 0) $('.card-select').removeAttr('card');
                        // game end
                        if (!$('.card').length) {
                            setTimeout(function () {
                                $('body').append(`<img class="party" style="transform:translate(calc(${$('body').width() / 2}px - 50%),-100px)">`.repeat(500));
                                $('.party').each(function () {
                                    $(this).attr('src', `img/${items[0]}/${random(0, items[1] - 1)}.png`);
                                    $(this).css('transition', random(1000, 4000) + 'ms ease-in');
                                    $(this).css('transform', `translate(calc(${random(0, $('body').width())}px - 50%),${$('body').height() + 100}px) rotate(${random(-720, 720)}deg)`);
                                    setTimeout(function () { $('.party').remove() }, 4e3);
                                });
                            }, 300);
                        }
                    }, 300);
                } else {
                    setTimeout(function () {
                        $('.gameover').css('display', 'flex');
                        $('.fill').remove();
                    }, 500);
                }
            }
        }
    });
    // buttons
    $('.fill').click(function () {
        let empties = [];
        $('.col').each(function () {
            if ($(this).find('.card').length == 0) {
                empties.push($(this));
            }
        });
        empties.sort(() => .5 - Math.random());
        empties.forEach(empty => {
            let lasts = [];
            $('.col').each(function () {
                if ($(this).find('.card').length > 1) {
                    lasts.push($(this).find('.card:last-child'));
                }
            });
            empty.append(lasts[random(0, lasts.length - 1)]);
        });
    });
    $('.reset').click(function () { location.reload() });
    // random function
    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
});