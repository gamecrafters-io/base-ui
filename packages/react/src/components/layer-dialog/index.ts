import LayerDialogBase from "./LayerDialog";
import LayerDialogAction from "./LayerDialogAction";
import LayerDialogActions from "./LayerDialogActions";
import LayerDialogAlert from "./LayerDialogAlert";
import LayerDialogBody from "./LayerDialogBody";
import LayerDialogContent from "./LayerDialogContent";
import LayerDialogDescription from "./LayerDialogDescription";
import LayerDialogTitle from "./LayerDialogTitle";
import LayerDialogTrigger from "./LayerDialogTrigger";

export const LayerDialog = Object.assign(LayerDialogBase, {
    // Named as the root in its own right as well as by the compound itself, so either reads the
    // same and a dialog written out in full is written the way an alert is
    Root: LayerDialogBase,
    Alert: LayerDialogAlert,
    Trigger: LayerDialogTrigger,
    Content: LayerDialogContent,
    Title: LayerDialogTitle,
    Description: LayerDialogDescription,
    Body: LayerDialogBody,
    Actions: LayerDialogActions,
    Action: LayerDialogAction,
});

export {
    LayerDialogAlert,
    LayerDialogTrigger,
    LayerDialogContent,
    LayerDialogTitle,
    LayerDialogDescription,
    LayerDialogBody,
    LayerDialogActions,
    LayerDialogAction,
};
export { LayerDialogContext, useLayerDialogContext } from "./LayerDialogContext";
export * from "./LayerDialog.types";
