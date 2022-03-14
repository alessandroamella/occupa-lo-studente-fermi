import React from "react";
import { Main, Heading, Paragraph, Grommet } from "grommet";
const customTheme = {
    global: {
        colors: {
            // Overriding existing grommet colors
            brand: "#4D4CDB",
            "accent-1": "#6FFFB0",
            "accent-2": "#7FFFB0",
            "accent-3": "#8FFFB0",
            "accent-4": "#9FFFB0",
            "neutral-1": "#10873D",
            "neutral-2": "#20873D",
            "neutral-3": "#30873D",
            "neutral-4": "#40873D",
            focus: "#000",
            // Setting new colors
            blue: "#00C8FF",
            green: "#17EBA0",
            teal: "#82FFF2",
            purple: "#F740FF",
            red: "#FC6161",
            orange: "#FFBC44",
            yellow: "#FFEB59",
            grey: "#787878",
            // you can also point to existing grommet colors
            brightGreen: "accent-1",
            deepGreen: "neutral-2"
        }
    }
};

const Middle = () => {
    return (
        <Grommet theme={customTheme} background="">
            <Main pad="large">
                <Heading>Something</Heading>
                <Paragraph>Something about something</Paragraph>
            </Main>
        </Grommet>
    );
};

export default Middle;
