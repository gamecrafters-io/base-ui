import {
    Avatar,
    Bubble,
    Heading,
    Message as MessageComponent,
    Stack,
    Text,
} from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // A message fills the room it is given, and the side it comes down is read against the edges of
    // that room, so the examples are held to the width a column of talk is actually read at rather
    // than run the width of the card
    conversation: "w-full max-w-[30rem]",
};

// Who is talking. The two are the ones the library's own stories are drawn with, so the
// conversation read here and the one read there are the same conversation
const speakers = {
    ada: "https://avatars.githubusercontent.com/u/7143434?v=4",
    alan: "https://avatars.githubusercontent.com/u/1024025?v=4",
};

// What every example carrying a face has to have in hand before it can be drawn. The addresses are
// written once and reached for by each of them, rather than run out along lines that would then
// have to be read across
const setup = `const speakers = {
    ada: "https://avatars.githubusercontent.com/u/7143434?v=4",
    alan: "https://avatars.githubusercontent.com/u/1024025?v=4",
};`;

// One message, which is the row: who said it at one end, what they said filling the rest. The
// column it stands in is the page's own furniture, as the card around it is, so the listing beneath
// is of the message alone.
//
// The page and the component it is about are both called Message, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Message, as an application
// importing it would
const defaultPreview = (
    <Stack className={classes.conversation}>
        <MessageComponent>
            <MessageComponent.Avatar>
                <Avatar size={32}>
                    <Avatar.Image src={speakers.ada} alt="Ada" />
                </Avatar>
            </MessageComponent.Avatar>
            <MessageComponent.Content>
                <MessageComponent.Header>Ada</MessageComponent.Header>
                <Bubble variant="muted">
                    <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
                </Bubble>
            </MessageComponent.Content>
        </MessageComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Message>
    <Message.Avatar>
        <Avatar size={32}>
            <Avatar.Image src={speakers.ada} alt="Ada" />
        </Avatar>
    </Message.Avatar>
    <Message.Content>
        <Message.Header>Ada</Message.Header>
        <Bubble variant="muted">
            <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
        </Bubble>
    </Message.Content>
</Message>`;

// Both sides of it, which is the whole of what a message is for. The same markup serves either
// speaker: only the side changes, and the row is laid out from the other end rather than written in
// a different order.
//
// Neither bubble is told which side it is on. The message hands it down, so a long thread never has
// the same word written on every turn in it
const conversationPreview = (
    <Stack gap="normal" className={classes.conversation}>
        <MessageComponent>
            <MessageComponent.Avatar>
                <Avatar size={32}>
                    <Avatar.Image src={speakers.ada} alt="Ada" />
                </Avatar>
            </MessageComponent.Avatar>
            <MessageComponent.Content>
                <MessageComponent.Header>Ada</MessageComponent.Header>
                <Bubble variant="muted">
                    <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
                </Bubble>
            </MessageComponent.Content>
        </MessageComponent>
        <MessageComponent align="end">
            <MessageComponent.Avatar>
                <Avatar size={32}>
                    <Avatar.Image src={speakers.alan} alt="Alan" />
                </Avatar>
            </MessageComponent.Avatar>
            <MessageComponent.Content>
                <MessageComponent.Header>Alan</MessageComponent.Header>
                <Bubble>
                    <Bubble.Content>Thursday still works</Bubble.Content>
                </Bubble>
            </MessageComponent.Content>
        </MessageComponent>
    </Stack>
);

// The column is part of what is being shown rather than the page's own furniture, since a side is
// read against the edges of the room the messages were given. The width is written out as the
// classes it stands for rather than as the name the page holds it under, since what is copied out
// of here has only itself to reach for
const conversationCode = `<Stack gap="normal" className="w-full max-w-[30rem]">
    <Message>
        <Message.Avatar>
            <Avatar size={32}>
                <Avatar.Image src={speakers.ada} alt="Ada" />
            </Avatar>
        </Message.Avatar>
        <Message.Content>
            <Message.Header>Ada</Message.Header>
            <Bubble variant="muted">
                <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
            </Bubble>
        </Message.Content>
    </Message>
    <Message align="end">
        <Message.Avatar>
            <Avatar size={32}>
                <Avatar.Image src={speakers.alan} alt="Alan" />
            </Avatar>
        </Message.Avatar>
        <Message.Content>
            <Message.Header>Alan</Message.Header>
            <Bubble>
                <Bubble.Content>Thursday still works</Bubble.Content>
            </Bubble>
        </Message.Content>
    </Message>
</Stack>`;

// A turn that ran to more than one thing said, written as one message holding several bubbles. The
// speaker then settles at the foot of the whole turn rather than against each line of it, which is
// what a run beside a face wants
const severalPreview = (
    <Stack className={classes.conversation}>
        <MessageComponent align="end">
            <MessageComponent.Avatar>
                <Avatar size={32}>
                    <Avatar.Image src={speakers.alan} alt="Alan" />
                </Avatar>
            </MessageComponent.Avatar>
            <MessageComponent.Content>
                <MessageComponent.Header>Alan</MessageComponent.Header>
                <Bubble>
                    <Bubble.Content>Thursday still works</Bubble.Content>
                </Bubble>
                <Bubble>
                    <Bubble.Content>Same place as last time</Bubble.Content>
                </Bubble>
            </MessageComponent.Content>
        </MessageComponent>
    </Stack>
);

const severalCode = `<Message align="end">
    <Message.Avatar>
        <Avatar size={32}>
            <Avatar.Image src={speakers.alan} alt="Alan" />
        </Avatar>
    </Message.Avatar>
    <Message.Content>
        <Message.Header>Alan</Message.Header>
        <Bubble>
            <Bubble.Content>Thursday still works</Bubble.Content>
        </Bubble>
        <Bubble>
            <Bubble.Content>Same place as last time</Bubble.Content>
        </Bubble>
    </Message.Content>
</Message>`;

// A run of messages from one speaker, with the side named once on the run rather than on each of
// them. They sit closer to one another than one run sits to the next, so a run reads as one turn.
//
// This is the shape for a run that carries no face beside it. Where there is one to show, a turn is
// better written as one message holding several bubbles, as above: the speaker then settles at the
// foot of the whole turn rather than against each line of it
const groupPreview = (
    <Stack gap="normal" className={classes.conversation}>
        <MessageComponent.Group>
            <MessageComponent>
                <MessageComponent.Content>
                    <MessageComponent.Header>Ada</MessageComponent.Header>
                    <Bubble variant="muted">
                        <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
                    </Bubble>
                </MessageComponent.Content>
            </MessageComponent>
            <MessageComponent>
                <MessageComponent.Content>
                    <Bubble variant="muted">
                        <Bubble.Content>No rush, whenever you see this</Bubble.Content>
                    </Bubble>
                </MessageComponent.Content>
            </MessageComponent>
        </MessageComponent.Group>
        <MessageComponent.Group align="end">
            <MessageComponent>
                <MessageComponent.Content>
                    <Bubble>
                        <Bubble.Content>Thursday still works</Bubble.Content>
                    </Bubble>
                </MessageComponent.Content>
            </MessageComponent>
            <MessageComponent>
                <MessageComponent.Content>
                    <Bubble>
                        <Bubble.Content>Same place as last time</Bubble.Content>
                    </Bubble>
                </MessageComponent.Content>
            </MessageComponent>
        </MessageComponent.Group>
    </Stack>
);

const groupCode = `<Stack gap="normal" className="w-full max-w-[30rem]">
    <Message.Group>
        <Message>
            <Message.Content>
                <Message.Header>Ada</Message.Header>
                <Bubble variant="muted">
                    <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
                </Bubble>
            </Message.Content>
        </Message>
        <Message>
            <Message.Content>
                <Bubble variant="muted">
                    <Bubble.Content>No rush, whenever you see this</Bubble.Content>
                </Bubble>
            </Message.Content>
        </Message>
    </Message.Group>
    <Message.Group align="end">
        <Message>
            <Message.Content>
                <Bubble>
                    <Bubble.Content>Thursday still works</Bubble.Content>
                </Bubble>
            </Message.Content>
        </Message>
        <Message>
            <Message.Content>
                <Bubble>
                    <Bubble.Content>Same place as last time</Bubble.Content>
                </Bubble>
            </Message.Content>
        </Message>
    </Message.Group>
</Stack>`;

// The lines above and below what was said. Both are set in from the edge by as much as the words
// are, so a name stands over the first letter of them rather than over the corner of the bubble
// they are on, and the line below gathers to the side the message is on.
//
// A message carrying a line below it would otherwise leave the speaker at the foot of that line
// rather than beside the words, so the face is lifted back up
const notedPreview = (
    <Stack gap="normal" className={classes.conversation}>
        <MessageComponent>
            <MessageComponent.Avatar>
                <Avatar size={32}>
                    <Avatar.Image src={speakers.ada} alt="Ada" />
                </Avatar>
            </MessageComponent.Avatar>
            <MessageComponent.Content>
                <MessageComponent.Header>Ada · 09:14</MessageComponent.Header>
                <Bubble variant="muted">
                    <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
                </Bubble>
                <MessageComponent.Footer>Read</MessageComponent.Footer>
            </MessageComponent.Content>
        </MessageComponent>
        <MessageComponent align="end">
            <MessageComponent.Avatar>
                <Avatar size={32}>
                    <Avatar.Image src={speakers.alan} alt="Alan" />
                </Avatar>
            </MessageComponent.Avatar>
            <MessageComponent.Content>
                <MessageComponent.Header>Alan · 09:20</MessageComponent.Header>
                <Bubble>
                    <Bubble.Content>Thursday still works</Bubble.Content>
                </Bubble>
                <MessageComponent.Footer>Sent</MessageComponent.Footer>
            </MessageComponent.Content>
        </MessageComponent>
    </Stack>
);

const notedCode = `<Stack gap="normal" className="w-full max-w-[30rem]">
    <Message>
        <Message.Avatar>
            <Avatar size={32}>
                <Avatar.Image src={speakers.ada} alt="Ada" />
            </Avatar>
        </Message.Avatar>
        <Message.Content>
            <Message.Header>Ada · 09:14</Message.Header>
            <Bubble variant="muted">
                <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
            </Bubble>
            <Message.Footer>Read</Message.Footer>
        </Message.Content>
    </Message>
    <Message align="end">
        <Message.Avatar>
            <Avatar size={32}>
                <Avatar.Image src={speakers.alan} alt="Alan" />
            </Avatar>
        </Message.Avatar>
        <Message.Content>
            <Message.Header>Alan · 09:20</Message.Header>
            <Bubble>
                <Bubble.Content>Thursday still works</Bubble.Content>
            </Bubble>
            <Message.Footer>Sent</Message.Footer>
        </Message.Content>
    </Message>
</Stack>`;

// Nothing standing beside it, for a conversation with only two voices in it, where a column of the
// same two faces down the edge says nothing the side does not already say
const facelessPreview = (
    <Stack gap="normal" className={classes.conversation}>
        <MessageComponent>
            <MessageComponent.Content>
                <Bubble variant="muted">
                    <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
                </Bubble>
            </MessageComponent.Content>
        </MessageComponent>
        <MessageComponent align="end">
            <MessageComponent.Content>
                <Bubble>
                    <Bubble.Content>Thursday still works</Bubble.Content>
                </Bubble>
            </MessageComponent.Content>
        </MessageComponent>
    </Stack>
);

const facelessCode = `<Stack gap="normal" className="w-full max-w-[30rem]">
    <Message>
        <Message.Content>
            <Bubble variant="muted">
                <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
            </Bubble>
        </Message.Content>
    </Message>
    <Message align="end">
        <Message.Content>
            <Bubble>
                <Bubble.Content>Thursday still works</Bubble.Content>
            </Bubble>
        </Message.Content>
    </Message>
</Stack>`;

// Words on the page rather than on a painted ground. An unpainted bubble has no padding of its own
// for the lines above and below it to line up with, so the message gives its gutter up and they
// line up with the words instead
const ghostPreview = (
    <Stack className={classes.conversation}>
        <MessageComponent>
            <MessageComponent.Avatar>
                <Avatar size={32}>
                    <Avatar.Image src={speakers.ada} alt="Ada" />
                </Avatar>
            </MessageComponent.Avatar>
            <MessageComponent.Content>
                <MessageComponent.Header>Assistant</MessageComponent.Header>
                <Bubble variant="ghost">
                    <Bubble.Content>
                        A meter is not going anywhere: it stands where it stands, and either end of
                        it is as ordinary a place to be as the middle.
                    </Bubble.Content>
                </Bubble>
                <MessageComponent.Footer>Answered in 1.2s</MessageComponent.Footer>
            </MessageComponent.Content>
        </MessageComponent>
    </Stack>
);

const ghostCode = `<Message>
    <Message.Avatar>
        <Avatar size={32}>
            <Avatar.Image src={speakers.ada} alt="Ada" />
        </Avatar>
    </Message.Avatar>
    <Message.Content>
        <Message.Header>Assistant</Message.Header>
        <Bubble variant="ghost">
            <Bubble.Content>
                A meter is not going anywhere: it stands where it stands, and either end
                of it is as ordinary a place to be as the middle.
            </Bubble.Content>
        </Bubble>
        <Message.Footer>Answered in 1.2s</Message.Footer>
    </Message.Content>
</Message>`;

// The message as it is reached for, drawn and written out one above the other. One message comes
// first, then the conversation it is read in, then the two shapes a turn of several things said
// comes to, and after those what a message carries besides the words and what it does without
const examples: ComponentExample[] = [
    {
        name: "Default",
        description:
            "One message: who said it at one end of the row, what they said filling the rest. The face settles at the foot of the message rather than the head of it, beside the last thing said rather than the first, which is where the eye goes for who is speaking.",
        setup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Both sides of it",
        description:
            "Which side of the conversation a message comes down, which is the whole of what a message is for. The same markup serves either speaker: the row is laid out from the other end rather than written in a different order. Neither bubble is told which side it is on — the message hands it down, so a long thread never has the same word written on every turn in it.",
        setup,
        preview: conversationPreview,
        code: conversationCode,
    },
    {
        name: "Several things said at once",
        description:
            "A turn that ran to more than one thing said, written as one message holding several bubbles. The face then settles at the foot of the whole turn rather than against each line of it, and the side is still named once. This is the shape to reach for wherever there is a speaker to show.",
        setup,
        preview: severalPreview,
        code: severalCode,
    },
    {
        name: "A run of messages",
        description:
            "The other shape a turn of several things said comes to: separate messages gathered into a run, with the side named once on the run rather than on each of them. They sit closer to one another than one run sits to the next, so a run reads as one turn. This is the shape for a run carrying no face beside it, since a face on every message in a run would draw the same speaker several times over.",
        preview: groupPreview,
        code: groupCode,
    },
    {
        name: "Named and accounted for",
        description:
            "The lines above and below what was said: a name, a time, whether it went. Both are set in from the edge by as much as the words are, so a name stands over the first letter of them rather than over the corner of the bubble they are on, and the line below gathers to the side the message is on. A message carrying a line below it would otherwise leave the speaker at the foot of that line rather than beside the words, so the face is lifted back up.",
        setup,
        preview: notedPreview,
        code: notedCode,
    },
    {
        name: "Nothing standing beside it",
        description:
            "For a conversation with only two voices in it, where a column of the same two faces down the edge says nothing the side does not already say. The message is still the row; there is simply nothing at one end of it.",
        preview: facelessPreview,
        code: facelessCode,
    },
    {
        name: "Words on the page",
        description:
            "A turn whose words stand on the page rather than on a painted ground. An unpainted bubble has no padding of its own for the lines above and below it to line up with, so the message gives its gutter up and they line up with the words instead. It is the shape a long answer wants, where a painted ground would sit under it as a slab.",
        setup,
        preview: ghostPreview,
        code: ghostCode,
    },
];

// Which side of the conversation a message comes down. It stands as the values themselves rather
// than as the name they are collected under, since one of them is what a caller actually hands over
const align = '"start" | "end"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// What the element being drawn takes on top of what the library declares itself. Those props are
// the element's own and are documented wherever elements are, so what is said here is what the
// library adds to them
const polymorphic = {
    name: "as",
    type: "React.ElementType",
    default: '"div"',
    description: "The element or component this is drawn as, in place of its default",
};

// Every prop the message and its parts take, under the one that takes it. The message comes first,
// since it is what the page is about, then the run it stands in, then the two ends of the row and
// the lines above and below what was said
const groups: ComponentPropGroup[] = [
    {
        name: "Message",
        props: [
            {
                name: "align",
                type: align,
                description:
                    "Which side of the conversation the message comes down, which is what a reader takes to mean the speaker. Left unsaid, it takes the side of the run it stands in, and comes down the leading side where there is neither. It is handed down to everything the message carries, so a bubble inside one — and the corner its reactions gather at — follows without being told a second time",
            },
            styling,
            polymorphic,
        ],
    },
    {
        name: "Message.Group",
        props: [
            {
                name: "align",
                type: align,
                default: '"start"',
                description:
                    "The side every message in the run comes down. A speaker does not change sides part way through a run, so it is named here rather than on each of them; a message that names one of its own still takes it, since the nearer of the two wins",
            },
            styling,
            polymorphic,
        ],
    },
    {
        name: "Message.Avatar",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "Whatever stands for the speaker — a picture, their initials, the mark of the thing that is talking. It is given a round ground of its own, so a set of speakers drawn from different sources still reads as one column down the edge of the conversation, and it settles at the foot of the message rather than the head of it",
            },
            styling,
            polymorphic,
        ],
    },
    {
        name: "Message.Content",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "What was said, and the lines above and below it. It takes the rest of the row once the speaker has been given their column, and everything stacked inside it keeps to the side the message comes down",
            },
            styling,
            polymorphic,
        ],
    },
    {
        name: "Message.Header",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "The line above what was said: a name, a time, whichever of them the conversation needs. It is set in from the edge by as much as the words are, so it stands over the first letter of them rather than over the corner of the bubble they are on",
            },
            styling,
            polymorphic,
        ],
    },
    {
        name: "Message.Footer",
        props: [
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "The line below what was said: whether it went, when it was read, what can be done about it. It is set in by the same amount and gathers to the side the message comes down, so it stays under the end of what was said rather than under the start of the row",
            },
            styling,
            polymorphic,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the message is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const Message = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Message
            </Heading>
            <Text as="p" size="large">
                One message in a conversation, with whoever said it standing beside it. The message
                is the row: who said it at one end, what they said filling the rest. A message from
                the other side of the conversation is laid out from the other end rather than
                written in a different order, so the same markup serves both speakers and only the
                side changes. That side is handed down rather than repeated — a bubble inside a
                message comes down the side the message comes down without being told it a second
                time, which is what keeps a long thread from having the same word written on every
                turn in it. The speaker settles at the foot of the message rather than the head of
                it, beside the last thing said rather than the first, which is where the eye goes
                for who is speaking.
            </Text>
        </Stack>
        <ComponentExamples component="Message" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Message;
