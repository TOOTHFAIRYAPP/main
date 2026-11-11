(function(){
  document.querySelectorAll('[data-ba-range]').forEach(function(r){
    var box = r.parentElement;
    var after = box.querySelector('[data-ba-after]'), line = box.querySelector('[data-ba-line]'), handle = box.querySelector('[data-ba-handle]');
    var set = function(){ var v = r.value + '%'; if (after) after.style.width = v; if (line) line.style.left = v; if (handle) handle.style.left = v; };
    r.addEventListener('input', set); set();
  });
  var fit = function(){ document.querySelectorAll('.tf-page').forEach(function(p){ p.style.zoom = Math.min(1, window.innerWidth / 1440); }); };
  window.addEventListener('resize', fit); fit();
})();