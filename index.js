import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
    res.render("index", { joke: null });
});


app.post("/joke", async (req, res) => {
    const category = req.body.category || "Any";
    try {
        const response = await axios.get(`https://v2.jokeapi.dev/joke/${category}?`);
        let joke;

        if (response.data.type === "single") {
            joke = response.data.joke;
        } else if (response.data.type === "twopart") {
            joke = `${response.data.setup} 🤔 ${response.data.delivery}`;
        }

        res.render("index", { joke });
    } catch (error) {
        console.error(error.message);
        res.render("index", { joke: "Sorry, couldn't fetch a joke." });
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
