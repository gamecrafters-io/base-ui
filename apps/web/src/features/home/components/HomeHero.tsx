import { Link } from "react-router";
import {
    ArchiveRegular,
    ArrowRightRegular,
    CopyRegular,
    DeleteRegular,
    EditRegular,
} from "@gamecrafters/base-ui-icons";
import {
    ActionList,
    ActionMenu,
    Button,
    Card,
    CodeBlock,
    Heading,
    PINInput,
    SegmentedControl,
    Slider,
    Stack,
    Switch,
    Text,
} from "@gamecrafters/base-ui/react";

const classes = {
    // The opening is read as prose rather than looked at as a specimen, so it is held to a
    // measure instead of running out to the width of whatever it is opened in
    root: "max-w-[46rem]",
    // The line beside the button is drawn to the height the button is drawn to, and takes it from
    // the same token rather than from a number that happens to match: a large control is that
    // tall, and the two stand in a row where either being taller than the other is read as one of
    // them having gone wrong. The room the block puts around its line is what it is given instead
    // of that height, so it is taken off and the line is set against the middle of what is left.
    //
    // Its width is the width of what it holds, which is how the button beside it is sized as
    // well: neither is given a measure of its own, and each is as wide as what it has to say
    install:
        "h-[var(--control-large-size)] [&>div]:grow [&>div]:flex [&>div]:items-center [&_pre]:py-0",
    // The specimens are laid out as many to a line as there is room for, and share out whatever
    // is left over rather than leaving a ragged end. The measure is the narrowest a tile can be
    // and still draw what stands in it at the size it was meant to be read at, which is what puts
    // all five on one line on a page as wide as the layout allows and folds them as it narrows.
    //
    // They run the width the page gives rather than the measure the opening is held to: the
    // opening is read and the specimens are looked at, and a line of tiles cut to the measure of
    // prose would be drawing them smaller than they are meant to be read at
    grid: "grid grid-cols-[repeat(auto-fit,minmax(13.5rem,1fr))] gap-[var(--base-size-16)]",
    // A specimen is named rather than labelled: the name is what it would be imported under, so
    // it is set in the monospace stack the rest of the library sets code in
    name: "text-[var(--foreground-color-muted)] font-[family-name:var(--font-stack-monospace)]",
    // The switch is drawn across the tile, the way a setting stands in a row of them: what it
    // turns at the start of the line and the switch itself at the end. The words and the track
    // are parts of the one component rather than two things laid out beside each other, so it is
    // the switch that is spread rather than a row holding it
    switchRow: "flex justify-between",
};

// Where a reader who has decided is sent: the page naming the one thing that has to be done
// before any of the library can be used, which is where the row across the top leads as well
const startHref = "/overview/installation";

// The one line that has to be run before anything shown below it can be drawn in a project of the
// reader's own. It is the line the installation page opens on, said here as well so that a reader
// who has already decided is not sent to another page to be told the obvious
const install = "npm install @gamecrafters/base-ui";

// A range that is dragged rather than typed. It runs the width of the tile, since a slider held
// to its content is a slider with nowhere to go
const slider = <Slider aria-label="Volume" defaultValue={64} block />;

// A code typed a character to a box. Four boxes rather than the six a one-time code usually runs
// to, so the specimen is read at the size the tile draws it rather than scrolled sideways
const pinInput = <PINInput aria-label="Verification code" length={4} />;

// One of a few, chosen by pressing the one wanted. What is being switched between is named the
// way a file would be looked at, since that is what the control is most often put to
const segmentedControl = (
    <SegmentedControl aria-label="File view">
        <SegmentedControl.Button defaultSelected>Preview</SegmentedControl.Button>
        <SegmentedControl.Button>Raw</SegmentedControl.Button>
    </SegmentedControl>
);

// Something that is either on or off, and says which without being pressed to find out. What it
// turns is said by the Label among its parts rather than by a word standing beside it, so there
// is nothing outside the switch for it to be pointed at.
//
// It is named after what it turns rather than after the component the way the rest are, since
// `switch` is a word the language keeps for itself
const notificationsSwitch = (
    <Switch className={classes.switchRow} defaultChecked>
        <Switch.Label>Notifications</Switch.Label>
        <Switch.Control>
            <Switch.Thumb />
        </Switch.Control>
        <Switch.HiddenInput />
    </Switch>
);

// What can be done to the thing the menu hangs off, gathered behind one press rather than laid
// out in the open. The last of them is set apart, since it is the one that cannot be undone
const actionMenu = (
    <ActionMenu>
        <ActionMenu.Button>Actions</ActionMenu.Button>
        <ActionMenu.Overlay>
            <ActionList>
                <ActionList.Item>
                    <ActionList.LeadingVisual>
                        <CopyRegular />
                    </ActionList.LeadingVisual>
                    Copy link
                </ActionList.Item>
                <ActionList.Item>
                    <ActionList.LeadingVisual>
                        <EditRegular />
                    </ActionList.LeadingVisual>
                    Rename
                </ActionList.Item>
                <ActionList.Item>
                    <ActionList.LeadingVisual>
                        <ArchiveRegular />
                    </ActionList.LeadingVisual>
                    Archive
                </ActionList.Item>
                <ActionList.Divider />
                <ActionList.Item variant="danger">
                    <ActionList.LeadingVisual>
                        <DeleteRegular />
                    </ActionList.LeadingVisual>
                    Delete
                </ActionList.Item>
            </ActionList>
        </ActionMenu.Overlay>
    </ActionMenu>
);

// The specimens, in the order they are read across: a control dragged, one typed into, one
// chosen from, one turned on, and one that opens onto the rest. They are named as they would be
// imported, so a reader who wants one knows what to reach for
const specimens = [
    { name: "Slider", specimen: slider },
    { name: "PINInput", specimen: pinInput },
    { name: "SegmentedControl", specimen: segmentedControl },
    { name: "Switch", specimen: notificationsSwitch },
    { name: "ActionMenu", specimen: actionMenu },
];

// What the library is and what it is for, said once, above anything asking to be read in order,
// and under it the components themselves, working rather than written about. A reader deciding
// whether to build on the library is deciding what its components are like to use, and a page
// that only said so would be asking to be taken at its word: the tiles are the library drawing
// itself, on the page that is trying to convince them. They are read in the one pass as the
// claim and what backs it, which is why they are made here together rather than a section apart.
//
// There is the one thing to do next, so there is the one thing to press: the way to the source is
// carried by the row across the top, where it stands on every page rather than on this one. A
// tile is not a way in to anything either, so none of them leads anywhere. The column of links
// beside every other page is where a component is looked up, and it names every one of them
// rather than the five that happen to stand here.
//
// The two are handed to the page loose rather than wrapped in something holding them, so the room
// between them is the room the page sets between its sections: the page gives that once, for all
// of them, and a box around these two would be setting it a second time and somewhere else
const HomeHero = () => (
    <>
        <Stack className={classes.root} gap="normal" align="start">
            <Heading as="h1" size="large">
                The design system GameCrafters draws its interfaces with
            </Heading>
            <Text as="p" size="large">
                Base UI is a React implementation of the GameCrafters design language: the
                components an interface is assembled from, the tokens they are drawn by, and the two
                colour schemes those tokens resolve under. Install it, import one stylesheet, and
                the rest is a component import.
            </Text>
            {/* The line stands beside the button rather than under it: it is not a second thing to
                press but what the reader who presses the first one will be asked for, and the two
                are read in the one glance. They fall one under the other on a screen with no room
                for both, which is the only way either of them would have to be cut short.

                The two are set against each other's middles rather than their tops, since the line
                is drawn in a block of its own and is the taller of the pair */}
            <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
                {/* What the page is for, so it is drawn as the primary action. It stays on the
                    site, and is followed by the router the way the links beside a page are */}
                <Button
                    as={Link}
                    to={startHref}
                    variant="primary"
                    size="large"
                    trailingVisual={ArrowRightRegular}
                >
                    Start building
                </Button>
                <CodeBlock language="shellscript" className={classes.install}>
                    <CodeBlock.Content>
                        <CodeBlock.Code>{install}</CodeBlock.Code>
                    </CodeBlock.Content>
                </CodeBlock>
            </Stack>
        </Stack>
        <div className={classes.grid}>
            {specimens.map(({ name, specimen }) => (
                <Card key={name}>
                    {/* The card is given its children rather than its parts, since what stands in
                        it is a working component and not a heading and a description */}
                    <Stack gap="normal" align="stretch">
                        <Text size="small" className={classes.name}>
                            {name}
                        </Text>
                        {specimen}
                    </Stack>
                </Card>
            ))}
        </div>
    </>
);

export default HomeHero;
