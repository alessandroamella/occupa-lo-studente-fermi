import express from "express";

const app = express();

app.get("/prova", (req, res) => {
    res.send("sergiano");
});

const PORT = Number(process.env.PORT) || 5000;
const IP = process.env.IP || "0.0.0.0";
app.listen(PORT, IP, () => {
    console.log(`Server started at ${IP}:${PORT}`);
});
