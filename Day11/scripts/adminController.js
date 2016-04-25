(function(module) {
  var adminController = {};

  Article.fetchAll(articleView.initAdminPage);

  // DONE: Define a function that hides all main section elements, and then reveals just the #admin section:
  adminController.index = function() {
    $('title').text('Blog Statistics');

    var $mainNav = $('.main-nav');
    $mainNav.find('li').hide();
    $mainNav.find('li:eq(0), li:gt(3)').show();
    $mainNav.find('li:eq(0) > a').text('Blog');

    $('main > section.tab-content').hide();
    $('#admin').show();
  };

  module.adminController = adminController;
})(window);
