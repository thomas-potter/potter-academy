document.addEventListener("DOMContentLoaded", () => {
	const track = document.getElementById("carousel-track");
	const prevBtn = document.getElementById("carousel-prev");
	const nextBtn = document.getElementById("carousel-next");
	const heroDynamicTitle = document.getElementById("hero-dynamic-title");
	const heroLayerA = document.getElementById("hero-layer-a");
	const heroLayerB = document.getElementById("hero-layer-b");
	const carouselContainer = document.getElementById("carousel");
	const navbar = document.getElementById("navbar");

	const mediaItems = [
		{
			src: "../imgs/topology_banner.webp",
			title: "Clean Character Topology",
		},
		{
			src: "../imgs/ps1_v2_banner.webp",
			title: "PS1 Character Creation",
		},
		{
			src: "../imgs/low_poly_banner.webp",
			title: "Low Poly Character Creation",
		},
		{
			src: "../imgs/weapon_banner.webp",
			title: "Stylized Game Weapons",
		},
	];

	const ITEM_W = 380,
		GAP = 24,
		STRIDE = ITEM_W + GAP;
	const CLONE_SETS = 3,
		ORIGIN_COUNT = mediaItems.length;
	let virtualIndex = ORIGIN_COUNT;
	let activeFront = "b";
	let autoRotateTimer,
		isTransitioning = false;

	const updateHeroTitle = (title) => {
		if (heroDynamicTitle)
			heroDynamicTitle.textContent = (
				title || "Low Poly Character Creation"
			).toUpperCase();
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
		updateHeroTitle(media.title);
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

	const selectVirtual = (vIdx, animate = true) => {
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
			item.style.cssText = `background-image: url('${media.src}'); background-size: cover; background-position: center;`;
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

	track.addEventListener("transitionend", () => {
		isTransitioning = false;
		const realIdx =
			((virtualIndex % ORIGIN_COUNT) + ORIGIN_COUNT) % ORIGIN_COUNT;
		if (virtualIndex < ORIGIN_COUNT || virtualIndex >= ORIGIN_COUNT * 2) {
			const newVirtual = ORIGIN_COUNT + realIdx;
			virtualIndex = newVirtual;
			jumpWithoutAnimation(newVirtual);
		}
	});

	const nextSlide = () => selectVirtual(virtualIndex + 1);
	const prevSlide = () => selectVirtual(virtualIndex - 1);
	const startAutoRotate = () => {
		clearInterval(autoRotateTimer);
		autoRotateTimer = setInterval(nextSlide, 15000);
	};

	nextBtn.addEventListener("click", () => {
		nextSlide();
		startAutoRotate();
	});
	prevBtn.addEventListener("click", () => {
		prevSlide();
		startAutoRotate();
	});
	window.addEventListener("resize", () => jumpWithoutAnimation(virtualIndex));

	// Init
	const middleIndex = Math.floor(mediaItems.length / 2);
	heroLayerA.style.backgroundImage = `url('${mediaItems[middleIndex].src}')`;
	heroLayerB.classList.remove("visible");
	activeFront = "a";
	updateHeroTitle(mediaItems[middleIndex].title);
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

	// FAQ accordion
	document.querySelectorAll(".faq-row-header").forEach((header) => {
		header.addEventListener("click", () => {
			const row = header.parentElement;
			document.querySelectorAll(".faq-row.active").forEach((el) => {
				if (el !== row) el.classList.remove("active");
			});
			row.classList.toggle("active");
		});
	});

	// Course row selection
	document.querySelectorAll(".course-row-header").forEach((header) => {
		header.addEventListener("click", () => {
			const row = header.parentElement;
			document.querySelectorAll(".course-row.active").forEach((el) => {
				if (el !== row) el.classList.remove("active");
			});
			row.classList.toggle("active");
		});
	});

	// Intersection Observer for scroll reveal animations (courses + FAQ only)
	const revealObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("visible");
					revealObserver.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
	);

	document.querySelectorAll(".course-row, .faq-row").forEach((el) => {
		el.classList.add("reveal");
		const parent = el.parentElement;
		if (parent) {
			const siblings = Array.from(parent.children).filter((c) =>
				c.classList.contains("reveal"),
			);
			const idx = siblings.indexOf(el);
			if (idx === 1) el.classList.add("reveal-delay-1");
			if (idx === 2) el.classList.add("reveal-delay-2");
			if (idx >= 3) el.classList.add("reveal-delay-3");
		}
		revealObserver.observe(el);
	});
});
