class Slideshow {
    constructor(_element) {
        this.element = _element;
        this.slides = Array.from(_element.querySelectorAll('.slideshow__slide'));
        this.slidesWrapper = null;
        this.index = 0;
        this.arrowLeft = null;
        this.arrowRight = null;
        this.frame = null;
        this.nbSlides = this.slides.length;
        this.indicatorsList = null;
        this.ratio = 100 / this.nbSlides;
        this.loop = this.element.getAttribute("data-loop") == "true" ? true : false;

        this.render();
        this.changeSlide(Number(this.loop));
    }

    // Render the final element
    render() {
        if (this.loop) this.createLoop();
        this.buildSlides();
        this.buildArrows();
        this.buildIndicator();
        this.buildElement();
        this.setStyle();
    }

    // Build the element by appending all of it's child
    buildElement() {
        this.frame = Slideshow.createElement('div', 'slideshow__frame');
        this.frame.appendChild(this.slidesWrapper);

        this.element.appendChild(this.arrowLeft);
        this.element.appendChild(this.frame);
        this.element.appendChild(this.arrowRight);
        this.element.appendChild(this.indicatorsList);
    }

    /* 
        if loop option is activate
        copy the first and the la slide to create a loop effect
    */
    createLoop() {
        const firstSlideCopy = this.slides[0].cloneNode(true);
        const lastSlideCopy = this.slides[this.nbSlides - 1].cloneNode(true);

        firstSlideCopy.classList.add('slideshow__slide-cloned');
        lastSlideCopy.classList.add('slideshow__slide-cloned');

        this.slides.push(firstSlideCopy);
        this.slides.unshift(lastSlideCopy);
    }

    /* 
        Create the arrow button
    */
    buildArrows() {
        this.arrowLeft = Slideshow.createElement('button', 'slideshow__arrow', 'slideshow__arrow-left');
        this.arrowLeft.appendChild(Slideshow.createNavSvg());
        this.arrowRight = Slideshow.createElement('button', 'slideshow__arrow', 'slideshow__arrow-right');
        this.arrowRight.appendChild(Slideshow.createNavSvg());

        this.arrowLeft.addEventListener('click', this.prev.bind(this));
        this.arrowRight.addEventListener('click', this.next.bind(this));
    }

    /* 
        Create the indicators
    */
    buildIndicator() {
        this.indicatorsList = Slideshow.createElement('ul', 'slideshow__indicators-list');
        this.indicators = Array(this.slides.length).fill().map((indicator, i) => {
            indicator = Slideshow.createElement('button', 'slideshow__indicator');
            indicator.setAttribute('data-slide-to', i);
            // Everytime we click on a indicator with go to the i-nth  slide
            indicator.addEventListener('click', () => this.changeSlide(i));
            this.indicatorsList.appendChild(indicator);
            return indicator;
        });

        /* 
            if the loop option is activated we delete the first and last indicators
            because they corresponds to the cloned slide 
        */
        if(this.loop){
            // Delete from the node list
            this.indicatorsList.removeChild(this.indicatorsList.firstChild);
            this.indicatorsList.removeChild(this.indicatorsList.lastChild);

            // delete from the array
            this.indicators.pop();
            this.indicators.shift();
        }

        this.element.appendChild(this.indicatorsList);
    }

    buildSlides() {
        this.slidesWrapper = Slideshow.createElement('div', 'slideshow__slides-trail');
        this.slides.forEach((slide) => {
            this.slidesWrapper.appendChild(slide)
        });

        this.nbSlides = this.slides.length;

        /* 
            If the loop option is activated when we arrive to the cloned slide
            and the transition is finished we stop the animation and go to their 
            original slide and restart the animation
        */
        if (this.loop) {
            this.slidesWrapper.addEventListener('transitionend', () => this.handleInfinite());
        }
    }

    handleInfinite() {
        if (this.index == 0 || this.index == this.nbSlides - 1) {
            this.cancelAnimation();
            if (this.index == 0) {
                this.changeSlide(this.nbSlides - 2);
            } else if(this.index == this.nbSlides - 1){
                this.changeSlide(1);
            }
            setTimeout(() => this.setAnimation(), 0);
        }
    }

    // stop the animation of the slideWrapper
    cancelAnimation() {
        this.slidesWrapper.style.transition = 'none';
    }

    // activate the transition if it was delete
    setAnimation() {
        this.slidesWrapper.style.transition = 'transform 0.3s';
    }

    // Create the arrow icon for the button
    static createNavSvg() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('viewBox', '0 0 443.52 443.52');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttributeNS(null, 'd', 'm143.49 221.86 192.73-192.73c6.663-6.664 6.663-17.468 0-24.132-6.665-6.662-17.468-6.662-24.132 0l-204.8 204.8c-6.662 6.664-6.662 17.468 0 24.132l204.8 204.8c6.78 6.548 17.584 6.36 24.132-0.42 6.387-6.614 6.387-17.099 0-23.712l-192.73-192.73z');

        svg.appendChild(path);
        return svg;
    }

    // go to the next slide
    next() {
        if (this.index < this.nbSlides - 1) this.changeSlide(this.index + 1);
    }

    // go to the previous slide
    prev() {
        if (this.index > 0) this.changeSlide(this.index - 1);
    }

    changeSlide(newIndex) {
        this.index = newIndex;
        this.goTo();

        this.updateIndicator(newIndex);
    }


    // update the list of indicator to active the correct one
    updateIndicator(newIndex) {
        // search for the current indicator and delete the active class
        this.indicators.forEach((el) => {
            if(el.classList.contains('active')){
                el.classList.remove('active');
            }
        })
        
        /* 
            if there is a loop there is less indicators than there is slides so we correspond the first slide
            and the last to the first indicator and the last
        */
        if(this.loop){
            if(newIndex == 0){
                newIndex = this.indicators.length - 2;
            }else if(newIndex == this.nbSlides - 1){
                newIndex = 1;
            }
        }

        this.indicators[newIndex - Number(this.loop)].classList.add('active');
    }

    // Set the style for all the elements
    setStyle() {
        this.ratio = 100 / this.nbSlides;
        this.slidesWrapper.style.width = `${this.nbSlides * 100}%`;
        this.slides.forEach((slide) => { slide.style.width = `${this.ratio}%` });
        const slidesWrapperHeight = this.slidesWrapper.offsetHeight;
        this.arrowLeft.style.top = `${(slidesWrapperHeight / 2)}px`;
        this.arrowRight.style.top = `${(slidesWrapperHeight / 2)}px`;
    }

    // Ask the slideWrapper to move to the correct slide
    goTo() {
        this.slidesWrapper.style.transform = `translateX(${-this.index * this.ratio}%)`;
    }

    // Create a new html element with classes
    static createElement(type, ...classList) {
        const el = document.createElement(type);
        classList.forEach((className) => { el.classList.add(className) });
        return el;
    }

    toString() {
        return `number of slides: ${this.slides.length} 
        current slide: ${this.index - Number(this.loop)}
        `;
    }
}

const element = document.querySelector('.slideshow');
const slideshow = new Slideshow(element);