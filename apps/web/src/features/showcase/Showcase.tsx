import { Card, Heading, Link, Stack, Text } from "@gamecrafters/base-ui/react";
import gamecraftersAiStudioImage from "../../assets/showcase/gamecrafters_ai_studio.png";
import gamecraftersDocumentationImage from "../../assets/showcase/gamecrafters_documentation.png";
import sundaeUiImage from "../../assets/showcase/sundae_ui.png";

const classes = {
    // The opening is read as prose, so it is held to a measure rather than run out to the width of
    // whatever the page is opened in. What stands under it is looked at rather than read, so it is
    // given the whole of that width instead
    prose: "max-w-[46rem]",
    // The cards are laid out as many to a line as there is room for and share out whatever is left
    // over, so a line of them ends where the page does rather than raggedly. The measure is wider
    // than the one the same things are laid out at on the page the site opens on: there they are one
    // section among several and a line holds as many as it can, and here they are the whole of what
    // the page has to show, so fewer stand on a line and each is drawn at a size the interface in
    // its picture can be made out at
    grid: "grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-[var(--base-size-16)]",
    // The link is what the row lays out, so it is laid out the way the card would have been: a grid
    // of one track, so the card is given the height the row settled on. An anchor is as tall as what
    // stands in it, and a card left inside one would stop at its own last line rather than reaching
    // the foot of the tallest card beside it.
    //
    // Its corners are cut to the card's, since the ring drawn round it when it is reached by the
    // keyboard is drawn just inside its edge: a square ring round a rounded card would cross the
    // corners it is meant to follow
    link: "group grid rounded-[var(--border-radius-large)]",
    // The card is raised as it is pointed at. It is drawn the way a card that leads nowhere is, so
    // nothing about it says it can be clicked; the raise is what says so, and says it as the reader
    // reaches the card rather than after they have clicked one to find out
    card: "transition-shadow duration-medium group-hover:shadow-[var(--shadow-resting-medium)]",
};

// What a link leading off the site is opened with. Everything named here is a site of its own, so
// there is nothing here this is not true of
const externalLinkProps = {
    target: "_blank",
    rel: "noreferrer",
} as const;

// One thing the library is put to: the picture, what it is called, what is meant by it, and where it
// is to be found.
//
// The picture is the thing itself as it stands today. It dates as the thing it is taken from
// changes, so it is worth retaking when that happens; what is bought for that is a reader seeing
// what was actually built rather than a drawing of what it might look like
type ShowcaseEntry = {
    title: string;
    description: string;
    image: string;
    href: string;
};

// What the library is put to, each of them a thing that has been built rather than a kind of thing
// that could be: the studio a model is worked in, the reference it is called through, and a second
// system standing on the same parts.
//
// It leaves the feature because this page is not the only place the list is shown: the page the site
// opens on carries a section of it as well, and the two would fall out of step were the list written
// out twice
export const showcases: ShowcaseEntry[] = [
    {
        title: "GameCrafters AI Studio",
        description: "AI platform",
        image: gamecraftersAiStudioImage,
        href: "https://aistudio.gamecrafters.io",
    },
    {
        title: "GameCrafters API Documentation",
        description: "API documentation platform",
        image: gamecraftersDocumentationImage,
        href: "https://docs.gamecrafters.io",
    },
    {
        title: "Sundae UI",
        description: "Website template",
        image: sundaeUiImage,
        href: "https://sundae.gamecrafters.io",
    },
];

// What has been built with the library, given a page of its own rather than only the section the
// page the site opens on carries. That section is read in passing, on the way down a page that is
// saying what the library is; this is where a reader who wants to see the whole of it is sent, and
// it is what the row across the top leads to.
//
// Each card leads to the thing it stands for. A reader shown what was built and then left without a
// way to it is a reader sent off to look for it themselves. The whole card is the way there rather
// than a word set inside it: most of a card here is its picture, and a picture that could not be
// clicked beside a line of words that could would be a card that has to be aimed at
const Showcase = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Showcase
            </Heading>
            <Text as="p" size="large">
                Beautiful websites built with Base UI
            </Text>
        </Stack>
        <div className={classes.grid}>
            {showcases.map(({ title, description, image, href }) => (
                // The link is muted so it holds none of the colour a link is drawn in. What stands
                // in the card is drawn in the colours the card sets, and a card that turned the
                // colour of a link would be read as one long link rather than as a card that is one
                <Link key={href} href={href} muted className={classes.link} {...externalLinkProps}>
                    <Card className={classes.card}>
                        {/* The picture is there to be looked at rather than read, and the words
                            beside it say the whole of what it is showing. It is left decorative
                            instead of being given the title to say a second time, since a reader
                            hearing the card read out would otherwise be told what it is twice over,
                            and the link takes its name from what is read out of it */}
                        <Card.Image src={image} alt="" />
                        {/* The page is headed by its own name, so what the cards under it are called
                            is headed one level below that rather than at the level a card heads
                            itself at by default */}
                        <Card.Heading as="h2">{title}</Card.Heading>
                        <Card.Description>{description}</Card.Description>
                    </Card>
                </Link>
            ))}
        </div>
    </Stack>
);

export default Showcase;
