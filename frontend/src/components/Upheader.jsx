import React from "react";
import { Box, Button, Menu, Grommet, Image } from "grommet";
import GoogleLogin from "./GoogleLogin";

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
            bluscuro: "#027A91",
            // you can also point to existing grommet colors
            brightGreen: "accent-1",
            deepGreen: "neutral-2"
        }
    }
};

const Upheader = ({ loginLoaded, student, logout }) => {
    return (
        <Grommet theme={customTheme}>
            <Box
                direction="row"
                align="center"
                pad="small"
                gap="small"
                background="bluscuro"
            >
                <Button
                    onClick={() => {
                        "https://www.fermi-mo.edu.it/";
                    }}
                >
                    <Box
                        background="bluscuro"
                        direction="row"
                        align="center"
                        margin={{ start: "small" }}
                        height="small"
                        width="small"
                    >
                        <Image
                            fit="contain"
                            src="https://ssh.edu.it/images/logos/fermi.png"
                        />
                    </Box>
                </Button>
                <Box direction="row" align="center" margin={{ start: "large" }}>
                    <Menu
                        dropProps={{
                            align: { top: "bottom", left: "left" },
                            elevation: "xlarge"
                        }}
                        label="Area"
                        items={[
                            { label: "Studenti", onClick: () => {} },
                            { label: "Ditta", onClick: () => {} }
                        ]}
                    />
                </Box>
                <Box direction="row" align="start" pad={{ start: "large" }}>
                    <Menu
                        dropProps={{
                            align: { top: "bottom", left: "left" },
                            elevation: "xlarge"
                        }}
                        label="Area"
                        items={[
                            { label: "Studenti", onClick: () => {} },
                            { label: "Ditta", onClick: () => {} }
                        ]}
                    />
                </Box>
                <Box direction="row" align="center" margin={{ start: "large" }}>
                    <Menu
                        dropProps={{
                            align: { top: "bottom", left: "left" },
                            elevation: "xlarge"
                        }}
                        label="Area"
                        items={[
                            { label: "Studenti", onClick: () => {} },
                            { label: "Ditta", onClick: () => {} }
                        ]}
                    />
                </Box>
                <Box
                    // direction="row"
                    basis="full"
                    align="end"
                    margin={{ start: "large" }}
                    pad={{ right: "3rem" }}
                >
                    {loginLoaded ? (
                        student ? (
                            <Menu
                                dropProps={{
                                    align: { top: "bottom", left: "left" },
                                    elevation: "xlarge"
                                }}
                                label={student.firstName}
                                items={[
                                    {
                                        label: "Profilo",
                                        onClick: () =>
                                            alert(
                                                "Yaro studiati React Router e fai una pagina profilo studente"
                                            )
                                    },
                                    { label: "Logout", onClick: logout }
                                ]}
                            />
                        ) : (
                            <GoogleLogin />
                        )
                    ) : (
                        <p>Caricamento...</p>
                    )}
                </Box>
            </Box>
        </Grommet>
    );
};

export default Upheader;
