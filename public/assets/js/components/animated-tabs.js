(function (a) {
  a(function () {
    var e = "fadeInLeft";
    var h;
    var f;
    g(a("#animate-tab a"), a("#animate-tab-content"));
    function g(d, c, b) {
      d.click(function (j) {
        j.preventDefault();
        a(this).tab("show");
        var k = a(this).data("easein");
        if (h) {
          h.removeClass(f)
        }
        if (k) {
          c.find("div.active").addClass("animated " + k);
          f = k
        } else {
          if (b) {
            c.find("div.active").addClass("animated " + b);
            f = b
          } else {
            c.find("div.active").addClass("animated " + e);
            f = e
          }
        }
        h = c.find("div.active")
      })
    }
    a("a[rel=popover]").popover().click(function (b) {
      b.preventDefault();
      if (a(this).data("easein") != undefined) {
        a(this).next().removeClass(a(this).data("easein")).addClass("animated " + a(this).data("easein"))
      } else {
        a(this).next().addClass("animated " + e)
      }
    })
  })
}
)(jQuery);