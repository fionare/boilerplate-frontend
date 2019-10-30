export default function(elem) {
  var self = this;
  self.elem = elem;

  // video wrapper
  self.elem.find('video').each(function() {
    if (
      $(this)
        .parent()
        .is('p') ||
      $(this)
        .parent()
        .is('div')
    ) {
      $(this).unwrap();
      $(this).wrap('<div class="richtext-media-16x9"></div>');
    } else {
      $(this).wrap('<div class="richtext-media-16x9"></div>');
    }
  });

  // iframe wrapper
  self.elem.find('iframe').each(function() {
    var src = $(this).attr('src');
    if (src.indexOf('youtu') > 0 || src.indexOf('vimeo') > 0) {
      if (
        $(this)
          .parent()
          .is('p')
      ) {
        $(this).unwrap();
        $(this).wrap('<div class="richtext-media-16x9"></div>');
      } else {
        $(this).wrap('<div class="richtext-media-16x9"></div>');
      }
    } else if (src.indexOf('google') > 0) {
      if (
        $(this)
          .parent()
          .is('p')
      ) {
        $(this).unwrap();
        $(this).wrap('<div class="richtext-media-4x3"></div>');
      } else {
        $(this).wrap('<div class="richtext-media-4x3"></div>');
      }
    }
  });

  // add wrapper to figure images
  self.elem.find('figure img').each(function() {
    $(this).wrap('<span class="image-wrapper"></span>');
  });

  // wrap table
  self.elem.find('table').each(function() {
    if (
      !$(this)
        .parent()
        .is('.article-table')
    ) {
      $(this).wrap(
        '<div class="article-table"><div class="article-table-wrapper"></div></div>'
      );
    } else {
      $(this).wrap('<div class="article-table-wrapper"></div>');
    }
    $(this).removeAttr('border');
  });

  self.elem.find('.gallery a').prop('target', '_blank');
}
