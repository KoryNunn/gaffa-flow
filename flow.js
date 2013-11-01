var Gaffa = require('gaffa'),
    doc = require('doc-js'),
    crel = require('crel');

function createNextStep(action, stepIndex){
    stepIndex = stepIndex || 0;

    var callback = function(event){
        if(event.getValue()){
            action.gaffa.gedi.debind(callback);
            if(++stepIndex<action.steps.length){
                createNextStep(stepIndex);
            }else{
                action.triggerActions('complete');
                action.debind();
            }
        }
    };
    action.gediCallbacks.push(callback);
    action.gaffa.gedi.bind(action.steps[stepIndex], callback);
}

function Flow(actionDefinition){}
Flow = Gaffa.createSpec(Flow, Gaffa.Action);
Flow.prototype.type = 'flow';
Flow.prototype.cancel = new Gaffa.Property();
Flow.prototype.trigger = function(){
    this.__super__.trigger.apply(this, arguments);

    var action = this;

    action.gediCallbacks = action.gediCallbacks || [];

    if(!this.steps || !this.steps.length){
        return;
    }

    createNextStep(this);

    var cancelCallback = function(event){
        if(event.getValue()){
            action.triggerActions('cancel');
            action.debind();
        }
    };
    action.gediCallbacks.push(cancelCallback);
    action.gaffa.gedi.bind(action.cancel.binding, cancelCallback);
};

module.exports = Flow;