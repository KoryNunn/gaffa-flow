var Gaffa = require('gaffa');

function createNextStep(action, scope, event, stepIndex){
    stepIndex = stepIndex || 0;

    function checkStep(){
        if(action.gaffa.gedi.get(action.steps[stepIndex], action.getPath(), scope)){
            action.gaffa.gedi.debind(checkStep);
            if(++stepIndex<action.steps.length){
                createNextStep(action, scope, event, stepIndex);
            }else{
                action.triggerActions('success', scope, event);
                action.complete();
            }
        }
    }

    action._flowBindings.push(checkStep);
    action.gaffa.gedi.bind(action.steps[stepIndex], checkStep, action.getPath());
    checkStep();
}

function Flow(){
    this._flowBindings = [];
}
Flow = Gaffa.createSpec(Flow, Gaffa.Action);
Flow.prototype._type = 'flow';
Flow.prototype._async = true;
Flow.prototype.cancel = new Gaffa.Property();
Flow.prototype.trigger = function(parent, scope, event){
    var action = this;

    if(!this.steps || !this.steps.length){
        return;
    }

    createNextStep(this, scope, event);

    if(action.cancel.binding){

        function cancelCallback(){
            if(action.gaffa.gedi.get(action.cancel.binding, action.getPath(), scope)){
                action.gaffa.gedi.debind(cancelCallback);
                action.triggerActions('cancel', scope, event);
                action.complete();
            }
        }

        action.gaffa.gedi.bind(action.steps[stepIndex], cancelCallback, action.getPath());
        cancelCallback();
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