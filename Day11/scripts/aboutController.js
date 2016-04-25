(function(module) {
  var aboutController = {};

  // DONE: Define a function that hides all main section elements, and then reveals just the #about section:
  aboutController.index = function() {
    $('title').text('Blog');

    var $mainNav = $('.main-nav');
    $mainNav.find('li').hide();
    $mainNav.find('li:lt(4)').show();
    $mainNav.find('li:eq(0) > a').text('Home');

    $('main > section.tab-content').hide();
    $('#about').show();
  };

  module.aboutController = aboutController;
})(window);
