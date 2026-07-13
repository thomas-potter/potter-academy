// Fire ref click-track as early as possible (non-blocking)
// Block dark-mode extensions from altering the page
(function enforceDarkMode() {
	const forbidden = ["filter", "backdrop-filter"];
	const reset = () => {
		document.documentElement.style.colorScheme = "dark";
		document.querySelectorAll("html, body, body *").forEach((el) => {
			const style = getComputedStyle(el);
			forbidden.forEach((prop) => {
				const val = style[prop];
				if (val && val !== "none") {
					try {
						el.style.setProperty(prop, "none", "important");
					} catch (e) {}
				}
			});
		});
	};
	reset();
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", reset);
	}
	setInterval(reset, 1000);
})();
(function () {
	var ref = new URLSearchParams(window.location.search).get("ref");
	if (!ref) return;
	try {
		fetch("https://judicious-walrus-668.convex.site/track-click", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ ref: ref }),
		}).catch(function () {});
	} catch (e) {}
})();

document.addEventListener("DOMContentLoaded", () => {
	const track = document.getElementById("carousel-track");
	const prevBtn = document.getElementById("carousel-prev");
	const nextBtn = document.getElementById("carousel-next");
	const heroContent = document.getElementById("hero-content");
	const heroDynamicTitle = document.getElementById("hero-dynamic-title");
	const heroSubtitle = document.getElementById("hero-subtitle");
	const heroLayerA = document.getElementById("hero-layer-a");
	const heroLayerB = document.getElementById("hero-layer-b");
	const carouselContainer = document.getElementById("carousel");

	// FAQ / accordion works on every page, even when the carousel is absent
	function setupAccordion(headerSelector) {
		document.querySelectorAll(headerSelector).forEach((header) => {
			header.addEventListener("click", () => {
				const row = header.parentElement;
				row.parentElement.querySelectorAll(".active").forEach((el) => {
					if (el !== row) el.classList.remove("active");
				});
				row.classList.toggle("active");
			});
		});
	}
	setupAccordion(".faq-row-header");

	// Guard clauses for missing DOM elements
	if (!track || !carouselContainer) return;

	const mediaItems = [
		{
			src: "/imgs/topology_banner.webp",
			title: "Game Ready Topology",
			subtitle:
				"Learn proven techniques to build clean and optimized topology, saving you hours of frustration and improving all your characters!",
		},
		{
			src: "/imgs/game_animation_header.webp",
			title: "Game Ready Animation",
			subtitle:
				"Learn the art of creating clean animations, ready for your game.",
		},
		
		{
			src: "/imgs/low_poly_banner.webp",
			title: "Low Poly Character Creation",
			subtitle:
				"End the hours of confusion and learn solid workflows to create any character in Blender.",
		},
		{
			src: "/imgs/ps1_v2_banner.webp",
			title: "PS1 Character Creation",
			subtitle:
				"Learn simple techniques to make PS1 characters in blender, saving you hours of frustration and learning real skills to improve your characters!",
		},

	];

	let ITEM_W = 900,
		GAP = 32,
		STRIDE = ITEM_W + GAP;

	const measureCarousel = () => {
		const firstItem = track.querySelector(".carousel-item");
		if (!firstItem) return { ITEM_W, GAP, STRIDE };

		const itemStyle = getComputedStyle(firstItem);
		const flexBasis = parseFloat(itemStyle.flexBasis || itemStyle.width);
		const measuredWidth = firstItem.getBoundingClientRect().width;
		const fallbackWidth =
			Number.isFinite(flexBasis) && flexBasis > 0 ? flexBasis : measuredWidth;

		ITEM_W = fallbackWidth > 0 ? fallbackWidth : ITEM_W;
		GAP = parseFloat(itemStyle.columnGap || itemStyle.gap) || 32;
		STRIDE = ITEM_W + GAP;

		return { ITEM_W, GAP, STRIDE };
	};
	const CLONE_SETS = 3,
		ORIGIN_COUNT = mediaItems.length;
	let virtualIndex = ORIGIN_COUNT;
	let activeFront = "b";
	let autoRotateTimer,
		isTransitioning = false;

	const updateHeroTitle = (title) => {
		if (!heroDynamicTitle) return;
		const newText = (title || "Low Poly Character Creation").toUpperCase();
		if (heroDynamicTitle.textContent !== newText) {
			heroDynamicTitle.textContent = newText;
		}
	};

	const updateHeroSubtitle = (subtitle) => {
		if (!heroSubtitle) return;
		const newText =
			subtitle || "Everything You Need to Create Game-Ready Characters";
		if (heroSubtitle.textContent !== newText) {
			heroSubtitle.textContent = newText;
		}
	};

	const TRANSITION_MS = 420;

	const animateHeroChange = (title, subtitle) => {
		if (!heroContent) {
			updateHeroTitle(title);
			updateHeroSubtitle(subtitle);
			return;
		}
		heroContent.classList.add("is-transitioning");
		setTimeout(() => {
			updateHeroTitle(title);
			updateHeroSubtitle(subtitle);
			heroContent.classList.remove("is-transitioning");
		}, TRANSITION_MS);
	};

	const crossFadeBg = (src) => {
		if (activeFront === "b") {
			heroLayerA.style.backgroundImage = `url('${src}')`;
			heroLayerB.classList.remove("visible");
			activeFront = "a";
		} else {
			heroLayerB.style.backgroundImage = `url('${src}')`;
			heroLayerB.classList.add("visible");
			activeFront = "b";
		}
	};

	const displayMedia = (media) => {
		crossFadeBg(media.src);
		animateHeroChange(media.title, media.subtitle);
	};

	const getTranslateX = (vIdx) =>
		-vIdx * STRIDE + carouselContainer.clientWidth / 2 - ITEM_W / 2;

	const updateActiveHighlight = (vIdx) => {
		const realIdx = ((vIdx % ORIGIN_COUNT) + ORIGIN_COUNT) % ORIGIN_COUNT;
		document.querySelectorAll(".carousel-item").forEach((el, i) => {
			el.classList.toggle("active", i % ORIGIN_COUNT === realIdx);
		});
	};

	const jumpWithoutAnimation = (vIdx) => {
		track.style.transition = "none";
		track.style.transform = `translateX(${getTranslateX(vIdx)}px)`;
		track.getBoundingClientRect(); // force reflow
		track.style.transition = "";
	};

	const recenterCarousel = () => {
		measureCarousel();
		requestAnimationFrame(() => {
			jumpWithoutAnimation(virtualIndex);
		});
	};

	const selectVirtual = (vIdx, animate = true) => {
		measureCarousel();
		if (isTransitioning && animate) return;
		isTransitioning = animate;
		virtualIndex = vIdx;
		const realIdx = ((vIdx % ORIGIN_COUNT) + ORIGIN_COUNT) % ORIGIN_COUNT;
		displayMedia(mediaItems[realIdx]);
		updateActiveHighlight(vIdx);
		track.style.transform = `translateX(${getTranslateX(vIdx)}px)`;
	};

	const fragment = document.createDocumentFragment();
	for (let s = 0; s < CLONE_SETS; s++) {
		mediaItems.forEach((media, idx) => {
			const item = document.createElement("div");
			item.className = "carousel-item";
			item.dataset.index = idx;
			item.innerHTML = `<img src="${media.src}" alt="${media.title}" draggable="false" />`;
			item.addEventListener("click", () => {
				if (isTransitioning) return;
				const nearest = [0, 1, 2]
					.map((set) => set * ORIGIN_COUNT + idx)
					.reduce((best, c) =>
						Math.abs(c - virtualIndex) < Math.abs(best - virtualIndex)
							? c
							: best,
					);
				selectVirtual(nearest);
				startAutoRotate();
			});
			fragment.appendChild(item);
		});
	}
	track.appendChild(fragment);

	track.addEventListener("transitionend", (e) => {
		if (e.target !== track || e.propertyName !== "transform") return;
		isTransitioning = false;
		const realIdx =
			((virtualIndex % ORIGIN_COUNT) + ORIGIN_COUNT) % ORIGIN_COUNT;
		if (virtualIndex < ORIGIN_COUNT || virtualIndex >= ORIGIN_COUNT * 2) {
			const newVirtual = ORIGIN_COUNT + realIdx;
			virtualIndex = newVirtual;
			jumpWithoutAnimation(newVirtual);
		}
	});

	// Auto-rotation interval in milliseconds
	const AUTO_ROTATE_MS = 3500;

	const nextSlide = () => selectVirtual(virtualIndex + 1);
	const prevSlide = () => selectVirtual(virtualIndex - 1);
	const startAutoRotate = () => {
		clearInterval(autoRotateTimer);
		autoRotateTimer = setInterval(nextSlide, AUTO_ROTATE_MS);
	};

	nextBtn.addEventListener("click", () => {
		nextSlide();
		startAutoRotate();
	});
	prevBtn.addEventListener("click", () => {
		prevSlide();
		startAutoRotate();
	});

	// ResizeObserver covers all container size changes including window resizes
	if (typeof ResizeObserver !== "undefined") {
		const resizeObserver = new ResizeObserver(() => recenterCarousel());
		resizeObserver.observe(carouselContainer);
	}

	// Init
	const middleIndex = Math.floor(mediaItems.length / 2);
	measureCarousel();
	heroLayerA.style.backgroundImage = `url('${mediaItems[middleIndex].src}')`;
	heroLayerB.classList.remove("visible");
	activeFront = "a";
	updateHeroTitle(mediaItems[middleIndex].title);
	updateHeroSubtitle(mediaItems[middleIndex].subtitle);
	virtualIndex = ORIGIN_COUNT + middleIndex;
	jumpWithoutAnimation(virtualIndex);
	updateActiveHighlight(virtualIndex);
	setTimeout(startAutoRotate, 50);

	// Testimonials
	const row1Cards = [
		{
			text: "Easily worth the money.",
			author: "Pax Luporum",
			course: "Topology Guide",
		},
		{
			text: "I've tried courses by half a dozen other content creators and they just never worked for me. But Thomas' way of explaining just clicks with me. Not only does he explain what he's doing, but WHY he's doing it It's like he's teaching to people and not just talking to his webcam.",
			author: "Beck",
			course: "Low Poly Character Course",
		},
		{
			text: "This is the stuff! As a complete blender beginner this course is great. I used it as a guide to model a character off a different piece of artwork, instead of following exactly along, but the course was still great in teaching me the required skills. Excellent pacing ensures that the skills you learn one minute are being tested soon after and are quickly cemented.",
			author: "Benjamin Bull",
			course: "PS1 Character Course",
		},
		{
			text: "Great guide. It has both the theory and the practice, and the explanations are easy to understand even for someone like me who hasn't got a degree in modeling or something like that. Good topology was exactly what I was missing, and now I have it! 🙌",
			author: "Anonymous",
			course: "Topology Guide",
		},
		{
			text: "After so many years I finally learned how to model. I would like the fingers to be included but this is five stars mate. Well done, absolutely worth it!",
			author: "Andrew Morris",
			course: "PS1 Character Course",
		},
		{
			text: "Tom, thank you for the amazing tutorial!! I learned a lot being a beginner and was able to create my first character and animate it. Really appreciate the in-depth explanation of every step. Very informative and easy to follow.",
			author: "Anastasia Sysoeva",
			course: "PS1 Character Course",
		},
		{
			text: "As far as I've seen this is by far the best blender course to start making original characters and jump straight into game development.",
			author: "Ryan Norton",
			course: "Low Poly Character Course",
		},
	];

	const row2Cards = [
		{
			text: "Very very informative, worth every penny!",
			author: "Sam Noire",
			course: "PS1 Character Course",
		},
		{
			text: "this will write in spanish, me gusto bastante el curso, va directo al grano y explica muy bien las ideas de cada decisión y tambien es un tutorial que te enseña realmente como hacer personajes low poly. Si sabes ingles te lo recomiendo igual el ingles no es muy complicado de entender y realmente tienes feedback al publicarlo en el grupo de discord",
			author: "Cesar Chavez",
			course: "Low Poly Character Course",
		},
		{
			text: "I'm really glad I took this course honestly. I learned a lot of methods I never knew about, and this is after I was in online modeling classes for a few years that I did a lot general work but i modeled props for the most part. But also I would preface that this course is not meant for beginners when you do mention it in videos",
			author: "Michelle Zietlow",
			course: "PS1 Character Course",
		},
		{
			text: "Excellent course! Gave me a real template that I could work toward to make my own characters. I was never very good at characters, and always had a fascination with low-poly characters. This course is an excellent stepping stone if you're looking for a good and effective workflow!",
			author: "Gabe M",
			course: "Low Poly Character Course",
		},
		{
			text: "I own almost every low poly character course in the internet, and this one is the best by far. God bless you Thomas.",
			author: "Jorge",
			course: "Low Poly Character Course",
		},
		{
			text: "Fantastic! I've been struggling to create low-poly models that I'm happy with and Thomas really simplifies the process into very easy-to-follow steps that I think will become second nature with repetition. Time to go back and completely redo the game character I've been working on.",
			author: "Dylan Kress",
			course: "Low Poly Character Course",
		},
		{
			text: "Great guide!",
			author: "Anonymous",
			course: "PS1 Character Course",
		},
		{
			text: "This is exactly what I've been looking for to work on my games...",
			author: "Anonymous",
			course: "Low Poly Character Course",
		},
	];

	const buildTrack = (trackEl, cards, duration) => {
		if (!trackEl) return;
		trackEl.innerHTML = [...cards, ...cards]
			.map(
				(c) => `
            <article class="testimonial-card">
                <div class="stars" aria-label="5 stars">★★★★★</div>
                <p class="quote-text">"${c.text}"</p>
                <div class="card-footer">
                    <span class="author-name">${c.author}</span>
                    <span class="course-label">${c.course}</span>
                </div>
            </article>`,
			)
			.join("");
		trackEl.style.setProperty("--duration", duration + "s");
	};

	buildTrack(document.getElementById("track1"), row1Cards, 60);
	buildTrack(document.getElementById("track2"), row2Cards, 60);

	// Clicking any course card scrolls to the pricing section
	document.querySelectorAll(".course-card").forEach((card) => {
		card.style.cursor = "pointer";
		card.addEventListener("click", () => {
			document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
		});
	});

	// --- Analytics & tracking (moved out of inline <script>) ---
	var search = window.location.search;
	var source = new URLSearchParams(search).get("ref") || "direct";
	var bundleDistinctId = window.posthog ? window.posthog.get_distinct_id() : undefined;

	if (window.posthog) {
		posthog.capture("bundle_viewed", {
			source: source,
			bundle_distinct_id: bundleDistinctId,
			$current_url: window.location.href,
		});
	}

	// Preserve query params on checkout links + add ph_id
	if (search) {
		document
			.querySelectorAll('a[href*="app.potteracademy.uk/checkout"]')
			.forEach(function (el) {
				var href = el.getAttribute("href");
				el.href =
					href +
					(href.indexOf("?") > -1 ? "&" : "?") +
					search.substring(1) +
					(href.indexOf("?") > -1 ? "&" : "?") +
					"ph_id=" + encodeURIComponent(bundleDistinctId);
			});
	}

	function trackBundleButtonClick(buttonName, buttonLocation) {
		if (!window.posthog) return;
		posthog.capture("bundle_button_clicked", {
			button_name: buttonName,
			button_location: buttonLocation,
			source: source,
			bundle_distinct_id: bundleDistinctId,
			$current_url: window.location.href,
		});
	}

	function bindClicks(selector, name, location) {
		document.querySelectorAll(selector).forEach(function (el) {
			el.addEventListener("click", function () {
				trackBundleButtonClick(name, location);
			});
		});
	}

	bindClicks(".nav-cta", "nav_cta", "navbar");
	bindClicks(".hero-footer .btn-primary", "hero_cta", "hero_footer");
	bindClicks(".pitch-section .btn-primary", "pitch_cta", "pitch_section");
	bindClicks(".final-cta .btn-primary", "final_cta", "final_cta_section");
	bindClicks(".carousel-nav", "carousel_nav", "carousel");

	document.querySelectorAll(".js-checkout-link").forEach(function (el) {
		el.addEventListener("click", function () {
			if (!window.posthog) return;
			posthog.capture("start_checkout", {
				location: "bundle_pricing",
				price: 79,
				currency: "USD",
				source: source,
				bundle_distinct_id: bundleDistinctId,
				$current_url: window.location.href,
			});
		});
	});

});

// == OUTCOMES TIMELINE SCROLL SYNC ===========================================
// Self-contained so it is NOT gated by the carousel DOMContentLoaded handler,
// and re-syncs after bfcache restore, tab visibility changes and font/image
// load — so the line never gets stuck on a stale value (the "works only after
// reload" bug).
(function () {
	function ready(fn) {
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", fn, { once: true });
		} else {
			fn();
		}
	}

	let outcomesLine, outcomesTimeline, outcomesModules;

	function cacheEls() {
		outcomesLine = document.getElementById("outcomes-line");
		outcomesTimeline = document.getElementById("outcomes-timeline");
		outcomesModules = document.querySelectorAll(".outcomes-section .module");
	}

	function updateOutcomesTimeline() {
		if (!outcomesLine || !outcomesTimeline || outcomesModules.length === 0)
			return;

		const winH = window.innerHeight;
		const timelineRect = outcomesTimeline.getBoundingClientRect();
		const firstRect = outcomesModules[0].getBoundingClientRect();
		const lastRect =
			outcomesModules[outcomesModules.length - 1].getBoundingClientRect();

		// -- PROGRESS (center-based)
		const start = firstRect.top - winH * 0.5;
		const end = lastRect.bottom - winH * 0.5;
		const progress = Math.min(Math.max(-start / (end - start), 0), 1);

		// update line
		outcomesLine.style.setProperty("--scroll", progress * 100 + "%");

		// -- CLIP LINE TO DOT BOUNDS
		const firstDotY = firstRect.top + firstRect.height / 2;
		const lastDotY = lastRect.top + lastRect.height / 2;
		const timelineTop = timelineRect.top;
		const topPercent =
			((firstDotY - timelineTop) / timelineRect.height) * 100;
		const bottomPercent =
			((timelineRect.bottom - lastDotY) / timelineRect.height) * 100;

		outcomesLine.style.clipPath = `polygon(0 ${topPercent}%, 100% ${topPercent}%, 100% ${100 - bottomPercent}%, 0 ${100 - bottomPercent}%)`;

		// -- DOTS (sync exactly with progress, BOTH directions)
		outcomesModules.forEach((mod, i) => {
			const trigger = (i + 0.5) / outcomesModules.length;
			if (progress >= trigger) {
				mod.classList.add("active");
			} else {
				mod.classList.remove("active"); // fixes scrolling back up
			}
		});
	}

	let bound = false;
	function init() {
		cacheEls();
		if (!outcomesLine) return; // no timeline on this page
		if (!bound) {
			bound = true;
			window.addEventListener("scroll", updateOutcomesTimeline, {
				passive: true,
			});
			window.addEventListener("resize", updateOutcomesTimeline);
		}
		updateOutcomesTimeline();
	}

	ready(init);

	// Fonts/images can shift the module layout after DOMContentLoaded; recalc
	// once they've settled so the line stays aligned with the dots on first load.
	if (document.fonts && document.fonts.ready) {
		document.fonts.ready.then(updateOutcomesTimeline);
	}
	window.addEventListener("load", () => updateOutcomesTimeline(), { once: true });

	// Re-sync after the page is restored from back/forward cache (bfcache),
	// where DOMContentLoaded does not fire again and the saved clip-path /
	// scroll values may be stale for the current viewport.
	window.addEventListener("pageshow", (event) => {
		if (event.persisted) {
			cacheEls();
			updateOutcomesTimeline();
		}
	});

	// Re-sync when returning to a foregrounded tab — the viewport may have
	// changed (e.g. mobile URL bar) while hidden.
	document.addEventListener("visibilitychange", () => {
		if (!document.hidden) updateOutcomesTimeline();
	});
})();
