import React, { useEffect } from "react";
import { Box, Form, TextInput, FormField, Button } from "grommet";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const StudentSignup = () => {
    const [searchParams] = useSearchParams();
    let navigate = useNavigate();

    const email = searchParams.get("email");
    const [firstName, lastName] = email
        .split("@")[0]
        .split(".")
        .map(capitalizeFirstLetter)
        .slice(0, 2);

    const [value, setValue] = React.useState({ firstName, lastName, email });
    const [disabled, setDisabled] = React.useState(true);

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Ensure form is loaded
    useEffect(() => setDisabled(false), []);

    async function submitForm() {
        setDisabled(true);
        try {
            const { data } = await axios.post(
                "/api/student/auth/signup",
                value
            );
            console.log(data);
            navigate("/", { state: { student: data } });
            // DEBUG
            // alert(JSON.stringify(data));
        } catch (err) {
            // DEBUG
            alert("Errore: " + err?.response?.data?.err);
            console.trace(err);
            setDisabled(false);
        }
    }

    return (
        <Box pad="large">
            <h1>Registrazione</h1>
            <Form
                value={value}
                onChange={nextValue => setValue(nextValue)}
                onSubmit={submitForm}
            >
                <FormField
                    name="firstName"
                    htmlFor="firstName-input"
                    label="Nome"
                    disabled={disabled}
                    required
                >
                    <TextInput
                        disabled={disabled}
                        id="firstName-input"
                        name="firstName"
                        autocomplete="given-name"
                    />
                </FormField>
                <FormField
                    name="lastName"
                    htmlFor="lastName-input"
                    label="Cognome"
                    disabled={disabled}
                    required
                >
                    <TextInput
                        disabled={disabled}
                        id="lastName-input"
                        name="lastName"
                        autocomplete="family-name"
                    />
                </FormField>
                <FormField
                    name="email"
                    htmlFor="email-input"
                    label="Email"
                    // this cannot be changed
                    disabled={true}
                    required
                >
                    <TextInput
                        disabled={true}
                        id="email-input"
                        name="email"
                        type="email"
                    />
                </FormField>
                <FormField
                    name="fiscalNumber"
                    htmlFor="fiscalNumber-input"
                    label="Codice fiscale"
                    disabled={disabled}
                    required
                >
                    <TextInput
                        disabled={disabled}
                        id="fiscalNumber-input"
                        name="fiscalNumber"
                        type="fiscalNumber"
                        autocomplete="tel"
                    />
                </FormField>
                <FormField
                    name="phoneNumber"
                    htmlFor="phoneNumber-input"
                    label="Numero di telefono"
                    disabled={disabled}
                    required
                >
                    <TextInput
                        disabled={disabled}
                        id="phoneNumber-input"
                        name="phoneNumber"
                        type="tel"
                        autocomplete="tel"
                    />
                </FormField>
                <Box direction="row" gap="medium">
                    <Button
                        type="submit"
                        disabled={disabled}
                        primary
                        label="Registra"
                    />
                </Box>
            </Form>
        </Box>
    );
};

export default StudentSignup;
