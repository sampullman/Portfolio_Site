var module = Sandbox;

function switchModule(m) {
    return function() {
        Special.clear();
        module.cleanup();
        m.initialize();
        module = m;
    };
}

$(document).ready(function() {
    Special.initialize({ 'gravity': 1000 });
    module.initialize();
    $("#sandbox").click(switchModule(Sandbox));
    $("#survive").click(switchModule(Survive));
    $("#evade").click(switchModule(Evade));
});