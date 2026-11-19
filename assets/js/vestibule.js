/* Vestibule: the bar sticks and its marker slides, the quotes slide, the sections rise once, the page remembers light or dark. */
(function () {
	'use strict';
	var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var __ = (window.wp && wp.i18n && wp.i18n.__) ? wp.i18n.__ : function (t) { return t; };
	var root = document.documentElement;

	/* The brand: each word in its own span, so a look can part the words or fold them to initials. */
	document.querySelectorAll('.vst-nav .wp-block-site-title a').forEach(function (a) {
		var words = a.textContent.trim().split(/\s+/);
		if (words.length < 2 || words.length > 3) return;
		a.setAttribute('aria-label', a.textContent.trim());
		a.textContent = '';
		words.forEach(function (w) {
			var s = document.createElement('span'); s.className = 'w'; s.appendChild(document.createTextNode(w.charAt(0)));
			var e = document.createElement('em'); e.textContent = w.slice(1); s.appendChild(e); a.appendChild(s);
		});
		a.classList.add('vst-brand');
	});
	/* The chip: middle dots become small round dots. */
	document.querySelectorAll('.vst-chip a').forEach(function (a) {
		if (a.children.length) return;
		var parts = a.textContent.split('·'); if (parts.length < 2) return;
		a.setAttribute('aria-label', a.textContent.replace(/\s*·\s*/g, ', ').trim());
		a.textContent = '';
		parts.forEach(function (t, i) {
			if (i) { var d = document.createElement('span'); d.className = 'vst-dot'; a.appendChild(d); }
			var s = document.createElement('span'); s.textContent = t.trim(); a.appendChild(s);
		});
	});

	/* The bar: sticky; the moment it sticks, the plate is on. A zero-height mark before the bar says where it rests. */
	var wrap = document.querySelector('.vst-nav-wrap'), nav = wrap && wrap.querySelector('.vst-nav'), mark = null;
	function update() {
		if (!nav) return;
		if (!mark) { mark = document.createElement('span'); mark.className = 'vst-nav-mark'; wrap.parentNode.insertBefore(mark, wrap); }
		var cs = getComputedStyle(wrap);
		var rest = mark.getBoundingClientRect().bottom + parseFloat(cs.marginTop);
		if (rest < parseFloat(cs.top) - 1) nav.setAttribute('data-stuck', ''); else nav.removeAttribute('data-stuck');
	}
	if (nav) {
		var barTick = false;
		var onBar = function () { if (barTick) return; barTick = true; requestAnimationFrame(function () { barTick = false; update(); }); };
		window.addEventListener('scroll', onBar, { passive: true });
		window.addEventListener('resize', onBar);
		update();
	}

	/* Pictures arrive with a soft fade over their placeholder, never a pop. */
	document.querySelectorAll('main img').forEach(function (img) {
		if (img.complete && img.naturalWidth) return;
		img.classList.add('vst-fade');
		var done = function () { img.classList.add('is-in'); };
		img.addEventListener('load', done, { once: true });
		img.addEventListener('error', done, { once: true });
	});

	/* Phones: once the opening has scrolled away, the booking button waits at the bottom; it steps aside at the booking section and the footer. */
	var cta = document.querySelector('.vst-nav .vst-cta .wp-block-button__link');
	if (cta && 'IntersectionObserver' in window) {
		var dock = document.createElement('div'); dock.className = 'vst-dock';
		dock.innerHTML = '<div class="wp-block-button"><a class="wp-block-button__link wp-element-button"></a></div>';
		var link = dock.querySelector('a'); link.href = cta.getAttribute('href'); link.textContent = cta.textContent.trim();
		document.body.appendChild(dock);
		var first = document.querySelector('main h1'), stops = document.querySelectorAll('#book, .wp-site-blocks > footer'), seen = new Set(), past = false;
		var paint = function () { dock.classList.toggle('is-on', past && seen.size === 0); dock.toggleAttribute('inert', !(past && seen.size === 0)); };
		new IntersectionObserver(function (es) { es.forEach(function (e) { past = !e.isIntersecting && e.boundingClientRect.top < 0; }); paint(); }).observe(first || document.querySelector('main'));
		var stop = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) seen.add(e.target); else seen.delete(e.target); }); paint(); });
		stops.forEach(function (el) { stop.observe(el); });
		paint();
	}

	/* The comment form starts as one box; name, email and the rest unfold once someone starts to write. */
	document.querySelectorAll('.comment-form').forEach(function (form) {
		var box = form.querySelector('textarea'), more = form.querySelector('.comment-form-author');
		if (!box || !more || box.value) return;
		form.classList.add('is-short');
		var open = function () { form.classList.remove('is-short'); };
		box.addEventListener('focus', open, { once: true });
		form.addEventListener('submit', open);
	});

	/* Reading a note: a thin line under the bar shows how far along the text you are; a look decides whether to show it. */
	var text = document.querySelector('body.single main .wp-block-post-content');
	if (nav && text) {
		var bar = document.createElement('span'); bar.className = 'vst-progress'; bar.setAttribute('aria-hidden', 'true'); nav.appendChild(bar);
		var readTick = false;
		var onRead = function () {
			if (readTick) return; readTick = true;
			requestAnimationFrame(function () {
				readTick = false;
				var r = text.getBoundingClientRect(), span = r.height - window.innerHeight * .6;
				bar.style.setProperty('--read', Math.min(1, Math.max(0, span > 0 ? -r.top / span : 1)).toFixed(3));
			});
		};
		window.addEventListener('scroll', onRead, { passive: true });
		window.addEventListener('resize', onRead);
		onRead();
	}

	/* The bar's marker slides to the section in view (one piece that moves, never a jump). A click sends it to the target at once
	   and mutes the spy until the scroll has settled, so it never visits the sections in between. */
	(function () {
		var ul = nav && nav.querySelector('.wp-block-navigation__container');
		var links = ul ? Array.prototype.slice.call(ul.querySelectorAll('.wp-block-navigation-item__content[href*="#"]')) : [];
		var same = links.filter(function (a) { var u = new URL(a.href, location.href); return u.pathname === location.pathname && u.hash.length > 1 && document.getElementById(u.hash.slice(1)); });
		if (!ul || !same.length) return;
		var item = document.createElement('li'); item.className = 'vst-pill-item'; item.setAttribute('role', 'presentation'); item.setAttribute('aria-hidden', 'true');
		var pill = document.createElement('span'); pill.className = 'vst-pill'; item.appendChild(pill); ul.appendChild(item);
		var cur = null, muted = 0, ready = false;
		function place(a) {
			if (!a) { pill.style.opacity = '0'; return; }
			var r = a.getBoundingClientRect(), u = ul.getBoundingClientRect();
			pill.style.width = r.width + 'px'; pill.style.transform = 'translateX(' + (r.left - u.left) + 'px)'; pill.style.opacity = '1';
			if (!ready) { void pill.offsetWidth; pill.classList.add('ready'); ready = true; }
		}
		function setCurrent(a) {
			if (a === cur) return; cur = a;
			same.forEach(function (x) { if (x === a) x.setAttribute('aria-current', 'true'); else x.removeAttribute('aria-current'); });
			place(a);
		}
		var secs = same.map(function (a) { return { el: document.getElementById(new URL(a.href, location.href).hash.slice(1)), a: a }; });
		secs.sort(function (x, y) { return x.el.compareDocumentPosition(y.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1; });
		function pick() { var line = window.innerHeight * .35, on = null; secs.forEach(function (x) { if (x.el.getBoundingClientRect().top <= line) on = x.a; }); return on; }
		var ticking = false;
		function onScroll() { if (ticking || muted) return; ticking = true; requestAnimationFrame(function () { ticking = false; setCurrent(pick()); }); }
		window.addEventListener('scroll', onScroll, { passive: true });
		var settle;
		function unmute() { muted = 0; setCurrent(pick()); }
		same.forEach(function (a) { a.addEventListener('click', function () { setCurrent(a); muted = 1; clearTimeout(settle); settle = setTimeout(unmute, 1200); }); });
		if ('onscrollend' in window) { window.addEventListener('scrollend', function () { if (muted) { clearTimeout(settle); settle = setTimeout(unmute, 80); } }); }
		window.addEventListener('resize', function () { if (cur) place(cur); });
		setCurrent(pick());
	})();

	/* Quotes: one at a time, two arrows, no autoplay, unless the look lays them side by side (--vst-slider: off). */
	document.querySelectorAll('.vst-slides').forEach(function (box) {
		var slides = Array.prototype.slice.call(box.children), cur = 0;
		if (slides.length < 2 || getComputedStyle(box).getPropertyValue('--vst-slider').trim() === 'off') return;
		box.classList.add('is-slider'); box.setAttribute('aria-live', 'polite');
		function hide(f, off) { f.inert = off; if (off) f.setAttribute('aria-hidden', 'true'); else f.removeAttribute('aria-hidden'); }
		slides.forEach(function (f, k) { hide(f, k !== 0); });
		slides[0].classList.add('on');
		function show(i, dir) {
			var prev = cur; cur = (i + slides.length) % slides.length; if (cur === prev) return;
			if (getComputedStyle(box).direction === 'rtl') dir = -dir;
			slides.forEach(function (f, k) {
				if (k === cur) {
					f.style.transition = 'none'; f.style.translate = (dir * 16) + 'px 0'; void f.offsetHeight;
					f.style.transition = ''; f.classList.add('on'); f.style.translate = '0 0'; hide(f, false);
				} else { f.classList.remove('on'); f.style.translate = (k === prev ? -dir * 16 : dir * 16) + 'px 0'; hide(f, true); }
			});
		}
		var arrows = document.createElement('div'); arrows.className = 'vst-arrows';
		arrows.innerHTML =
			'<button type="button" class="vst-control vst-prev" aria-label="' + __('Previous', 'vestibule') + '"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3 5 8l5 5"/></svg></button>' +
			'<button type="button" class="vst-control vst-next" aria-label="' + __('Next', 'vestibule') + '"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 3 5 5-5 5"/></svg></button>';
		box.parentNode.insertBefore(arrows, box.nextSibling);
		arrows.querySelector('.vst-prev').addEventListener('click', function () { show(cur - 1, -1); });
		arrows.querySelector('.vst-next').addEventListener('click', function () { show(cur + 1, 1); });
	});

	/* Reveal on first sight: every section but the hero rises once, items inside in a short stagger. */
	var cards = document.querySelectorAll('main .alignfull.wp-block-group');
	cards.forEach(function (c) { c.classList.add('vst-reveal'); });
	if (rm || !('IntersectionObserver' in window)) {
		cards.forEach(function (c) { c.classList.add('in'); });
	} else {
		var io = new IntersectionObserver(function (es) {
			es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
		}, { rootMargin: '0px 0px -10% 0px' });
		cards.forEach(function (c) { io.observe(c); });
	}

	/* A note card or a notes row is one link: click anywhere on it. */
	document.querySelectorAll('.wp-block-post .is-style-tile').forEach(function (card) {
		var link = card.querySelector('.wp-block-post-title a'); if (!link) return;
		card.addEventListener('click', function (e) { if (e.target.closest('a')) return; link.click(); });
	});

	/* A question opens and closes from anywhere on its row, not only the title. */
	document.querySelectorAll('.is-style-faq').forEach(function (d) {
		d.addEventListener('click', function (e) { if (e.target.closest('summary, a')) return; if (d.open && e.target !== d) return; d.open = !d.open; });
	});

	/* The close button of the phone sheet sits where the menu button was, wherever the bar is at that moment. */
	document.querySelectorAll('.vst-nav .wp-block-navigation__responsive-container-open').forEach(function (open) {
		open.addEventListener('click', function () {
			var r = open.getBoundingClientRect(), nav = open.closest('.wp-block-navigation'), box = nav && nav.querySelector('.wp-block-navigation__responsive-container'), tries = 0;
			if (!box) return;
			(function place() {
				var cs = getComputedStyle(box), top = parseFloat(cs.top), rtl = cs.direction === 'rtl', side = parseFloat(rtl ? cs.left : cs.right);
				if (isNaN(top) || isNaN(side) || !box.classList.contains('is-menu-open')) { if (tries++ < 5) requestAnimationFrame(place); return; }
				box.style.setProperty('--vst-close-top', (r.top - top - box.clientTop) + 'px');
				box.style.setProperty('--vst-close-end', ((rtl ? r.left : document.documentElement.clientWidth - r.right) - side - box.clientLeft) + 'px');
			})();
		});
	});

	/* The phone sheet ends with the booking button, like the bar. */
	document.querySelectorAll('.vst-nav .wp-block-navigation__responsive-container-content').forEach(function (box) {
		var src = document.querySelector('.vst-nav .vst-cta a'); if (!src || box.querySelector('.vst-sheet-cta')) return;
		var wrap = document.createElement('div'); wrap.className = 'wp-block-button vst-sheet-cta';
		var a = document.createElement('a'); a.className = 'wp-block-button__link wp-element-button'; a.href = src.getAttribute('href'); a.textContent = src.textContent;
		wrap.appendChild(a); box.appendChild(wrap);
		a.addEventListener('click', function () { var c = document.querySelector('.vst-nav .wp-block-navigation__responsive-container-close'); if (c) c.click(); });
	});

	/* The hero photo follows the cursor, a little, on pointers that can hover. */
	var hero = document.querySelector('.vst-hero'), photo = hero && hero.querySelector('.wp-block-cover__image-background');
	if (photo && !rm && !window.matchMedia('(prefers-reduced-data: reduce)').matches && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
		var stage = hero;
		photo.style.willChange = 'transform';
		photo.style.transform = 'scale(1.04)';
		stage.addEventListener('mousemove', function (e) {
			var r = stage.getBoundingClientRect();
			var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
			photo.style.transform = 'scale(1.04) translate(' + (-x * 14) + 'px,' + (-y * 10) + 'px)';
		});
		stage.addEventListener('mouseleave', function () { photo.style.transform = 'scale(1.04)'; });
	}

	/* The calendar: a quiet skeleton until Zoom has loaded, then it fades in. */
	document.querySelectorAll('.vst-clip').forEach(function (clip) {
		var fr = clip.querySelector('iframe'); if (!fr) return;
		var sk = document.createElement('div'); sk.className = 'vst-skeleton'; sk.setAttribute('aria-hidden', 'true'); sk.innerHTML = '<i></i><i></i><i></i>';
		clip.appendChild(sk);
		var done = function () { fr.classList.add('loaded'); sk.classList.add('off'); };
		fr.addEventListener('load', done); setTimeout(done, 15000);
	});

	/* No word alone on the last line: tie the last two words of every paragraph with a non-breaking space. */
	document.querySelectorAll('main p, main li, main figcaption').forEach(function (el) {
		var t = el.lastChild; while (t && t.nodeType !== 3) { t = t.previousSibling; }
		if (!t) return; var s = t.nodeValue.replace(/\s+$/, ''); var i = s.lastIndexOf(' ');
		if (i > 0 && s.length - i <= 14) { t.nodeValue = s.slice(0, i) + ' ' + s.slice(i + 1) + t.nodeValue.slice(s.length); }
	});

	/* Light and dark: light first for everyone, the switch remembered. One cross-fade, nothing else animates meanwhile. */
	var meta = document.querySelectorAll('meta[name=theme-color]');
	var switches = document.querySelectorAll('.vst-theme button, .vst-theme a');
	function tellState() { var dark = root.getAttribute('data-theme') === 'dark'; switches.forEach(function (b) { b.setAttribute('aria-pressed', dark ? 'true' : 'false'); }); }
	tellState();
	switches.forEach(function (b) {
		b.addEventListener('click', function (e) {
			e.preventDefault();
			var cur = root.getAttribute('data-theme') || 'light';
			var nxt = cur === 'dark' ? 'light' : 'dark';
			var apply = function () {
				root.setAttribute('data-theme', nxt);
				try { localStorage.setItem('vestibule-theme', nxt); } catch (err) {}
				tellState();
				if (meta.length) { meta[0].setAttribute('content', meta[0].getAttribute(nxt === 'dark' ? 'data-dark' : 'data-light')); }
			};
			if (document.startViewTransition && !rm) {
				root.classList.add('switching');
				var vt = document.startViewTransition(apply);
				vt.finished.then(function () { root.classList.remove('switching'); }, function () { root.classList.remove('switching'); });
			} else if (rm) { apply(); }
			else { root.classList.add('theming'); apply(); setTimeout(function () { root.classList.remove('theming'); }, 600); }
		});
	});
})();
