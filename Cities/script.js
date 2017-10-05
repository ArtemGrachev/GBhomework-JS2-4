(function($){$(function(){
    var arrChecks = [
        {
            name: 'name',
            required: true,
            checks: [{
                error: 'В этом поле должны быть только буквы.',
                re: /^[a-zA-Zа-яёА-ЯЁ]+$/
            }]
        }, {
            name: 'phone',
            required: false,
            checks: [{
                error: 'Это поле должно соответствовать шаблону +7(000)000-0000 .',
                re: /^\+7\(\d{3}\)\d{3}-\d{4}$/
            }]
        }, {
            name: 'eMail',
            required: true,
            checks: [{
                error: 'Поле должно соответствовать одному из шаблонов: mymail@mail.ru my.mail@mail.ru my-mail@mail.ru .',
                re: /^[a-z]+(|\.|-)[a-z]+@[a-z]+\.[a-z]{2,3}$/
            }]
        }, {
            name: 'someText',
            required: true,
            checks: []
        }, {
            name: 'city',
            required: true,
            checks: [{
                error: 'Выберите один из предложенных городов. Если вашего города нет среди предлагаемых, выберите ближайший.',
// !!!!! Пока я отлаживал эту функцию, у меня исчерпался лимит у предложенного вами сервиса списка городов, так что где-то тут осталась ошибка. Валидация этого поля будет некорректной.
                func: function(errText, field) {
                    $.ajax({
                        type: 'GET',
                        dataType: 'json',
                        url: "http://htmlweb.ru/geo/api.php?city_name=" + field.value + "&json",
                        success: function(data){
                            var goodField = false;
                            for (var i = 0; i < data.limit; i++) {
                                if (data[i].name == field.value) {
                                    goodField = true;
                                }
                            }
                            if (!goodField) writeError(field, errText);
                        }
                    });
                }
            }]
        }
    ];
    
    function insertAfter(newElem, elem) {
        elem.parentElement.insertBefore(newElem, elem.nextSibling);
    }
    function deleteError() {
        if (this.classList.contains('fieldError')) {
            this.parentElement.removeChild(this.nextSibling);
            this.classList.remove('fieldError');
        }
    }
    function deleteErrorByName(name) {
        deleteError.call(document.getElementsByName(name)[0]);
    }
    function writeError(field, errText) {
        field.classList.add('fieldError');
        var errorElem = document.createElement('div');
        errorElem.className = "error";
        errorElem.innerHTML = errText;
        insertAfter(errorElem, field);
        formIsCorrect = false;
    }
    function checkError(errText, field, regularExp) {
        if ((!field.classList.contains('fieldError')) && (!regularExp.test(field.value))) {
            writeError(field, errText);
        }
    }

    $('[name="city"]').autocomplete({
        source: function(request, response){
            $.ajax({
                type: 'GET',
                dataType: 'json',
                url: "http://htmlweb.ru/geo/api.php?city_name=" + request.term + "&json",
                success: function(data){
                    response($.map(data, function(item){
                        return item.name;
                    }));
                }
            });
        },
        minLength: 3
    });
    $('.submit').on('click', function () {
        formIsCorrect = true;
        event.preventDefault();
        var that = $(this);
        arrChecks.forEach(function(obj) {
            var field = that.closest('form').find('[name=' + obj.name + ']')[0];
            if (!field) {
                throw new Error("Ошибка arrChecks: не существует элемента с именем " + obj.name);
            }
            deleteErrorByName(obj.name);
            if (field.value.length == 0) {
                if (obj.required) {
                    writeError(field, 'Это поле обязательно для заполнения.');
                }
            } else {
                obj.checks.forEach(function(check) {
                    if (check.func) {
                        check.func(check.error, field);
                    } else if (check.re) {
                        checkError(check.error, field, check.re);
                    } else {
                        throw new Error("Ошибка arrChecks: нет обработчика ошибки поля " + obj.name);
                    }
                });
            }
        });
        if (formIsCorrect) {
            var ollKorrect = document.createElement('div');
            ollKorrect.className = "ollKorrect";
            ollKorrect.innerHTML = "Форма заполнена правильно!";
            that.parentElement.appendChild(ollKorrect);
        }
    });
    $('input[type="text"], textarea').on('focus', deleteError);
});})(jQuery)