import { readFile, writeFile } from "fs/promises";

const file = "./users.json";

async function readUsers() {
    try {
        const data = await readFile(file, "utf-8");
        return JSON.parse(data);
    } catch (err) {

        return [];
    }
}


async function saveUsers(users) {
    await writeFile(file, JSON.stringify(users, null, 2));
}


const [, , action, ...params] = process.argv;

switch (action) {
    case "add": {
        const name = params[0];
        const users = await readUsers();
        const newUser = {
            id: Date.now(),
            name
        };

        users.push(newUser);
        await saveUsers(users);
        console.log("✅ User added:", newUser);
        break;
    }

    case "remove": {
        const id = Number(params[0]);
        let users = await readUsers();
        users = users.filter(user => user.id !== id);
        await saveUsers(users);
        console.log(`✅ User with id ${id} removed`);
        break;
    }

    case "getall": {
        const users = await readUsers();
        console.log("📋 All Users:");
        console.log(users);
        break;
    }

    case "getone": {
        const id = Number(params[0]);
        const users = await readUsers();
        const user = users.find(u => u.id === id);
        console.log("👤 User:", user);
        break;
    }

    case "edit": {
        const id = Number(params[0]);
        const newName = params[1];
        const users = await readUsers();
        const index = users.findIndex(u => u.id === id);
        users[index].name = newName;
        await saveUsers(users);
        console.log(`✅ User with id ${id} updated to "${newName}"`);
        break;
    }

    default:
        console.log("❌ Unknown action. Try: add | remove | getall | getone | edit");
}
