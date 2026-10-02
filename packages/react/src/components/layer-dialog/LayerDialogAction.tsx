import * as React from "react";
import { ChevronDownRegular } from "@gamecrafters/base-ui-icons";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ActionList } from "../action-list";
import { ActionMenu } from "../action-menu";
import { Button } from "../button";
import { ButtonGroup } from "../button-group";
import { IconButton } from "../icon-button";
import type { LayerDialogActionProps } from "./LayerDialog.types";

// The one thing the dialog is there to do. It is a button like any other, drawn as the primary
// one, or as a dangerous one where what it does cannot be undone.
//
// Where there is more than one way of doing it — saving now or saving a draft, say — the others
// are offered from a menu opened beside it rather than standing as buttons of their own, so the
// footer never grows a row of peers. The button that opens the menu is drawn the way the action
// is, so the two read as halves of the one control
function LayerDialogAction(
    props: LayerDialogActionProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { children, variant = "primary", menu, menuLabel = "More actions", ...rest } = props;

    const button = (
        <Button ref={ref} variant={variant} data-component="LayerDialog.Action" {...rest}>
            {children}
        </Button>
    );

    if (!menu?.length) {
        return button;
    }

    return (
        <ButtonGroup role="group" aria-label={menuLabel} data-component="LayerDialog.ActionGroup">
            {button}
            <ActionMenu>
                <ActionMenu.Anchor>
                    <IconButton
                        icon={ChevronDownRegular}
                        aria-label={menuLabel}
                        variant={variant}
                        data-component="LayerDialog.ActionMenuButton"
                    />
                </ActionMenu.Anchor>
                {/* The action stands at the end of the footer, so the menu is lined up with
                    that end rather than running off past it */}
                <ActionMenu.Overlay align="end">
                    <ActionList>{menu}</ActionList>
                </ActionMenu.Overlay>
            </ActionMenu>
        </ButtonGroup>
    );
}

LayerDialogAction.displayName = "LayerDialog.Action";

export default fixedForwardRef(LayerDialogAction);
