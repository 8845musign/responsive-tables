function responsiveTable(selector, bodySelector, breakpoint) {
  var selector = selector ? selector : "table.responsive";
  var headerSelector = headerSelector ? headerSelector : "th:first-child, td:first-child";
  var breakpoint = breakpoint ? breakpoint : 767;

  var switched = false;
  var updateTables = function() {
    if (($(window).width() < breakpoint) && !switched ){
      switched = true;
      $(selector).each(function(i, element) {
        splitTable($(element));
      });
      return true;
    }
    else if (switched && ($(window).width() > breakpoint)) {
      switched = false;
      $(selector).each(function(i, element) {
        unsplitTable($(element));
      });
    }
  };
   
  $(window).load(updateTables);
  $(window).on("redraw",function(){switched=false;updateTables();}); // An event to listen for
  $(window).on("resize", updateTables);
   
  
  function splitTable(original)
  {
    original.wrap("<div class='table-wrapper' />");
    originalTr = original.find("tr");

    var copy = original.clone();
    copy.find("th, td").not(headerSelector).css("display", "none");
    copy.removeClass("responsive");

    var copyHeader = copy.find(headerSelector);
    var cntSpan = 0;
    for (var i = 0, len = copyHeader.size(); i < len; i++) {
      var self = copyHeader.eq(i);
      var rowSpan = self.attr("rowspan");
      if (rowSpan) {
        cntSpan = cntSpan + (rowSpan - 1);
      } else if(cntSpan) {
        self.remove();
        originalTr.eq(i).children().first().css("display", 'block');
        cntSpan--;
      }
    }
    
    original.closest(".table-wrapper").append(copy);
    copy.wrap("<div class='pinned' />");
    original.wrap("<div class='scrollable' />");

    setCellHeights(original, copy);
  }
  
  function unsplitTable(original) {
    original.closest(".table-wrapper").find(".pinned").remove();
    original.unwrap();
    original.unwrap();
  }

  function setCellHeights(original, copy) {
    var tr = original.find('tr'),
        tr_copy = copy.find('tr'),
        heights = [];

    for (var index = 0, len = tr.size(); index < len; index++) {
      var self = tr.eq(index);
          tx = self.find('th, td');

      tx.each(function () {
        var height = $(this).outerHeight(true);
        heights[index] = heights[index] || 0;
        if (height > heights[index]) heights[index] = height;
      });
    }

    var cntSpan = 0;
    for (var index = 0, len = tr_copy.size(); index < len; index++) {
      var self = tr_copy.eq(index);
      var rowSpan = self.attr("rowspan");
      if (rowSpan) {
        var allHeight = 0;
        for (var span_i = 0; span_i < rowSpan; span_i++) {
          allHeight = allHeight + heights[index + span_i];
        }
        self.height(allHeight);
        index = index + (rowSpan - 1);
      } else {
        self.height(heights[index]);  
      }
    }
  }
}
