'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Page navigation - Smooth Scrolling

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();

//     // Id in perfect format of the elem you want to scroll to
//     const id = this.getAttribute('href');
//     console.log(id);

//     // selecting the element like so:
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// With event delegation:
// 1. We add the e listener to a common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  // On which element exactly the click happened
  console.log(e.target);
  e.preventDefault();

  // Matching strategies
  // Checking if the target contains the class we are interested in
  if (e.target.classList.contains('nav__link')) {
    // Id in perfect format of the elem you want to scroll to
    const id = e.target.getAttribute('href');
    console.log(id);
    // selecting the element like so:
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Smooth Scroll
/////////////////////////////////////////////////////

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  //   Scrolling

  //   window
  //     .scrollTo
  //     // How to compute the absolute position of the element, relative to the document(entire page)
  //     // Current position + current scroll
  //     // s1coords.left + window.pageXOffset,
  //     // s1coords.top + window.pageYOffset
  //     ();

  //   window.scrollTo({
  //     left: s1coords.left + window.pageXOffset,
  //     top: s1coords.top + window.pageYOffset,
  //     behavior: 'smooth',
  //   });

  // Newer way
  section1.scrollIntoView({ behavior: 'smooth' });

  //   getBoundingClientRect() is relative to the viewport
  //   console.log(e.target.getBoundingClientRect());
  //   console.log('Current scroll (X / Y)', window.pageXOffset, window.pageYOffset);
  //   console.log(
  //     'height / width of viewport:',
  //     document.documentElement.clientHeight,
  //     document.documentElement.clientWidth
  //   );
});

// //// - Tabbed Component

// NOT GOOD
// tabs.forEach(t =>
//   t.addEventListener('click', () => {
//     console.log('TAB');
//   })
// );
// EVENT DELEGATION
tabsContainer.addEventListener('click', function (e) {
  // Using closest method to get rid of the span bug and make delegation easier
  const clicked = e.target.closest('.operations__tab');
  //   console.log(clicked);
  // Guard clause = returns early if condition is matched
  if (!clicked) return;
  ////// or
  //   if (clicked) {
  // Remove active classes from previously clicked links
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //  Active tab
  clicked.classList.add('operations__tab--active');
  // }
  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
// // Menu Fade Animation

const handleHover = function (e) {
  // We don't use closest because there are no spans to accidentaly get clicked on finding the nav__link class is enough
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
      logo.style.opacity = this;
    });
  }
};

// Workaround the fact that the handler function can take only one argument
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky Navigation

// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);
// window.addEventListener('scroll', function () {
//   // console.log(window.scrollY);

//   // Using the scroll event is low performance because it fires all the time
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');

//   // Calculate the position of the first section and therefore the scroll value
//   // dynamically
// });
////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
// A better way than the scroll event - THE INTERSECTION OBSERVER API
//////////////////////////////////////////////////////////////////////
// We need to start by creating a new intersection observer
// Which takes as argumetns a callback function and an object of options

// The entries arguments is an array of the threshold entries
// const observerCallback = function (entries, observer) {
//   entries.forEach(entry => console.log(entry));
// };

// const observerOptions = {
//   root: null, // Element that we want our target element intersect
//   threshold: [0, 0.2], // Percentage of intersection at which the callback will be called
// };

// const observer = new IntersectionObserver(observerCallback, observerOptions);

// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null, //interested in all of the viewport
  threshold: 0,
  rootMargin: `-${navHeight}px`, // box of 90 px that will be applied outside of our header elem (delaying the sticky nav from appearing)
});

headerObserver.observe(header);

/////////////////////////////////////////////
// REVEAL SECTIONS
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});
/////////////////////////////////////////////////
// Lazy loading images //
// Using the data-src custom attribute on the images from HTML, a filter with blur for the low res images

const imgTargets = document.querySelectorAll('img[data-src]');
console.log(imgTargets);

const loadImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;

  // Replace the src attribute with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

/////////////////////////////////////////
// SLIDER COMPONENT //

// Slider

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const slider = document.querySelector('.slider');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // slider.style.transform = 'scale(0.4) translateX(-800px)';
  // slider.style.overflow = 'visible';

  // FUNCTIONS
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (curSlide) {
    slides.forEach(
      (slide, i) =>
        (slide.style.transform = `translateX(${100 * (i - curSlide)}%)`)
    );
  };

  // Next Slide

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) curSlide = 0;
    else curSlide++;

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) curSlide = maxSlide - 1;
    else curSlide--;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };

  init();

  // Event Handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  // Dots event listeners
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};

slider();
// curSlide  = 1 : 100%, 0% , 100%, 200%
//////////////////////////////////////////////
/////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////

// LECTURES
// NAV LINK - Event Propagation in Practice
// rgb(255,255,255)
// const randomInt = (min, max) =>
//   // Get random integer
//   Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// console.log(randomColor(0, 255));

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);
//   console.log(e.currentTarget === this);

//   //   Stop propagation
//   //   e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target, e.currentTarget);
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('NAV', e.target, e.currentTarget);
// });

//////////////////////////////////////////////
// LECTURES
////////////////////////////////////////////
// HOW THE DOM REALLY WORKS

// What is the DOM? ------
// The DOM is an interface between JavaScript and the Browser
// we can use it to help javascript interact with the browser
// We can use JS to create, modify and delete HTML elements;
// set styles, classes and attributes; and liste and respond to events
// DOM tree is generated from an HTML document, which we can then interact with;
// DOM is a very complex API(Application Programming Interface) that contains lots of methods and properties to interact with the DOM Tree

// How the DOM API is organized behind the scenes ----

// Every single node in the DOM tree is of type : Node
// Each Node in JS is represented as an Object
// The Node has 4 different child types :
/*
 * ELEMENT - gives each HTML element useful methods
{The element type has a single child type: HTMLElement that differs for each separate element(One different type of HTMLElement for every HTML element... Example: HTMLButtonElement, HTMLDivElement) -- This is important because each HTML element can have unique properties, depending on its type
}
 * TEXT - text inside any element
 * COMMENT - any HTML Comment
 * DOCUMENT -
 */

// What makes all of this work is something called INHERITANCE(All the child types will have access to their parent properties and methods) -> HTMLElement will have access to all the the properties and methods of Element as well as the Node type (considering the inheritance Tree)

// There is another Special Node in the Node Type Tree called Event Target(addEventListener() / removeEventListener()): which is a parent node to the Node object as well as the Window / Global Object (lots of methods and properties many unrelated to the DOM)

// SELECTING - CREATING - DELETING elements

// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector('.header');

// const allSections = document.querySelectorAll('.section');

// console.log(allSections);

// document.getElementById('section--1');

// // This method returns a HTML Collection instead of a Node List
// // A HTML collections is a live collection - if the DOM changes this collection is updated automatically
// const allButtons = document.getElementsByTagName('button');

// console.log(allButtons);

// console.log(document.getElementsByClassName('btn'));

// //  Creating and Inserting elements

// // .insertAdjacentHTML

// // Creating an element
// const message = document.createElement('div');

// message.classList.add('cookie-message');
// message.textContent = 'We use cookies for improved functionality and analytics';
// message.innerHTML =
//   'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// // header.prepend(message); //first child of the element
// header.append(message); // last child
// // header.before(message); // before header as a sibling element
// // header.after(message); // after header as a sibling element

// // header.append(message.cloneNode(true));

// // Delete elements

// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//     // Old way
//     // message.parentElement.removeChild(message);
//   });

////////////////////////////////////////
//STYLES - ATTRIBUTES - CLASSES -//////
//////////////////////////////////////

// STYLES
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// console.log(message.style.height); // Doesn't return anything same as any other CSS property, color width etc
// console.log(message.style.backgroundColor);

// console.log(getComputedStyle(message).color); // How to get CSS styles inside your program, calling it with no specific property getComputedStyle(message) returns a huge object with all it's properties
// console.log(getComputedStyle(message).height);

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';

//  documentElement is the :root element in css, how to change the variables in css using JS
// document.documentElement.style.setProperty('--color-primary', 'orangered');

// ATTRIBUTES

// const logo = document.querySelector('.nav__logo');

// console.log(logo.className);

// console.log(logo.alt);
// // console.log(logo.src);

// logo.alt = 'Beautiful minimalist logo';
// console.log(logo.alt);
//Direct access works only with standard attributes
// console.log(logo.designer);

// // To get custom ones use

// console.log(logo.getAttribute('designer'));

// Opposite of get attribute

// logo.setAttribute('company', 'Bankist');

// console.log(logo.src);
// console.log(logo.getAttribute('src'));

// const link = document.querySelector('.nav__link--btn');

// // Absolute link value
// console.log(link.href);
// console.log('-----');

// // Relative link value
// console.log(link.getAttribute('href'));

// // Classes

// logo.classList.add('c');
// logo.classList.remove('c');
// logo.classList.toggle('c');
// logo.classList.contains('c'); // not includes

// // Don't use - overrides existing classes and also allows us to put only one class onto one element
// // logo.className = 'Alex';

// // Eventlisteners and elemets
// const h1 = document.querySelector('h1');

// const alertH1 = function (e) {
//   alert('addEventListener: Great! You are reading the heading :D');
// };

// h1.addEventListener('mouseenter', alertH1);

// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);
// h1.onmouseenter = function (e) {
//   alert('addEventListener: Great! You are reading the heading :D');
// };

/////////////////////////////////////////
// Evemt propagation and BUBBLING
////////////////////////////////////////
// The event is actually generated on the root of the document not on the element itself, this trigger is called the capturing phase
// The Capturing Phase: The event travels from the document root to the target element, as the event travels down the tree it will pass through every single parent element of the target element
// Until it reaches the target element, when this happens the Target phase begins
// The Target Phase :  where the callback function gets executed, after this is completed
// The event travels all the way back to the root element,
// this is called the bubbling phase
// The bubbling phase: events 'bubble up' from the target to the root element, passing through all the parent elements of the target (just the parents not through the siblings)
// It is important because it's as if the event happens in each parent element, like it happened in that element, if we attach this event listener to the section window we would get the same exact alert(in this case) for the section as well, handling the same event twice once for the target elem and the second time for it's parent. this will allow for powerful patterns to be implemented
// Events can only be handled in the bubbling and target phases respectively, but we can set up eventlisteners in a way that they listen to events in the capturing phase, some events don't have a capturing or a bubbling phase. some are created right on the target element so we can only capture them there
// EVENTS PROPAGATING FROM ONE PLACE TO ANOTHER - CAPTURING PHASE / BUBBLING PHASE
///////////////////////////////////////////////////////

/////////////= DOM TRAVERSING =/////////

// const h1 = document.querySelector('h1');

// // Going downwards : selecting child elements
// // Works no matter how deep (nested within other child elements) these highlight class spans are. !IMPORTANT
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children); //live collection get all the 3 elements inside of H1, -- works only for direct CHILDREN
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// // Going UPWARDS : selecting parents, grandparent elements etc

// console.log(h1.parentNode);
// console.log(h1.parentElement);

// // Parent element that is somewhere in the DOM hierarchy

// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// h1.closest('h1').style.background = 'var(--gradient-primary)';

// // Going SIDEWAYS : selecting sibling (in JS we can only access direct sibling)

// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// // Sibling for Nodes
// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// // Move to parent element and read all children

// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });

// Lifecycle DOM Events

// DOM content loaded

// document.addEventListener('DOMContentLoaded', function (e) {
//   console.log('HTML parsed and DOM tree built!', e);
// });

// window.addEventListener('load', function (e) {
//   console.log('Page fully loaded', e);
// });

// Use in situations were data might be lost by accident
// Don't abuse it!!

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });

// Efficient Script Loading: defer and async

/*
 * You can load the javascript file in three different ways :
 *  - regular
 *  - async
 *  - defer
 *
 *
 */
