# gaffa-flow

flow action for gaffa

basically parallel.

## Install:

    npm i gaffa-flow

## Add to gaffa:

    gaffa.registerConstructor(require('gaffa-flow'));

# API

## Properties (instanceof Gaffa.Property)

### cancel

Binding the when changed to a truthy vallue will cancel the flow

## Properties !(instanceof Gaffa.Property)

### steps

A standard array of bindings that when evaluate to true will trigger the next step to be evaluated.

Once all steps have evaluated to true the complete action will be triggered


## Example

    var flow = new Flow();

    flow.steps = [
        '[/foo]',
        '[/bar]'
    ];

    flow.actions.complete[someAction];

    // Step 1
    gaffa.model.set('[/foo]', true);

    setTimeout(function(){
        // Step 2
        gaffa.model.set('[/bar]', true);
    }, 1000);

    // After step 2 is set someAction will trigger



