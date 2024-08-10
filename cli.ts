import { Command, Option } from "commander";
import mongoose, { Types } from "mongoose";
import readline from "readline";
import connectToDB from "./src/config/dbConnection";
import dotenv from "dotenv";
import { SearchStatus } from "./src/interfaces/schemaTypes/enums/SearchStatus";
import PackageStatus from "./src/interfaces/schemaTypes/enums/PackageStatus";
dotenv.config();

const program = new Command();

program
    .command("get-all-subscription")
    .description("Get all subscriptions")
    .action(async () => {
        console.log("getall");
    });

program
    .command("get-subscription <id>")
    .description("Get subscription by Id")
    .action(async (id: Types.ObjectId) => {
        console.log("get ", id);
    });

program
    .command("add-subscription")
    .description("Add a new subscription")
    .requiredOption("--name <name>", "Subscription name")
    .requiredOption("--cost <cost>", "Subscription cost")
    .requiredOption("--searchCount <searchCount>", "Number of searches")
    .requiredOption("--status <status>", "Subscription status")
    .action(
        async (options: {
            name: string;
            cost: string;
            searchCount: string;
            status: string;
        }) => {
            // Validate and parse input values
            const { name, cost, searchCount, status } = options;
            const parsedCost = parseFloat(cost);
            const parsedSearchCount = parseInt(searchCount, 10);
            const parsedStatus =
                PackageStatus[status as keyof typeof PackageStatus];

            if (isNaN(parsedCost) || parsedCost <= 0) {
                console.error("Invalid cost. Please enter a positive number.");
                return;
            }

            if (isNaN(parsedSearchCount) || parsedSearchCount < 0) {
                console.error(
                    "Invalid search count. Please enter a non-negative integer."
                );
                return;
            }

            if (!parsedStatus) {
                console.error(
                    `Invalid status. Available statuses are: ${Object.values(
                        PackageStatus
                    ).join(", ")}`
                );
                return;
            }

            try {
                console.log("Adding subscription with the following details:");
                console.log(`Name: ${name}`);
                console.log(`Cost: ${parsedCost}`);
                console.log(`Search Count: ${parsedSearchCount}`);
                console.log(`Status: ${parsedStatus}`);
            } catch (error) {
                console.error(
                    "An error occurred while adding the subscription:",
                    error
                );
            }
        }
    );
program
    .command("delete-subscription <id>")
    .description("Remove a subscription by Id")
    .action(async (id: Types.ObjectId) => {
        console.log("remove", id);
    });

program
    .command("update-subscription <id>")
    .description("Update subscription details")
    .option("--name <name>", "Update subscription name")
    .option("--cost <cost>", "Update subscription cost", parseFloat)
    .option(
        "--searchCount <count>",
        "Update subscription search count",
        parseInt
    )
    .option("--status <status>", "Update subscription status")
    .action(
        async (
            id: Types.ObjectId,
            options: {
                name?: string;
                cost?: number;
                searchCount?: number;
                status?: PackageStatus;
            }
        ) => {
            // Handle the update based on the provided options
            console.log("update", { id, ...options });
            // Implement your update logic here
        }
    );

async function startCLI() {
    try {
        console.log("FindMyMeds CLI Connecting to database...");
        // await connectToDB();
        displayCommands();

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        function displayCommands() {
            console.log("\nAvailable commands:");
            program.commands.forEach((cmd: any) => {
                const commandName = cmd.name();
                const args =
                    cmd._args.map((arg: any) => `<${arg.name()}>`).join(" ") ||
                    "";

                console.log(`- ${commandName} ${args}`);
            });
        }

        function main() {
            rl.question(
                "\nEnter a command (or press q to quit): ",
                (answer) => {
                    if (answer.trim() === "q") {
                        console.log("Exiting...");
                        rl.close();
                        mongoose.connection.close();
                        return;
                    }

                    const args = answer.trim().split(" ");

                    try {
                        program.parse(args, { from: "user" });
                    } catch (error) {
                        console.error("An error occurred:", error);
                    }

                    main();
                }
            );
        }

        main();
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        process.exit(1);
    }
}

startCLI();
