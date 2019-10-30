import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';

export default function() {
  var photoswipeParseHash = function() {
    var hash = window.location.hash.substring(1),
      params = {};

    if (hash.length < 5) {
      return params;
    }

    var vars = hash.split('&');
    for (var i = 0; i < vars.length; i++) {
      if (!vars[i]) {
        continue;
      }
      var pair = vars[i].split('=');
      if (pair.length < 2) {
        continue;
      }
      params[pair[0]] = pair[1];
    }

    return params;
  };
  // get pswp ready
  var pswpElement = document.querySelectorAll('.pswp')[0];
  // init gallery obj
  var gallery = {};
  // loop thru each gallery
  $('.gallery').each(function() {
    var i = 0;
    var $temp = [];
    // loop thru gallery item
    $(this)
      .find('.gallery-item')
      .each(function() {
        // set entry object
        var $entry = {};
        $entry.src = $(this)
          .find('img')
          .data('full');
        $entry.w = $(this)
          .find('img')
          .data('width');
        $entry.h = $(this)
          .find('img')
          .data('height');
        // find caption
        if ($(this).find('.gallery-caption').length > 0) {
          $entry.title = $(this)
            .find('.gallery-caption')
            .text()
            .trim();
        }
        // add data to stack
        $temp.push($entry);
        $(this)
          .find('a')
          .data('index', i);
        i++;
      });
    // put generated data to variable
    gallery[$(this).attr('id')] = $temp;
  });
  $('.gallery-item a').on('click', function(e) {
    e.preventDefault();
    var $uid = $(this)
      .closest('.gallery')
      .attr('id');
    var swipe = new PhotoSwipe(
      pswpElement,
      PhotoSwipeUI_Default,
      gallery[$uid],
      { galleryUID: $uid, index: $(this).data('index') }
    );
    swipe.init();
  });
  var hashData = photoswipeParseHash();
  if (hashData.pid && hashData.gid) {
    var swipe = new PhotoSwipe(
      pswpElement,
      PhotoSwipeUI_Default,
      gallery[hashData.gid],
      { galleryUID: hashData.gid, index: hashData.pid - 1 }
    );
    swipe.init();
  }
}
