(function($){
$(function(){
    $(".tab__text_collapsed").hide();
    $('.tab__button').on('click', function(event){
        if (!$(this).hasClass('tab__button_active')) {
            var tab = $(this).closest('.tab'),
               dataWasActive = tab.find('.tab__button_active').attr('data-tab');
            tab.find('.tab__button_active').removeClass('tab__button_active');
            $(this).addClass('tab__button_active');
            tab.find('[data-tabtext="' + dataWasActive + '"], [data-tabtext="' + $(this).attr('data-tab') + '"]').toggleClass('tab__text_collapsed').slideToggle(500);
       }
   });
});
})(jQuery)