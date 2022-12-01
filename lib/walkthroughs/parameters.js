import { FeatureWalkthrough$ } from 'san-webkit/lib/ui/FeatureWalkthrough/context';
import { awaitChildren, BR } from './utils';
export function showAddParameterWalkthrough() {
    FeatureWalkthrough$.show({
        id: 'fw-add-parameter',
        align: 'right',
        title: 'Add dynamic parameters to define a value that can be changed on-the-fly without hardcoding it in the query',
        description: `<p class="mrg-l mrg--b">Parameters are useful for reducing repetition and for creating dynamic dashboards.
    ${BR}
    Define the asset and the dates as parameters and change your dashboards with simple clicks without touching the code.</p>`,
    });
}
export function showParameterOptionsWalkthrough(parentNode) {
    const node = parentNode.querySelector('.parameter');
    if (node)
        show(node);
    else
        awaitChildren(parentNode, show, () => parentNode.querySelector('.parameter'));
    function show(node) {
        node.id = 'fw-parameter-options';
        FeatureWalkthrough$.show({
            id: node.id,
            align: 'right',
            title: 'Parameter options',
            description: `<p class="mrg-l mrg--b">Click on the parameter to open the options dialog.
      ${BR}
      Drag and drop the parameter to the editor below to quickly add it to your SQL query
      </p>`,
        });
    }
}
//# sourceMappingURL=parameters.js.map