$(document).ready(function () {
    
    // REFERENCES    
    var baseMonth = moment('2018-01-01');
    var source = $('#day-template').html();
    var template = Handlebars.compile(source);
    var prev = $('.Header-leftArrow');
    var next = $('.Header-rightArrow');
    var modal = $('.Modal');

    // print giorno
    printMonth(template, baseMonth);

    // ottieni festività mese corrente
    printHoliday(baseMonth);

    // EVENTS
    next.click(function() {
        var activeDate = moment( $('h2').attr('data-this-date'));
        var newActiveDate = activeDate.add(1, 'M');
        
        if (newActiveDate.year() > 2018) {
            modalFade(modal);
        } else {
            //reset mesi
            $('.month-list').html('');
            
            printMonth(template, newActiveDate);

            printHoliday(newActiveDate);
        }
        
    });
    
    prev.click(function() {
        var activeDate = moment( $('h2').attr('data-this-date'));
        var newActiveDate = activeDate.subtract(1, 'M');
        
        if (newActiveDate.year() < 2018) {
            modalFade(modal);
        } else {
            //reset mesi
            $('.month-list').html('');
            
            printMonth(template, newActiveDate);

            printHoliday(newActiveDate);
        }
        
    });

}); // <-- End doc ready


/*************************************
    FUNCTIONS
 *************************************/

// Stampa a schermo i giorni del mese
function printMonth(template, date) {
    // numero giorni nel mese
    var daysInMonth = date.daysInMonth();

    //  setta header
    $('h2').html( date.format('MMMM YYYY') );

    // Imposta data attribute data visualizzata
    $('.month').attr('data-this-date',  date.format('YYYY-MM-DD'));

    // genera giorni mese
    for (var i = 0; i < daysInMonth; i++) {
        // genera data con moment js
        var thisDate = moment({
            year: date.year(),
            month: date.month(),
            day: i + 1
        });

        // imposta dati template
        var context = {
            class: 'day',
            day: thisDate.format('D'),
            completeDate: thisDate.format('YYYY-MM-DD')
        };
        
        //compilare e aggiungere template
        var html = template(context);
        $('.month-list').append(html);
    }
}

// Ottieni e stampa festività
function printHoliday(date) {
    // chiamo API
    $.ajax({
        url: 'https://flynn.boolean.careers/exercises/api/holidays' ,
        method: 'GET',
        data: {
            year: date.year(),
            month: date.month()
        },
        success: function(res) {
            var holidays = res.response;

            for (var i = 0; i < holidays.length; i++) {
                var thisHoliday = holidays[i];

                var listItem = $('li[data-complete-date="' + thisHoliday.date + '"]');

                if(listItem) {
                    listItem.addClass('is-holiday');
                    // listItem.text( listItem.text() + ' - ' + thisHoliday.name );
                    listItem.children('.HolidayName').text(thisHoliday.name);
                }
            }
        },
        error: function() {
            console.log('Errore chiamata festività'); 
        }
    });
}

function modalFade(modal) {
    modal.css('opacity', '1');
    setTimeout(function(){
        modal.animate({
            opacity: 0
        }, 1000);
    }, 1500)
}
