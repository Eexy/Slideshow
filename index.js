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
        this.indicators = null;
        this.ratio = 100 / this.nbSlides;
        this.loop = this.element.getAttribute("data-loop") == "true" ? true : false;

        this.render();
        this.setStyle();

        this.setIndex(Number(this.loop));
    }

    // Create the final html element
    render() {
        this.frame = Slideshow.createElement('div', 'slideshow__frame');
        this.slidesWrapper = Slideshow.createElement('div', 'slideshow__slides-trail');
        this.indicators = Array(this.nbSlides).fill().map((el, i) => el = Slideshow.createElement('button', 'slideshow__indicator'));

        if (this.loop) {
            this.createLoop();

            this.slidesWrapper.addEventListener('transitionend', () => {
                if (this.index == 0 || this.index == this.nbSlides - 1) {
                    this.slidesWrapper.style.transition = 'none';
                    if (this.index == 0) {
                        this.index = this.nbSlides - 2;
                    } else if(this.index == this.nbSlides - 1){
                        this.index = 1;
                    }
                    this.setIndex(this.index);
                    setTimeout(() => {
                        this.slidesWrapper.style.transition = 'transform 0.3s';
                    }, 0)
                }
                // this.setActiveIndicator();
            });
        }

        this.slides.forEach((slide) => { this.slidesWrapper.appendChild(slide) });
        this.arrowLeft = Slideshow.createElement('button', 'slideshow__arrow', 'arrow-left');
        this.arrowLeft.appendChild(Slideshow.createNavSvg());
        this.arrowRight = Slideshow.createElement('button', 'slideshow__arrow', 'arrow-right');
        this.arrowRight.appendChild(Slideshow.createNavSvg());
        this.frame.appendChild(this.slidesWrapper);
        this.indicatorsWrapper = Slideshow.createElement('div', 'slideshow__indicators-trail');

        this.indicators.forEach((el, index) => {
            this.indicatorsWrapper.appendChild(el);
            el.addEventListener('click', () => {
                this.setIndex(index + Number(this.loop));
            })
        });

        this.indicators[0].classList.add('active');

        this.arrowLeft.addEventListener('click', () => {
            this.setIndex(this.index - 1);
        });
        this.arrowRight.addEventListener('click', () => {
            this.setIndex(this.index + 1);
        });

        this.element.appendChild(this.arrowLeft);
        this.element.appendChild(this.frame);
        this.element.appendChild(this.arrowRight);
        this.element.appendChild(this.indicatorsWrapper);
    }

    createLoop() {
        const firstSlideCopy = this.slides[0].cloneNode(true);
        const lastSlideCopy = this.slides[this.nbSlides - 1].cloneNode(true);

        this.slides.push(firstSlideCopy);
        this.slides.unshift(lastSlideCopy);
        this.nbSlides = this.slides.length;
        this.ratio = 100 / this.nbSlides;
    }

    static createNavSvg() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('viewBox', '0 0 443.52 443.52');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttributeNS(null, 'd', 'm143.49 221.86 192.73-192.73c6.663-6.664 6.663-17.468 0-24.132-6.665-6.662-17.468-6.662-24.132 0l-204.8 204.8c-6.662 6.664-6.662 17.468 0 24.132l204.8 204.8c6.78 6.548 17.584 6.36 24.132-0.42 6.387-6.614 6.387-17.099 0-23.712l-192.73-192.73z');

        svg.appendChild(path);
        return svg;
    }

    setActiveIndicator(){
        this.indicatorsWrapper.querySelector('.active').classList.remove('active');
        this.indicators[this.index - Number(this.loop)].classList.add('active');
    }

    setIndex(_index) {
        if (_index >= 0 && _index < this.nbSlides) {
            this.index = _index;
            this.goTo();

            if(this.loop && (this.index >= 1 && this.index <= this.indicators.length)){
                this.setActiveIndicator();
            }else if(!this.loop){
                this.setActiveIndicator();
            }
        }
    }

    // Set the style for all the elements
    setStyle() {
        this.slidesWrapper.style.width = `${this.nbSlides * 100}%`;
        this.slides.forEach((slide) => { slide.style.width = `${this.ratio}%` });
        const slidesWrapperHeight = this.slidesWrapper.offsetHeight;
        this.arrowLeft.style.top = `${(slidesWrapperHeight / 2)}px`;
        this.arrowRight.style.top = `${(slidesWrapperHeight / 2)}px`;
    }

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
        return `number of slides: ${this.slides.length}`;
    }
}

const element = document.querySelector('.slideshow');
const slideshow = new Slideshow(element);