(() => {

    class SSN {
        node;
        stepClass;
        steps;
        stepThreshold;
        stepSuffix;
        isActive;
        currentStep;
        startingScrollVal;
        observer;

        constructor(node, suffix = '-step-') {
            this.node = node;
            this.stepClass = this.node.dataset.ssnClass;
            this.steps = this.node.dataset.ssnSteps;
            this.stepThreshold = this.node.dataset.ssnThreshold;
            this.stepSuffix = suffix;
            this.isActive = false;
            this.currentStep = 0;
            this.startingScrollVal = 0;

            this.observer = new IntersectionObserver(this.validateVisibility.bind(this), {root:null,rootMargin:'0px',threshold:0});
            this.observer.observe(this.node);
        }

        validateVisibility(entries) {
            if(entries[0].isIntersecting && !this.isActive) {
                this.isActive = true;
                this.startingScrollVal = window.scrollY;
            }
        }

        update() {
            let newStep = Math.floor((window.scrollY - this.startingScrollVal) / this.stepThreshold);

            if(newStep !== this.currentStep && newStep <= this.steps && newStep >= 0) {
                this.node.classList.remove(this.stepClass + this.stepSuffix + this.currentStep);
                this.currentStep = newStep;
                if(this.currentStep > 0)
                    this.node.classList.add(this.stepClass + this.stepSuffix + this.currentStep);
            }
        }
    }

    class SSCBootstrap {
        settings = {
            ssnClassName: 'ssn',
            stepSuffix: '-step-'
        }
        ssnNodes = [];

        constructor(settings = {}) {
            this.settings = {...this.settings, ...settings};

            [].slice.call(document.querySelectorAll('.' + this.settings.ssnClassName)).forEach(node => {
                this.ssnNodes.push(new SSN(node, this.settings.stepSuffix));
            });

            window.addEventListener('scroll', () => {
                this.ssnNodes.forEach(node => {
                    if(node.isActive) node.update();
                });
            })
        }
    }

    let SSC = new SSCBootstrap();
})();