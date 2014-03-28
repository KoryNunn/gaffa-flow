var Gaffa = require('gaffa');

function createNextStep(action, scope, event, stepIndex){
    stepIndex = stepIndex || 0;

    var callback = function(event){
        if(event.getValue()){
            action.gaffa.gedi.debind(callback);
            if(++stepIndex<action.steps.length){
                createNextStep(action, scope, event, stepIndex);
            }else{
                action.triggerActions('complete', scope, event);
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
Flow.prototype._type = 'flow';
Flow.prototype.cancel = new Gaffa.Property();
Flow.prototype.trigger = function(parent, scope, event){
    var action = this;

    if(!this.steps || !this.steps.length){
        return;
    }

    createNextStep(this, scope, event);

    if(action.cancel.binding){
        var cancelCallback = function(event){
            if(event.getValue()){
                action.triggerActions('cancel', scope, event);
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