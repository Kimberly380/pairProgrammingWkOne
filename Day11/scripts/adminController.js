(function(module) {
  var adminController = {};

  // DONE: Define a function that hides all main section elements, and then reveals just the #admin section:
  adminController.index = function() {
    $('main > section.tab-content').hide();
    $('#admin').show();
  };

  module.adminController = adminController;
})(window);
