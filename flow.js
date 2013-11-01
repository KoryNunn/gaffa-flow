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
    action._flowBindings.push(callback);
    action.gaffa.gedi.bind(action.steps[stepIndex], callback);
}

function Flow(actionDefinition){
    this._flowBindings = [];
}
Flow = Gaffa.createSpec(Flow, Gaffa.Action);
Flow.prototype.type = 'flow';
Flow.prototype.cancel = new Gaffa.Property();
Flow.prototype.trigger = function(){
    this.__super__.trigger.apply(this, arguments);

    var action = this;

    if(!this.steps || !this.steps.length){
        return;
    }

    createNextStep(this);

    if(action.cancel.binding){
        var cancelCallback = function(event){
            if(event.getValue()){
                action.triggerActions('cancel');
                action.debind();
            }
        };
        action._flowBindings.push(cancelCallback);
        action.gaffa.gedi.bind(action.cancel.binding, cancelCallback);
    }
};
Flow.prototype.debind = function(){
    var gedi = this.gaffa.gedi;
    for(var i = 0; i < this._flowBindings.length; i++) {
        gedi.debind(this._flowBindings[i]);
    }
    Gaffa.Action.prototype.debind.call(this);
};

module.exports = Flow;