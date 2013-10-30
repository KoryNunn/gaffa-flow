var Gaffa = require('gaffa'),
    doc = require('doc-js'),
    crel = require('crel'),

function createNextStep(action, stepIndex){
    stepIndex = stepIndex || 0;

    var callback = function(){
        if(++stepIndex<action.steps.length){
            createNextStep(stepIndex);
        }else{
            action.triggerActions('complete');
        }
        action.gaffa.gedi.debind(callback);
    };

    action.gaffa.bind(action.steps[stepIndex], action, );
}

function Flow(actionDefinition){}
Flow = Gaffa.createSpec(Flow, Gaffa.Action);
Flow.prototype.type = 'flow';
Flow.prototype.trigger = function(){
    this.__super__.trigger.apply(this, arguments);

    var action = this;

    if(!this.steps || !this.steps.length){
        return;
    }

    createNextStep(this);

    var cancelCallback = function(){
        action.triggerActions('cancel');
        action.debind();
    };
    action.gaffa.bind(action.cancel.binding, action, cancelCallback);
};

module.exports = Flow;