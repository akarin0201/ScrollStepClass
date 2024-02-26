(() => {
    class ScrollStepNode {
        settings = {
            stepSuffix: '-step-',
            detectionThreshold: 0
        };
        node;
        stepClass;
        steps;
        stepThreshold;

        scrollValue;
        isActive;
        currentStep;
        scrollDifference;
        lastScrollValue;
        observer;

        constructor(node, settings = {}) {
            this.node = node || null;
            if(this.node.nodeType === 1) {
                this.settings = {...this.settings, ...settings};
                this.stepClass = this.node.dataset.ssnClass;
                this.steps = this.node.dataset.ssnSteps;
                this.stepThreshold = this.node.dataset.ssnThreshold;
                
                this.isActive = false;
                this.scrollValue = 0;

                this.currentStep = 0;
                this.scrollDifference = 0;
                this.lastScrollValue = window.scrollY || null;
                this.observer = new IntersectionObserver(this.validateVisibility.bind(this), {root:null,rootMargin:'0px',threshold:this.settings.detectionThreshold});
                this.observer.observe(this.node);
            }
            else {
                console.error('%cScrollStepNode: %cErorr! No valid node given!', 'color:#0ff', 'color:#f00');
            }
        }

        validateVisibility(entries) {
            if(entries[0].isIntersecting && !this.isActive) {
                this.isActive = true;
                this.lastScrollValue = window.scrollY;
            }
        }

        update(newScrollValue) {
            if(this.isActive) {
                this.calcScrollDifference(newScrollValue);
                this.scrollValue += this.scrollDifference;
                console.log(this.scrollValue);
    
                let newStep = Math.floor(this.scrollValue / this.stepThreshold);

                if(newStep !== this.currentStep && newStep <= this.steps && newStep >= 0) {
                    this.node.classList.remove(this.stepClass + this.settings.stepSuffix + this.currentStep);
                    this.currentStep = newStep;
                    if(this.currentStep > 0)
                        this.node.classList.add(this.stepClass + this.settings.stepSuffix + this.currentStep);
                }
            }
        }

        calcScrollDifference(newScrollValue) {
            this.scrollDifference = newScrollValue - this.lastScrollValue;
            this.lastScrollValue = newScrollValue;
        }
    }

    let scrollStepNodeClass = 'ssn';

    const ssnReadyNodes = Array.prototype.slice.call(document.querySelectorAll('.' + scrollStepNodeClass));

    const scrollStepNodes = [];
    for(let i = 0; i < ssnReadyNodes.length; i++)
        scrollStepNodes.push(new ScrollStepNode(ssnReadyNodes[i], {}));

    window.addEventListener('scroll', () => {
        scrollStepNodes.forEach(node => {
            node.update(window.scrollY);
        });
    });
})();