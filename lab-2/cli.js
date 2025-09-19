import { Command } from "commander";
import { readFile, writeFile } from "fs/promises";

const program = new Command();
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
// add \\
program
    .command("add <name>")
    .description("add user")
    .action(async (name) => {
        const users = await readUsers();
        const newUser = { id: Date.now(), name };
        users.push(newUser);
        await saveUsers(users);
        console.log("user added", newUser);

    });

// remove \\
program
    .command("remove <id>")
    .description("remove user")
    .action(async (id) => {
        const users = await readUsers();
        const updated = users.filter(u => u.id !== Number(id));
        console.log("user removed");
    });

// get all \\
program
    .command("getall")
    .description("get all users")
    .action(async () => {
        const users = await readUsers();
        console.table(users);
    });

// get one \\
program
    .command("getone <id>")
    .description("get one user")
    .action(async (id) => {
        const users = await readUsers();
        const user = users.filter(u => u.id == Number(id));
        console.log(user);
    });

// edit \\
program
    .command("edit <id> <name>")
    .description("edit one user")
    .action(async (id) => {
        const users = await readUsers();
        const index = users.findIndex(u => u.id == Number(id));
        user[index].name = name;
        await saveUsers(users);
        console.log("user edited");

    });
program.parse(process.argv);
