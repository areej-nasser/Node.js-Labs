import { readFile, writeFile } from "fs/promises";
import http from 'http';
const file = "./users.json";

async function readUsers() {
    try {
        const data = await readFile(file, "utf-8");
        return JSON.parse(data);
    } catch {

        return [];
    }
}


async function saveUsers(users) {
    await writeFile(file, JSON.stringify(users, null, 2));
}

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    res.setHeader("Content-Type", "application/json");
    const methode = req.method;
    //get all
    if (methode === 'GET' && url.pathname === "/users") {
        const users = await readUsers();
        res.end(JSON.stringify(users));
        // get one
    } else if (methode === 'GET' && url.pathname.startsWith("/users/")) {
        const id = Number(url.pathname.split("/")[2]);
        const users = await readUsers();
        const user = users.find((u) => u.id === id)
        res.end(JSON.stringify(user));
    }
    //add user
    else if (methode === 'POST' && url.pathname === "/users") {
        let body = "";
        req.on("data", chunk => {
            body += chunk;
        });
        req.on("end", async () => {
            const { name } = JSON.parse(body);
            const users = await readUsers();
            const newUser = { id: Date.now(), name };
            users.push(newUser);
            await saveUsers(users);
            res.end(JSON.stringify(newUser));
        });
    }// update user
    else if (methode === 'PUT' && url.pathname.startsWith("/users/")) {
        const users = await readUsers();
        const id = Number(url.pathname.split("/")[2]);
        const idx = users.findIndex((u) => u.id === id);
        const name = url.searchParams.get("name")
        users[idx].name = name;
        await saveUsers(users);

        res.end(JSON.stringify(users[idx]));
    }// delete user
    else if (methode === 'DELETE' && url.pathname.startsWith("/users/")) {
        const users = await readUsers();
        const id = Number(url.pathname.split("/")[2]);
        const updated = users.filter((u) => u.id !== id);
        await saveUsers(updated);

        res.end(JSON.stringify(updated));
    }

})
server.listen(3000, 'localhost', () => {
    console.log(`Server running at http://localhost:3000/`);
});

// // add \\
// program
//     .command("add <name>")
//     .description("add user")
//     .action(async (name) => {
//         const users = await readUsers();
//         const newUser = { id: Date.now(), name };
//         users.push(newUser);
//         await saveUsers(users);
//         console.log("user added", newUser);

//     });

// // remove \\
// program
//     .command("remove <id>")
//     .description("remove user")
//     .action(async (id) => {
//         const users = await readUsers();
//         const updated = users.filter(u => u.id !== Number(id));
//         console.log("user removed");
//     });

// // get all \\
// program
//     .command("getall")
//     .description("get all users")
//     .action(async () => {
//         const users = await readUsers();
//         console.table(users);
//     });

// // get one \\
// program
//     .command("getone <id>")
//     .description("get one user")
//     .action(async (id) => {
//         const users = await readUsers();
//         const user = users.filter(u => u.id == Number(id));
//         console.log(user);
//     });

// // edit \\
// program
//     .command("edit <id> <name>")
//     .description("edit one user")
//     .action(async (id) => {
//         const users = await readUsers();
//         const index = users.findIndex(u => u.id == Number(id));
//         user[index].name = name;
//         await saveUsers(users);
//         console.log("user edited");

//     });
// program.parse(process.argv);
