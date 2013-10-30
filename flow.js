var Gaffa = require('gaffa'),
    doc = require('doc-js'),
    crel = require('crel'),

function Flow(actionDefinition){}
Flow = Gaffa.createSpec(Flow, Gaffa.Action);
Flow.prototype.type = 'flow';
Flow.prototype.trigger = function(){
    this.__super__.trigger.apply(this, arguments);


};

module.exports = Flow;