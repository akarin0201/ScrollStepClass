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

        inViewport;
        currentStep;
        currentStepValue;
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
                
                this.inViewport = false;
                this.currentStep = 0;
                this.currentStepValue = 0;
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
            if(entries[0].isIntersecting) this.inViewport = true;
            else this.inViewport = false;
        }

        update(newScrollValue) {
            if(this.inViewport) {
                this.calcScrollDiference(newScrollValue);
                this.calcCurrentStepValue();
                
                if(this.scrollDifference > 0 && this.currentStep < this.steps) {
                    this.moveForward();
                }
                else if(this.scrollDifference < 0 && this.currentStep > 0) {
                    this.moveBackwards();
                }
            }
            // console.log('%ccurretStepValue: ' + this.currentStepValue, 'color: #ff0');
        }

        calcScrollDiference(newScrollValue) {
            this.scrollDifference = newScrollValue - this.lastScrollValue;
            this.lastScrollValue = newScrollValue;
        }

        calcCurrentStepValue() {
            this.currentStepValue += this.scrollDifference;
        }

        moveForward() {
            let lastStep = this.currentStep;
            let mod = this.currentStepValue % this.stepThreshold;
            let calculatedStep = (this.currentStepValue - mod) / this.stepThreshold;
            this.currentStep = Math.min(calculatedStep, this.steps);
            if(this.currentStep > lastStep) {
                this.node.classList.add(this.stepClass + this.settings.stepSuffix + this.currentStep);
                this.node.classList.remove(this.stepClass + this.settings.stepSuffix + lastStep);
            }
        }

        moveBackwards() {
            let lastStep = this.currentStep;
            let absCurrentStepValue = Math.abs(this.currentStepValue);
            if(absCurrentStepValue < this.stepThreshold) {
                this.currentStep = 0;
                this.node.classList.remove(this.stepClass + this.settings.stepSuffix + lastStep);
            }
            else {
                let mod = absCurrentStepValue % this.stepThreshold;
                let calculatedStep = (absCurrentStepValue - mod) / this.stepThreshold;
                this.currentStep = Math.max(calculatedStep, 1);
                if(this.currentStep < lastStep){
                    this.node.classList.add(this.stepClass + this.settings.stepSuffix + this.currentStep);
                    this.node.classList.remove(this.stepClass + this.settings.stepSuffix + lastStep);
                } 
            }
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